# Contributing to VibeUI

Thanks for helping. Keep the library calm, precise, and copy-owned.

## Principles

1. **Restraint**: if removing a shadow, border or radius doesn’t hurt clarity, remove it.
2. **Tokens first**: colors, radii, shadows and easing come from `templates/vibeui.css`. Never hard-code a hex in a component.
3. **Own the source**: components are single files that someone copies into their repo. Keep them self-contained and keep peers to `clsx`, `tailwind-merge`, `class-variance-authority` and `@phosphor-icons/react`.
4. **Motion earns its place**: transform and opacity only, and it must survive `prefers-reduced-motion`. Keyframes and `animate-*` utilities belong in the token file so copied components animate too.
5. **Accessible by default**: reach for a native element first (`input`, `select`, `button`), then add roles and keyboard handling.

## Setup

```bash
npm install
npm run dev
```

## Adding a component

1. Create `src/components/ui/<name>.tsx`. Start with a one-line `/** … */` comment: it becomes the description in the registry and on the site.
2. Export it from `src/components/ui/index.ts`.
3. Add a demo in `src/components/showcase/demos/<category>.tsx` and register it under the same slug. The gallery tile and the detail page both render from it.
4. Add the slug to the matching rule in `agent/lib.mjs` if it doesn’t fall into a category automatically.
5. Run `npm run registry`, then check `/components/<name>` in light **and** dark and at 390px wide.
6. `npx tsc --noEmit && npx eslint && npm run build` should be clean.

## Tokens and the template

`templates/vibeui.css` is the single source of truth and is imported by `src/app/globals.css`. If you add a token, add it there (light and `.dark`) and register it in the `@theme inline` block so Tailwind generates the utility.

## Brand

- Mark: `public/brand/mark.svg`
- Wordmark: `public/brand/logo.svg`
- Light canvas `#f8f7f4`, ink `#1b1a17`, accent `#d9480f`, dark canvas `#0f0e0d`, dark accent `#ff7a3d`
