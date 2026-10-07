"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

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
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <CaretLeft size={14} weight="bold" />
      </Button>
      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="inline-flex items-center gap-1">
            {showEllipsis ? (
              <span className="px-1 text-xs text-faint">…</span>
            ) : null}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                "flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-[13px] font-medium transition-colors",
                p === page
                  ? "bg-ink text-surface"
                  : "text-muted hover:bg-surface-muted hover:text-ink",
              )}
            >
              {p}
            </button>
          </span>
        );
      })}
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <CaretRight size={14} weight="bold" />
      </Button>
    </div>
  );
}
