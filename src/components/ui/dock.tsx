"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** macOS-style dock: icons magnify smoothly with distance from the cursor. */
export function Dock({
  items,
  className,
}: {
  items: { id: string; label: string; icon: React.ReactNode; onSelect?: () => void }[];
  className?: string;
}) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const magnify = (clientX: number) => {
    refs.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const d = Math.abs(clientX - (r.left + r.width / 2));
      const scale = 1 + 0.7 * Math.exp(-((d / 70) ** 2));
      el.style.transform = `scale(${scale}) translateY(${(scale - 1) * -14}px)`;
    });
  };

  const reset = () =>
    refs.current.forEach((el) => {
      if (el) el.style.transform = "";
    });

  return (
    <div
      role="toolbar"
      className={cn(
        "inline-flex items-end gap-2 rounded-xl border border-line bg-surface/80 px-3 py-2.5 shadow-lift backdrop-blur-md",
        className,
      )}
      onMouseMove={(e) => magnify(e.clientX)}
      onMouseLeave={reset}
    >
      {items.map((item, i) => (
        <button
          key={item.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          aria-label={item.label}
          onClick={item.onSelect}
          className="group/dock relative flex size-11 origin-bottom items-center justify-center rounded-md border border-line bg-surface-muted text-ink shadow-quiet transition-transform duration-150 ease-out will-change-transform"
        >
          {item.icon}
          <span
            role="tooltip"
            className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[7px] bg-ink px-2 py-1 text-[11px] font-medium text-surface opacity-0 transition-opacity duration-150 group-hover/dock:opacity-100"
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
