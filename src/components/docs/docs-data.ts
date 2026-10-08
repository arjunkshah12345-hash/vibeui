export type DocLinkItem = { href: string; label: string };

export const docsNav: { title: string; items: DocLinkItem[] }[] = [
  {
    title: "Getting started",
    items: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/components", label: "How components work" },
    ],
  },
  {
    title: "Customize",
    items: [
      { href: "/docs/theming", label: "Theming" },
      { href: "/docs/dark-mode", label: "Dark mode" },
      { href: "/docs/motion", label: "Motion" },
      { href: "/docs/accessibility", label: "Accessibility" },
    ],
  },
  {
    title: "Guides",
    items: [
      { href: "/docs/recipes", label: "Recipes" },
      { href: "/docs/upgrading", label: "Upgrading to 0.2" },
      { href: "/docs/faq", label: "FAQ" },
    ],
  },
  {
    title: "Tooling",
    items: [
      { href: "/docs/cli", label: "CLI" },
      { href: "/docs/registry", label: "Registry" },
      { href: "/docs/agents", label: "Agents and MCP" },
    ],
  },
  {
    title: "Project",
    items: [
      { href: "/docs/contributing", label: "Contributing" },
      { href: "/docs/changelog", label: "Changelog" },
    ],
  },
];

export const docsFlat = docsNav.flatMap((g) => g.items);
