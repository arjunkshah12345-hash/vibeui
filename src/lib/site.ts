export const site = {
  name: "VibeUI",
  tagline: "Components with taste, that you own",
  description:
    "120 copy-owned React + Tailwind components with warm tokens, real dark mode and signature motion. Add one with a command, keep every line.",
  url: "https://github.com/arjunkshah12345-hash/vibeui",
  repo: "arjunkshah12345-hash/vibeui",
  license: "MIT",
  count: 120,
  /**
   * How people run the CLI. Not on npm yet, so it runs straight from GitHub.
   * After publishing, change this to the npm command.
   */
  cli: "npx github:arjunkshah12345-hash/vibeui",
} as const;

export const nav = [
  { href: "/components", label: "Components" },
  { href: "/docs", label: "Docs" },
] as const;
