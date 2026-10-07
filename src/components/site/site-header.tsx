"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GithubLogo } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/mark.svg"
              alt=""
              width={28}
              height={28}
              className="rounded-[7px]"
            />
            <span className="flex items-baseline gap-1.5">
              <span className="font-[family-name:var(--font-display)] text-xl tracking-[-0.03em] text-ink">
                Vibe
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                UI
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 sm:flex">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[13px] transition-colors",
                    active
                      ? "font-medium text-ink"
                      : "text-muted hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={site.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-sm)] border border-line bg-surface px-3 text-[13px] font-medium text-ink transition-colors hover:bg-surface-muted"
          >
            <GithubLogo size={16} weight="bold" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
