import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";

export type Token = { name: string; light: string; dark: string };

function block(css: string, selector: RegExp) {
  const m = css.match(selector);
  return m ? m[1] : "";
}

function vars(body: string) {
  const out = new Map<string, string>();
  for (const m of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    out.set(m[1], m[2].replace(/\s+/g, " ").trim());
  }
  return out;
}

/** Every light/dark token pair, read straight from templates/vibeui.css so the docs cannot drift. */
export async function getTokens(): Promise<Token[]> {
  "use cache";
  cacheLife("max"); // files only change on a new build
  const css = await readFile(path.join(process.cwd(), "templates/vibeui.css"), "utf8");
  const light = vars(block(css, /:root,\s*\.light\s*\{([\s\S]*?)\n\}/));
  const dark = vars(block(css, /\n\.dark\s*\{([\s\S]*?)\n\}/));
  return [...light.entries()].map(([name, value]) => ({
    name: `--${name}`,
    light: value,
    dark: dark.get(name) ?? value,
  }));
}

export type Animation = { utility: string; value: string };

/** `animate-*` utilities declared in the token file. */
export async function getAnimations(): Promise<Animation[]> {
  "use cache";
  cacheLife("max"); // files only change on a new build
  const css = await readFile(path.join(process.cwd(), "templates/vibeui.css"), "utf8");
  return [...css.matchAll(/--animate-([\w-]+):\s*([^;]+);/g)].map((m) => ({
    utility: `animate-${m[1]}`,
    value: m[2].replace(/\s+/g, " ").trim(),
  }));
}
