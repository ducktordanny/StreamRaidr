import type {Streamer} from '../shared/types';
import {getStreamers, getAutoWatchTabId, clearAutoWatchTabId} from '../shared/storage';
import {TWITCH_CHANNEL_URL_PREFIX} from '../shared/constants';

function findTopLiveStreamer(streamers: Streamer[]): Streamer | undefined {
  return [...streamers]
    .sort((first, second) => first.rank - second.rank)
    .find((streamer) => streamer.isLive);
}

export async function executeAutoWatch(): Promise<void> {
  const tabId = await getAutoWatchTabId();
  if (tabId === null) return;

  try {
    const tab = await chrome.tabs.get(tabId);
    const streamers = await getStreamers();
    const topLive = findTopLiveStreamer(streamers);

    if (!topLive) return;

    const targetUrl = `${TWITCH_CHANNEL_URL_PREFIX}${topLive.username}`;
    if (tab.url !== targetUrl) await chrome.tabs.update(tabId, {url: targetUrl});
  } catch {
    await clearAutoWatchTabId();
  }
}

export function setupTabRemovalListener(): void {
  chrome.tabs.onRemoved.addListener(async (closedTabId) => {
    const autoWatchTabId = await getAutoWatchTabId();
    if (autoWatchTabId === closedTabId) await clearAutoWatchTabId();
  });
}
