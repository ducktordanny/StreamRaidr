# AGENTS.md

Project instructions for coding agents working in this repository.

## Mission

Build **StreamRaidr**, a Chrome extension that lets users rank Twitch streamers and optionally auto-open the highest-ranked streamer who is live.

Current phase: **Post-MVP polish**.

## Source of Truth

- Product and implementation plan: `README.md`
- Project scaffold and architecture: `src/` and `vite.config.ts`
- Formatting rules: `.prettierrc`

If guidance conflicts, follow this priority:

1. Direct user request
2. `AGENTS.md`
3. `README.md`

## Stack and Constraints

- React 19 + TypeScript (strict mode)
- Vite + `@crxjs/vite-plugin`
- Chrome Extension Manifest V3
- Background service worker (no persistent background page)
- Storage:
  - `chrome.storage.sync` for streamer rankings/list
  - `chrome.storage.local` for auth token, settings, and auto-watch tab ID
- No server-side component
- Auth: Twitch OAuth implicit flow via `chrome.identity.launchWebAuthFlow`

## Package Manager and Tooling

- Package manager: `pnpm` (see `package.json#packageManager`)
- Do not introduce npm/yarn lockfiles
- Pre-commit hook: Husky + lint-staged
  - `.husky/pre-commit` runs `pnpm lint-staged`
  - staged files are formatted with Prettier

## Commands

- Install: `pnpm install`
- Dev: `pnpm dev`
- Typecheck: `pnpm typecheck`
- Build: `pnpm build`
- Format: `pnpm format`
- Format check: `pnpm format:check`

Agents should run `pnpm typecheck` (and `pnpm build` for substantial changes) before finishing.

## Architecture Expectations

Keep code aligned with existing structure:

- `src/manifest.ts` - extension manifest definition
- `src/popup/` - popup UI
  - `components/` for presentational UI pieces
  - `hooks/` for popup logic and data access
- `src/background/` - polling and auto-watch orchestration
- `src/shared/` - shared types, constants, storage helpers, and reusable UI primitives (`components/ui/`)
- `src/content/` - optional content script logic

Prefer small, focused modules with clear boundaries.

## Completed Features

All Phase 1 MVP features are shipped:

1. Streamer add/remove and persistence (`chrome.storage.sync`)
2. Twitch OAuth login via `chrome.identity` (implicit flow, silent renew on 401)
3. Autocomplete streamer search using `GET /helix/search/channels`
4. Live-status checks via `GET /helix/streams`, shown with viewer count and game
5. Background polling with configurable interval (`chrome.alarms`)
6. Auto-watch: designated tab always follows the highest-ranked live streamer
7. Settings UI: login/logout, poll interval, theme (light/dark/system), clear data
8. Drag-to-reorder streamer list

## Coding Guidelines

- Preserve TypeScript strictness; avoid `any`
- Reuse shared types from `src/shared/types.ts`
- Keep side effects out of UI components when possible
- Prefer single-file components with one clear responsibility per component
- Build base UI primitives (button, input, toggle, etc.) as separate pure reusable components
- Think in structure first; keep code organized and avoid messy implementations
- Add only necessary dependencies
- Do not add comments unless a block is non-obvious
- Do not use single-letter variable names; prefer descriptive names
- Prefer one-line `if` statements when they remain readable
- Follow Prettier formatting from `.prettierrc`
- CSS sizing scale: use only power-of-2 values (0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512; for sub-pixel: 0.1, 0.2, 0.4, 0.8). All spacing, sizing, and numeric CSS values should follow this doubling pattern. Font sizes may use standard type scale values (12, 14, 16, 20, 32).

## Safety and Data Rules

- Never commit secrets, tokens, or personal credentials
- Do not hardcode a Twitch Client ID in source
- Treat storage schema updates carefully; prefer backward-compatible reads
- Avoid destructive git actions unless explicitly requested

## Definition of Done (for implementation tasks)

- Feature behavior matches `README.md` MVP intent
- Code is formatted
- `pnpm typecheck` passes
- `pnpm build` passes for non-trivial changes
- No unrelated file churn
