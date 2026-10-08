"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Before/after comparison with a draggable, keyboard-accessible divider. */
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

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPct(Math.min(95, Math.max(5, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-60 w-full touch-none overflow-hidden rounded-lg border border-line select-none",
        className,
      )}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e.clientX);
      }}
    >
      <div className="absolute inset-0 bg-surface-muted">{right}</div>
      <div
        className="absolute inset-0 bg-surface"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        {left}
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Drag to compare"
        aria-valuemin={5}
        aria-valuemax={95}
        aria-valuenow={Math.round(pct)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPct((p) => Math.max(5, p - 4));
          if (e.key === "ArrowRight") setPct((p) => Math.min(95, p + 4));
        }}
        className="group absolute inset-y-0 z-10 w-px cursor-ew-resize bg-accent outline-none"
        style={{ left: `${pct}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-surface text-xs text-ink shadow-lift transition-transform duration-200 group-hover:scale-110 group-focus-visible:ring-[3px] group-focus-visible:ring-ring">
          ⇄
        </span>
      </div>
    </div>
  );
}
