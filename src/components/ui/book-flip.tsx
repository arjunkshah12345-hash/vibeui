"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Page({
  index,
  total,
  title,
  body,
}: {
  index: number;
  total: number;
  title: string;
  body: string;
}) {
  return (
    <div className="flex h-full flex-col p-7">
      <p className="font-mono text-[11px] text-faint">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      <h3 className="mt-4 font-display text-[32px] leading-none tracking-[-0.01em] text-ink">
        {title}
      </h3>
      <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

/** A page that physically turns over its spine to reveal the next. */
export function BookFlip({
  pages,
  className,
}: {
  pages: { title: string; body: string }[];
  className?: string;
}) {
  const [page, setPage] = React.useState(0);
  const [flipping, setFlipping] = React.useState(false);
  const total = pages.length;
  const current = pages[page];
  const next = pages[(page + 1) % total];

  const flip = () => {
    if (!flipping && total > 1) setFlipping(true);
  };

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="relative h-60 [perspective:1600px]">
        {/* Page underneath, revealed as the cover lifts */}
        <div className="absolute inset-0 overflow-hidden rounded-lg border border-line bg-surface shadow-quiet">
          <Page index={(page + 1) % total} total={total} {...next} />
        </div>
        {/* Turning page */}
        <button
          type="button"
          onClick={flip}
          aria-label="Turn page"
          onTransitionEnd={(e) => {
            if (e.propertyName !== "transform" || !flipping) return;
            setPage((p) => (p + 1) % total);
            setFlipping(false);
          }}
          className={cn(
            "group absolute inset-0 origin-left cursor-pointer overflow-hidden rounded-lg border border-line-strong bg-surface text-left shadow-lift [transform-style:preserve-3d] [backface-visibility:hidden]",
            flipping
              ? "transition-transform duration-[850ms] ease-[cubic-bezier(0.645,0.045,0.355,1)]"
              : "transition-transform duration-500 ease-out hover:[transform:rotateY(-14deg)]",
          )}
          style={flipping ? { transform: "rotateY(-180deg)" } : undefined}
        >
          <Page index={page} total={total} {...current} />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/[0.06] to-transparent"
          />
          <span className="absolute bottom-5 right-6 text-xs text-faint transition-colors group-hover:text-muted">
            Turn page →
          </span>
        </button>
      </div>
    </div>
  );
}
