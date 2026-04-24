export interface Streamer {
  id: string;
  username: string;
  rank: number;
  isLive: boolean;
  viewerCount?: number;
  gameName?: string;
  profileImageUrl?: string;
}

export type NewStreamer = Pick<Streamer, 'username' | 'profileImageUrl' | 'isLive' | 'gameName'>;

export type Theme = 'system' | 'light' | 'dark';

export interface Settings {
  clientId: string;
  clientSecret: string;
  pollInterval: number;
  theme: Theme;
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
