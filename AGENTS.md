# AGENTS.md

Project instructions for coding agents working in this repository.

## Mission

Build **StreamRaidr**, a Chrome extension that lets users rank Twitch streamers and optionally auto-open the highest-ranked streamer who is live.

Current phase: **Phase 1 MVP (Client ID-based, no OAuth)**.

## Source of Truth

- Product and implementation plan: `README.md`
- Project scaffold and architecture: `src/` and `vite.config.ts`
- Formatting rules: `.prettierrc`

If guidance conflicts, follow this priority:

1. Direct user request
2. `AGENTS.md`
3. `README.md`

## Stack and Constraints

- React 18 + TypeScript (strict mode)
- Vite + `@crxjs/vite-plugin`
- Chrome Extension Manifest V3
- Background service worker (no persistent background page)
- Storage:
  - `chrome.storage.sync` for streamer rankings/list
  - `chrome.storage.local` for Twitch Client ID
- No server-side component
- No OAuth for MVP

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

## MVP Feature Expectations

Implement in this order unless user asks otherwise:

1. Streamer add/remove and persistence
2. Twitch Helix live-status checks (`GET /helix/streams` with `Client-ID`) — also add autocomplete to the Add Streamer input using the Twitch search endpoint
3. Background polling with configurable intervals
4. Auto-watch behavior (open highest-ranked live streamer)
5. Settings UI (Client ID, interval, auto-watch toggle, clear data)

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
