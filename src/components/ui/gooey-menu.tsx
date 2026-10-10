"use client";

import * as React from "react";
import { Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type GooeyItem = {
  id: string;
  // Accessible name and tooltip.
  label: string;
  icon: React.ReactNode;
  onSelect?: () => void;
};

type Direction = "fan" | "up" | "down" | "left" | "right";

const SIZE = 56;
const ITEM = 48;

function place(direction: Direction, count: number, spacing: number) {
  if (direction === "fan") {
    const span = Math.min(46 * (count - 1), 160);
    return Array.from({ length: count }, (_, i) => {
      const a = count === 1 ? -90 : -90 - span / 2 + (span / (count - 1)) * i;
      const rad = (a * Math.PI) / 180;
      return { x: Math.cos(rad) * spacing * 1.2, y: Math.sin(rad) * spacing * 1.2 };
    });
  }
  const v = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[direction];
  return Array.from({ length: count }, (_, i) => ({
    x: v[0] * spacing * (i + 1),
    y: v[1] * spacing * (i + 1),
  }));
}

/**
 * A button whose actions bud off like liquid and stay fused to it.
 *
 * The blobs go through an SVG goo filter; real buttons sit on top for keyboard and screen readers.
 */
export function GooeyMenu({
  items,
  direction = "fan",
  spacing = 54,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  icon,
  label = "Menu",
  className,
}: {
  items: GooeyItem[];
  /** Where the items emerge: a fan arc, or a straight line. */
  direction?: Direction;
  /** Distance between the button and each item, in px. */
  spacing?: number;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Icon on the main button. It turns 45° when open. */
  icon?: React.ReactNode;
  /** Accessible name of the main button. */
  label?: string;
  className?: string;
}) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const [inner, setInner] = React.useState(defaultOpen);
  const open = controlled ?? inner;
  const root = React.useRef<HTMLDivElement>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (controlled === undefined) setInner(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  React.useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key);
    };
  }, [open, setOpen]);

  const spots = place(direction, items.length, spacing);
  const stagger = 55;

  return (
    <div
      ref={root}
      role="group"
      aria-label={label}
      className={cn("relative", className)}
      style={{ width: SIZE, height: SIZE }}
    >
      <svg aria-hidden width="0" height="0" className="pointer-events-none absolute">
        <filter
          id={id}
          filterUnits="userSpaceOnUse"
          x="-1000"
          y="-1000"
          width="3000"
          height="3000"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      {/* the liquid: every blob lives on one layer so the filter can fuse them */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{ inset: 0, filter: `url(#${id})` }}
      >
        {items.map((item, i) => (
          <span
            key={item.id}
            className="absolute rounded-full bg-ink"
            style={{
              width: ITEM,
              height: ITEM,
              left: (SIZE - ITEM) / 2,
              top: (SIZE - ITEM) / 2,
              transform: open
                ? `translate(${spots[i].x}px, ${spots[i].y}px) scale(1)`
                : "translate(0px, 0px) scale(0.55)",
              transition: "transform 0.7s var(--ease-spring)",
              transitionDelay: `${(open ? i : items.length - 1 - i) * stagger}ms`,
            }}
          />
        ))}
        <span className="absolute inset-0 rounded-full bg-ink" />
      </div>

      {items.map((item, i) => (
        <button
          key={item.id}
          type="button"
          aria-label={item.label}
          title={item.label}
          tabIndex={open ? 0 : -1}
          onClick={() => {
            item.onSelect?.();
            setOpen(false);
          }}
          className={cn(
            "absolute inline-flex items-center justify-center rounded-full text-surface outline-none transition-[opacity,transform] duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
            open ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          style={{
            width: ITEM,
            height: ITEM,
            left: (SIZE - ITEM) / 2,
            top: (SIZE - ITEM) / 2,
            transform: open
              ? `translate(${spots[i].x}px, ${spots[i].y}px)`
              : "translate(0px, 0px) scale(0.55)",
            transitionDelay: open ? `${i * stagger + 160}ms` : "0ms",
          }}
        >
          {item.icon}
        </button>
      ))}

      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="absolute inset-0 inline-flex items-center justify-center rounded-full text-surface outline-none transition-transform duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        <span
          className="inline-flex transition-transform duration-500"
          style={{
            transform: open ? "rotate(135deg)" : "rotate(0deg)",
            transitionTimingFunction: "var(--ease-spring)",
          }}
        >
          {icon ?? <Plus size={22} weight="bold" />}
        </span>
      </button>
    </div>
  );
}
