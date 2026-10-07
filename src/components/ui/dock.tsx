"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Dock({
  items,
  className,
}: {
  items: { id: string; label: string; icon: React.ReactNode }[];
  className?: string;
}) {
  const [hover, setHover] = React.useState<number | null>(null);

  return (
    <div
      className={cn(
        "inline-flex items-end gap-2 rounded-[var(--radius-lg)] border border-line bg-surface/90 px-3 py-2 shadow-[var(--shadow-lift)] backdrop-blur-md",
        className,
      )}
      onMouseLeave={() => setHover(null)}
    >
      {items.map((item, i) => {
        const dist = hover === null ? 99 : Math.abs(hover - i);
        const scale = dist === 0 ? 1.35 : dist === 1 ? 1.15 : 1;
        return (
          <button
            key={item.id}
            type="button"
            title={item.label}
            aria-label={item.label}
            onMouseEnter={() => setHover(i)}
            className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-surface-muted text-ink transition-transform duration-200 ease-[var(--ease-out)]"
            style={{ transform: `scale(${scale}) translateY(${scale > 1 ? -4 : 0}px)` }}
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
}
