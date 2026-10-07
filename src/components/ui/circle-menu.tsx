"use client";

import * as React from "react";
import { Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function CircleMenu({
  items,
  className,
}: {
  items: { id: string; label: string; icon: React.ReactNode; onSelect?: () => void }[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const radius = 72;

  return (
    <div className={cn("relative flex size-44 items-center justify-center", className)}>
      {items.map((item, i) => {
        const angle = (-90 + (360 / items.length) * i) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <button
            key={item.id}
            type="button"
            title={item.label}
            aria-label={item.label}
            onClick={() => {
              item.onSelect?.();
              setOpen(false);
            }}
            className={cn(
              "absolute flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-[var(--shadow-quiet)] transition-all duration-500 ease-[var(--ease-out)]",
              open
                ? "opacity-100 scale-100"
                : "pointer-events-none opacity-0 scale-50",
            )}
            style={{
              transform: open
                ? `translate(${x}px, ${y}px)`
                : "translate(0,0)",
              transitionDelay: open ? `${i * 40}ms` : "0ms",
            }}
          >
            {item.icon}
          </button>
        );
      })}
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="relative z-10 flex size-12 items-center justify-center rounded-full bg-ink text-surface transition-transform duration-300 ease-[var(--ease-out)] hover:scale-105"
        style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
      >
        <Plus size={20} weight="bold" />
      </button>
    </div>
  );
}
