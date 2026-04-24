import type {Streamer} from './types';

const STREAMERS_KEY = 'streamers';

export async function getStreamers(): Promise<Streamer[]> {
  const data = await chrome.storage.sync.get([STREAMERS_KEY]);
  return (data[STREAMERS_KEY] as Streamer[] | undefined) ?? [];
}

export async function setStreamers(streamers: Streamer[]): Promise<void> {
  await chrome.storage.sync.set({[STREAMERS_KEY]: streamers});
}
