#!/usr/bin/env node
/**
 * Rewrites the component catalog block in README.md (between the
 * `catalog:start` / `catalog:end` markers) from registry/components.json.
 * Runs as part of `npm run registry`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const README = path.join(ROOT, "README.md");
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry/components.json"), "utf8"));

const shelves = [
  ["actions", "Actions"],
  ["forms", "Forms"],
  ["feedback", "Feedback"],
  ["data", "Data & surfaces"],
  ["overlays", "Overlays"],
  ["navigation", "Navigation"],
  ["craft", "Signature"],
  ["text", "Text effects"],
  ["hover", "Hover effects"],
  ["footers", "Footers"],
];

const rows = shelves.map(([id, label]) => {
  const names = registry.components.filter((c) => c.category === id).map((c) => `\`${c.name}\``);
  return `| ${label} | ${names.length} | ${names.join(" · ")} |`;
});

const block = [
  "<!-- catalog:start -->",
  "| Shelf | Count | Components |",
  "| --- | --- | --- |",
  ...rows,
  "<!-- catalog:end -->",
].join("\n");

const src = fs.readFileSync(README, "utf8");
const next = src.replace(/<!-- catalog:start -->[\s\S]*?<!-- catalog:end -->/, block);
if (next !== src) fs.writeFileSync(README, next);
console.log(`Updated README catalog (${registry.components.length} components).`);
