#!/usr/bin/env node
/**
 * Writes llms-full.txt: a single plain-text file an agent can load to know every
 * component, its peers, sibling imports and props, without running anything.
 * Generated from registry/components.json by `npm run registry`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, "registry/components.json"), "utf8"));

const lines = [];
const out = (s = "") => lines.push(s);

out("# VibeUI (full reference)");
out();
out("> Copy-owned React + Tailwind components. MIT. https://github.com/arjunkshah12345-hash/vibeui");
out(`> Version ${reg.version} · ${reg.count} components · generated from registry/components.json`);
out();
out("## Setup");
out();
out("- Peers: " + reg.peerDependencies.filter((p) => !["react", "react-dom"].includes(p)).join(", "));
out("- Tailwind v4. Import the token file AFTER `@import \"tailwindcss\";` (templates/vibeui.css or vibeui.tokens.css).");
out("- Path alias `@/*` -> `src/*`. Components import `cn` from `@/lib/utils`.");
out("- Dark mode: `dark` class on <html>. `light` / `dark` on any element pins that subtree.");
out("- Install: `npx @agents-npm-packages/vibeui add <name...> --dir ./src/components/ui` (siblings are copied automatically).");
out("- Toasts need <ToastProvider> once near the root.");
out();
out("## Conventions");
out();
out("- One file per component in src/components/ui/<kebab>.tsx; named exports only.");
out("- className is merged last with cn(); remaining props spread onto the root element.");
out("- Use token classes (bg-surface, text-muted, border-line, ring-ring, shadow-lift, rounded-md); never raw hex.");
out("- Variants use class-variance-authority. Export `xVariants` to style other elements (e.g. a Link as a button).");
out("- Stateful components support controlled and uncontrolled use (value/defaultValue).");
out("- Files without \"use client\" are server-safe; import icons from @phosphor-icons/react/dist/ssr there.");
out();
out("## Components");

const byCat = new Map();
for (const c of reg.components) {
  if (!byCat.has(c.category)) byCat.set(c.category, []);
  byCat.get(c.category).push(c);
}

for (const [cat, list] of byCat) {
  out();
  out(`### ${cat}`);
  for (const c of list) {
    out();
    out(`#### ${c.name}`);
    out(c.description);
    out(`- file: ${c.file}`);
    out(`- exports: ${c.exports.join(", ")}`);
    out(`- ${c.client ? "client component" : "server-safe"}`);
    if (c.dependencies.length) out(`- peers: ${c.dependencies.join(", ")}`);
    if (c.registryDependencies?.length) out(`- also imports: ${c.registryDependencies.join(", ")}`);
    for (const e of c.api ?? []) {
      if (!e.props.length && !e.extends.length) continue;
      out(`- <${e.name}>${e.extends.length ? ` (also accepts ${e.extends[0]})` : ""}`);
      for (const p of e.props) {
        const def = p.default ? ` = ${p.default}` : "";
        out(`  - ${p.name}${p.required ? "" : "?"}: ${p.type}${def}${p.description ? ` — ${p.description}` : ""}`);
      }
    }
  }
}

fs.writeFileSync(path.join(ROOT, "llms-full.txt"), lines.join("\n") + "\n");
console.log(`Wrote llms-full.txt (${lines.length} lines).`);
