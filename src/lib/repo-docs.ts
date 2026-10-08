import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";

/** Reads a markdown file from the repo root at build time, so docs pages never duplicate it. */
export async function readRepoFile(name: string): Promise<string> {
  "use cache";
  cacheLife("max"); // files only change on a new build
  return readFile(path.join(process.cwd(), name), "utf8");
}
