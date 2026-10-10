# VibeUI for agents

Machine-facing entrypoints so coding agents can discover and install components without browsing the site.

## Surfaces

| Surface | Entry | When |
|---------|-------|------|
| MCP (stdio) | `node mcp/server.mjs` or `vibeui mcp` | Cursor / Claude Desktop / any MCP host |
| CLI | `npx @agents-npm-packages/vibeui` / `node bin/vibeui.mjs` | Scripts, CI, one-shot agent shells |
| Registry JSON | `registry/components.json` | Offline catalog |
| llms.txt | `/llms.txt` in repo root | Model context bootstrap |
| llms-full.txt | `/llms-full.txt` in repo root | Every component with props, in one file (generated) |

## MCP setup (Cursor)

Add to MCP config (absolute path to your clone):

```json
{
  "mcpServers": {
    "vibeui": {
      "command": "node",
      "args": ["/absolute/path/to/vibeui/mcp/server.mjs"]
    }
  }
}
```

See also `.cursor/mcp.vibeui.example.json`.

### Tools

- `library_info` — version, count, peers
- `list_components` / `search_components` — discovery
- `get_component` — full source + metadata + generated `api` (props)
- `add_component` — copy into a project dir
- `get_tokens` / `get_utils` / `get_install_guide` — bootstrap files
- `list_categories` / `refresh_registry`

### Resources

- `vibeui://registry` — full catalog JSON
- `vibeui://llms.txt` — agent brief

### Prompt

- `integrate_vibeui` — guided integrate for one component

## CLI

```bash
node bin/vibeui.mjs list --json
node bin/vibeui.mjs search carousel
node bin/vibeui.mjs get rotating-carousel --source
node bin/vibeui.mjs add button trading-card --dir ./src/components/ui
node bin/vibeui.mjs init --dir .
node bin/vibeui.mjs mcp
```

`--json` on list/search/get for structured agent parsing.

## Recommended agent loop

1. `search_components` or `vibeui search <need>`
2. `get_component` to read source + deps
3. Ensure peers + tokens + `cn()` utils (tokens are imported **after** `@import "tailwindcss"`)
4. `add_component` / `vibeui add` (sibling imports are copied automatically; check `registryDependencies`)
5. Import and wire into the app; match local conventions

## Do not

- Invent APIs that are not in the source file
- Wrap VibeUI in an opaque npm package runtime (copy-owned model)
- Force purple/neon styling over the warm token set, or hard-code hex values instead of tokens
