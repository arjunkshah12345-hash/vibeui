"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
  const [pill, setPill] = React.useState({ left: 0, width: 0 });

  React.useLayoutEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const active = root.querySelector<HTMLElement>(`[data-value="${value}"]`);
    if (!active) return;
    setPill({ left: active.offsetLeft, width: active.offsetWidth });
  }, [value, tabs]);

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cn(
        "relative inline-flex rounded-[var(--radius-md)] border border-line bg-surface-muted p-1",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute top-1 h-[calc(100%-8px)] rounded-[var(--radius-sm)] bg-surface shadow-[var(--shadow-quiet)] transition-all duration-300 ease-[var(--ease-out)]"
        style={{ left: pill.left, width: pill.width }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          data-value={tab.value}
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "relative z-10 px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200",
            value === tab.value ? "text-ink" : "text-muted hover:text-ink",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
