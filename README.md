# StreamRaidr

StreamRaidr is a Chrome extension that lets you rank your favorite Twitch streamers and optionally auto-open the highest-ranked streamer who is currently live.

## Features

- Add and remove streamers by Twitch username
- Keep a ranked list of streamers (highest priority first)
- Check live status using the Twitch Helix API
- Optional auto-watch mode to open the top-ranked live streamer
- Store your Twitch Client ID and extension settings locally

## Tech Stack

- React 18
- TypeScript (strict mode)
- Vite
- `@crxjs/vite-plugin`
- Chrome Extension Manifest V3

## Project Structure

```text
src/
  manifest.ts
  popup/
  background/
  shared/
  content/
public/
  icons/
```

## Requirements

- Node.js 20.17+
- pnpm
- Google Chrome

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start development:

   ```bash
   pnpm dev
   ```

3. Build the extension:

   ```bash
   pnpm build
   ```

4. Load the built extension in Chrome:
   - Open `chrome://extensions`
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select the `dist/` directory

## Available Scripts

- `pnpm dev` - Start Vite dev server
- `pnpm typecheck` - Run TypeScript checks
- `pnpm build` - Typecheck and build extension
- `pnpm format` - Format files with Prettier
- `pnpm format:check` - Check formatting

## Twitch Setup

To check stream live status, create a Twitch Developer application and copy your **Client ID** into extension settings.

- Console: https://dev.twitch.tv/console
- API used: `GET https://api.twitch.tv/helix/streams`
- Header required: `Client-ID: <your-client-id>`

## Notes

- This project currently uses a Client ID flow (no OAuth yet)
- No server-side component is required for the current version
