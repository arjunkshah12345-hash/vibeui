"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const docsNav = [
  {
    title: "Getting started",
    items: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
    ],
  },
  {
    title: "Customize",
    items: [{ href: "/docs/theming", label: "Theming and dark mode" }],
  },
  {
    title: "Tooling",
    items: [
      { href: "/docs/cli", label: "CLI" },
      { href: "/docs/agents", label: "Agents and MCP" },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Docs" className="space-y-7">
      {docsNav.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-xs font-medium text-faint">{group.title}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-sm px-3 py-1.5 text-[13.5px] transition-colors duration-150",
                      active
                        ? "bg-surface-muted font-medium text-ink"
                        : "text-muted hover:bg-surface-muted/60 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
