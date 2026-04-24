# StreamRaidr

A Chrome extension that tracks your favourite Twitch streamers and automatically switches a designated tab to whoever is live at the top of your list.

## Features

- Add up to 10 Twitch streamers with live autocomplete search
- Drag-to-reorder your priority list
- Live status, viewer count, and current game shown in the popup
- **Auto-watch**: pin a browser tab that always follows your highest-ranked live streamer
- Configurable poll interval (1–60 minutes)
- Light / dark / system theme

## Requirements

- Node.js 20.17+
- pnpm
- Google Chrome

## Setup

### 1. Create a Twitch application

1. Go to the [Twitch Developer Console](https://dev.twitch.tv/console/apps) and create a new application.
2. Set the **OAuth Redirect URL** to:
   ```
   https://<your-extension-id>.chromiumapp.org/twitch
   ```
   > **Where to find your extension ID:** load the extension in Chrome first (see step 4 below), then copy the ID from `chrome://extensions`. The full redirect URL is also printed to the service worker console on first load.
3. Set **Category** to _Browser Extension_.
4. Copy the **Client ID**.

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Client ID:

```
VITE_TWITCH_CLIENT_ID=your_twitch_client_id_here
```

### 3. Install dependencies and build

```bash
pnpm install
pnpm build
```

### 4. Load the extension in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `dist/` folder

## Development

```bash
pnpm dev
```

Vite watches for changes and rebuilds automatically. After each rebuild, click the reload icon on `chrome://extensions`.

## Available Scripts

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `pnpm dev`          | Start Vite in watch mode               |
| `pnpm build`        | Typecheck + build extension to `dist/` |
| `pnpm typecheck`    | Run TypeScript checks only             |
| `pnpm format`       | Format all files with Prettier         |
| `pnpm format:check` | Check formatting without writing       |

## Project Structure

```
src/
  manifest.ts          # Chrome extension manifest
  background/          # Service worker (polling, auto-watch)
  popup/               # React popup UI
  shared/              # Types, storage, Twitch API client
  content/             # Content script (unused placeholder)
```

## Tech Stack

- React 18 + TypeScript
- Vite + [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin)
- Chrome Extension Manifest V3
