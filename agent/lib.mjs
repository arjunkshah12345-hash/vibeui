#!/usr/bin/env node
/**
 * Shared library for VibeUI CLI + MCP — agent-optimized component access.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const UI_DIR = path.join(ROOT, "src/components/ui");
export const REGISTRY_PATH = path.join(ROOT, "registry/components.json");
export const TOKENS_PATH = path.join(ROOT, "templates/vibeui.css");
export const UTILS_PATH = path.join(ROOT, "src/lib/utils.ts");

const CATEGORY_RULES = [
  { cat: "footers", test: (n) => n.startsWith("footer-") || n === "social-links" },
  {
    cat: "hover",
    test: (n) =>
      n.startsWith("hover-") ||
      n === "magnetic-link" ||
      n === "magnetic-button" ||
      n === "hover-image" ||
      n === "hover-card",
  },
  {
    cat: "text",
    test: (n) =>
      [
        "gradient-text",
        "scramble-text",
        "letter-hover",
        "underline-reveal",
        "text-shimmer",
        "stagger-words",
        "highlight-text",
        "rolling-text",
        "decode-text",
        "flip-text",
        "text-reveal",
        "typewriter",
        "text-link",
        "quote",
      ].includes(n),
  },
  {
    cat: "craft",
    test: (n) =>
      [
        "trading-card",
        "dock",
        "circle-menu",
        "magnet-tabs",
        "book-flip",
        "folder-preview",
        "scroll-stack",
        "dotted-grid",
        "count-up",
        "blur-reveal",
        "split-showcase",
        "orbit-ring",
        "jelly-loader",
        "arrow-fill-button",
        "rotating-carousel",
        "flip-card",
        "stacked-cards",
        "spotlight",
        "marquee",
        "masonry",
      ].includes(n),
  },
  {
    cat: "forms",
    test: (n) =>
      [
        "input",
        "textarea",
        "select",
        "checkbox",
        "radio",
        "switch",
        "slider",
        "search-field",
        "password-field",
        "number-field",
        "otp-field",
        "tag-input",
        "file-drop",
        "calendar",
        "rating",
      ].includes(n) || n.includes("field"),
  },
  {
    cat: "overlays",
    test: (n) =>
      ["dialog", "sheet", "popover", "dropdown-menu", "command", "toast", "tooltip"].includes(
        n,
      ),
  },
  {
    cat: "navigation",
    test: (n) =>
      [
        "tabs",
        "segmented",
        "accordion",
        "breadcrumb",
        "pagination",
        "stepper",
        "timeline",
      ].includes(n),
  },
  {
    cat: "feedback",
    test: (n) =>
      [
        "alert",
        "banner",
        "callout",
        "progress",
        "meter",
        "spinner",
        "skeleton",
        "empty",
        "notification",
      ].includes(n),
  },
  {
    cat: "data",
    test: (n) =>
      [
        "card",
        "table",
        "list",
        "avatar",
        "stat",
        "code-block",
        "color-swatch",
        "comparison",
        "scroll-area",
        "aspect-ratio",
      ].includes(n),
  },
  {
    cat: "actions",
    test: (n) =>
      ["button", "pill", "chip", "toggle", "kbd", "separator"].includes(n),
  },
];

function categorize(name) {
  for (const rule of CATEGORY_RULES) {
    if (rule.test(name)) return rule.cat;
  }
  return "misc";
}

function describe(name, src) {
  const exportMatch = src.match(/export function (\w+)/);
  const exportName = exportMatch?.[1] ?? toPascal(name);
  const firstComment = src.match(/\/\*\*([\s\S]*?)\*\//)?.[1];
  if (firstComment) {
    const line = firstComment
      .split("\n")
      .map((l) => l.replace(/^\s*\*\s?/, "").trim())
      .find((l) => l && !l.startsWith("@"));
    if (line) return line;
  }
  const hints = {
    button: "Primary action button with variants (primary, secondary, ghost, soft).",
    "rotating-carousel": "3D ring card carousel with pause-on-hover and dots.",
    "magnetic-button": "Button that magnetically follows the cursor.",
    "scramble-text": "Text that scrambles/decodes on hover.",
    "footer-mega": "Multi-column marketing footer with brand blurb.",
    dock: "macOS-style icon dock with hover magnification.",
    command: "Command palette with search and grouped actions.",
  };
  return (
    hints[name] ??
    `${exportName} — VibeUI ${categorize(name)} component. Copy-owned React + Tailwind.`
  );
}

function toPascal(kebab) {
  return kebab
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function toKebab(name) {
  return name
    .replace(/\.tsx$/, "")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

export function resolveComponentName(raw) {
  return toKebab(raw);
}

export function listComponentFiles() {
  return fs
    .readdirSync(UI_DIR)
    .filter((f) => f.endsWith(".tsx") && f !== "index.ts")
    .sort();
}

export function buildRegistry() {
  const files = listComponentFiles();
  const components = files.map((file) => {
    const name = file.replace(/\.tsx$/, "");
    const src = fs.readFileSync(path.join(UI_DIR, file), "utf8");
    const deps = [];
    if (src.includes("@phosphor-icons/react")) deps.push("@phosphor-icons/react");
    if (src.includes("class-variance-authority") || src.includes("cva("))
      deps.push("class-variance-authority");
    if (src.includes('from "motion') || src.includes("from 'motion"))
      deps.push("motion");

    const exports = [...src.matchAll(/export function (\w+)/g)].map((m) => m[1]);
    const client = src.includes('"use client"') || src.includes("'use client'");

    return {
      name,
      title: toPascal(name),
      category: categorize(name),
      description: describe(name, src),
      file: `src/components/ui/${file}`,
      exports: exports.length ? exports : [toPascal(name)],
      client,
      dependencies: [...new Set(deps)],
      tags: [categorize(name), client ? "client" : "rsc-safe"],
    };
  });

  const byCategory = {};
  for (const c of components) {
    byCategory[c.category] ??= [];
    byCategory[c.category].push(c.name);
  }

  return {
    name: "vibeui",
    version: "0.1.0",
    license: "MIT",
    repository: "https://github.com/arjunkshah12345-hash/vibeui",
    count: components.length,
    tokens: "templates/vibeui.css",
    utils: "src/lib/utils.ts",
    peerDependencies: [
      "react",
      "react-dom",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
      "@phosphor-icons/react",
    ],
    agent: {
      cli: "npx vibeui",
      mcp: "node mcp/server.mjs",
      docs: ["llms.txt", "AGENTS.md", "docs/agents.md"],
    },
    categories: byCategory,
    components,
  };
}

export function writeRegistry() {
  const registry = buildRegistry();
  fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + "\n");
  return registry;
}

export function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) return writeRegistry();
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
}

export function getComponent(rawName) {
  const name = resolveComponentName(rawName);
  const registry = loadRegistry();
  const meta = registry.components.find((c) => c.name === name);
  const file = path.join(UI_DIR, `${name}.tsx`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, "utf8");
  return {
    ...(meta ?? {
      name,
      title: toPascal(name),
      category: categorize(name),
      file: `src/components/ui/${name}.tsx`,
      dependencies: [],
    }),
    source,
    path: file,
  };
}

export function searchComponents(query, { category } = {}) {
  const q = (query ?? "").toLowerCase().trim();
  const registry = loadRegistry();
  return registry.components.filter((c) => {
    if (category && c.category !== category) return false;
    if (!q) return true;
    const hay = [c.name, c.title, c.description, c.category, ...(c.tags ?? [])]
      .join(" ")
      .toLowerCase();
    return hay.includes(q) || q.split(/\s+/).every((part) => hay.includes(part));
  });
}

export function getTokens() {
  return fs.readFileSync(TOKENS_PATH, "utf8");
}

export function getUtils() {
  return fs.readFileSync(UTILS_PATH, "utf8");
}

export function getInstallGuide() {
  return `# VibeUI — agent install guide

## Peers
\`\`\`bash
npm i clsx tailwind-merge class-variance-authority @phosphor-icons/react
\`\`\`

## Tokens
Copy \`templates/vibeui.css\` into global CSS (Tailwind v4). Toggle dark with \`.dark\` on \`<html>\`.

## Utils
Write \`src/lib/utils.ts\` with cn() from clsx + tailwind-merge. Path alias: \`@/*\` → \`./src/*\`.

## Add component (CLI)
\`\`\`bash
npx vibeui add button --dir ./src/components/ui
npx vibeui add trading-card footer-mega --dir ./src/components/ui
\`\`\`

## Add via MCP
Tools: list_components, search_components, get_component, add_component, get_tokens, get_utils, get_install_guide.

## Import
\`\`\`tsx
import { Button } from "@/components/ui/button"
\`\`\`
`;
}

/**
 * Copy component(s) into a destination directory.
 * Also ensures utils.ts nearby if missing.
 */
export function addComponents(names, destDir, { withTokens = false, withUtils = true } = {}) {
  const dest = path.resolve(process.cwd(), destDir);
  fs.mkdirSync(dest, { recursive: true });
  const results = [];

  for (const raw of names) {
    const comp = getComponent(raw);
    if (!comp) {
      results.push({ name: raw, ok: false, error: "not found" });
      continue;
    }
    const destFile = path.join(dest, `${comp.name}.tsx`);
    fs.writeFileSync(destFile, comp.source);
    results.push({
      name: comp.name,
      ok: true,
      path: destFile,
      dependencies: comp.dependencies,
      client: comp.client,
    });
  }

  if (withUtils) {
    const utilsDest = path.resolve(dest, "../../lib/utils.ts");
    if (!fs.existsSync(utilsDest)) {
      fs.mkdirSync(path.dirname(utilsDest), { recursive: true });
      fs.copyFileSync(UTILS_PATH, utilsDest);
      results.push({ name: "utils", ok: true, path: utilsDest });
    }
  }

  if (withTokens) {
    const tokensDest = path.resolve(dest, "../../../vibeui.tokens.css");
    fs.copyFileSync(TOKENS_PATH, tokensDest);
    results.push({ name: "tokens", ok: true, path: tokensDest });
  }

  return results;
}

export function listCategories() {
  const registry = loadRegistry();
  return Object.entries(registry.categories ?? {}).map(([name, items]) => ({
    name,
    count: items.length,
    components: items,
  }));
}
