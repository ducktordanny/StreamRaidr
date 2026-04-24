import {defineManifest} from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'StreamRaidr',
  version: '0.1.0',
  description: 'Your top streamers, always on.',
  action: {
    default_title: 'StreamRaidr',
    default_popup: 'src/popup/index.html',
  },
  background: {
    service_worker: 'src/background/background.ts',
    type: 'module',
  },
  permissions: ['storage', 'alarms', 'tabs', 'identity'],
  host_permissions: [
    'https://api.twitch.tv/*',
    'https://id.twitch.tv/*',
    'https://www.twitch.tv/*',
  ],
});
