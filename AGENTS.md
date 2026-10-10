# VibeUI — agent notes

Copy-owned React + Tailwind UI. Prefer MCP/CLI over guessing component APIs.

## Entrypoints

- MCP: `node mcp/server.mjs`
- CLI: `node bin/vibeui.mjs` / `npx vibeui`
- Catalog: `registry/components.json` (`npm run registry`)
- Site: `/components` (live gallery), `/components/<name>` (preview + source), demos in `src/components/showcase/demos/`
- Brief: `llms.txt` · detail: `docs/agents.md`

## Integrate loop

1. Search → `search_components` / `vibeui search`
2. Read source → `get_component` / `vibeui get <name> --source`
3. Peers: `clsx` `tailwind-merge` `class-variance-authority` `@phosphor-icons/react`
4. Tokens: `templates/vibeui.css` · utils: `src/lib/utils.ts` (`cn`)
5. Add → `add_component` / `vibeui add <name> --dir ./src/components/ui`

## Conventions

- Files: `src/components/ui/<kebab>.tsx`
- Dark: `.dark` on `<html>`
- Warm canvas `#f8f7f4` / `#0f0e0d`, one accent (the ink by default), tokens only (see `templates/vibeui.css`)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
