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
