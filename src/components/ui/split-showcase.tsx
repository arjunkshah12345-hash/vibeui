"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function SplitShowcase({
  left,
  right,
  className,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pct, setPct] = React.useState(50);
  const dragging = React.useRef(false);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const next = ((clientX - r.left) / r.width) * 100;
    setPct(Math.min(85, Math.max(15, next)));
  };

  React.useEffect(() => {
    const onUp = () => {
      dragging.current = false;
    };
    const onMove = (e: MouseEvent) => {
      if (dragging.current) move(e.clientX);
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-56 w-full overflow-hidden rounded-[var(--radius-lg)] border border-line select-none",
        className,
      )}
    >
      <div className="absolute inset-0 bg-surface-muted">{right}</div>
      <div
        className="absolute inset-0 overflow-hidden bg-surface"
        style={{ width: `${pct}%` }}
      >
        {left}
      </div>
      <div
        className="absolute inset-y-0 z-10 w-px bg-ink"
        style={{ left: `${pct}%` }}
      >
        <button
          type="button"
          aria-label="Drag to compare"
          onMouseDown={() => {
            dragging.current = true;
          }}
          className="absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface text-[10px] font-mono text-ink shadow-[var(--shadow-lift)]"
        >
          ↔
        </button>
      </div>
    </div>
  );
}
