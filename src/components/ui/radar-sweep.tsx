"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type RadarBlip = {
  label: string;
  /** Bearing in degrees, 0 at the top, clockwise. */
  angle: number;
  /** Distance from the centre, 0 to 1. */
  distance: number;
};

/**
 * A radar screen: a beam sweeps round, and each contact lights up as it passes, then fades until the
 * next sweep.
 *
 * Point at a contact to read its label. The rings, the beam and the contacts are all drawn on a canvas,
 * so hundreds of contacts stay smooth.
 */
export function RadarSweep({
  blips,
  color = "#4dff9d",
  speed = 0.22,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  blips: RadarBlip[];
  /** Colour of the screen, as a 6-digit hex such as `#4dff9d`. */
  color?: string;
  /** Turns per second. */
  speed?: number;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const tip = React.useRef<HTMLDivElement>(null);
  const live = React.useRef({ blips, color, speed });

  React.useEffect(() => {
    live.current = { blips, color, speed };
  }, [blips, color, speed]);

  React.useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    const label = tip.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx || !label) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = 0;
    let raf = 0;
    let visible = true;
    let sweep = -Math.PI / 2;
    let last = performance.now();
    const ptr = { x: -1, y: -1 };

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = el.clientWidth;
      cv.width = Math.round(size * dpr);
      cv.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const norm = (a: number) => ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    const draw = (dt: number) => {
      const { blips: list, color: tint, speed: rps } = live.current;
      const c = size / 2;
      const R = c * 0.94;
      sweep = norm(sweep + dt * rps * Math.PI * 2);
      ctx.clearRect(0, 0, size, size);

      // the screen
      const bg = ctx.createRadialGradient(c, c, 0, c, c, R);
      bg.addColorStop(0, `${tint}22`);
      bg.addColorStop(1, `${tint}08`);
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `${tint}55`;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(c, c, (R * i) / 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        ctx.moveTo(c, c);
        ctx.lineTo(c + Math.cos(a) * R, c + Math.sin(a) * R);
      }
      ctx.stroke();

      // the beam: a wedge that is bright at its leading edge and fades behind it
      const trailArc = Math.PI * 0.55;
      const steps = 36;
      for (let i = 0; i < steps; i++) {
        const a0 = sweep - (trailArc * (i + 1)) / steps;
        const a1 = sweep - (trailArc * i) / steps;
        ctx.fillStyle = `${tint}${Math.round((1 - i / steps) ** 2 * 80)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.arc(c, c, R, a0, a1);
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = tint;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.lineTo(c + Math.cos(sweep) * R, c + Math.sin(sweep) * R);
      ctx.stroke();

      // contacts: bright when the beam has just passed, fading until it comes round again
      let hover = -1;
      list.forEach((b, i) => {
        const a = norm((b.angle * Math.PI) / 180 - Math.PI / 2);
        const x = c + Math.cos(a) * R * b.distance;
        const y = c + Math.sin(a) * R * b.distance;
        const since = norm(sweep - a) / (Math.PI * 2);
        const glow = calm ? 0.8 : Math.max(0.06, 1 - since * 1.15);
        ctx.fillStyle = tint;
        ctx.globalAlpha = glow;
        ctx.shadowColor = tint;
        ctx.shadowBlur = 12 * glow;
        ctx.beginPath();
        ctx.arc(x, y, 3.5 + glow * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        if (Math.hypot(ptr.x - x, ptr.y - y) < 14) hover = i;
      });

      if (hover >= 0) {
        const b = list[hover];
        const a = norm((b.angle * Math.PI) / 180 - Math.PI / 2);
        label.textContent = b.label;
        label.style.opacity = "1";
        label.style.transform = `translate(${c + Math.cos(a) * R * b.distance}px, ${
          c + Math.sin(a) * R * b.distance - 16
        }px) translate(-50%, -100%)`;
      } else label.style.opacity = "0";
    };

    const frame = (t: number) => {
      raf = 0;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      draw(dt);
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
      ptr.x = ((e.clientX - r.left) / r.width) * size;
      ptr.y = ((e.clientY - r.top) / r.height) * size;
      if (calm) draw(0);
    };
    const leave = () => {
      ptr.x = -1;
      ptr.y = -1;
    };

    fit();
    const ro = new ResizeObserver(() => {
      fit();
      if (calm) draw(0);
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    start();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      role="img"
      aria-label={`Radar showing ${blips.length} contacts`}
      {...props}
      ref={box}
      className={cn("relative aspect-square w-72 select-none", className)}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
      <div
        ref={tip}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 font-mono text-[11px] text-white opacity-0 transition-opacity duration-150"
      />
    </div>
  );
}
