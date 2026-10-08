"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Item = {
  label?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect?: () => void;
  danger?: boolean;
  separator?: boolean;
};

/** Action menu: arrow-key navigation, staggered items, animates in and out. */
export function DropdownMenu({
  trigger,
  items,
  className,
  align = "start",
}: {
  trigger: React.ReactNode;
  items: Item[];
  className?: string;
  align?: "start" | "end";
}) {
  const [open, setOpen] = React.useState(false);
  // Stay mounted until the exit animation has played.
  const [present, setPresent] = React.useState(false);
  if (open && !present) setPresent(true);
  const ref = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const nodes = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    const i = nodes.indexOf(document.activeElement as HTMLElement);
    const next = e.key === "ArrowDown" ? i + 1 : i - 1;
    nodes[(next + nodes.length) % nodes.length]?.focus();
  };

  return (
    <div
      ref={ref}
      className={cn("relative inline-flex", className)}
      onKeyDown={onKeyDown}
    >
      <span
        className="inline-flex"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {trigger}
      </span>
      {present ? (
        <div
          ref={menuRef}
          role="menu"
          data-state={open ? "open" : "closed"}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget && !open) setPresent(false);
          }}
          className={cn(
            "absolute top-[calc(100%+6px)] z-30 min-w-52 origin-top rounded-md border border-line bg-surface p-1 shadow-lift data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in",
            !open && "pointer-events-none",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, i) =>
            item.separator ? (
              <div key={`sep-${i}`} role="separator" className="my-1 h-px bg-line" />
            ) : (
              <button
                key={`${item.label}-${i}`}
                type="button"
                role="menuitem"
                style={{ animationDelay: `${30 + i * 28}ms` }}
                className={cn(
                  "group/item flex w-full animate-fade-up items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-left text-[13px] outline-none transition-[background-color,color,padding] duration-150 active:scale-[0.98]",
                  item.danger
                    ? "text-pastel-rose-ink hover:bg-pastel-rose focus:bg-pastel-rose"
                    : "text-ink-soft hover:bg-surface-muted hover:text-ink focus:bg-surface-muted focus:text-ink",
                )}
                onClick={() => {
                  item.onSelect?.();
                  setOpen(false);
                }}
              >
                {item.icon ? (
                  <span className="flex size-4 shrink-0 items-center justify-center opacity-70 transition-transform duration-200 group-hover/item:scale-110 group-focus/item:scale-110">
                    {item.icon}
                  </span>
                ) : null}
                <span className="flex-1">{item.label}</span>
                {item.shortcut ? (
                  <span className="font-mono text-[10.5px] text-faint">
                    {item.shortcut}
                  </span>
                ) : null}
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
