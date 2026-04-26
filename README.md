# mathbot

Duolingo-like math learning platform. First course: `kulmakerroin` (8th grade Finnish coordinate geometry).

## Stack

Vite + React 19 + TypeScript + Tailwind v4 + Framer Motion + React Router + Zustand + Firebase (Anonymous Auth + Firestore) + @dnd-kit. Deployed to GitHub Pages via Actions.

## First-time setup

### 1. Install deps

```bash
npm install
```

### 2. Create the Firebase project

1. Open https://console.firebase.google.com and create a project named `mathbot` (or anything).
2. Add a Web app to the project (no hosting needed).
3. Copy the `firebaseConfig` values shown.
4. Enable **Authentication → Sign-in method → Anonymous** and **Google**.
5. Enable **Firestore Database** (start in production mode).
6. Paste the contents of `firestore.rules` into the **Rules** tab and publish.

### 3. Configure environment

```bash
cp .env.local.example .env.local
# fill in the Firebase values
```

### 4. Run

```bash
npm run dev          # local
npm run dev:host     # exposed on LAN — open from phone via http://<your-ip>:5173/mathbot/
```

### 5. Deploy

Push to `main`. GitHub Actions will build and deploy to Pages.

Set the same six `VITE_FIREBASE_*` values as **repository secrets** in GitHub:
Settings → Secrets and variables → Actions → New repository secret.

In the Pages settings of the repo: Source = "GitHub Actions".

The deployed URL will be `https://<username>.github.io/mathbot/`.

## Project structure

```
src/
  main.tsx                 entry
  App.tsx                  router, auth bootstrap
  index.css                Tailwind v4 + design tokens
  lib/
    firebase.ts            Firebase init, anonymous auth, Firestore helpers
    store.ts               Zustand store (persisted)
  screens/
    LevelSelectScreen.tsx
    PracticeScreen.tsx
    CompleteScreen.tsx
public/
  icon.svg                 app icon
  manifest.webmanifest     PWA manifest
firestore.rules            paste into Firebase console
.github/workflows/deploy.yml  Pages deploy
```

## Roadmap

- **M0** — scaffolding tracer bullet (this milestone)
- **M1** — Koordinaatisto level, `tap` only, end to end
- **M2** — All 5 levels of `tap`/`solve`, real diagrams
- **M3** — `match` and `slider` question types
- **M4** — Hearts, streak, XP, daily goal
- **M5** — Sounds, haptics, settings, polish
