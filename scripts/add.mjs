#!/usr/bin/env node
/**
 * Legacy shim — prefer: npx vibeui add <name> --dir <dest>
 *
 *   node scripts/add.mjs button ../my-app/src/components/ui
 */
import { addComponents } from "../agent/lib.mjs";

const [, , rawName, destArg] = process.argv;
if (!rawName || !destArg) {
  console.error("Usage: node scripts/add.mjs <component> <destination-dir>");
  console.error("Prefer: npx vibeui add <component> --dir <destination-dir>");
  process.exit(1);
}

const results = addComponents([rawName], destArg, { withUtils: true });
for (const r of results) {
  if (r.ok) console.log(`✓ ${r.name} → ${r.path}`);
  else {
    console.error(`✗ ${r.name}: ${r.error}`);
    process.exit(1);
  }
}
console.log("\nAlso paste tokens from templates/vibeui.css into your global CSS.");
console.log("Or: npx vibeui add <name> --dir <dest> --tokens");
