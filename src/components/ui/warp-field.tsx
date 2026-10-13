"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Star = { x: number; y: number; z: number; pz: number };

/**
 * A starfield you fly through: stars stream out of a vanishing point that follows your pointer, and
 * stretch into streaks as you speed up.
 *
 * Hold the pointer down to punch it to warp. Place content inside and it floats over the stars.
 */
export function WarpField({
  stars = 420,
  speed = 0.35,
  color = "#ffffff",
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** How many stars are in flight. */
  stars?: number;
  /** Cruising speed. Warp is several times this. */
  speed?: number;
  /** Colour of the stars. */
  color?: string;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const live = React.useRef({ stars, speed, color });

  React.useEffect(() => {
    live.current = { stars, speed, color };
  }, [stars, speed, color]);

  React.useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const field: Star[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let boost = 1;
    let warp = false;
    const eye = { x: 0, y: 0, tx: 0, ty: 0 };

    const spawn = (first: boolean): Star => {
      const z = first ? Math.random() : 1;
      return { x: (Math.random() - 0.5) * 2.4, y: (Math.random() - 0.5) * 2.4, z, pz: z };
    };

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
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const { stars: n, speed: base, color: tint } = live.current;
      while (field.length < n) field.push(spawn(true));
      field.length = Math.min(field.length, n);

      boost += ((warp ? 7 : 1) - boost) * (1 - Math.exp(-dt * (warp ? 3 : 2)));
      eye.x += (eye.tx - eye.x) * (1 - Math.exp(-dt * 4));
      eye.y += (eye.ty - eye.y) * (1 - Math.exp(-dt * 4));
      const cx = w / 2 + eye.x * w * 0.3;
      const cy = h / 2 + eye.y * h * 0.3;
      const focal = Math.max(w, h) * 0.55;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = tint;
      ctx.lineCap = "round";
      for (const s of field) {
        s.pz = s.z;
        s.z -= dt * base * boost * (calm ? 0 : 1);
        if (s.z <= 0.02) {
          Object.assign(s, spawn(false));
          continue;
        }
        const x = cx + (s.x / s.z) * focal * 0.5;
        const y = cy + (s.y / s.z) * focal * 0.5;
        const px = cx + (s.x / s.pz) * focal * 0.5;
        const py = cy + (s.y / s.pz) * focal * 0.5;
        if (x < -40 || x > w + 40 || y < -40 || y > h + 40) {
          Object.assign(s, spawn(false));
          continue;
        }
        const near = 1 - s.z;
        ctx.globalAlpha = Math.min(1, near * 1.6);
        ctx.lineWidth = 0.4 + near * 2.2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
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
      eye.tx = ((e.clientX - r.left) / r.width - 0.5) * -1;
      eye.ty = ((e.clientY - r.top) / r.height - 0.5) * -1;
    };
    const leave = () => {
      eye.tx = 0;
      eye.ty = 0;
      warp = false;
    };
    const down = () => {
      warp = true;
    };
    const up = () => {
      warp = false;
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
      {...props}
      ref={box}
      className={cn("relative overflow-hidden bg-[#06060a] text-white", className)}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
      <div className="relative">{children}</div>
    </div>
  );
}
