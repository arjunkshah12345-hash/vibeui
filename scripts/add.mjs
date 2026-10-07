#!/usr/bin/env node
/**
 * Copy a VibeUI component (and utils if missing) into another project.
 *
 * Usage:
 *   node scripts/add.mjs button ../my-app/src/components/ui
 *   npm run add -- trading-card ./dest
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [, , rawName, destArg] = process.argv;
if (!rawName || !destArg) {
  console.error("Usage: node scripts/add.mjs <component> <destination-dir>");
  console.error("Example: node scripts/add.mjs button ../app/src/components/ui");
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const name = rawName
  .replace(/\.tsx$/, "")
  .replace(/([a-z])([A-Z])/g, "$1-$2")
  .toLowerCase();
const srcFile = path.join(root, "src/components/ui", `${name}.tsx`);
const destDir = path.resolve(process.cwd(), destArg);

if (!fs.existsSync(srcFile)) {
  console.error(`Unknown component: ${rawName}`);
  console.error(`Expected file: ${srcFile}`);
  console.error("Run: npm run registry && cat registry/components.json");
  process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });
const destFile = path.join(destDir, `${name}.tsx`);
fs.copyFileSync(srcFile, destFile);
console.log(`✓ ${name}.tsx → ${destFile}`);

const utilsSrc = path.join(root, "src/lib/utils.ts");
const utilsGuess = path.resolve(destDir, "../../lib/utils.ts");
if (fs.existsSync(utilsSrc) && !fs.existsSync(utilsGuess)) {
  fs.mkdirSync(path.dirname(utilsGuess), { recursive: true });
  fs.copyFileSync(utilsSrc, utilsGuess);
  console.log(`✓ utils.ts → ${utilsGuess}`);
}

console.log("\nAlso paste tokens from templates/vibeui.css into your global CSS.");
console.log("Deps often needed: clsx, tailwind-merge, class-variance-authority, @phosphor-icons/react");
