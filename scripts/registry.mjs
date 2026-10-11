#!/usr/bin/env node
import { writeRegistry } from "../agent/lib.mjs";

const reg = writeRegistry();
console.log(`Wrote ${reg.count} components → registry/components.json`);

// Add the generated API tables (needs the TypeScript dev dependency).
try {
  await import("./props.mjs");
} catch (e) {
  console.warn(`Skipped API extraction: ${e.message}`);
}

// Keep the README catalog in step with the registry.
await import("./catalog.mjs");

// A single-file reference for agents.
await import("./llms-full.mjs");

// Serve the agent briefs from the site root (/llms.txt and /llms-full.txt) as static files.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
fs.mkdirSync(path.join(root, "public"), { recursive: true });
for (const f of ["llms.txt", "llms-full.txt"]) {
  fs.copyFileSync(path.join(root, f), path.join(root, "public", f));
}
