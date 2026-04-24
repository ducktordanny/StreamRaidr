# StreamRaidr Plan

## Target

Build a Chrome extension that ranks Twitch streamers and can auto-open the highest-ranked live streamer.

## Reached Goals

- Base project scaffold (Vite + React + TypeScript + Manifest V3)
- Extension structure in place (`popup`, `background`, `shared`, `content`)
- Tooling baseline (`pnpm`, Prettier, Husky, lint-staged)
- Streamer add/remove and persistence in `chrome.storage.sync`
- Autocomplete streamer search via `GET /helix/search/channels`
- Twitch OAuth login via `chrome.identity` (implicit flow, silent renew on 401)
- Live-status checks via `GET /helix/streams` with viewer count and game name
- Background polling with configurable interval (`chrome.alarms`)
- Auto-watch: designated tab always follows the highest-ranked live streamer
- Drag-to-reorder streamer list
- Settings UI: login/logout, poll interval, theme, clear data
- Light / dark / system theme support

## Planned Goals

### Phase 2: Polish

1. Stronger error state UI (surface API failures to the user)
2. Notification when auto-watch switches to a new streamer
3. Show streamer profile images (already stored, could be displayed more prominently)

### Phase 3: Future

1. Import/export streamer list
2. Quick actions (copy link, open in mini-player)
3. Switch to OAuth PKCE flow (more robust than implicit)
