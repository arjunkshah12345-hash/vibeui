"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Command } from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { useTheme } from "@/components/theme/theme-provider";
import { categoryLabel, type ComponentSummary } from "@/lib/categories";
import { cn } from "@/lib/utils";

const noop = () => () => {};

const pages = [
  { id: "page:/", label: "Home", href: "/" },
  { id: "page:/components", label: "All components", href: "/components" },
  { id: "page:/docs", label: "Docs · Introduction", href: "/docs" },
  { id: "page:/docs/installation", label: "Docs · Installation", href: "/docs/installation" },
  { id: "page:/docs/theming", label: "Docs · Theming and dark mode", href: "/docs/theming" },
  { id: "page:/docs/cli", label: "Docs · CLI", href: "/docs/cli" },
  { id: "page:/docs/agents", label: "Docs · Agents and MCP", href: "/docs/agents" },
];

/** ⌘K palette: jump to any component or docs page, or flip the theme. */
export function CommandPalette({
  components,
  className,
}: {
  components: ComponentSummary[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const hrefs = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const p of pages) map.set(p.id, p.href);
    for (const c of components) map.set(`c:${c.name}`, `/components/${c.name}`);
    return map;
  }, [components]);

  const items = React.useMemo(
    () => [
      ...pages.map((p) => ({ id: p.id, label: p.label, group: "Pages" })),
      { id: "action:theme", label: "Toggle theme", group: "Actions", hint: "T" },
      ...components.map((c) => ({
        id: `c:${c.name}`,
        label: c.title.replace(/([a-z])([A-Z])/g, "$1 $2"),
        group: categoryLabel(c.category),
      })),
    ],
    [components],
  );

  const select = (id: string) => {
    setOpen(false);
    if (id === "action:theme") return toggleTheme();
    const href = hrefs.get(id);
    if (href) router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className={cn(
          "flex h-9 items-center gap-2 rounded-sm border border-line bg-surface px-3 text-[13px] text-muted shadow-quiet transition-colors hover:border-line-strong hover:text-ink",
          className,
        )}
      >
        <MagnifyingGlass size={15} weight="bold" />
        <span className="hidden lg:inline">Search</span>
        <span className="ml-3 hidden gap-1 lg:flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
      {open && mounted
        ? createPortal(
            <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[14vh]">
              <div
                aria-hidden
                className="absolute inset-0 animate-fade-in bg-overlay backdrop-blur-[2px]"
                onClick={() => setOpen(false)}
              />
              <div role="dialog" aria-modal="true" aria-label="Search" className="relative w-full max-w-xl animate-pop-in">
                <Command
                  items={items}
                  onSelect={select}
                  placeholder="Search components and docs…"
                  className="shadow-pop"
                  autoFocus
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
