"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Card with a soft highlight that tracks the cursor across its surface. */
export function HoverShine({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-line bg-surface p-6 shadow-quiet [--x:50%] [--y:50%]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(260px circle at var(--x) var(--y), color-mix(in oklab, var(--ink) 9%, transparent), transparent 60%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
