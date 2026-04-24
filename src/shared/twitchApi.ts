import type {TwitchAppToken, TwitchStream, TwitchSearchResult} from './types';
import {getAppToken, setAppToken, clearAppToken} from './storage';
import {TWITCH_TOKEN_URL, TWITCH_API_BASE_URL, SEARCH_RESULTS_LIMIT} from './constants';

let tokenRefreshPromise: Promise<string> | null = null;

async function refreshAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const response = await fetch(TWITCH_TOKEN_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status}`);
  }

  const body = (await response.json()) as {access_token: string; expires_in: number};
  const token: TwitchAppToken = {
    accessToken: body.access_token,
    expiresAt: Date.now() + body.expires_in * 1000 - 60_000,
  };

  await setAppToken(token);
  return token.accessToken;
}

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const cached = await getAppToken();
  if (cached && cached.expiresAt > Date.now()) return cached.accessToken;

  if (tokenRefreshPromise) return tokenRefreshPromise;

  tokenRefreshPromise = refreshAccessToken(clientId, clientSecret).finally(() => {
    tokenRefreshPromise = null;
  });

  return tokenRefreshPromise;
}

async function twitchFetch(url: string, clientId: string, accessToken: string): Promise<Response> {
  return fetch(url, {
    headers: {
      'Client-Id': clientId,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function withAuthRetry<TResult>(
  clientId: string,
  clientSecret: string,
  requestFn: (accessToken: string) => Promise<Response>,
  parseFn: (response: Response) => Promise<TResult>,
  isRetry = false,
): Promise<TResult> {
  const accessToken = await getAccessToken(clientId, clientSecret);
  const response = await requestFn(accessToken);

  if (response.status === 401 && !isRetry) {
    await clearAppToken();
    return withAuthRetry(clientId, clientSecret, requestFn, parseFn, true);
  }

  if (!response.ok) {
    throw new Error(`Twitch API error: ${response.status}`);
  }

  return parseFn(response);
}

export async function fetchLiveStreams(
  clientId: string,
  clientSecret: string,
  usernames: string[],
): Promise<TwitchStream[]> {
  if (usernames.length === 0) return [];

  const params = new URLSearchParams();
  for (const username of usernames) {
    params.append('user_login', username);
  }

  return withAuthRetry<TwitchStream[]>(
    clientId,
    clientSecret,
    (accessToken) => twitchFetch(`${TWITCH_API_BASE_URL}/streams?${params}`, clientId, accessToken),
    async (response) => {
      const body = (await response.json()) as {data: TwitchStream[]};
      return body.data;
    },
  );
}

export async function searchChannels(
  clientId: string,
  clientSecret: string,
  query: string,
): Promise<TwitchSearchResult[]> {
  const params = new URLSearchParams({
    query,
    first: String(SEARCH_RESULTS_LIMIT),
  });

  return withAuthRetry<TwitchSearchResult[]>(
    clientId,
    clientSecret,
    (accessToken) =>
      twitchFetch(`${TWITCH_API_BASE_URL}/search/channels?${params}`, clientId, accessToken),
    async (response) => {
      const body = (await response.json()) as {data: TwitchSearchResult[]};
      return body.data;
    },
  );
}
