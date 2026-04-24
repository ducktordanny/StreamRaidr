export const DEFAULT_POLL_INTERVAL_MINUTES = 5;

export const STORAGE_KEY_STREAMERS = 'streamers';
export const STORAGE_KEY_SETTINGS = 'settings';
export const STORAGE_KEY_TOKEN = 'twitchUserToken';
export const STORAGE_KEY_AUTO_WATCH_TAB = 'autoWatchTabId';

export const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID as string;
export const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/authorize';
export const TWITCH_API_BASE_URL = 'https://api.twitch.tv/helix';
export const SEARCH_RESULTS_LIMIT = 8;
export const AUTOCOMPLETE_DEBOUNCE_MS = 256;
export const MAX_STREAMERS = 10;
export const TWITCH_CHANNEL_URL_PREFIX = 'https://www.twitch.tv/';
