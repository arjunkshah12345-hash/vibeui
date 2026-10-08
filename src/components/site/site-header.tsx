import Link from "next/link";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getSummaries } from "@/lib/registry";
import { nav, site } from "@/lib/site";
import { BrandMark } from "./brand-mark";
import { CommandPalette } from "./command-palette";
import { HeaderFrame } from "./header-frame";
import { NavLink } from "./nav-link";

export function SiteHeader() {
  return (
    <HeaderFrame>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-4 sm:gap-7">
          <Link href="/" className="flex items-center gap-2.5" aria-label="VibeUI home">
            <BrandMark />
            <span className="hidden font-display text-[22px] leading-none tracking-[-0.01em] text-ink sm:inline">
              VibeUI
            </span>
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-1">
            {nav.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1.5">
          <CommandPalette components={getSummaries()} />
          <ThemeToggle />
          <a
            href={site.url}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="flex size-9 items-center justify-center rounded-sm text-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <GithubLogo size={18} weight="bold" />
          </a>
        </div>
      </div>
    </HeaderFrame>
  );
}
