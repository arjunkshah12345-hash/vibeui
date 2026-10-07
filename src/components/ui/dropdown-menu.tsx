"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function DropdownMenu({
  trigger,
  items,
  className,
}: {
  trigger: React.ReactNode;
  items: {
    label?: string;
    onSelect?: () => void;
    danger?: boolean;
    separator?: boolean;
  }[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative inline-flex", className)}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-[180px] rounded-[var(--radius-md)] border border-line bg-surface p-1 shadow-[var(--shadow-lift)] animate-fade-up"
        >
          {items.map((item, i) =>
            item.separator ? (
              <div key={`sep-${i}`} className="my-1 h-px bg-line" />
            ) : (
              <button
                key={item.label ?? i}
                type="button"
                role="menuitem"
                className={cn(
                  "flex w-full rounded-[var(--radius-sm)] px-3 py-2 text-left text-[13px] transition-colors",
                  item.danger
                    ? "text-pastel-rose-ink hover:bg-pastel-rose"
                    : "text-ink-soft hover:bg-surface-muted hover:text-ink",
                )}
                onClick={() => {
                  item.onSelect?.();
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
