import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { getSummaries } from "@/lib/registry";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tryjasmine.dev";
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Every docs section is a folder under `app/docs` that holds a page. */
function docsRoutes() {
  const dir = path.join(process.cwd(), "src/app/docs");
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(dir, d.name, "page.tsx")))
    .map((d) => `/docs/${d.name}`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/components",
    "/docs",
    ...docsRoutes(),
    ...getSummaries().map((c) => `/components/${c.name}`),
  ];
  return paths.map((p, i) => ({
    url: `${site}${base}${p}`,
    changeFrequency: p.startsWith("/components/") ? "monthly" : "weekly",
    priority: i === 0 ? 1 : p === "/components" || p === "/docs" ? 0.9 : 0.6,
  }));
}
