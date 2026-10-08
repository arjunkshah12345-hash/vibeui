#!/usr/bin/env node
/**
 * VibeUI CLI — agent-friendly component tooling.
 *
 *   vibeui list [--category forms] [--json]
 *   vibeui search <query> [--json]
 *   vibeui get <name> [--source]
 *   vibeui add <name...> [--dir ./src/components/ui] [--tokens]
 *   vibeui init [--dir .]
 *   vibeui categories
 *   vibeui registry
 *   vibeui mcp
 */
import fs from "node:fs";
import path from "node:path";
import {
  ROOT,
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

const args = process.argv.slice(2);
const cmd = args[0];
const VALUE_FLAGS = new Set(["--dir", "--category"]);

function parseArgs(argv) {
  const flags = new Set();
  const values = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      positional.push(a);
      continue;
    }
    flags.add(a);
    if (VALUE_FLAGS.has(a) && argv[i + 1] && !argv[i + 1].startsWith("--")) {
      values[a] = argv[++i];
    }
  }
  return { flags, values, positional };
}

const { flags, values, positional } = parseArgs(args);

function flagValue(name, fallback) {
  return values[name] ?? fallback;
}

function out(data) {
  if (flags.has("--json")) {
    console.log(JSON.stringify(data, null, 2));
  } else if (typeof data === "string") {
    console.log(data);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

function help() {
  console.log(`VibeUI — copy-owned React + Tailwind components (agent CLI)

Usage:
  vibeui list [--category <cat>] [--json]
  vibeui search <query> [--category <cat>] [--json]
  vibeui get <name> [--source] [--json]
  vibeui add <name...> [--dir <path>] [--tokens] [--no-utils]
  vibeui init [--dir <path>]
  vibeui categories [--json]
  vibeui registry
  vibeui mcp
  vibeui guide

Examples:
  vibeui search carousel
  vibeui get rotating-carousel --source
  vibeui add button trading-card --dir ./src/components/ui
  vibeui init --dir .

Repo: https://github.com/arjunkshah12345-hash/vibeui
MCP:  node mcp/server.mjs  (or: vibeui mcp)
`);
}

async function main() {
  if (!cmd || cmd === "help" || cmd === "-h" || cmd === "--help") {
    help();
    return;
  }

  if (cmd === "registry") {
    const reg = writeRegistry();
    console.log(`Wrote ${reg.count} components → registry/components.json`);
    return;
  }

  if (cmd === "list") {
    const category = flagValue("--category");
    const items = searchComponents("", { category });
    if (flags.has("--json")) {
      out(items.map(({ name, category: c, description, dependencies }) => ({
        name,
        category: c,
        description,
        dependencies,
      })));
      return;
    }
    for (const c of items) {
      console.log(`${c.name.padEnd(28)} ${c.category.padEnd(12)} ${c.description.slice(0, 60)}`);
    }
    console.error(`\n${items.length} components`);
    return;
  }

  if (cmd === "search") {
    const query = positional.slice(1).join(" ");
    if (!query) {
      console.error("Usage: vibeui search <query>");
      process.exit(1);
    }
    const category = flagValue("--category");
    const items = searchComponents(query, { category });
    if (flags.has("--json")) {
      out(items);
      return;
    }
    if (!items.length) {
      console.log("No matches.");
      return;
    }
    for (const c of items) {
      console.log(`${c.name.padEnd(28)} ${c.category.padEnd(12)} ${c.description.slice(0, 70)}`);
    }
    return;
  }

  if (cmd === "get") {
    const name = positional[1];
    if (!name) {
      console.error("Usage: vibeui get <name> [--source]");
      process.exit(1);
    }
    const comp = getComponent(name);
    if (!comp) {
      console.error(`Unknown component: ${name}`);
      process.exit(1);
    }
    if (flags.has("--source") && !flags.has("--json")) {
      console.log(comp.source);
      return;
    }
    const meta = Object.fromEntries(
      Object.entries(comp).filter(([k]) => k !== "source" && k !== "path"),
    );
    out(flags.has("--source") ? { ...meta, source: comp.source } : meta);
    return;
  }

  if (cmd === "add") {
    const names = positional.slice(1);
    if (!names.length) {
      console.error("Usage: vibeui add <name...> [--dir ./src/components/ui]");
      process.exit(1);
    }
    const dir = flagValue("--dir", "./src/components/ui");
    const results = addComponents(names, dir, {
      withTokens: flags.has("--tokens"),
      withUtils: !flags.has("--no-utils"),
    });
    for (const r of results) {
      if (r.ok)
        console.log(
          `✓ ${r.name} → ${r.path}${r.requested === false ? "  (required by another component)" : ""}`,
        );
      else console.error(`✗ ${r.name}: ${r.error}`);
    }
    const failed = results.filter((r) => !r.ok);
    if (failed.length) process.exit(1);
    // Every component needs cn(), so clsx + tailwind-merge are always required.
    const deps = [
      ...new Set([
        "clsx",
        "tailwind-merge",
        ...results.flatMap((r) => r.dependencies ?? []),
      ]),
    ];
    if (deps.length) console.log(`\nPeers to install: npm i ${deps.join(" ")}`);
    return;
  }

  if (cmd === "init") {
    const dir = path.resolve(process.cwd(), flagValue("--dir", "."));
    const uiDir = path.join(dir, "src/components/ui");
    const libDir = path.join(dir, "src/lib");
    fs.mkdirSync(uiDir, { recursive: true });
    fs.mkdirSync(libDir, { recursive: true });
    const utilsDest = path.join(libDir, "utils.ts");
    if (!fs.existsSync(utilsDest)) {
      fs.writeFileSync(utilsDest, getUtils());
      console.log(`✓ ${utilsDest}`);
    }
    const tokensDest = path.join(dir, "vibeui.tokens.css");
    if (!fs.existsSync(tokensDest)) {
      fs.writeFileSync(tokensDest, getTokens());
      console.log(`✓ ${tokensDest}`);
    }
    const guideDest = path.join(dir, "VIBEUI.md");
    fs.writeFileSync(guideDest, getInstallGuide());
    console.log(`✓ ${guideDest}`);
    console.log("\nNext: vibeui add button --dir ./src/components/ui");
    console.log("Import tokens from vibeui.tokens.css into your global CSS.");
    return;
  }

  if (cmd === "categories") {
    const cats = listCategories();
    if (flags.has("--json")) {
      out(cats);
      return;
    }
    for (const c of cats) {
      console.log(`${c.name.padEnd(14)} ${String(c.count).padStart(3)}  ${c.components.slice(0, 5).join(", ")}${c.components.length > 5 ? "…" : ""}`);
    }
    return;
  }

  if (cmd === "guide") {
    console.log(getInstallGuide());
    return;
  }

  if (cmd === "mcp") {
    const { spawn } = await import("node:child_process");
    const server = path.join(ROOT, "mcp/server.mjs");
    const child = spawn(process.execPath, [server], {
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => process.exit(code ?? 0));
    return;
  }

  if (cmd === "info") {
    const reg = loadRegistry();
    out({
      name: reg.name,
      version: reg.version,
      count: reg.count,
      repository: reg.repository,
      agent: reg.agent,
      categories: Object.keys(reg.categories ?? {}),
    });
    return;
  }

  console.error(`Unknown command: ${cmd}`);
  help();
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
