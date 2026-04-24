import {DEFAULT_POLL_INTERVAL_MINUTES, STORAGE_KEY_AUTO_WATCH_TAB} from '../shared/constants';
import {getSettings, getUserToken} from '../shared/storage';
import {STORAGE_KEY_SETTINGS, STORAGE_KEY_STREAMERS} from '../shared/constants';
import {getStreamers, setStreamers} from '../shared/storage';
import {fetchLiveStreams} from '../shared/twitchApi';
import type {TwitchStream} from '../shared/types';
import {executeAutoWatch, setupTabListeners} from './autoWatch';

const POLL_ALARM_NAME = 'streamraidr-poll';

function log(...args: unknown[]) {
  console.log(`[StreamRaidr ${new Date().toLocaleString()}]`, ...args);
}

function logError(...args: unknown[]) {
  console.error(`[StreamRaidr ${new Date().toLocaleString()}]`, ...args);
}

async function runPollCycle(trigger: 'alarm' | 'install' | 'startup'): Promise<void> {
  try {
    const token = await getUserToken();
    if (!token) {
      log('Skipping poll: not logged in');
      return;
    }

    const streamers = await getStreamers();
    if (streamers.length === 0) return;

    const usernames = streamers.map((streamer) => streamer.username);
    const liveStreams = await fetchLiveStreams(usernames);

    const liveStreamMap = new Map<string, TwitchStream>();
    for (const stream of liveStreams) {
      liveStreamMap.set(stream.user_login.toLowerCase(), stream);
    }

    const updatedStreamers = streamers.map((streamer) => {
      const matchingStream = liveStreamMap.get(streamer.id);
      return {
        ...streamer,
        isLive: !!matchingStream,
        viewerCount: matchingStream?.viewer_count,
        gameName: matchingStream?.game_name,
      };
    });

    await setStreamers(updatedStreamers);
    await executeAutoWatch();
    log(`Poll complete (${trigger}): ${liveStreams.length} live`);
  } catch (error) {
    logError('Poll cycle failed:', error);
  }
}

async function ensurePollingAlarm(): Promise<void> {
  const settings = await getSettings();
  const desiredPeriodInMinutes = settings?.pollInterval ?? DEFAULT_POLL_INTERVAL_MINUTES;

  const existingAlarm = await chrome.alarms.get(POLL_ALARM_NAME);
  if (existingAlarm?.periodInMinutes === desiredPeriodInMinutes) return;

  if (existingAlarm) await chrome.alarms.clear(POLL_ALARM_NAME);

  chrome.alarms.create(POLL_ALARM_NAME, {
    delayInMinutes: 0.1,
    periodInMinutes: desiredPeriodInMinutes,
  });
}

void ensurePollingAlarm();
setupTabListeners();

chrome.runtime.onInstalled.addListener(() => {
  void ensurePollingAlarm();
  void runPollCycle('install');
});

chrome.runtime.onStartup.addListener(() => {
  void ensurePollingAlarm();
  void runPollCycle('startup');
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== POLL_ALARM_NAME) return;

  void runPollCycle('alarm');
});

chrome.storage.local.onChanged.addListener((changes) => {
  if (STORAGE_KEY_SETTINGS in changes) void ensurePollingAlarm();
  if (STORAGE_KEY_AUTO_WATCH_TAB in changes) void executeAutoWatch();
});

chrome.storage.sync.onChanged.addListener((changes) => {
  if (STORAGE_KEY_STREAMERS in changes) void executeAutoWatch();
});
