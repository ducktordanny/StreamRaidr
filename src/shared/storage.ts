import type {Streamer, Settings, TwitchUserToken} from './types';
import {
  STORAGE_KEY_STREAMERS,
  STORAGE_KEY_SETTINGS,
  STORAGE_KEY_TOKEN,
  STORAGE_KEY_AUTO_WATCH_TAB,
} from './constants';

export async function getStreamers(): Promise<Streamer[]> {
  const data = await chrome.storage.sync.get([STORAGE_KEY_STREAMERS]);
  return (data[STORAGE_KEY_STREAMERS] as Streamer[] | undefined) ?? [];
}

export async function setStreamers(streamers: Streamer[]): Promise<void> {
  await chrome.storage.sync.set({[STORAGE_KEY_STREAMERS]: streamers});
}

export async function getSettings(): Promise<Settings | null> {
  const data = await chrome.storage.local.get([STORAGE_KEY_SETTINGS]);
  return (data[STORAGE_KEY_SETTINGS] as Settings | undefined) ?? null;
}

export async function setSettings(settings: Settings): Promise<void> {
  await chrome.storage.local.set({[STORAGE_KEY_SETTINGS]: settings});
}

export async function getUserToken(): Promise<TwitchUserToken | null> {
  const data = await chrome.storage.local.get([STORAGE_KEY_TOKEN]);
  return (data[STORAGE_KEY_TOKEN] as TwitchUserToken | undefined) ?? null;
}

export async function setUserToken(token: TwitchUserToken): Promise<void> {
  await chrome.storage.local.set({[STORAGE_KEY_TOKEN]: token});
}

export async function clearUserToken(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEY_TOKEN);
}

export async function getAutoWatchTabId(): Promise<number | null> {
  const data = await chrome.storage.local.get([STORAGE_KEY_AUTO_WATCH_TAB]);
  return (data[STORAGE_KEY_AUTO_WATCH_TAB] as number | undefined) ?? null;
}

export async function setAutoWatchTabId(tabId: number): Promise<void> {
  await chrome.storage.local.set({[STORAGE_KEY_AUTO_WATCH_TAB]: tabId});
}

export async function clearAutoWatchTabId(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEY_AUTO_WATCH_TAB);
}

export async function clearAllData(): Promise<void> {
  await chrome.storage.sync.clear();
  await chrome.storage.local.clear();
}
