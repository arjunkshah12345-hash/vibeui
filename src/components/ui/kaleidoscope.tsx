"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A drawing surface with mirrors: whatever you draw is repeated around the centre in several slices,
 * each reflected, so a scribble becomes a mandala.
 *
 * Draw with the pointer; strokes cycle through the colour wheel and slowly fade. Left alone it draws a
 * pattern of its own. Double-click to wipe it clean.
 */
export function Kaleidoscope({
  slices = 8,
  fade = 0.012,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Number of mirrored slices. Even numbers read best. */
  slices?: number;
  /** How quickly strokes fade, 0 to 1 per frame. 0 keeps them forever. */
  fade?: number;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const live = React.useRef({ slices, fade });

  React.useEffect(() => {
    live.current = { slices, fade };
  }, [slices, fade]);

  React.useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = 0;
    let raf = 0;
    let visible = true;
    let time = 0;
    let last = performance.now();
    let prev: { x: number; y: number } | null = null;
    let idleFor = 0;
    let hue = 20;
    const ptr = { x: 0, y: 0, down: false, inside: false };

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = el.clientWidth;
      cv.width = Math.round(size * dpr);
      cv.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      prev = null;
    };

    // Draw one stroke segment in every slice, and its mirror image in each.
    const stroke = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      const { slices: n } = live.current;
      const c = size / 2;
      ctx.strokeStyle = `hsl(${hue} 85% 62%)`;
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.shadowColor = `hsl(${hue} 90% 60% / 0.8)`;
      ctx.shadowBlur = 8;
      for (let i = 0; i < n; i++) {
        for (const flip of [1, -1]) {
          ctx.save();
          ctx.translate(c, c);
          ctx.rotate((i * Math.PI * 2) / n);
          ctx.scale(flip, 1);
          ctx.beginPath();
          ctx.moveTo(a.x - c, a.y - c);
          ctx.lineTo(b.x - c, b.y - c);
          ctx.stroke();
          ctx.restore();
        }
      }
    };

    const frame = (t: number) => {
      raf = 0;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      time += dt;
      const { fade: f } = live.current;
      if (f > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgb(0 0 0 / ${f})`;
        ctx.fillRect(0, 0, size, size);
        ctx.restore();
      }
      const active = ptr.inside && ptr.down;
      idleFor = active ? 0 : idleFor + dt;
      let pos: { x: number; y: number } | null = null;
      if (active) pos = { x: ptr.x, y: ptr.y };
      else if (idleFor > 1.2 && !ptr.inside) {
        // nobody is drawing: trace a slow looping figure
        const r = size * 0.36;
        pos = {
          x: size / 2 + Math.sin(time * 0.9) * r * Math.cos(time * 0.37),
          y: size / 2 + Math.cos(time * 1.1) * r * Math.sin(time * 0.43 + 1),
        };
      }
      if (pos) {
        hue = (hue + 90 * dt) % 360;
        if (prev) stroke(prev, pos);
        prev = pos;
      } else prev = null;
      if (visible && !calm) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const place = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = ((e.clientX - r.left) / r.width) * size;
      ptr.y = ((e.clientY - r.top) / r.height) * size;
    };
    const down = (e: PointerEvent) => {
      place(e);
      ptr.down = true;
      prev = null;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      place(e);
      ptr.inside = true;
    };
    const up = () => {
      ptr.down = false;
      prev = null;
    };
    const leave = () => {
      ptr.inside = false;
      ptr.down = false;
    };
    const wipe = () => ctx.clearRect(0, 0, size, size);

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("dblclick", wipe);
    start();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("dblclick", wipe);
    };
  }, []);

  return (
    <div
      role="img"
      aria-label="Kaleidoscope drawing surface"
      {...props}
      ref={box}
      className={cn(
        "relative aspect-square w-72 touch-none select-none overflow-hidden rounded-full bg-[#0b0a10] shadow-[inset_0_0_40px_rgb(0_0_0/0.6)] ring-1 ring-black/20",
        className,
      )}
      style={{ cursor: "crosshair", ...props.style }}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
    </div>
  );
}
