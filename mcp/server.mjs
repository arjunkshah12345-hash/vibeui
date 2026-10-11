#!/usr/bin/env node
/**
 * VibeUI MCP server (stdio) — tools for agents to list/search/get/add components.
 *
 * Cursor / Claude Desktop config:
 * {
 *   "mcpServers": {
 *     "vibeui": {
 *       "command": "node",
 *       "args": ["/absolute/path/to/vibeui/mcp/server.mjs"]
 *     }
 *   }
 * }
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  addComponents,
  getComponent,
  getInstallGuide,
  getTokens,
  getUtils,
  listCategories,
  loadRegistry,
  searchComponents,
  writeRegistry,
} from "../agent/lib.mjs";

function text(data) {
  const body = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  return { content: [{ type: "text", text: body }] };
}

function err(message) {
  return {
    isError: true,
    content: [{ type: "text", text: message }],
  };
}

const server = new McpServer({
  name: "vibeui",
  version: "0.3.1",
});

server.registerTool(
  "list_components",
  {
    title: "List VibeUI components",
    description:
      "List all VibeUI components with name, category, description, and dependencies. Optionally filter by category.",
    inputSchema: {
      category: z
        .string()
        .optional()
        .describe(
          "Optional category: actions, forms, overlays, navigation, feedback, data, craft, text, hover, footers, misc",
        ),
    },
  },
  async ({ category }) => {
    const items = searchComponents("", { category }).map((c) => ({
      name: c.name,
      title: c.title,
      category: c.category,
      description: c.description,
      dependencies: c.dependencies,
      registryDependencies: c.registryDependencies,
      client: c.client,
      tags: c.tags,
    }));
    return text({ count: items.length, components: items });
  },
);

server.registerTool(
  "search_components",
  {
    title: "Search VibeUI components",
    description:
      "Search VibeUI by keyword (name, description, tags). Use before get_component or add_component.",
    inputSchema: {
      query: z.string().describe("Search query, e.g. carousel, footer, scramble"),
      category: z.string().optional().describe("Optional category filter"),
    },
  },
  async ({ query, category }) => {
    const items = searchComponents(query, { category });
    return text({
      count: items.length,
      components: items.map((c) => ({
        name: c.name,
        category: c.category,
        description: c.description,
        dependencies: c.dependencies,
        registryDependencies: c.registryDependencies,
      })),
    });
  },
);

server.registerTool(
  "get_component",
  {
    title: "Get VibeUI component source",
    description:
      "Return full source code and metadata for a component by kebab-case name (e.g. rotating-carousel, button).",
    inputSchema: {
      name: z.string().describe("Component name, e.g. button or trading-card"),
    },
  },
  async ({ name }) => {
    const comp = getComponent(name);
    if (!comp) return err(`Unknown component: ${name}. Use search_components or list_components.`);
    return text({
      name: comp.name,
      title: comp.title,
      category: comp.category,
      description: comp.description,
      file: comp.file,
      exports: comp.exports,
      client: comp.client,
      dependencies: comp.dependencies,
      registryDependencies: comp.registryDependencies,
      api: comp.api,
      source: comp.source,
    });
  },
);

server.registerTool(
  "add_component",
  {
    title: "Add VibeUI component to a project",
    description:
      "Copy one or more VibeUI components into a destination directory (usually ./src/components/ui). Sibling components they import are copied too, and utils.ts is created if missing.",
    inputSchema: {
      names: z
        .union([z.string(), z.array(z.string())])
        .describe("Component name(s) to add"),
      dir: z
        .string()
        .default("./src/components/ui")
        .describe("Destination directory relative to cwd"),
      tokens: z
        .boolean()
        .optional()
        .describe("Also copy tokens CSS next to the project"),
    },
  },
  async ({ names, dir, tokens }) => {
    const list = Array.isArray(names) ? names : [names];
    const results = addComponents(list, dir || "./src/components/ui", {
      withTokens: Boolean(tokens),
      withUtils: true,
    });
    const failed = results.filter((r) => !r.ok);
    if (failed.length && failed.length === results.length) {
      return err(`Failed: ${failed.map((f) => `${f.name}: ${f.error}`).join("; ")}`);
    }
    return text({
      results,
      // Every component needs cn(), so clsx + tailwind-merge are always required.
      peers: [...new Set(["clsx", "tailwind-merge", ...results.flatMap((r) => r.dependencies ?? [])])],
    });
  },
);

server.registerTool(
  "get_tokens",
  {
    title: "Get VibeUI CSS tokens",
    description: "Return the VibeUI design tokens CSS (templates/vibeui.css) for pasting into global styles.",
    inputSchema: {},
  },
  async () => text(getTokens()),
);

server.registerTool(
  "get_utils",
  {
    title: "Get VibeUI cn() utils",
    description: "Return src/lib/utils.ts (cn helper using clsx + tailwind-merge).",
    inputSchema: {},
  },
  async () => text(getUtils()),
);

server.registerTool(
  "get_install_guide",
  {
    title: "Get VibeUI install guide",
    description: "Return agent-oriented install and integrate instructions for VibeUI.",
    inputSchema: {},
  },
  async () => text(getInstallGuide()),
);

server.registerTool(
  "list_categories",
  {
    title: "List VibeUI categories",
    description: "Return component categories with counts and member names.",
    inputSchema: {},
  },
  async () => text(listCategories()),
);

server.registerTool(
  "refresh_registry",
  {
    title: "Refresh VibeUI registry",
    description: "Rebuild registry/components.json from src/components/ui.",
    inputSchema: {},
  },
  async () => {
    const reg = writeRegistry();
    return text({ count: reg.count, path: "registry/components.json" });
  },
);

server.registerTool(
  "library_info",
  {
    title: "VibeUI library info",
    description: "High-level metadata: version, count, repo, agent entrypoints.",
    inputSchema: {},
  },
  async () => {
    const reg = loadRegistry();
    return text({
      name: reg.name,
      version: reg.version,
      count: reg.count,
      repository: reg.repository,
      license: reg.license,
      agent: reg.agent,
      peerDependencies: reg.peerDependencies,
      categories: Object.keys(reg.categories ?? {}),
    });
  },
);

server.registerResource(
  "registry",
  "vibeui://registry",
  {
    title: "VibeUI component registry",
    description: "Full machine-readable component catalog (JSON).",
    mimeType: "application/json",
  },
  async () => ({
    contents: [
      {
        uri: "vibeui://registry",
        mimeType: "application/json",
        text: JSON.stringify(loadRegistry(), null, 2),
      },
    ],
  }),
);

server.registerResource(
  "llms",
  "vibeui://llms.txt",
  {
    title: "VibeUI llms.txt",
    description: "Agent-facing library brief.",
    mimeType: "text/plain",
  },
  async () => {
    const { readFileSync, existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    const { ROOT } = await import("../agent/lib.mjs");
    const p = join(ROOT, "llms.txt");
    const body = existsSync(p) ? readFileSync(p, "utf8") : getInstallGuide();
    return {
      contents: [{ uri: "vibeui://llms.txt", mimeType: "text/plain", text: body }],
    };
  },
);

server.registerPrompt(
  "integrate_vibeui",
  {
    title: "Integrate VibeUI",
    description: "Prompt that walks an agent through integrating a VibeUI component into the current app.",
    argsSchema: {
      component: z.string().describe("Component to integrate, e.g. button or footer-mega"),
    },
  },
  async ({ component }) => {
    const comp = getComponent(component);
    const guide = getInstallGuide();
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Integrate the VibeUI component "${component}" into this project.

${guide}

${
  comp
    ? `## Component source (${comp.name})\n\`\`\`tsx\n${comp.source}\n\`\`\`\n\nDependencies: ${(comp.dependencies || []).join(", ") || "none extra"}`
    : `Component "${component}" not found. Call search_components first.`
}

Steps: ensure peers + tokens + utils, write the component file under src/components/ui, import and use it in a real page. Match existing project conventions.`,
          },
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
