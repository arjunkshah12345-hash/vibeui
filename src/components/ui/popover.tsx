"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Anchored panel: click to open, animates in and out, Escape or outside click closes. */
export function Popover({
  trigger,
  children,
  className,
  align = "start",
  side = "bottom",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
}) {
  const [open, setOpen] = React.useState(false);
  // Stay mounted until the exit animation has played.
  const [present, setPresent] = React.useState(false);
  if (open && !present) setPresent(true);
  const ref = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <span
        className="inline-flex"
        aria-expanded={open}
        aria-controls={present ? id : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        {trigger}
      </span>
      {present ? (
        <div
          id={id}
          data-state={open ? "open" : "closed"}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget && !open) setPresent(false);
          }}
          className={cn(
            "absolute z-30 min-w-56 rounded-md border border-line bg-surface p-3.5 shadow-lift data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in",
            !open && "pointer-events-none",
            side === "bottom" ? "top-[calc(100%+8px)]" : "bottom-[calc(100%+8px)]",
            align === "start" && "left-0",
            align === "center" && "left-1/2 -translate-x-1/2",
            align === "end" && "right-0",
            className,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
