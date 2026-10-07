#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uiDir = path.join(root, "src/components/ui");
const outDir = path.join(root, "registry");
const outFile = path.join(outDir, "components.json");

const files = fs
  .readdirSync(uiDir)
  .filter((f) => f.endsWith(".tsx") && f !== "index.ts")
  .sort();

const components = files.map((file) => {
  const name = file.replace(/\.tsx$/, "");
  const src = fs.readFileSync(path.join(uiDir, file), "utf8");
  const deps = [];
  if (src.includes("@phosphor-icons/react")) deps.push("@phosphor-icons/react");
  if (src.includes("class-variance-authority") || src.includes("cva("))
    deps.push("class-variance-authority");
  if (src.includes("from \"motion") || src.includes("from 'motion"))
    deps.push("motion");
  return {
    name,
    file: `src/components/ui/${file}`,
    dependencies: [...new Set(deps)],
  };
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  outFile,
  JSON.stringify(
    {
      name: "vibeui",
      version: "0.1.0",
      license: "MIT",
      count: components.length,
      tokens: "templates/vibeui.css",
      utils: "src/lib/utils.ts",
      components,
    },
    null,
    2,
  ) + "\n",
);

console.log(`Wrote ${components.length} components → registry/components.json`);
