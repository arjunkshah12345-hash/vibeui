"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type FloatingNavItem = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
};

/**
 * A pill-shaped navigation bar with a highlight that glides between items and settles on the current one.
 *
 * The hover highlight slides ahead of the pointer and returns to the active item when you leave.
 * Turn on `hideOnScroll` and it tucks away as you scroll down and comes back as you scroll up.
 * Position it yourself, for example `fixed left-1/2 top-4 -translate-x-1/2`.
 */
export function FloatingNav({
  items,
  value,
  defaultValue,
  onChange,
  hideOnScroll = false,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "onChange" | "defaultValue"> & {
  items: FloatingNavItem[];
  /** Controlled active item. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Slide out of view while scrolling down. */
  hideOnScroll?: boolean;
}) {
  const [own, setOwn] = React.useState(defaultValue ?? items[0]?.value);
  const active = value ?? own;
  const [hover, setHover] = React.useState<string | null>(null);
  const [hidden, setHidden] = React.useState(false);
  const [rects, setRects] = React.useState<Record<string, { x: number; w: number }>>({});
  const rail = React.useRef<HTMLDivElement>(null);
  const cells = React.useRef<Record<string, HTMLElement | null>>({});

  React.useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const measure = () => {
      const next: Record<string, { x: number; w: number }> = {};
      for (const [k, c] of Object.entries(cells.current))
        if (c) next[k] = { x: c.offsetLeft, w: c.offsetWidth };
      setRects(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items]);

  React.useEffect(() => {
    if (!hideOnScroll) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 80);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnScroll]);

  const pick = (v: string) => {
    if (value === undefined) setOwn(v);
    onChange?.(v);
  };
  const lit = hover ?? active;
  const r = rects[lit];
  const a = rects[active];
  return (
    <nav
      aria-label="Primary"
      {...props}
      className={cn(
        "inline-flex rounded-full border border-line bg-surface/80 p-1.5 shadow-lift backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.3,1.2,0.4,1)]",
        hidden && "-translate-y-[160%]",
        className,
      )}
      onPointerLeave={() => setHover(null)}
    >
      <div ref={rail} className="relative flex items-center">
        {/* the solid pill marks where you are; the soft one follows the pointer */}
        {a && (
          <span
            aria-hidden
            className="absolute inset-y-0 rounded-full bg-ink shadow-quiet transition-[left,width] duration-500 ease-[cubic-bezier(0.3,1.25,0.4,1)]"
            style={{ left: a.x, width: a.w }}
          />
        )}
        {r && hover && hover !== active && (
          <span
            aria-hidden
            className="absolute inset-y-0 rounded-full bg-surface-muted transition-[left,width] duration-300 ease-[cubic-bezier(0.3,1.2,0.4,1)]"
            style={{ left: r.x, width: r.w }}
          />
        )}
        {items.map((it) => {
          const on = it.value === active;
          const Tag = it.href ? "a" : "button";
          return (
            <Tag
              key={it.value}
              ref={(el: HTMLElement | null) => {
                cells.current[it.value] = el;
              }}
              {...(it.href ? { href: it.href } : { type: "button" as const })}
              aria-current={on ? "page" : undefined}
              onClick={() => pick(it.value)}
              onPointerEnter={() => setHover(it.value)}
              onFocus={() => setHover(it.value)}
              onBlur={() => setHover(null)}
              className={cn(
                "relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring",
                on ? "text-surface" : "text-ink-soft hover:text-ink",
              )}
            >
              {it.icon != null && <span className="grid [&_svg]:size-4">{it.icon}</span>}
              {it.label}
            </Tag>
          );
        })}
      </div>
    </nav>
  );
}
