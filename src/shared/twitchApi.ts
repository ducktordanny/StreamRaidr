import type {TwitchStream, TwitchSearchResult} from './types';
import {getUserToken, clearUserToken} from './storage';
import {TWITCH_CLIENT_ID, TWITCH_API_BASE_URL, SEARCH_RESULTS_LIMIT} from './constants';

async function getAccessToken(): Promise<string | null> {
  const token = await getUserToken();
  return token?.accessToken ?? null;
}

async function twitchFetch(url: string): Promise<Response | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const response = await fetch(url, {
    headers: {
      'Client-Id': TWITCH_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    await clearUserToken();
    return null;
  }

  if (!response.ok) {
    throw new Error(`Twitch API error: ${response.status}`);
  }

  return response;
}

export async function fetchLiveStreams(usernames: string[]): Promise<TwitchStream[]> {
  if (usernames.length === 0) return [];

  const params = new URLSearchParams();
  for (const username of usernames) {
    params.append('user_login', username);
  }

  const response = await twitchFetch(`${TWITCH_API_BASE_URL}/streams?${params}`);
  if (!response) return [];

  const body = (await response.json()) as {data: TwitchStream[]};
  return body.data;
}

export async function searchChannels(query: string): Promise<TwitchSearchResult[]> {
  const params = new URLSearchParams({
    query,
    first: String(SEARCH_RESULTS_LIMIT),
  });

  const response = await twitchFetch(`${TWITCH_API_BASE_URL}/search/channels?${params}`);
  if (!response) return [];

  const body = (await response.json()) as {data: TwitchSearchResult[]};
  return body.data;
}
