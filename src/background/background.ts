import {DEFAULT_POLL_INTERVAL_MINUTES} from '../shared/constants';
import {getSettings} from '../shared/storage';
import {getStreamers, setStreamers} from '../shared/storage';
import {fetchLiveStreams} from '../shared/twitchApi';
import type {TwitchStream} from '../shared/types';

const POLL_ALARM_NAME = 'streamraidr-poll';

async function runPollCycle(trigger: 'alarm' | 'install' | 'startup'): Promise<void> {
  try {
    const settings = await getSettings();
    if (!settings?.clientId || !settings?.clientSecret) {
      console.log('[StreamRaidr] Skipping poll: no API credentials configured');
      return;
    }

    const streamers = await getStreamers();
    if (streamers.length === 0) return;

    const usernames = streamers.map((streamer) => streamer.username);
    const liveStreams = await fetchLiveStreams(settings.clientId, settings.clientSecret, usernames);

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
    console.log(`[StreamRaidr] Poll complete (${trigger}): ${liveStreams.length} live`);
  } catch (error) {
    console.error('[StreamRaidr] Poll cycle failed:', error);
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
