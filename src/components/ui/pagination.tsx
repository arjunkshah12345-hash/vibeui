"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type PageItem = number | `gap-${number}`;

function range(page: number, total: number): PageItem[] {
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: PageItem[] = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev > 1) {
      // A single missing page is shown instead of an ellipsis.
      out.push(p - prev === 2 ? prev + 1 : `gap-${prev}`);
    }
    out.push(p);
  });
  return out;
}

/** Page navigator with collapsing ellipses. */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const cell =
    "flex size-8 items-center justify-center rounded-sm text-[13px] font-medium tabular-nums transition-colors duration-150";

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        className={cn(cell, "text-muted hover:bg-surface-muted hover:text-ink disabled:pointer-events-none disabled:opacity-35")}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <CaretLeft size={14} weight="bold" />
      </button>
      {range(page, totalPages).map((p) =>
        typeof p === "string" ? (
          <span key={p} aria-hidden className="w-6 text-center text-xs text-faint">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={cn(
              cell,
              p === page
                ? "bg-ink text-surface shadow-quiet"
                : "text-muted hover:bg-surface-muted hover:text-ink",
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className={cn(cell, "text-muted hover:bg-surface-muted hover:text-ink disabled:pointer-events-none disabled:opacity-35")}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <CaretRight size={14} weight="bold" />
      </button>
    </nav>
  );
}
