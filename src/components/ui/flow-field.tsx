"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const PALETTE = ["#f2d49b", "#e9a25b", "#d4673f", "#a8405a", "#5b4a8f", "#3f7f93"];

// A smooth, cheap stand-in for noise: a few sines at unrelated frequencies.
const angleAt = (x: number, y: number, t: number) =>
  (Math.sin(x * 0.0042 + t * 0.21) +
    Math.cos(y * 0.0051 - t * 0.17) +
    Math.sin((x + y) * 0.0027 + t * 0.12)) *
  Math.PI;

/**
 * Thousands of tiny particles riding an invisible wind, leaving long soft trails that curl into ribbons.
 *
 * The pointer stirs the wind into a whirl; press to blow outward. It draws on a transparent canvas, so it
 * sits on any background, and pauses when it scrolls out of view.
 */
export function FlowField({
  count = 1400,
  palette = PALETTE,
  trail = 0.05,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** Particles in flight. */
  count?: number;
  /** Colours the particles are drawn in. */
  palette?: string[];
  /** How quickly trails fade, 0 to 1. Smaller leaves longer ribbons. */
  trail?: number;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const live = React.useRef({ count, palette, trail });

  React.useEffect(() => {
    live.current = { count, palette, trail };
  }, [count, palette, trail]);

  React.useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    type P = { x: number; y: number; px: number; py: number; c: number; age: number };
    const ps: P[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let time = 0;
    let last = performance.now();
    const ptr = { x: 0, y: 0, on: false, blow: false };

    const born = (): P => {
      const x = Math.random() * w;
      const y = Math.random() * h;
      return { x, y, px: x, py: y, c: Math.floor(Math.random() * 8), age: Math.random() * 200 };
    };
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ps.length = 0;
    };

    const frame = (t: number) => {
      raf = 0;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      time += dt;
      const { count: n, palette: cols, trail: fadeBy } = live.current;
      while (ps.length < n) ps.push(born());
      ps.length = Math.min(ps.length, n);

      // fade what is already there, rather than clearing, so the trails build up
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgb(0 0 0 / ${fadeBy})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 1.1;
      ctx.lineCap = "round";

      const byColour = new Map<number, P[]>();
      for (const p of ps) {
        p.px = p.x;
        p.py = p.y;
        let a = angleAt(p.x, p.y, time);
        if (ptr.on) {
          const dx = p.x - ptr.x;
          const dy = p.y - ptr.y;
          const d = Math.hypot(dx, dy);
          if (d < 220) {
            // blend toward a whirl (or an outward push) around the pointer
            const k = 1 - d / 220;
            const target = Math.atan2(dy, dx) + (ptr.blow ? 0 : Math.PI / 2);
            const diff = Math.atan2(Math.sin(target - a), Math.cos(target - a));
            a += diff * k * 0.9;
          }
        }
        p.x += Math.cos(a) * 70 * dt;
        p.y += Math.sin(a) * 70 * dt;
        p.age += 1;
        if (p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5 || p.age > 520) {
          Object.assign(p, born(), { age: 0 });
          p.px = p.x;
          p.py = p.y;
          continue;
        }
        const arr = byColour.get(p.c % cols.length) ?? [];
        arr.push(p);
        byColour.set(p.c % cols.length, arr);
      }
      // one path per colour keeps this fast with many particles
      for (const [c, arr] of byColour) {
        ctx.strokeStyle = cols[c];
        ctx.beginPath();
        for (const p of arr) {
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      if (visible && !calm) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.on = true;
    };
    const leave = () => {
      ptr.on = false;
      ptr.blow = false;
    };
    const down = () => {
      ptr.blow = true;
    };
    const up = () => {
      ptr.blow = false;
    };

    fit();
    const ro = new ResizeObserver(() => {
      fit();
      if (calm) {
        for (let i = 0; i < 40; i++) frame(performance.now() + i * 16);
      }
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    start();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div {...props} ref={box} className={cn("relative overflow-hidden", className)}>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
      <div className="pointer-events-none relative">{children}</div>
    </div>
  );
}
