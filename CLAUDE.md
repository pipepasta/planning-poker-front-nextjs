# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm ci` - Install dependencies (recommended over npm install)
- `npm run dev` - Start development server at http://localhost:3000 (with Turbopack)
- `npm run build` - Build production bundle
- `npm run start` - Start production server

### Code Quality
- `npm run lint` - Run Biome linting and formatting checks
- `npm run typecheck` - Run TypeScript type checking (`tsc --noEmit`)
- `npm test` - Run Vitest test suite once
- `npm run test:watch` - Run Vitest in watch mode

### CI
- `.github/workflows/biome_check.yaml` - Biome lint/format check
- `.github/workflows/ci.yaml` - On pull requests to `main` and `workflow_dispatch`: `npm ci`, `npm run typecheck`, `npx vitest run`, `npm run build`. The build step gets placeholder Supabase env vars from the workflow, so it never depends on repository secrets.

## Architecture Overview

This is a Next.js planning poker client application that connects to a WebSocket-based planning poker server using a snapshot-based protocol. Pure modules hold domain logic and message parsing; a room module owns the WebSocket lifecycle and a reducer that applies server snapshots; presentational components are composed by three route screens (login, home, room). Supabase anonymous auth supplies the JWT used for the socket connection.

### Project Structure
- `src/domain/` - Pure domain logic shared in spirit with the server
  - `deck.ts` - Deck definitions. **Parity file**: it must stay equivalent to the server's `cdk/src/domain/deck.ts`. Both sides pin the card arrays in a test (`tests/domain/deck.test.ts` here), so a deck change has to be made deliberately in both repos or votes are silently rejected.
  - `results.ts` - `summarize(deck, votes)` for average/mode/decision/consensus
  - `timer.ts` - `elapsedMs`, `formatDuration`
- `src/protocol/` - `messages.ts` defines server/client message types, `parseServerMessage`, and the shared input limits (`ROOM_ID_MAX`, `NAME_MAX`, `isValidRoomId`). Components import those constants rather than re-declaring their own copies.
- `src/room/` - WebSocket connection and room state
  - `roomReducer.ts` - Connection + snapshot + my-selection state machine
  - `useRoomConnection.ts` - WebSocket lifecycle, reconnect, ping, send helpers
  - `useTimerDisplay.ts` - 1 Hz elapsed string from timer + clock offset
  - `useReactions.ts` - Transient floating reactions list
- `src/lib/` - Cross-cutting utilities
  - `supabase/{client,server,proxy}.ts` - Supabase clients and session refresh
  - `session.ts` - `useSession()` (user id, display name, token getter, rename)
  - `prefs.ts` - `themeAtom`
  - `toast.ts` - Toast store (`toast()`, `useToasts()`)
  - `haptics.ts` - `tap()`
  - `cn.ts` - `cn()` class name helper
- `src/components/` - Presentational components
  - `ui/` - Button, IconButton, Panel, Input, Dialog, Toaster, Skeleton, Spinner, Segmented
  - `theme/` - ThemeProvider, ThemePicker
  - `room/` - RoomHeader, TimerControl, DeckSwitcher, NameDialog, CopyLink, ResultsPanel, ParticipantsPanel, ParticipantCard, Hand, HandCard, ReactionBar, ReactionFloat, EmojiDialog, ConnectionBanner, RoomScreen
  - `home/HomeScreen.tsx`, `login/LoginForm.tsx` - Screens
- `app/` - Routes: `layout.tsx`, `globals.css`, `page.tsx`, `login/{page.tsx,actions.ts}`, `rooms/[roomId]/page.tsx`
- `proxy.ts` - Auth redirect
- `tests/` - Vitest tests

### State Management Architecture
- **Jotai atoms** for persistent client-side state (theme color)
- **Room reducer + `useRoomConnection`** manage real-time server communication and connection state
- **Local React state** for UI-specific state

### WebSocket Integration
`src/room/useRoomConnection.ts` handles all real-time features:
- Room joining/leaving
- Vote submission and revelation
- Timer controls (reset, pause, resume)
- Reaction system
- Automatic reconnection and heartbeat

The WebSocket endpoint is selected via `NEXT_PUBLIC_WS_URL` (default is the production AWS API Gateway WebSocket URL).

### Room Layout
The room is a normally scrolling page (`min-h-dvh`) holding one centred vertical stack, `max-w-5xl`: sticky `RoomHeader`, `ConnectionBanner`, the results row (`average` / `mode` / `scrum decision` as three equal columns, spinners before the reveal), the `ParticipantsPanel` (the white card that anchors the screen, with the participant flip cards in a wrapping grid and the reaction floats positioned inside it), the `Reveal` / `Next Vote` buttons, the fanned `Hand`, then the `ReactionBar`. There is no fixed-height shell and nothing clips, so do not reintroduce `h-dvh overflow-hidden` or viewport-fraction heights. The hand's top padding still has to clear the fan's upward arc plus the selected card's rise, so `HandCard`'s tilt and lift stay capped (`MAX_TILT`, `MAX_LIFT`) and the row keeps `pt-10`.

### Theme System
- Colours are HSL triples in CSS variables consumed as `hsl(var(--x))`: `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring` and their `-foreground` pairs. `@theme inline` in `app/globals.css` maps each to a Tailwind colour utility.
- Five themes (pink, blue, green, purple, orange) selected by `data-theme` on `<html>`. A theme is only two hues (`--theme-h`, `--theme-h-soft`); one shared set of lightness/saturation formulas in `:root` derives every token from them, so add a theme by adding a `[data-theme="..."]` hue pair.
- The look is a pale tinted background, white `--card` panels with hairline `border-border` and soft shadows (`shadow-sm`/`md`/`lg`), and pastel `--primary` for the selected card, the primary buttons and the voted state. No hard offset shadows and no colours outside the token set.
- `--radius: 0.75rem`, with `rounded-lg`/`md`/`sm` derived from it.
- One typeface: Inter, loaded in `app/layout.tsx` and exposed as `--font-sans`.
- `app/globals.css` also owns the single `hsl(var(--ring))` `:focus-visible` outline, the flip-card utilities, the reaction float and `pop-in` animations, and the `prefers-reduced-motion` opt-outs.
- No dark mode.
- Theme state persisted via Jotai storage atom (`mp.theme`).

### Component Architecture
- **Screens** (`src/components/home`, `src/components/login`, `src/components/room`) compose presentational pieces and connect to room/session state
- **UI components** (`src/components/ui`) are pure presentation components with minimal logic
- **Providers** (`src/components/theme`) supply theme context
- All components follow consistent TypeScript patterns with proper typing

### Authentication
- Supabase integration with SSR support (`src/lib/supabase`)
- Login page with authentication flow
- `proxy.ts` handles protected routes

## Key Dependencies
### UI & Styling
- **@radix-ui/react-dialog** - Accessible UI primitives
- **lucide-react** - Modern icon library
- **clsx** & **tailwind-merge** - Utility-first styling (`cn()`)
- **frimousse** - Emoji picker

### State & Effects
- **jotai** - Global state management
- **react-confetti** (6.2.2) - Celebration animations

## Code Style Guidelines
- 4-space indentation (enforced by Biome)
- Biome formatting with recommended rules and auto-imports organization
- Disabled rules for flexibility:
  - `useExhaustiveDependencies` (correctness)
  - `noStaticElementInteractions` (a11y)
  - `noForEach` (complexity)
- Component organization follows feature-based architecture
- TypeScript strict mode with comprehensive type definitions
- Git integration enabled with VCS support

## Next.js Configuration
- Turbopack enabled for faster development builds
- Trailing slash redirects disabled (`skipTrailingSlashRedirect: true`)
- Optimized for planning poker real-time features

## Environment Setup
The application requires Supabase environment variables for authentication:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## WebSocket Server
Connects to AWS API Gateway WebSocket endpoint for real-time planning poker functionality. The endpoint is configurable via `NEXT_PUBLIC_WS_URL` (default is the production API Gateway URL).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
