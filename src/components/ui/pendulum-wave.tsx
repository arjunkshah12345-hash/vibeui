"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A row of pendulums, each a hair faster than the last, that drift in and out of step to trace waves,
 * spirals and scattered chaos, then snap back into line.
 *
 * The cycle is exact: every pendulum has completed a whole number of swings when it repeats. Hold the
 * pointer down to run time faster, or click to restart the pattern.
 */
export function PendulumWave({
  count = 15,
  period = 40,
  swings = 28,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Number of pendulums. */
  count?: number;
  /** Seconds for the whole pattern to repeat. */
  period?: number;
  /** Swings the slowest pendulum makes in one period. Each one after makes one more. */
  swings?: number;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const live = React.useRef({ count, period, swings });

  React.useEffect(() => {
    live.current = { count, period, swings };
  }, [count, period, swings]);

  React.useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let time = 0;
    let rate = 1;
    let fast = false;
    let last = performance.now();

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const { count: n, period: T, swings: s0 } = live.current;
      ctx.clearRect(0, 0, w, h);
      const bob = Math.max(6, Math.min(w * 0.016, 14));
      const reach = Math.min(h * 0.16, w * 0.055);
      // leave room at both ends for the widest swing, so no bob is ever clipped
      const padX = reach + bob + 14;
      const gap = (w - padX * 2) / Math.max(1, n - 1);
      const top = h * 0.1;

      // the beam they hang from
      ctx.fillStyle = "rgb(120 110 100 / 0.5)";
      ctx.beginPath();
      ctx.roundRect(padX - 14, top - 7, w - padX * 2 + 28, 7, 3.5);
      ctx.fill();

      for (let i = 0; i < n; i++) {
        const x = padX + gap * i;
        // The freer ones hang longer: length follows the period, so the picture reads as physics.
        const swings = s0 + i;
        const len = h * 0.74 * (s0 / swings) ** 2;
        const phase = Math.cos((2 * Math.PI * swings * time) / T);
        const theta = phase * (reach / len);
        const bx = x + Math.sin(theta) * len;
        const by = top + Math.cos(theta) * len;
        const hue = 18 + (i / Math.max(1, n - 1)) * 300;
        ctx.strokeStyle = "rgb(120 110 100 / 0.55)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(bx, by);
        ctx.stroke();
        const g = ctx.createRadialGradient(bx - bob * 0.3, by - bob * 0.3, 1, bx, by, bob);
        g.addColorStop(0, `hsl(${hue} 90% 78%)`);
        g.addColorStop(1, `hsl(${hue} 75% 48%)`);
        ctx.fillStyle = g;
        ctx.shadowColor = `hsl(${hue} 80% 50% / 0.45)`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(bx, by, bob, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const frame = (t: number) => {
      raf = 0;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      rate += ((fast ? 6 : 1) - rate) * (1 - Math.exp(-dt * 4));
      time += dt * rate;
      draw();
      if (visible && !calm) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const down = () => {
      fast = true;
    };
    const up = () => {
      fast = false;
    };
    const click = () => {
      time = 0;
    };

    fit();
    // Reduced motion: hold a single frame partway through the cycle, where the wave is clearest.
    if (calm) time = live.current.period * 0.12;
    const ro = new ResizeObserver(() => {
      fit();
      if (calm) draw();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    el.addEventListener("dblclick", click);
    start();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("dblclick", click);
    };
  }, []);

  return (
    <div
      role="img"
      aria-label="Pendulum wave"
      {...props}
      ref={box}
      className={cn("relative h-72 w-full select-none", className)}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
    </div>
  );
}
