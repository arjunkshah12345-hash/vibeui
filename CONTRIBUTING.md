# Contributing to VibeUI

Thanks for helping. Keep the library quiet, precise, and copy-owned.

## Principles

1. **Restraint** — if removing a shadow/border/radius doesn’t hurt clarity, remove it.
2. **Tokens first** — colors and radii come from CSS variables in `src/app/globals.css`.
3. **Own the source** — components live in-repo for consumers; no opaque runtime UI package.
4. **Motion earns its place** — transform + opacity only; respect `prefers-reduced-motion`.

## Setup

```bash
npm install
npm run dev
```

## Adding a component

1. Create `src/components/ui/<name>.tsx`
2. Export it from `src/components/ui/index.ts`
3. Demo it on `/gallery` (and Craft section if it’s signature motion)
4. Run `npm run registry` to refresh `registry/components.json`
5. Open a PR with a short description + screenshot if visual

## Brand

- Mark: `public/brand/mark.svg`
- Wordmark: `public/brand/logo.svg`
- Light canvas `#fbfbfa`, ink `#1c1c1a`, warm-stone dark `#121110`
