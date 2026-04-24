import {TWITCH_CLIENT_ID, TWITCH_AUTH_URL} from './constants';
import {setUserToken, clearUserToken} from './storage';

function getRedirectUrl(): string {
  return chrome.identity.getRedirectURL('twitch');
}

function parseTokenFromUrl(redirectUrl: string): string | null {
  const fragment = new URL(redirectUrl).hash.slice(1);
  const params = new URLSearchParams(fragment);
  return params.get('access_token');
}

export async function login(): Promise<boolean> {
  const redirectUrl = getRedirectUrl();
  const params = new URLSearchParams({
    client_id: TWITCH_CLIENT_ID,
    redirect_uri: redirectUrl,
    response_type: 'token',
    scope: '',
  });

  const authUrl = `${TWITCH_AUTH_URL}?${params}`;

  try {
    const responseUrl = await chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true,
    });

    if (!responseUrl) return false;

    const accessToken = parseTokenFromUrl(responseUrl);
    if (!accessToken) return false;

    await setUserToken({accessToken});
    return true;
  } catch {
    return false;
  }
}

export async function logout(): Promise<void> {
  await clearUserToken();
}
