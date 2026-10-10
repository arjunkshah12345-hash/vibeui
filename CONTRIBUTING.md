# Contributing to VibeUI

Thanks for helping. This guide covers how the repo is laid out, how to add or change a component, and what a good pull request looks like. By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Principles

1. **Restraint.** If removing a shadow, border or radius doesn’t hurt clarity, remove it.
2. **Tokens first.** Colors, radii, shadows and easing come from `templates/vibeui.css`. Never hard-code a hex in a component.
3. **Own the source.** A component is one self-contained file that someone copies into their repo. Keep it that way, and keep peers to `clsx`, `tailwind-merge`, `class-variance-authority` and `@phosphor-icons/react`.
4. **Motion earns its place.** Transform and opacity only. Hover, press and enter/exit feedback is expected, and it must survive `prefers-reduced-motion`. Keyframes and `animate-*` utilities belong in the token file so copied components animate too.
5. **Accessible by default.** Reach for a native element first (`input`, `select`, `button`), then add roles and keyboard handling. Document any gap in `/docs/accessibility`.

## Repository layout

```
src/components/ui/        the library: one file per component
src/components/showcase/  demos (demos/*.tsx) and the gallery
src/components/home/      landing page sections
src/components/docs/      docs layout, tables, API table
src/app/                  the Next.js site (landing, /components, /docs)
templates/vibeui.css      the token file, single source of truth
agent/lib.mjs             registry builder, CLI core
bin/vibeui.mjs            the CLI
mcp/server.mjs            the MCP server
scripts/                  registry.mjs, props.mjs, add.mjs
registry/components.json  generated catalog (commit it)
```

## Setup

```bash
git clone https://github.com/arjunkshah12345-hash/vibeui.git
cd vibeui
npm install
npm run dev
```

The site runs at http://localhost:3000. Add `?theme=dark` to preview dark mode.

## Adding a component

1. Create `src/components/ui/<name>.tsx`. Start with a one-line `/** … */` comment: it becomes the description in the registry and on the site.
2. Export it from `src/components/ui/index.ts`.
3. Add a demo in `src/components/showcase/demos/<category>.tsx` and register it under the same slug. The gallery tile and the detail page both render from it. The gallery tile can use a compact `Tile` composition (a fixed `TILE_W` column, see `demos/actions.tsx`) so the grid stays tidy; otherwise set `tileScale` if the demo is taller than a tile.
4. If the name is not already matched by a category rule, add it in `agent/lib.mjs`.
5. Run `npm run registry`. This regenerates `registry/components.json`, including the API table from your props.
6. Check `/components/<name>` in light and dark, at 390px wide, and with the keyboard.
7. Run the checks below.

### Writing good props

- Document non-obvious props with a `/** … */` comment directly above them. It appears in the API table.
- Prefer a `variant` or `tone` string union over several booleans.
- Support controlled and uncontrolled use for anything stateful (`value` / `defaultValue`).
- Spread remaining props onto the root element and merge `className` with `cn()`.

## Tokens and the template

`templates/vibeui.css` is imported by `src/app/globals.css`. If you add a token, define it for light **and** `.dark`, and register it in the `@theme inline` block so Tailwind generates the utility. New keyframes go inside `@theme` with a matching `--animate-*` entry.

## Checks

Before opening a pull request:

```bash
npm run typecheck
npx eslint
npm run build
```

All three should be clean. CI runs the same.

## Commits and pull requests

- Use short, imperative commit subjects (“Add dock tooltips”). Explain the why in the body when it isn’t obvious.
- Keep a pull request focused on one change. Include a screenshot or short recording for visual changes, in light and dark.
- Update `CHANGELOG.md` under “Unreleased” for anything user-facing.
- Describe how you tested it.

## Reporting bugs

Open an issue with the component, your Tailwind and React versions, and a minimal reproduction. For security problems, follow [SECURITY.md](SECURITY.md) instead of opening a public issue.

## Credits and licensing of contributions

By contributing you agree that your work is licensed under the project’s MIT license. Only submit code you wrote or have the right to submit. If a component is inspired by another project, say so in the pull request and credit it in `THIRD_PARTY_NOTICES.md`.

## Brand

- Mark: `public/brand/mark.svg`; wordmark: `public/brand/logo.svg`
- Light canvas `#f8f7f4`, ink `#1b1a17`, accent is the ink (`#1b1a17`); dark canvas `#0f0e0d`, accent is the ink (`#f4f2ee`)
