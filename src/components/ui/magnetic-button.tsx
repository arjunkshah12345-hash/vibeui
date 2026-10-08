"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Button that leans toward the cursor and springs back on leave. */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Fraction of the cursor offset the button follows (0–1). */
  strength?: number;
}) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const inner = React.useRef<HTMLSpanElement>(null);

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transition = "transform 0.12s linear";
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    if (inner.current) {
      inner.current.style.transform = `translate(${x * strength * 0.4}px, ${y * strength * 0.4}px)`;
    }
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.6s var(--ease-spring)";
    el.style.transform = "translate(0,0)";
    if (inner.current) inner.current.style.transform = "translate(0,0)";
  };

  return (
    <button
      ref={ref}
      type="button"
      onMouseMove={move}
      onMouseLeave={reset}
      className={cn(
        "relative inline-flex h-12 items-center justify-center rounded-md bg-ink px-6 text-[15px] font-medium text-surface shadow-quiet shadow-inset transition-shadow duration-300 hover:shadow-lift",
        className,
      )}
      {...props}
    >
      <span
        ref={inner}
        className="inline-flex items-center gap-2 transition-transform duration-300 ease-out"
      >
        {children}
      </span>
    </button>
  );
}
