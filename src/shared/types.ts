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
  autoWatchEnabled: boolean;
  pollInterval: number;
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
