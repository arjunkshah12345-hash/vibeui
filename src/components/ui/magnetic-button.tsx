"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function MagneticButton({
  children,
  className,
  strength = 28,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { strength?: number }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "relative inline-flex h-11 items-center justify-center rounded-[var(--radius-sm)] bg-ink px-5 text-sm font-medium text-surface transition-shadow duration-200 ease-[var(--ease-out)] hover:shadow-[var(--shadow-lift)] active:scale-[0.98]",
        className,
      )}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.18s var(--ease-out)",
      }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        setOffset({
          x: (x / r.width) * strength,
          y: (y / r.height) * strength,
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      {...props}
    >
      {children}
    </button>
  );
}
