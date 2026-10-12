"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type HoverImageItem = {
  title: string;
  meta?: string;
  image: string;
  href?: string;
};

/**
 * An index of large titles where hovering a row floats its picture beside the cursor, tilting as you move.
 *
 * The picture follows with a lag and leans into the motion; the other rows fade back. Works as
 * a list of links, and keyboard focus shows the picture too.
 */
export function HoverImageList({
  items,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  items: HoverImageItem[];
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const tag = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState<number | null>(null);
  const on = React.useRef(false);
  const target = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    on.current = active !== null;
  }, [active]);

  React.useEffect(() => {
    const el = box.current;
    const card = tag.current;
    if (!el || !card) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = { x: 0, y: 0 };
    let tilt = 0;
    let scale = 0;
    let raf = 0;
    let last = performance.now();
    let seen = false;

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const follow = calm ? 1 : 1 - Math.exp(-dt * 11);
      const vx = (target.current.x - pos.x) * follow;
      pos.x += vx;
      pos.y += (target.current.y - pos.y) * follow;
      const wantTilt = Math.max(-14, Math.min(14, vx * 1.1));
      tilt += (wantTilt - tilt) * (1 - Math.exp(-dt * 10));
      const goal = on.current ? 1 : 0;
      scale += (goal - scale) * (calm ? 1 : 1 - Math.exp(-dt * 12));
      card.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg) scale(${0.7 + scale * 0.3})`;
      card.style.opacity = String(Math.min(1, scale * 1.4));
      const settled = !on.current && scale < 0.01;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const k = el.offsetWidth / (r.width || 1);
      target.current = { x: (e.clientX - r.left) * k + 120, y: (e.clientY - r.top) * k };
      if (!seen) {
        pos.x = target.current.x;
        pos.y = target.current.y;
        seen = true;
      }
      wake();
    };
    const leave = () => {
      seen = false;
      wake();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", move);
    el.addEventListener("pointerleave", leave);
    // Keep the loop alive while a row is active, even with the pointer still.
    const watch = window.setInterval(() => on.current && wake(), 250);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(watch);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      {...props}
      ref={box}
      className={cn("relative w-full", className)}
      onPointerLeave={() => setActive(null)}
    >
      <ul>
        {items.map((it, i) => {
          const Tag = it.href ? "a" : "button";
          return (
            <li key={it.title} className="border-t border-line last:border-b">
              <Tag
                {...(it.href ? { href: it.href } : { type: "button" as const })}
                onPointerEnter={() => setActive(i)}
                onFocus={() => {
                  setActive(i);
                  const r = box.current?.getBoundingClientRect();
                  const row = (
                    document.activeElement as HTMLElement | null
                  )?.getBoundingClientRect();
                  if (r && row)
                    target.current = {
                      x: row.right - r.left - 140,
                      y: row.top - r.top + row.height / 2,
                    };
                }}
                onBlur={() => setActive(null)}
                className={cn(
                  "group flex w-full items-baseline gap-6 py-5 text-left outline-none transition-opacity duration-300 focus-visible:bg-surface-muted",
                  active !== null && active !== i && "opacity-30",
                )}
              >
                <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-4xl leading-none tracking-tight text-ink transition-transform duration-500 ease-[cubic-bezier(0.2,0.9,0.2,1)] group-hover:translate-x-3 group-focus-visible:translate-x-3 sm:text-5xl">
                  {it.title}
                </span>
                {it.meta && <span className="hidden text-sm text-muted sm:block">{it.meta}</span>}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="shrink-0 -translate-x-2 self-center text-ink opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Tag>
            </li>
          );
        })}
      </ul>
      {/* the floating picture: every image is stacked and preloaded; the active one fades in */}
      <div
        ref={tag}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 h-[260px] w-[200px] overflow-hidden rounded-xl bg-surface-muted opacity-0 shadow-[0_24px_50px_-12px_rgb(0_0_0/0.45)]"
      >
        {items.map((it, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={it.image}
            src={it.image}
            alt=""
            draggable={false}
            className={cn(
              "absolute inset-0 size-full object-cover transition-[opacity,transform] duration-500 ease-out",
              active === i ? "scale-100 opacity-100" : "scale-110 opacity-0",
            )}
          />
        ))}
      </div>
    </div>
  );
}
