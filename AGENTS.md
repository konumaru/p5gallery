# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router source
  - `app/page.tsx`: Home (links to sketches)
  - `app/layout.tsx`, `app/globals.css`, `app/Header.tsx`: shared layout/UI
  - `app/<sketch>/page.tsx`: route entry for an artwork (e.g., `app/fishRipple/page.tsx`)
  - `app/<sketch>/src.tsx`: client-side p5 sketch component (`'use client'`)
  - Supporting modules live next to the sketch (e.g., `app/fishRipple/Fish.tsx`)
- `public/`: static assets (SVGs, icons)
- `.github/workflows/deploy.yml`: GitHub Pages build/deploy workflow

When adding a new sketch, follow the existing pattern: create `app/<sketchName>/page.tsx` + `app/<sketchName>/src.tsx`, then link it from `app/page.tsx`.

## Build, Test, and Development Commands

CI uses `pnpm` (via `pnpm-lock.yaml`).

- `pnpm install --frozen-lockfile`: install dependencies from lockfile
- `pnpm run dev`: run local dev server
- `pnpm run lint`: run ESLint (`next/core-web-vitals`)
- `pnpm run build`: production build + static export (writes `out/`)
- `pnpm run start`: run production server (useful for quick sanity checks)

## Coding Style & Naming Conventions

- TypeScript is `strict`; keep types explicit and avoid `any` unless unavoidable.
- Keep `pnpm run lint` clean; fix warnings/errors rather than suppressing them.
- Use 2-space indentation and keep quotes/semicolons consistent within a file.
- Naming: React components in `PascalCase`; route folders use existing `lowerCamelCase` (e.g., `drawLine`).

## Testing Guidelines

There is no dedicated unit/e2e test suite yet. Validate changes with:

- `pnpm run lint`
- `pnpm run build` (ensures the static export succeeds)
- Manual checks of affected routes, including touch/mouse interactions for p5 sketches.

## Commit & Pull Request Guidelines

- Commit messages commonly use short, Conventional-ish prefixes: `feat:`, `fix:`, `chore:`, `refactor:`.
- PRs should include: a brief description, linked issue (if any), and screenshots/GIFs for visual changes.
- Call out new/changed routes (e.g., `app/newSketch/`) and what you manually verified (`lint`, `build`, pages checked).

## Security & Configuration Tips

- Do not commit real credentials. Use `.env.local` for local secrets.
- `.env` includes placeholders for optional Spotify API integration.
