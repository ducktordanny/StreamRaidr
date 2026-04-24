import {DEFAULT_POLL_INTERVAL_MINUTES} from '../shared/constants';

const POLL_ALARM_NAME = 'streamraidr-poll';

async function runPollCycle(
  trigger: 'alarm' | 'install' | 'startup' | 'service-worker-load',
): Promise<void> {
  console.log(`[StreamRaidr] Poll cycle triggered by ${trigger}`);
}

async function ensurePollingAlarm(): Promise<void> {
  const existingAlarm = await chrome.alarms.get(POLL_ALARM_NAME);
  const desiredPeriodInMinutes = DEFAULT_POLL_INTERVAL_MINUTES;

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
