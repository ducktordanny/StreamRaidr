# StreamRaidr Plan

## Target

Build a Chrome extension that ranks Twitch streamers and can auto-open the highest-ranked live streamer.

## Reached Goals

- Base project scaffold created (Vite + React + TypeScript + Manifest V3)
- Extension structure in place (`popup`, `background`, `shared`, `content`)
- Tooling baseline ready (`pnpm`, Prettier, Husky, lint-staged)

## Planned Goals

### Phase 1: MVP

1. Streamer add/remove and persistence in `chrome.storage.sync`
2. Twitch Helix live-status checks via `GET /helix/streams` using `Client-ID`
3. Background polling with configurable interval
4. Auto-watch behavior for highest-ranked live streamer
5. Settings for Client ID, auto-watch, poll interval, and clear data

### Phase 2: Polish

1. Drag-and-drop ranking reorder
2. Stronger live/offline/loading/error status UI
3. Optional notification when auto-watch opens a stream

### Phase 3: Future

1. OAuth PKCE flow (replace manual Client ID entry)
2. Import/export streamer list
3. Quick actions (open stream, copy link)
4. Theme support
