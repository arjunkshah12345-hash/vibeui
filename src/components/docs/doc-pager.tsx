"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { docsFlat } from "./docs-data";

/** Previous / next page links, derived from the sidebar order. */
export function DocPager() {
  const pathname = usePathname();
  const i = docsFlat.findIndex((d) => d.href === pathname);
  if (i < 0) return null;
  const prev = docsFlat[i - 1];
  const next = docsFlat[i + 1];

  const card =
    "group flex items-center gap-3 rounded-lg border border-line bg-surface p-4 shadow-quiet transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift";

  return (
    <nav aria-label="Pagination" className="mt-20 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className={card}>
          <ArrowLeft size={16} weight="bold" className="text-faint transition-transform duration-300 group-hover:-translate-x-1" />
          <span>
            <span className="block text-xs text-muted">Previous</span>
            <span className="text-sm font-medium text-ink">{prev.label}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className={`${card} justify-end text-right`}>
          <span>
            <span className="block text-xs text-muted">Next</span>
            <span className="text-sm font-medium text-ink">{next.label}</span>
          </span>
          <ArrowRight size={16} weight="bold" className="text-faint transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      ) : null}
    </nav>
  );
}
