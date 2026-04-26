# mathbot — context for Claude Code

Read this first. It captures decisions and project shape so a fresh session can continue without re-asking.

## What this is

A Duolingo-like math learning platform for Finnish secondary school students. The first course is **kulmakerroin** (8th grade coordinate geometry — `y = kx + b`, gradient/slope, y-intercept). Built for a personal use case (one kid playing on their Android phone). No privacy or security stakes.

The full content design lives in `kulmakerroin-spec.md`. Treat it as a *first draft from Claude Design* — it has typos and rough edges; it is not canonical. The decisions in this file override anything in the spec.

## Architecture

- **Build:** Vite 8 + React 19 + TypeScript
- **Styling:** Tailwind v4 with design tokens defined inline in `src/index.css` via `@theme`. Custom palette (mint/coral/gold/blue/violet/rose) on a cream `#fbf8f1` background.
- **Routing:** React Router v7 with `HashRouter` (works on GitHub Pages without 404 redirect tricks).
- **State:** Zustand with `persist` middleware (`mathbot:state:v1` localStorage key). Source of truth for game state is **Firestore**; Zustand mirrors what the UI needs.
- **Auth + persistence:** Firebase. Anonymous-first (`signInAnonymously` on first load), with `linkWithPopup(googleProvider)` upgrade later — preserves UID and progress, no migration step.
- **Animation:** Framer Motion.
- **Drag/drop:** `@dnd-kit/core` (for `match` question type).
- **Hosting:** GitHub Pages, deployed via Actions on push to `main`. Repo is `vcorr/mathbot` (public).
- **PWA:** Manifest only (no service worker). Installable to home screen.
- **Locale:** Finnish hardcoded in content. Course interface has `locale: 'fi'` as future-proofing; no i18n library yet.

## Project structure

```
src/
  main.tsx                 entry
  App.tsx                  router + auth bootstrap
  index.css                Tailwind v4 + design tokens
  lib/
    firebase.ts            init, anonymous auth, Firestore helpers
    store.ts               Zustand store (persisted)
  screens/
    LevelSelectScreen.tsx
    PracticeScreen.tsx
    CompleteScreen.tsx
public/
  icon.svg                 app icon (mint with white π)
  manifest.webmanifest     PWA manifest
firestore.rules            per-user access only
firebase.json              firebase CLI config (rules deploy)
.firebaserc                project: mathbot-8
.github/workflows/deploy.yml
```

## Firebase project

- **Project ID:** `mathbot-8`
- **Region:** `eur3` (Europe multi-region)
- **Firestore:** native, production mode, rules in `firestore.rules`
- **Auth providers enabled:** Anonymous + Google
- **Console:** https://console.firebase.google.com/project/mathbot-8

`.env.local` (gitignored) holds the web SDK config. The same six values are stored as GitHub Actions secrets for production builds.

## Data model

Single doc per user:

```
users/{uid}
  profile: { createdAt, locale }
  progress: { unlockedUpTo, totalXp, dailyXp, dailyXpDate, streak,
              lastPlayedDate, hearts, heartsLastRegen }
  levelStats: { [levelId]: { stars, attempts, bestCorrect } }
```

Use `setDoc(..., { merge: true })` everywhere — never overwrite the full doc. Firestore offline persistence is on by default; queued writes sync when network returns.

## Content schema (content modules)

Course content lives in `src/courses/<id>/` as TypeScript modules. Adding a course = adding a folder.

```ts
type Question =
  | TapQuestion       // 'tap' AND 'solve' (visually different but same logic)
  | MatchQuestion     // drag chips to targets
  | SliderQuestion    // drag slider to find a value within tolerance

interface Level { id; title; subtitle; icon; tint; tintSoft; shadow; questions }
interface Course { id; title; sectionLabel; locale: 'fi'; levels: Level[] }
```

Diagrams are referenced by **string key**, not React component, so content stays serializable. A `Diagram` registry maps key → component.

## Game flow rules

- **Locked progression:** Level N unlocks when N-1 is completed.
- **Stars:** ★/★★/★★★ by best correctness across attempts (3 = no wrong, 2 = 1 wrong, 1 = 2+ wrong). Best-of preserves intrinsic motivation.
- **Practice mode:** completed levels can be replayed; XP awarded at half rate (5 instead of 10).
- **No fail state.** Run out of hearts? Stay at the question, don't restart.
- **Soft hearts:** start with 5, lose 1 on wrong, regen 1 every 30 min, **never blocks** new lessons. Visible in header; functional but friendly.
- **XP:** 10 per correct on first attempt, 5 in practice mode.
- **Streak:** counts on any activity for the day (not gated on hitting daily goal).
- **Daily goal:** soft target, default 30 XP/day, configurable in settings, no streak gating. Yellow card on level-select.
- **No mascot character.** Visual personality is the SVG diagrams + design tokens.
- **Audio:** 2 SFX (correct/wrong) + haptic on wrong + mute toggle in settings. **No music. No fanfare.** Keep it minimal.
- **No leaderboards / social / push notifications** (require backend, out of scope).

## Roadmap

- **M0 — DONE:** scaffolding tracer bullet. Vite + everything wired, anonymous auth verified, deployed to https://vcorr.github.io/mathbot/.
- **M1 — NEXT:** Koordinaatisto (Level 1), `tap` only, 5 questions, level-select winding-path UI, feedback drawer, complete screen. Real `CoordDiagram` SVG.
- **M2:** all 5 levels of `tap`/`solve` content, real diagrams (`CoordDiagram`, `RiseRunDiagram`, `LinearDiagram`).
- **M3:** `match` and `slider` question types + remaining diagrams.
- **M4:** hearts, streak, XP, daily goal in Firestore (currently localStorage-only).
- **M5:** sounds, haptics, settings screen, polish. v1.

Each milestone is independently shippable. After each, decide whether to keep going or stop.

## Decisions worth knowing

- **Brand:** `mathbot` (header always reads this, course title shown elsewhere). Section labels (`OSIO N`) deferred until there are multiple courses.
- **Repo + folder name mismatch is intentional:** folder is `mathtrainerbot/`, repo is `mathbot`. Don't "fix" by renaming.
- **`_scaffold/`, `src/App.css`, `src/assets/`, `public/favicon.svg`, `public/icons.svg`** are leftover Vite scaffold files. Tree-shaken from build. Safe to delete.
- **Time zone for streak/daily reset:** `Europe/Helsinki`.
- **Slider questions:** Q5 of Level 1 has `tolerance: 0` for `y = 3`. Use `step: 1` so exact match works.
- **Finnish typo cleanup:** `jyrkkin` → `jyrkin`, `type: 'solver'` → `type: 'solve'` (Q4 L2). Read the spec critically; don't copy-paste verbatim.

## Working style preferences

- **Minimal scope.** When the user says "don't go crazy with this", drop optional polish. Same for "whatever is lightest".
- **One question at a time** when grilling on a plan, with a recommended answer.
- **Don't ask before low-stakes decisions** — pick the obvious answer, note in the PR/commit, accept override later. Flag the choice in the message rather than blocking on it.
- **Decide-and-flag during implementation** for typos, exact pixel values, animation timings, Finnish phrasing tweaks.

## Dev workflow

```bash
npm run dev          # local
npm run dev:host     # exposed on LAN — phone via http://<your-ip>:5173/mathbot/
npm run build        # production build
npm run lint
npm run format       # prettier
```

**Deploy:** push to `main`. Action builds and deploys automatically. Live URL: https://vcorr.github.io/mathbot/

**Firestore rules deploy:** `npx firebase deploy --only firestore:rules`

**Verify changes visually:** use the Playwright MCP plugin to navigate to localhost dev server and snapshot. Don't claim UI changes work without seeing them rendered.

## What's verified working (M0)

- Vite + React 19 + Tailwind v4 build pipeline
- HashRouter, three placeholder routes
- Tailwind tokens render correctly (cream bg, mint/gold buttons with `0 4px 0 var(--color-*-d)` shadows for the 3D Duolingo-style)
- Firebase anonymous auth fires on first load
- Firestore profile doc is written on auth
- GitHub Actions deploys to Pages on push to main
- Manifest serves correctly, no console errors in production

## Open questions for M1

These are intentionally deferred until we hit them:

- **App icon polish:** current icon is a placeholder. Iterate when we have a clear direction.
- **Level-select winding path:** alternating left/right indent `[0, 24, 48, 24, 0]px` per spec. Visual fidelity needs iteration on the actual phone.
- **Feedback drawer animation:** Framer Motion `slide-up` from bottom with spring physics — exact timing/easing TBD on first render.
- **CoordDiagram SVG:** 280×280 viewBox, range −5 to 5, axes with arrows, ticks every unit. Coordinate transform: SVG y is inverted (math y goes up, SVG y goes down) — diagrams must handle this.

## Things NOT to do

- Don't add a mascot character — explicitly rejected.
- Don't add lesson-complete fanfare audio — explicitly cut for v1.
- Don't add leaderboards, social, push notifications — out of scope.
- Don't add hard hearts behavior (regen 4h, blocks new lessons). Soft hearts only.
- Don't add an i18n library — Finnish hardcoded.
- Don't migrate to Next.js, Remix, or any other framework. Vite + SPA is correct for this scale.
- Don't add a backend (Cloud Run, custom REST). Firebase Firestore is the data layer.
- Don't switch to bundlers other than Vite, or to Tailwind v3.
