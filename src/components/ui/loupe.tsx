"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A magnifying glass that follows the pointer and enlarges whatever is under it: images, type, whole interfaces.
 *
 * The lens is a second copy of the content, scaled up and moved so the point under the glass stays put.
 * It eases after the pointer, pops in and out, and on touch it floats above your finger.
 */
export function Loupe({
  children,
  zoom = 2.4,
  size = 168,
  className,
  lensClassName,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The content to magnify. */
  children: React.ReactNode;
  /** Magnification. */
  zoom?: number;
  /** Diameter of the lens, in px. */
  size?: number;
  /** Extra classes for the lens ring. */
  lensClassName?: string;
}) {
  const host = React.useRef<HTMLDivElement>(null);
  const lens = React.useRef<HTMLDivElement>(null);
  const inner = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState<{ w: number; h: number } | null>(null);
  const live = React.useRef({ zoom, size });

  React.useEffect(() => {
    live.current = { zoom, size };
  }, [zoom, size]);

  // The copy inside the lens needs the same width as the original so text wraps identically.
  React.useEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const el = host.current;
    const ring = lens.current;
    const copy = inner.current;
    if (!el || !ring || !copy) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let shown = 0; // 0 hidden, 1 fully open
    let want = 0;
    let lift = 0;
    let raf = 0;
    let running = false;
    let last = 0;

    const place = () => {
      const { zoom: z, size: s } = live.current;
      const cy = pos.y - lift * s * 0.8;
      ring.style.transform = `translate3d(${pos.x - s / 2}px, ${cy - s / 2}px, 0) scale(${0.4 + 0.6 * shown})`;
      ring.style.opacity = String(Math.min(1, shown * 1.6));
      // Shift the enlarged copy so the point under the lens centre sits at the lens centre.
      copy.style.transform = `translate3d(${s / 2 - pos.x * z}px, ${s / 2 - pos.y * z}px, 0) scale(${z})`;
    };
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const k = 1 - Math.exp(-dt * 22);
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      shown += (want - shown) * (1 - Math.exp(-dt * 16));
      place();
      const done =
        Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) < 0.2 &&
        Math.abs(want - shown) < 0.01;
      if (done) {
        shown = want;
        place();
        running = false;
      } else raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (calm) {
        pos.x = target.x;
        pos.y = target.y;
        shown = want;
        place();
        return;
      }
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const aim = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const k = el.offsetWidth / (r.width || 1);
      target.x = (e.clientX - r.left) * k;
      target.y = (e.clientY - r.top) * k;
      lift = e.pointerType === "touch" ? 1 : 0;
    };
    const enter = (e: PointerEvent) => {
      aim(e);
      if (shown < 0.05) {
        pos.x = target.x;
        pos.y = target.y;
      }
      want = 1;
      kick();
    };
    const move = (e: PointerEvent) => {
      aim(e);
      want = 1;
      kick();
    };
    const up = (e: PointerEvent) => {
      if (e.pointerType === "touch") leave();
    };
    const leave = () => {
      want = 0;
      kick();
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointercancel", leave);
    el.addEventListener("pointerup", up);
    place();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointercancel", leave);
      el.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div {...props} ref={host} className={cn("relative cursor-none overflow-hidden", className)}>
      {children}
      {/* the glass: hidden until the pointer arrives, and invisible to input and assistive tech */}
      <div
        ref={lens}
        aria-hidden
        inert
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-20 overflow-hidden rounded-full bg-surface opacity-0 shadow-[0_18px_40px_-8px_rgb(0_0_0/0.45),0_0_0_1px_rgb(0_0_0/0.18),0_0_0_5px_rgb(255_255_255/0.55),0_0_0_6px_rgb(0_0_0/0.12)] will-change-transform",
          lensClassName,
        )}
        style={{ width: size, height: size }}
      >
        <div
          ref={inner}
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={box ? { width: box.w, height: box.h } : undefined}
        >
          {children}
        </div>
        {/* glass: a bright rim, a soft highlight, a touch of shade at the far edge */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgb(255_255_255/0.5),transparent_38%),radial-gradient(circle,transparent_62%,rgb(0_0_0/0.16))] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.6),inset_0_0_14px_rgb(0_0_0/0.14)]" />
      </div>
    </div>
  );
}
