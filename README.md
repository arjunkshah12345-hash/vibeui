<p align="center">
  <img src="public/brand/mark.svg" width="64" height="64" alt="VibeUI" />
</p>

<h1 align="center">VibeUI</h1>

<p align="center">
  Quiet React + Tailwind components for calm interfaces.<br />
  Open source · MIT · copy-owned source
</p>

<p align="center">
  <a href="#integrate">Integrate</a> ·
  <a href="/gallery">Gallery</a> ·
  <a href="/docs">Docs</a> ·
  <a href="https://github.com/arjunkshah12345-hash/vibeui">GitHub</a>
</p>

---

**VibeUI** is a minimalist component library with warm dark mode and a craft layer (magnetic buttons, trading cards, docks, 3D carousel) — tuned for restraint, not neon demos.

Inspired by [shadcn/ui](https://ui.shadcn.com), [ObsidianUI](https://www.obsidianui.dev), [Magic UI](https://magicui.design), and [Origin / coss](https://coss.com/ui).

## Features

- **80+ components** — primitives, forms, overlays, navigation, craft
- **Light + dark** — CSS variables, FOUC-safe theme script
- **Copy-owned** — paste into your repo; no opaque UI runtime
- **Easy integrate** — tokens template + CLI `vibeui add`
- **Agent-ready** — MCP server + CLI + `llms.txt` / registry JSON
- **Brand kit** — mark + wordmark in `public/brand/`

## Quick start (this repo)

```bash
git clone https://github.com/arjunkshah12345-hash/vibeui.git
cd vibeui
npm install
npm run dev
```

- Home → `/`
- Gallery → `/gallery`
- Docs → `/docs`

## Integrate

### 1. Install peers in your app

```bash
npm i clsx tailwind-merge class-variance-authority @phosphor-icons/react
```

### 2. Paste tokens

Copy [`templates/vibeui.css`](templates/vibeui.css) into your global CSS (Tailwind v4 `@theme` included).

### 3. Add `cn()` utils

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 4. Copy a component

```bash
npx vibeui add button --dir ../my-app/src/components/ui
# or from a clone:
node bin/vibeui.mjs add button trading-card --dir ../my-app/src/components/ui
```

Or copy any file from `src/components/ui/` by hand.

```tsx
import { Button } from "@/components/ui/button"

<Button>Primary</Button>
```

Machine-readable catalog: [`registry/components.json`](registry/components.json) (`npm run registry`).

## Agents (CLI + MCP)

Coding agents can discover and install components without scraping the gallery.

| Surface | Command |
|---------|---------|
| CLI | `npx vibeui` · `node bin/vibeui.mjs list\|search\|get\|add\|init` |
| MCP (stdio) | `npm run mcp` · `node mcp/server.mjs` |
| Brief | [`llms.txt`](llms.txt) · [`docs/agents.md`](docs/agents.md) |

```bash
npx vibeui search carousel
npx vibeui get rotating-carousel --source
npx vibeui add footer-mega --dir ./src/components/ui --tokens
```

**Cursor MCP** — merge [`.cursor/mcp.vibeui.example.json`](.cursor/mcp.vibeui.example.json) into your MCP config (use an absolute path to `mcp/server.mjs`).

Tools: `list_components`, `search_components`, `get_component`, `add_component`, `get_tokens`, `get_utils`, `get_install_guide`, …

## Brand

| Asset | Path |
|-------|------|
| Mark | `public/brand/mark.svg` |
| Wordmark | `public/brand/logo.svg` |
| Favicon | `public/favicon.svg` |

Colors: canvas `#fbfbfa` · ink `#1c1c1a` · dark canvas `#121110`

## Scripts

| Command | What |
|---------|------|
| `npm run dev` | Showcase site |
| `npm run build` | Production build (+ registry) |
| `npm run registry` | Refresh component catalog |
| `npm run vibeui` | Agent CLI |
| `npm run mcp` | Start MCP server (stdio) |
| `npm run add -- <name> <dest>` | Legacy copy shim |

## License

[MIT](LICENSE) — use it, fork it, ship it.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
