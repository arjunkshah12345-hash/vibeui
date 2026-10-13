"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Drop = { x: number; y: number; r: number; life: number; vx: number; vy: number };

/**
 * A surface that holds ink: move across it and the pointer leaves a blobby trail that merges, wobbles and
 * slowly dries away.
 *
 * Drops are drawn on a canvas and fused with an SVG gooey filter, so touching drops join into one shape
 * instead of overlapping. Press to splat a larger blot. Content you place inside sits above the ink.
 */
export function InkTrail({
  color = "var(--ink)",
  size = 26,
  fade = 1800,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** Colour of the ink. Any CSS colour, including a variable. */
  color?: string;
  /** Radius of a fresh drop, in px. */
  size?: number;
  /** How long a drop takes to dry away, in ms. */
  fade?: number;
}) {
  const id = React.useId();
  const box = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const live = React.useRef({ color, size, fade });

  React.useEffect(() => {
    live.current = { color, size, fade };
  }, [color, size, fade]);

  React.useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const drops: Drop[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let prev: { x: number; y: number } | null = null;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (t: number) => {
      raf = 0;
      const dt = Math.min(t - last, 50);
      last = t;
      const { color: ink, fade: dry } = live.current;
      // Resolve the colour once per frame, so CSS variables work on the canvas.
      ctx.fillStyle = ink;
      ctx.clearRect(0, 0, w, h);
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.life -= dt / dry;
        if (d.life <= 0) {
          drops.splice(i, 1);
          continue;
        }
        d.x += d.vx * dt * 0.02;
        d.y += d.vy * dt * 0.02;
        d.vx *= 0.96;
        d.vy *= 0.96;
        // a drop swells for an instant, then shrinks as it dries
        const grow = d.life > 0.9 ? 1 + (1 - d.life) * 2 : d.life / 0.9;
        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.max(0.5, d.r * grow), 0, Math.PI * 2);
        ctx.fill();
      }
      if (drops.length) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const deposit = (x: number, y: number, scale = 1) => {
      const { size: s } = live.current;
      drops.push({
        x,
        y,
        r: s * (0.55 + Math.random() * 0.5) * scale,
        life: 1,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
      if (drops.length > 260) drops.shift();
    };
    const move = (e: PointerEvent) => {
      if (calm) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (prev) {
        // fill the gap between events so a fast swipe leaves a continuous line
        const dist = Math.hypot(x - prev.x, y - prev.y);
        const steps = Math.min(24, Math.ceil(dist / (live.current.size * 0.6)));
        for (let i = 1; i <= steps; i++) {
          deposit(prev.x + ((x - prev.x) * i) / steps, prev.y + ((y - prev.y) * i) / steps);
        }
      } else deposit(x, y);
      prev = { x, y };
      wake();
    };
    const leave = () => {
      prev = null;
    };
    const down = (e: PointerEvent) => {
      if (calm) return;
      const r = el.getBoundingClientRect();
      for (let i = 0; i < 9; i++) {
        deposit(
          e.clientX - r.left + (Math.random() - 0.5) * 30,
          e.clientY - r.top + (Math.random() - 0.5) * 30,
          1.5,
        );
      }
      wake();
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
    };
  }, []);

  return (
    <div {...props} ref={box} className={cn("relative overflow-hidden", className)}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id={`${id}-goo`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" />
            <feColorMatrix
              in="b"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
            />
          </filter>
        </defs>
      </svg>
      <canvas
        ref={canvas}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
        style={{ filter: `url(#${id}-goo)` }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
