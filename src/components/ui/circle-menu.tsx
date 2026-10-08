"use client";

import * as React from "react";
import { Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Radial menu: a button that fans its actions out in a circle. */
export function CircleMenu({
  items,
  className,
  radius = 76,
}: {
  items: { id: string; label: string; icon: React.ReactNode; onSelect?: () => void }[];
  className?: string;
  radius?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const size = radius * 2 + 56;

  return (
    <div
      className={cn("relative mx-auto flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <span
        aria-hidden
        className={cn(
          "absolute rounded-full border border-dashed border-line-strong transition-[opacity,transform] duration-500 ease-out",
          open ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
        style={{ width: radius * 2, height: radius * 2 }}
      />
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
            tabIndex={open ? 0 : -1}
            onClick={() => {
              item.onSelect?.();
              setOpen(false);
            }}
            className={cn(
              "absolute flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-quiet transition-[transform,opacity,background-color] duration-500 ease-spring hover:bg-surface-muted",
              open ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            style={{
              transform: open
                ? `translate(${x}px, ${y}px) scale(1)`
                : "translate(0,0) scale(0.4)",
              transitionDelay: open ? `${i * 45}ms` : "0ms",
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
        className="relative z-10 flex size-14 items-center justify-center rounded-full bg-ink text-surface shadow-lift shadow-inset transition-transform duration-500 ease-spring hover:scale-105 active:scale-95"
        style={{ transform: open ? "rotate(135deg)" : undefined }}
      >
        <Plus size={22} weight="bold" />
      </button>
    </div>
  );
}
