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
  - `metric.ts` - The room-wide result statistic (`average` / `mode` / `decision`, default `decision`), plus the `METRICS` list the picker renders. **Second parity file**: the id block must stay equivalent to the server's `cdk/src/domain/metric.ts`, and both sides pin the ids in a test (`tests/domain/metric.test.ts`), or the server rejects what the picker sends.
  - `results.ts` - `summarize(deck, votes)` for average/mode/decision/consensus, and `metricValue(metric, summary)` for the one value the room is showing
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
  - `room/` - RoomHeader, TimerControl, `fan.ts` (the hand's geometry),, SettingsDialog, DeckSwitcher, MetricSwitcher, NameDialog, CopyLink, ResultsPanel, ParticipantsPanel, ParticipantCard, Hand, HandCard, ReactionBar, ReactionFloat, EmojiDialog, ConnectionBanner, RoomScreen
  - `home/HomeScreen.tsx`, `login/LoginForm.tsx` - Screens
  - `AppHeader.tsx`, `Wordmark.tsx`, `PersonalSettings.tsx` - Shared across all three pages: the one header bar, the brand lockup, and the personal settings (name + theme) that both the room's gear and home's gear show
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
The room is a normally scrolling page (`min-h-dvh`) holding one centred vertical stack, `max-w-5xl`: sticky `RoomHeader`, `ConnectionBanner`, the `ResultsPanel`, the `ParticipantsPanel` (the white card that anchors the screen, with the participant flip cards in a wrapping grid and the reaction floats positioned inside it), the `Reveal` / `Next Vote` buttons, the fanned `Hand`, then the `ReactionBar`. There is no fixed-height shell and nothing clips, so do not reintroduce `h-dvh overflow-hidden` or viewport-fraction heights.

**The hand fits its width by construction** (`src/components/room/fan.ts`, and see that file's comments). The fan is a `relative` box with absolutely positioned cards: card `i` sits at `left: calc((100% - var(--card-w)) * i / (n - 1))`, so the cards always span exactly the box and the overlap is whatever the width leaves — no fixed row width, no `overflow-x`, no horizontal scroller, any deck, any viewport. The box is `mx-auto`, capped at `min(30rem, card-w * (1 + 0.8 * (n - 1)))` so a short deck still overlaps, and it states its own height (`--fan-rise` + `--card-h` + the arc's sink) because absolute children give it none. `--card-w` is `clamp(3.5rem, 12vw, 5rem)` with `--card-h` 1.4x that, so the cards scale instead of stepping at a breakpoint. Each card rotates about `origin-bottom` from `-MAX_TILT` on the left to `+MAX_TILT` on the right (12deg, which is as far as they can lean before the rotated top corners leave the 24px of gutter the shell's `px-3` plus the hand's own `px-3` provide), and sinks by `fanSink`, which cancels the rise that rotating about the bottom edge gives a card's outer top corner and then drops it onto a 48rem pivot circle. That is what makes it a fan and not its inverse: measured, the end cards' top edges sit 16.78px *below* the middle card's at every width. Selection (`--fan-lift`) and hover/focus (`--fan-pop`) raise a card straight up on top of that, within `--fan-rise`; do not add `overflow` anywhere in the hand, it would cut that rise off. Cards overlap, so the top-left corner label is the part that stays readable in the sliver; the exposed sliver is 22px at 320 and 29px at 390 (with eleven cards, `(box - card) / 10` cannot reach 28px below ~384px wide, so this is the ceiling, not a tuning choice).

`ResultsPanel` is one compact centred card, not a full-width band: the room shows a single statistic (the room's `metric`), as a small uppercase label above a large value, with the `Consensus!` pill beside that pair rather than stacked above it. Its height is fixed — the value line is `h-9` whether it holds the pending spinner, the value, or the value with the pill — so revealing and reaching consensus never move the participants panel. Measured: the card is 77px tall and the panel's top stays put in every state.

### The header, on every page
One bar, `src/components/AppHeader.tsx`: it owns the chrome (`header-chrome` over `bg-header`, sticky, `min-h-14` so all three pages stand 56px tall, the `max-w-5xl` row and its padding) and the `Wordmark` that starts it; each page passes only its own controls as children. **Room**: copy link, timer, gear, and from `lg` up name and theme. **Home**: the personal pair from `sm` up, folded behind the same gear below that (`PersonalSettingsDialog`). **Login**: theme only — there is no name before sign-in. `src/components/PersonalSettings.tsx` holds the shared `Field` and the personal fields, so the room's gear and home's gear show the same two settings.

**The row is `flex-wrap`, and that is load-bearing**: a bar that cannot fit takes a second line instead of pushing the page wider than the viewport. The breakpoints are chosen so it does not come to that except on the room below 390px (header 96px, two rows, measured at 320 and 375) — but a long room id or a long name can no longer break the page. Do not replace it with a `nowrap` row tuned to one width; that is exactly the bug that produced the blank strip on the right (the `sm` gate put the name and the five swatches in the room bar at 640px, where they need 690px).

**Header split, by who a setting affects.** `SettingsDialog` (the gear) is the one sheet, with two labelled sections: **Room** — the deck and the metric, with "These change the room for everyone in it." — and **You** — name and theme. The room section is there at every width. The personal section is `lg:hidden`, so above `lg` it is `display:none` (and out of the tab order) because `NameDialog` and `ThemePicker` sit inline in the bar instead; below `lg` it is the only place they live. `lg` and not `sm`: the room bar also carries the link and the timer, and 1024px is the first width where all of them fit beside a whole wordmark *and* a name at its `max-w-28` limit.

That is the trade the narrow bar forces, and it is settled: **the wordmark is never cut down.** The lockup keeps its mark *and* its word at every width (`Wordmark` has no compact mode by design — see its doc comment and af2d425); the 120px that costs comes out of the controls, which fold behind the gear, not out of the brand. Measured at 390px: header 56px, one row, `macaroni poker` fully visible at 120px and unclipped, and no horizontal overflow. `TimerControl`'s readout is `text-sm sm:text-lg` for the last few of those pixels, and `CopyLink`'s room id is `max-w-32 truncate` so it cannot grow without bound. Measured after this: `scrollWidth === clientWidth` on login, home and room at 320, 340, 360, 375, 390, 412, 430, 500, 639, 640, 700, 767, 768, 900, 1023, 1024, 1280 and 1440, with no element's box crossing the viewport edge at any of them.

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
