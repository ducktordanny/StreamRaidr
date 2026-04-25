import {defineManifest} from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'StreamRaidr',
  version: '0.1.0',
  description: 'Your top streamers, always on lurk.',
  icons: {
    16: 'icons/icon16.png',
    32: 'icons/icon32.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  },
  action: {
    default_title: 'StreamRaidr',
    default_popup: 'src/popup/index.html',
    default_icon: {
      16: 'icons/icon16.png',
      32: 'icons/icon32.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
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
