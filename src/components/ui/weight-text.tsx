"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Type whose weight swells under the pointer: letters near it turn heavy, the rest stay light.
 *
 * It needs a variable font with a weight axis, which the Geist sans in this kit has. Each letter's
 * box is locked to a fixed width, so the line never shifts as the weights change.
 */
export function WeightText({
  children,
  min = 200,
  max = 900,
  radius = 150,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** The text. Keep it a plain string. */
  children: string;
  /** Weight of letters far from the pointer. */
  min?: number;
  /** Weight of the letter right under it. */
  max?: number;
  /** How far the effect reaches, in px. */
  radius?: number;
}) {
  const root = React.useRef<HTMLSpanElement>(null);
  const live = React.useRef({ min, max, radius });

  React.useEffect(() => {
    live.current = { min, max, radius };
  }, [min, max, radius]);

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cells = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    const centres: { x: number; y: number }[] = [];
    const now = cells.map(() => live.current.min);
    const goal = cells.map(() => live.current.min);
    const pointer = { x: -9999, y: -9999, on: false };
    let raf = 0;
    let running = false;
    let last = 0;

    // Lock every letter's width to what it needs at a fairly heavy weight (a little tighter than the
    // heaviest, so the resting line is not gappy), then read where each one sits.
    const measure = () => {
      for (const c of cells) {
        c.style.width = "";
        c.style.fontWeight = String(
          Math.round(live.current.min + (live.current.max - live.current.min) * 0.55),
        );
      }
      const widths = cells.map((c) => c.getBoundingClientRect().width);
      cells.forEach((c, i) => {
        c.style.width = `${widths[i]}px`;
        c.style.fontWeight = String(Math.round(now[i]));
      });
      centres.length = 0;
      for (const c of cells) {
        const r = c.getBoundingClientRect();
        centres.push({
          x: r.left + r.width / 2 + window.scrollX,
          y: r.top + r.height / 2 + window.scrollY,
        });
      }
    };

    const paint = () => {
      for (let i = 0; i < cells.length; i++) cells[i].style.fontWeight = String(Math.round(now[i]));
    };
    const aim = () => {
      const { min: lo, max: hi, radius: R } = live.current;
      for (let i = 0; i < cells.length; i++) {
        const d = pointer.on
          ? Math.hypot(pointer.x - centres[i].x, pointer.y - centres[i].y)
          : Infinity;
        const t = Math.max(0, 1 - d / R);
        goal[i] = lo + (hi - lo) * t * t;
      }
    };
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const k = calm ? 1 : 1 - Math.exp(-dt * 14);
      let moving = false;
      for (let i = 0; i < cells.length; i++) {
        now[i] += (goal[i] - now[i]) * k;
        if (Math.abs(goal[i] - now[i]) > 0.6) moving = true;
        else now[i] = goal[i];
      }
      paint();
      if (moving) raf = requestAnimationFrame(tick);
      else running = false;
    };
    const wake = () => {
      aim();
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      pointer.x = e.clientX + window.scrollX;
      pointer.y = e.clientY + window.scrollY;
      pointer.on = true;
      wake();
    };
    const leave = () => {
      pointer.on = false;
      wake();
    };

    measure();
    paint();
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, [children]);

  return (
    <span
      role="img"
      aria-label={children}
      {...props}
      ref={root}
      className={cn("inline-flex whitespace-pre font-sans", className)}
    >
      {Array.from(children, (ch, i) => (
        <span
          key={i}
          data-w
          aria-hidden
          className="inline-block text-center"
          style={{ fontWeight: min }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
