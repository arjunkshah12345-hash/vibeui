import type { NextConfig } from "next";

/**
 * Set BASE_PATH (for example "/ui") at build time to serve the site under a
 * sub-path of another domain. Unset, it serves from the root.
 */
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [{ source: "/gallery", destination: "/components", permanent: true }];
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
