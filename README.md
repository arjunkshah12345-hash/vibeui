<p align="center">
  <img src="public/brand/mark.svg" width="64" height="64" alt="VibeUI" />
</p>

<h1 align="center">VibeUI</h1>

<p align="center">
  Components with taste, that you own.<br />
  104 React + Tailwind components · warm tokens · real dark mode · MIT
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> ·
  <a href="#theming">Theming</a> ·
  <a href="#agents-cli--mcp">Agents</a> ·
  <a href="https://github.com/arjunkshah12345-hash/vibeui">GitHub</a>
</p>

---

**VibeUI** is a copy-owned component library. You add a file to your repo and it is yours: no runtime package, no theme provider, nothing to fight. Everything reads one token file, so pieces from different corners of the library look like they were made together.

Run the site locally to browse every component live (`/components`) and read the docs (`/docs`).

Inspired by [shadcn/ui](https://ui.shadcn.com), [Magic UI](https://magicui.design) and [Origin / coss](https://coss.com/ui).

## Features

- **104 components** across actions, forms, feedback, data, overlays, navigation, signature motion, text effects, hover effects and footers
- **One token file** with colors, radii, shadows, easing, keyframes and the `dark` variant, so copied components animate and theme correctly in your app
- **Real dark mode**: a `dark` class on `<html>`, no flash, and `light` / `dark` can scope any subtree
- **Accessible by default**: native inputs where they exist, roles and keyboard handling on the rest, reduced motion honoured
- **Four peers, no animation library**: `clsx`, `tailwind-merge`, `class-variance-authority`, `@phosphor-icons/react`
- **Agent-ready**: CLI, MCP server, `llms.txt` and a JSON registry

## Quick start

```bash
git clone https://github.com/arjunkshah12345-hash/vibeui.git
cd vibeui
npm install
npm run dev
```

| Route | What |
|-------|------|
| `/` | Landing page |
| `/components` | Searchable gallery of live previews |
| `/components/<name>` | One component: preview, install, source |
| `/docs` | Installation, theming, CLI, agents |

## Integrate into your app

### 1. Install peers

```bash
npm i clsx tailwind-merge class-variance-authority @phosphor-icons/react
```

### 2. Add the tokens and `cn()`

```bash
npx github:arjunkshah12345-hash/vibeui init --dir .
```

This writes `vibeui.tokens.css` and `src/lib/utils.ts`. Import the tokens **after** Tailwind:

```css
@import "tailwindcss";
@import "../../vibeui.tokens.css";
```

(Or copy [`templates/vibeui.css`](templates/vibeui.css) by hand.)

### 3. Add a component

```bash
npx github:arjunkshah12345-hash/vibeui add button dialog --dir ./src/components/ui
```

Components that import siblings bring them along, so `add footer-cta` also copies `button`. Or copy any file from `src/components/ui/` by hand.

```tsx
import { Button } from "@/components/ui/button"

<Button variant="accent">Get started</Button>
```

> VibeUI is not on npm yet, so the CLI runs from GitHub. Once published, replace `npx github:arjunkshah12345-hash/vibeui` with `npx vibeui` (one constant: `site.cli` in `src/lib/site.ts`).

Toasts need `ToastProvider` once near your root. Everything else is self-contained.

## Theming

```css
:root { --accent: #2563eb; --accent-ink: #fff; --accent-soft: rgb(37 99 235 / .1); --ring: rgb(37 99 235 / .3); }
.dark { --accent: #6ea8ff; --accent-ink: #06142e; --accent-soft: rgb(110 168 255 / .14); --ring: rgb(110 168 255 / .32); }
```

See `/docs/theming` for the full token list, dark-mode wiring, scoping and motion.

## Agents (CLI + MCP)

Coding agents can discover and install components without scraping the gallery.

| Surface | Command |
|---------|---------|
| CLI | `node bin/vibeui.mjs list\|search\|get\|add\|init` |
| MCP (stdio) | `npm run mcp` · `node mcp/server.mjs` |
| Brief | [`llms.txt`](llms.txt) · [`docs/agents.md`](docs/agents.md) |

```bash
node bin/vibeui.mjs search carousel
node bin/vibeui.mjs get rotating-carousel --source
node bin/vibeui.mjs add footer-mega --dir ./src/components/ui --tokens
```

**Cursor MCP**: merge [`.cursor/mcp.vibeui.example.json`](.cursor/mcp.vibeui.example.json) into your MCP config (use an absolute path to `mcp/server.mjs`).

Tools: `list_components`, `search_components`, `get_component`, `add_component`, `get_tokens`, `get_utils`, `get_install_guide`, …

## Brand

| Asset | Path |
|-------|------|
| Mark | `public/brand/mark.svg` |
| Wordmark | `public/brand/logo.svg` |
| Favicon | `public/favicon.svg` |

Canvas `#f8f7f4` · ink `#1b1a17` · accent `#d9480f` · dark canvas `#0f0e0d` · accent (dark) `#ff7a3d`

## Scripts

| Command | What |
|---------|------|
| `npm run dev` | Showcase site |
| `npm run build` | Production build (regenerates the registry first) |
| `npm run registry` | Refresh `registry/components.json` |
| `npm run vibeui` | Agent CLI |
| `npm run mcp` | Start MCP server (stdio) |

## License

[MIT](LICENSE). Use it, fork it, ship it.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
