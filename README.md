# StreamRaidr Chrome Extension

## Overview
A Chrome extension called StreamRaidr that lets users rank their favorite Twitch streamers and optionally auto-opens the highest-ranked live stream.

---

## Core Features

### 1. Streamer Management
- Add streamers by Twitch username
- Drag-and-drop to reorder rankings (rank 1 = highest priority)
- Remove streamers from list
- Persist rankings using `chrome.storage.sync`

### 2. Live Status Checking
- Use **Twitch Helix API** (`GET /streams`)
- Pass usernames via `user_login` query param (up to 100 at once)
- **No OAuth required** — just `Client-ID` header with a Twitch app Client ID
- Poll at configurable interval (default: 5 minutes)
- Display live/offline status per streamer

### 3. Auto-Watch Mode
- Toggle switch in popup UI
- When enabled and a stream is live:
  - Find highest-ranked streamer who is live
  - Open `https://twitch.tv/{username}` in current tab
- If none are live: do nothing (wait for next poll)
- Optional: show notification when stream auto-opens

### 4. User Settings
- Polling interval (1, 5, 10, 15 min options)
- Auto-watch toggle
- Clear all data option

---

## Technical Stack
- **React 18** — UI components
- **TypeScript** — Type safety
- **Vite** — Build tooling (fast HMR for development)
- **Manifest V3** — Chrome extension requirement
- **Service Worker** — Background polling (V3 requirement)

## Architecture

```
Extension Structure:
├── manifest.json
├── vite.config.ts          # Build config for chrome extension
├── package.json
├── src/
│   ├── manifest.ts          # Manifest generation
│   ├── popup/
│   │   ├── Popup.tsx        # Main popup component
│   │   ├── Popup.css
│   │   ├── components/
│   │   │   ├── StreamerList.tsx
│   │   │   ├── StreamerItem.tsx
│   │   │   ├── AddStreamer.tsx
│   │   │   └── Settings.tsx
│   │   └── hooks/
│   │       ├── useStreamers.ts
│   │       └── useTwitchApi.ts
│   ├── background/
│   │   ├── background.ts    # Service worker entry
│   │   ├── polling.ts       # Polling logic
│   │   └── autoWatch.ts     # Auto-watch orchestration
│   ├── shared/
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── constants.ts     # API config, defaults
│   │   └── storage.ts       # Chrome storage helpers
│   └── content/
│       └── content.tsx      # (optional) overlays
└── public/
    └── icons/
        ├── icon16.png
        ├── icon48.png
        └── icon128.png
```

### Key Implementation Details

**Twitch API:**
```typescript
// Endpoint
GET https://api.twitch.tv/helix/streams?user_login={name1}&user_login={name2}

// Required headers
Client-ID: {Twitch_APP_CLIENT_ID}

// No OAuth needed for public stream data
```

**Type Definitions:**
```typescript
interface Streamer {
  id: string;
  username: string;
  rank: number;
  isLive: boolean;
  viewerCount?: number;
  gameName?: string;
}

interface Settings {
  clientId: string;
  autoWatchEnabled: boolean;
  pollInterval: number; // minutes
}

interface TwitchStream {
  id: string;
  user_login: string;
  user_name: string;
  viewer_count: number;
  game_name: string;
  title: string;
  thumbnail_url: string;
}
```

**Storage Schema:**
```typescript
chrome.storage.sync.get(['streamers'], ...)
// streamers = Streamer[]
```

---

## UI Design

### Popup Components (React)

```
StreamerList
├── Header (title + status count)
├── StreamerItem × N
│   ├── Rank badge
│   ├── Username
│   ├── Live/Offline indicator
│   ├── Drag handle (for reorder)
│   └── Actions (open/remove)
├── AddStreamer (input + button)
└── Settings (collapsible)

Settings Panel
├── Client ID input
├── Auto-watch toggle
└── Poll interval dropdown
```

### States per Streamer
- `LIVE` — red dot + "LIVE" badge, bold username, viewer count
- `offline` — gray dot, normal styling
- `loading` — spinner/skeleton animation
- `error` — red text, "API Error" tooltip

---

## Setup Requirements (User)

1. User creates Twitch Developer app at [dev.twitch.tv/console](https://dev.twitch.tv/console)
2. User copies Client ID into extension settings
3. Extension stores Client ID in `chrome.storage.local`

**Note:** Each user must provide their own Client ID. This is the MVP approach. See Future Enhancements for OAuth upgrade.

---

## Milestones

### Phase 1: MVP (Client ID)
- [ ] Manifest + basic popup layout
- [ ] Add/remove streamers
- [ ] Twitch API integration with user-provided Client ID
- [ ] Background polling script
- [ ] Auto-watch logic
- [ ] User must manually enter their Twitch app Client ID

### Phase 2: Polish
- [ ] Drag-and-drop reordering
- [ ] Polling interval setting
- [ ] Visual status indicators
- [ ] Notification when stream opens

### Phase 3: Future Enhancements
- [ ] **OAuth PKCE flow** — Replace Client ID with Twitch login
  - Users authenticate via Twitch OAuth (PKCE, no client secret needed)
  - Each user gets their own API quota
  - More secure, better UX (no manual Client ID entry)
  - No server-side component needed (PKCE works client-side)
- Import/export streamer list
- Quick actions (open stream, copy link)
- Dark/light theme toggle

---

## Technical Constraints
- Manifest V3 (Chrome requirement)
- Service worker for background (replaces background pages)
- `chrome.storage.sync` for cross-device sync
- Vite + `@crxjs/vite-plugin` for extension bundling
- No server-side component needed
- TypeScript strict mode enabled
