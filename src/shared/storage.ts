import type {Streamer, Settings, TwitchAppToken} from './types';

const STREAMERS_KEY = 'streamers';
const SETTINGS_KEY = 'settings';
const TOKEN_KEY = 'twitchAppToken';
const AUTO_WATCH_TAB_KEY = 'autoWatchTabId';

export async function getStreamers(): Promise<Streamer[]> {
  const data = await chrome.storage.sync.get([STREAMERS_KEY]);
  return (data[STREAMERS_KEY] as Streamer[] | undefined) ?? [];
}

export async function setStreamers(streamers: Streamer[]): Promise<void> {
  await chrome.storage.sync.set({[STREAMERS_KEY]: streamers});
}

export async function getSettings(): Promise<Settings | null> {
  const data = await chrome.storage.local.get([SETTINGS_KEY]);
  return (data[SETTINGS_KEY] as Settings | undefined) ?? null;
}

export async function setSettings(settings: Settings): Promise<void> {
  await chrome.storage.local.set({[SETTINGS_KEY]: settings});
}

export async function getAppToken(): Promise<TwitchAppToken | null> {
  const data = await chrome.storage.local.get([TOKEN_KEY]);
  return (data[TOKEN_KEY] as TwitchAppToken | undefined) ?? null;
}

export async function setAppToken(token: TwitchAppToken): Promise<void> {
  await chrome.storage.local.set({[TOKEN_KEY]: token});
}

export async function clearAppToken(): Promise<void> {
  await chrome.storage.local.remove(TOKEN_KEY);
}

export async function getAutoWatchTabId(): Promise<number | null> {
  const data = await chrome.storage.local.get([AUTO_WATCH_TAB_KEY]);
  return (data[AUTO_WATCH_TAB_KEY] as number | undefined) ?? null;
}

export async function setAutoWatchTabId(tabId: number): Promise<void> {
  await chrome.storage.local.set({[AUTO_WATCH_TAB_KEY]: tabId});
}

export async function clearAutoWatchTabId(): Promise<void> {
  await chrome.storage.local.remove(AUTO_WATCH_TAB_KEY);
}
