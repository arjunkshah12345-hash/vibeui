"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Tabs with a hover highlight that glides between items and a marker on the active tab. */
export function MagnetTabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [hover, setHover] = React.useState<{ left: number; width: number } | null>(null);

  const target = (el: HTMLElement) =>
    setHover({ left: el.offsetLeft, width: el.offsetWidth });

  return (
    <div
      ref={listRef}
      role="tablist"
      onMouseLeave={() => setHover(null)}
      className={cn("relative inline-flex gap-1", className)}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 rounded-sm bg-surface-muted transition-[left,width,opacity] duration-300 ease-out",
          hover ? "opacity-100" : "opacity-0",
        )}
        style={{ left: hover?.left ?? 0, width: hover?.width ?? 0 }}
      />
      {tabs.map((tab) => {
        const selected = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            onMouseEnter={(e) => target(e.currentTarget)}
            onFocus={(e) => target(e.currentTarget)}
            className={cn(
              "relative z-10 h-9 px-3.5 text-[13px] font-medium transition-colors duration-200",
              selected ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {tab.label}
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-3.5 -bottom-px h-0.5 origin-center rounded-full bg-accent transition-transform duration-300 ease-out",
                selected ? "scale-x-100" : "scale-x-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
