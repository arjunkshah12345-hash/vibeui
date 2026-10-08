<p align="center">
  <img src="public/brand/mark.svg" width="64" height="64" alt="VibeUI" />
</p>

<h1 align="center">VibeUI</h1>

<p align="center">
  <strong>Everything an interface is made of.</strong><br />
  104 copy-owned React + Tailwind components with warm tokens, real dark mode and motion that earns its place.
</p>

<p align="center">
  MIT · React 18+ · Tailwind v4 · TypeScript · pre-1.0
</p>

<p align="center">
  <a href="#why">Why</a> ·
  <a href="#quick-start">Quick start</a> ·
  <a href="#components">Components</a> ·
  <a href="#theming">Theming</a> ·
  <a href="#cli">CLI</a> ·
  <a href="#agents">Agents</a> ·
  <a href="#contributing">Contributing</a>
</p>

---

**VibeUI** is a component library you copy into your project instead of installing. Add a file and it is yours to read, change and keep: no runtime package, no theme provider, no black box. Every component reads one token file, so pieces from different corners of the library look like they were made together.

Run the repo to browse all 104 components live (`/components`), read the docs (`/docs`), and open any component for its source, install command and generated API table.

## Why

- **You own the code.** Components are single files. Re-add one to update it, or edit it freely.
- **One token file.** Colors, radii, shadows, easing, keyframes and the dark variant live in `templates/vibeui.css`. Copied components animate and theme correctly in your app.
- **Real dark mode.** A `dark` class on `<html>`, no flash, and `light` / `dark` can pin any subtree.
- **Motion built in.** Hover, press, focus, enter and exit on every component, using only transform and opacity, and honouring `prefers-reduced-motion`.
- **Native first.** Checkbox, Radio, Select and Slider are real form controls, with roles and keyboard handling on the rest. See the [accessibility notes](#accessibility), including the known gaps.
- **Four peers.** `clsx`, `tailwind-merge`, `class-variance-authority`, `@phosphor-icons/react`. No animation library.
- **Agent-ready.** A CLI, an MCP server, `llms.txt` and a JSON registry with generated API tables.

> **Status.** Pre-1.0 and not on npm yet. The CLI runs from GitHub (see [CLI](#cli)); once published, `npx github:arjunkshah12345-hash/vibeui` becomes `npx vibeui`.

## Quick start

### Look around locally

```bash
git clone https://github.com/arjunkshah12345-hash/vibeui.git
cd vibeui
npm install
npm run dev
```

| Route | What |
| --- | --- |
| `/` | Landing page: a live composed interface, the ten shelves with real previews, a token playground |
| `/components` | Searchable gallery of live previews |
| `/components/<name>` | One component: preview, install, API, source |
| `/docs` | Installation, theming, dark mode, motion, accessibility, recipes, CLI, MCP, FAQ |

Add `?theme=dark` (or `light`) to any URL to preview a theme.

### Use it in your app

**1. Install the peers**

```bash
npm i clsx tailwind-merge class-variance-authority @phosphor-icons/react
```

**2. Add the tokens and `cn()`**

```bash
npx github:arjunkshah12345-hash/vibeui init --dir .
```

This writes `vibeui.tokens.css` and `src/lib/utils.ts`. Import the tokens **after** Tailwind:

```css
@import "tailwindcss";
@import "../../vibeui.tokens.css";
```

**3. Add a component**

```bash
npx github:arjunkshah12345-hash/vibeui add button dialog --dir ./src/components/ui
```

Components that import siblings bring them along, so `add footer-cta` also copies `button` (and `button` copies `spinner`).

```tsx
import { Button } from "@/components/ui/button"

<Button variant="accent" loading={saving}>Save changes</Button>
```

You need a `@/*` → `src/*` path alias and Tailwind CSS v4. Toasts need `ToastProvider` once near your root; everything else is self-contained. Vite and Next.js setup details are in [`/docs/installation`](/docs/installation).

## Components

<!-- catalog:start -->
| Shelf | Count | Components |
| --- | --- | --- |
| Actions | 6 | `button` · `chip` · `kbd` · `pill` · `separator` · `toggle` |
| Forms | 14 | `calendar` · `checkbox` · `file-drop` · `input` · `number-field` · `otp-field` · `password-field` · `radio` · `rating` · `search-field` · `select` · `slider` · `switch` · `tag-input` |
| Feedback | 9 | `alert` · `banner` · `callout` · `empty` · `meter` · `notification` · `progress` · `skeleton` · `spinner` |
| Data & surfaces | 10 | `aspect-ratio` · `avatar` · `card` · `code-block` · `color-swatch` · `comparison` · `list` · `scroll-area` · `stat` · `table` |
| Overlays | 7 | `command` · `dialog` · `dropdown-menu` · `popover` · `sheet` · `toast` · `tooltip` |
| Navigation | 7 | `accordion` · `breadcrumb` · `pagination` · `segmented` · `stepper` · `tabs` · `timeline` |
| Signature | 20 | `arrow-fill-button` · `blur-reveal` · `book-flip` · `circle-menu` · `count-up` · `dock` · `dotted-grid` · `flip-card` · `folder-preview` · `jelly-loader` · `magnet-tabs` · `marquee` · `masonry` · `orbit-ring` · `rotating-carousel` · `scroll-stack` · `split-showcase` · `spotlight` · `stacked-cards` · `trading-card` |
| Text effects | 14 | `decode-text` · `flip-text` · `gradient-text` · `highlight-text` · `letter-hover` · `quote` · `rolling-text` · `scramble-text` · `stagger-words` · `text-link` · `text-reveal` · `text-shimmer` · `typewriter` · `underline-reveal` |
| Hover effects | 11 | `hover-border` · `hover-card` · `hover-expand` · `hover-icon` · `hover-image` · `hover-lift` · `hover-shine` · `hover-slide` · `hover-tilt` · `magnetic-button` · `magnetic-link` |
| Footers | 6 | `footer-cta` · `footer-legal` · `footer-mega` · `footer-newsletter` · `footer-simple` · `social-links` |
<!-- catalog:end -->

Every component has hover, press and focus feedback, and anything that appears also animates out. Each page in `/components` lists the props (generated from the real TypeScript types), the peers it needs and the sibling components it imports.

## Theming

Everything is a CSS variable. Retint the accent for both themes:

```css
:root { --accent: #2563eb; --accent-ink: #fff; --accent-soft: rgb(37 99 235 / .1); --ring: rgb(37 99 235 / .28); }
.dark { --accent: #7aa7ff; --accent-ink: #06142e; --accent-soft: rgb(122 167 255 / .14); --ring: rgb(122 167 255 / .3); }
```

Light mode ships with a vermilion accent; dark mode is monochrome (the accent is the ink). Radii, shadows, fonts and motion are tokens too, and you can override any of them on a single element to scope a theme. See `/docs/theming`, `/docs/dark-mode` and `/docs/motion`.

## CLI

```bash
npx github:arjunkshah12345-hash/vibeui list --category forms
npx github:arjunkshah12345-hash/vibeui search "date picker" --json
npx github:arjunkshah12345-hash/vibeui get calendar --source
npx github:arjunkshah12345-hash/vibeui add calendar --dir ./src/components/ui
```

| Command | Purpose |
| --- | --- |
| `list`, `search`, `get` | Read the registry (add `--json` for scripts) |
| `add <name…>` | Copy components and the siblings they import |
| `init` | Write the token file, `utils.ts` and a short guide |
| `categories`, `registry`, `guide`, `mcp` | Catalog, regenerate, install guide, start the MCP server |

`add` exits non-zero if anything fails, so it is safe in scripts. Inside a clone, the binary is `node bin/vibeui.mjs` (or `npm run vibeui`). Full reference: `/docs/cli`.

## Agents

Coding agents can discover and install components without scraping the site.

| Surface | Entry |
| --- | --- |
| MCP (stdio) | `npm run mcp` · `node mcp/server.mjs` |
| CLI with `--json` | see above |
| Briefs | [`llms.txt`](llms.txt) · [`docs/agents.md`](docs/agents.md) |
| Registry | [`registry/components.json`](registry/components.json) |

```bash
claude mcp add vibeui -- node /absolute/path/to/vibeui/mcp/server.mjs
```

Tools: `search_components`, `get_component` (source + API), `add_component`, `get_tokens`, `get_utils`, `get_install_guide`, and more. See `/docs/agents` and [`.cursor/mcp.vibeui.example.json`](.cursor/mcp.vibeui.example.json).

## Accessibility

Native controls where they exist, real roles and keyboard handling on the rest, visible focus, and reduced-motion support. It has **not** had a formal audit. Known gaps (for example Sheet and Popover do not trap focus, and Segmented and Rating are not arrow-key navigable) are listed honestly in `/docs/accessibility`.

## Project layout

```
src/components/ui/        the library: one file per component
src/components/showcase/  demos and the gallery
src/app/                  the Next.js site (landing, /components, /docs)
templates/vibeui.css      the token file, single source of truth
agent/ bin/ mcp/          registry core, CLI and MCP server
scripts/                  registry, API extraction, catalog, notices
registry/components.json  generated catalog (committed)
```

## Scripts

| Command | What |
| --- | --- |
| `npm run dev` | Showcase site |
| `npm run build` | Production build (regenerates the registry first) |
| `npm run check` | Typecheck, lint and build |
| `npm run registry` | Refresh the registry, API tables and this README's catalog |
| `npm run notices` | Regenerate `THIRD_PARTY_NOTICES.md` |
| `npm run vibeui` / `npm run mcp` | The CLI / the MCP server |

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the layout, how to add a component and what a good pull request looks like, and the [Code of Conduct](CODE_OF_CONDUCT.md). Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md). Release notes are in [CHANGELOG.md](CHANGELOG.md).

## License and credits

[MIT](LICENSE). Third-party dependencies, fonts and icons are listed with their licenses in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

VibeUI was inspired by [shadcn/ui](https://ui.shadcn.com) (the copy-owned model and its API conventions), [ObsidianUI](https://www.obsidianui.dev) (expressive, animated craft components), [Magic UI](https://magicui.design) (tasteful motion) and [Origin / coss ui](https://coss.com/ui) (dense app primitives). All of those are credited for ideas, not code, and none is affiliated with this project.
