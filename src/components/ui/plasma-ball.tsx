"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Pt = [number, number];

// A jagged bolt: split the segment, push the middle sideways, and repeat on each half.
function bolt(a: Pt, b: Pt, spread: number, depth: number, out: Pt[]) {
  if (depth === 0) {
    out.push(b);
    return;
  }
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const nx = -(b[1] - a[1]);
  const ny = b[0] - a[0];
  const len = Math.hypot(nx, ny) || 1;
  const k = (Math.random() - 0.5) * spread;
  const m: Pt = [mx + (nx / len) * k, my + (ny / len) * k];
  bolt(a, m, spread / 2, depth - 1, out);
  bolt(m, b, spread / 2, depth - 1, out);
}

/**
 * A plasma globe: filaments crackle from a bright core out to the glass, and bend toward your finger.
 *
 * Move the pointer over it and the bolts reach for that spot; leave it alone and they wander. Press and
 * hold for a storm. Set the size with width classes; it stays round.
 */
export function PlasmaBall({
  color = "#b06bff",
  bolts = 6,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Colour of the glow. The core of each bolt is white. */
  color?: string;
  /** How many filaments are alive at once. */
  bolts?: number;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const live = React.useRef({ color, bolts });

  React.useEffect(() => {
    live.current = { color, bolts };
  }, [color, bolts]);

  React.useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = 0;
    let raf = 0;
    let visible = true;
    let stormy = false;
    const aim: { a: number; on: boolean } = { a: 0, on: false };
    const arms = Array.from({ length: 12 }, () => ({
      a: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.9,
      born: 0,
    }));

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = el.clientWidth;
      cv.width = Math.round(size * dpr);
      cv.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (t: number) => {
      raf = 0;
      const { color: tint, bolts: n } = live.current;
      const c = size / 2;
      const R = c * 0.9;
      ctx.clearRect(0, 0, size, size);

      // the glass: a dark sphere with a soft rim light
      const glass = ctx.createRadialGradient(c - R * 0.3, c - R * 0.35, R * 0.1, c, c, R);
      glass.addColorStop(0, "rgb(34 24 52)");
      glass.addColorStop(1, "rgb(8 6 14)");
      ctx.fillStyle = glass;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.globalCompositeOperation = "lighter";

      // an ambient glow around the core
      const halo = ctx.createRadialGradient(c, c, 0, c, c, R * 0.55);
      halo.addColorStop(0, `${tint}88`);
      halo.addColorStop(1, `${tint}00`);
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, size, size);

      const count = Math.min(arms.length, stormy ? n * 2 : n);
      for (let i = 0; i < count; i++) {
        const arm = arms[i];
        // an arm lives for a short while, then is reborn somewhere else
        if (t - arm.born > 140 + (i % 3) * 90) {
          arm.born = t;
          arm.a =
            aim.on && i % 2 === 0
              ? aim.a + (Math.random() - 0.5) * 0.35
              : arm.a + arm.drift * (0.4 + Math.random());
        }
        const end: Pt = [c + Math.cos(arm.a) * R * 0.97, c + Math.sin(arm.a) * R * 0.97];
        const pts: Pt[] = [[c, c]];
        bolt([c, c], end, R * 0.55, 5, pts);
        for (const [w, alpha, col] of [
          [7, 0.1, tint],
          [3, 0.35, tint],
          [1.2, 1, "#ffffff"],
        ] as const) {
          ctx.strokeStyle = col;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = w;
          ctx.lineJoin = "round";
          ctx.beginPath();
          pts.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
          ctx.stroke();
        }
        // a glow where the filament touches the glass
        ctx.globalAlpha = 0.5;
        const touch = ctx.createRadialGradient(end[0], end[1], 0, end[0], end[1], R * 0.14);
        touch.addColorStop(0, tint);
        touch.addColorStop(1, `${tint}00`);
        ctx.fillStyle = touch;
        ctx.fillRect(end[0] - R * 0.14, end[1] - R * 0.14, R * 0.28, R * 0.28);
      }
      ctx.restore();

      // the core, drawn last so it sits on top
      ctx.globalAlpha = 1;
      const core = ctx.createRadialGradient(c, c, 0, c, c, R * 0.13);
      core.addColorStop(0, "#fff");
      core.addColorStop(0.4, `${tint}`);
      core.addColorStop(1, `${tint}00`);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(c, c, R * 0.13, 0, Math.PI * 2);
      ctx.fill();

      // a highlight on the glass
      const shine = ctx.createLinearGradient(c - R, c - R, c, c);
      shine.addColorStop(0, "rgb(255 255 255 / 0.18)");
      shine.addColorStop(1, "rgb(255 255 255 / 0)");
      ctx.fillStyle = shine;
      ctx.beginPath();
      ctx.ellipse(c - R * 0.32, c - R * 0.42, R * 0.34, R * 0.2, -0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgb(255 255 255 / 0.14)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.stroke();

      if (visible && !calm) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      aim.a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
      aim.on = true;
    };
    const leave = () => {
      aim.on = false;
      stormy = false;
    };
    const down = () => {
      stormy = true;
    };
    const up = () => {
      stormy = false;
    };

    fit();
    const ro = new ResizeObserver(() => {
      fit();
      if (calm) start();
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
    <div
      role="img"
      aria-label="Plasma globe"
      {...props}
      ref={box}
      className={cn("relative aspect-square w-64 touch-none select-none", className)}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
      {/* the base the globe sits on */}
      <span
        aria-hidden
        className="absolute inset-x-[30%] -bottom-1 h-[7%] rounded-b-full bg-gradient-to-b from-[#2a2733] to-[#0d0c11]"
      />
    </div>
  );
}
