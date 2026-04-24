export interface Streamer {
  id: string;
  username: string;
  rank: number;
  isLive: boolean;
  viewerCount?: number;
  gameName?: string;
}

export interface Settings {
  clientId: string;
  clientSecret: string;
  autoWatchEnabled: boolean;
  pollInterval: number;
}

export interface TwitchAppToken {
  accessToken: string;
  expiresAt: number;
}

export interface TwitchSearchResult {
  id: string;
  broadcaster_login: string;
  display_name: string;
  is_live: boolean;
  game_name: string;
  thumbnail_url: string;
}

export interface TwitchStream {
  id: string;
  user_login: string;
  user_name: string;
  viewer_count: number;
  game_name: string;
  title: string;
  thumbnail_url: string;
}
