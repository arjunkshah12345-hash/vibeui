"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function BookFlip({
  pages,
  className,
}: {
  pages: { title: string; body: string }[];
  className?: string;
}) {
  const [page, setPage] = React.useState(0);
  const current = pages[page];
  const next = pages[page + 1];

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="relative h-52 [perspective:1200px]">
        <div className="absolute inset-0 rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-[var(--shadow-quiet)]">
          {next ? (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
                Next
              </p>
              <h3 className="mt-3 text-lg font-medium tracking-[-0.02em] text-ink">
                {next.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{next.body}</p>
            </>
          ) : (
            <p className="text-sm text-muted">End of book</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setPage((p) => (p + 1) % pages.length)}
          className="absolute inset-0 origin-left rounded-[var(--radius-lg)] border border-line bg-surface p-6 text-left shadow-[var(--shadow-lift)] transition-transform duration-700 ease-[var(--ease-out)] hover:[transform:rotateY(-18deg)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
            {String(page + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl tracking-[-0.03em] text-ink">
            {current?.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{current?.body}</p>
          <p className="mt-6 text-xs text-faint">Click to turn the page</p>
        </button>
      </div>
    </div>
  );
}
