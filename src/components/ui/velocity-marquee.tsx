"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * A ticker that responds to you: scroll the page and it speeds up, reverses and leans into the motion.
 *
 * You can also grab it and fling it. Without any input it drifts at a steady pace.
 */
export function VelocityMarquee({
  children,
  speed = 70,
  direction = 1,
  skew = 10,
  gap = 40,
  pauseOnHover = false,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The items to run. They repeat to fill the width. */
  children: React.ReactNode;
  /** Resting speed in px per second. */
  speed?: number;
  /** `1` runs left, `-1` runs right. */
  direction?: 1 | -1;
  /** The most the text can lean, in degrees, when it is moving fast. 0 turns it off. */
  skew?: number;
  /** Space between items, in px. */
  gap?: number;
  /** Stop while the pointer is over it. */
  pauseOnHover?: boolean;
}) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const track = React.useRef<HTMLDivElement>(null);
  const group = React.useRef<HTMLDivElement>(null);
  const [copies, setCopies] = React.useState(3);
  const live = React.useRef({ speed, direction, skew, pauseOnHover });

  React.useEffect(() => {
    live.current = { speed, direction, skew, pauseOnHover };
  }, [speed, direction, skew, pauseOnHover]);

  // Enough copies that the row never runs out, however wide the container is.
  React.useEffect(() => {
    const host = wrap.current;
    const g = group.current;
    if (!host || !g) return;
    const fit = () => {
      const w = g.offsetWidth || 1;
      setCopies(clamp(Math.ceil(host.offsetWidth / w) + 1, 2, 10));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    ro.observe(g);
    return () => ro.disconnect();
  }, [children, gap]);

  React.useEffect(() => {
    const host = wrap.current;
    const el = track.current;
    const g = group.current;
    if (!host || !el || !g) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let offset = 0;
    let scrollVel = 0; // smoothed, px/s, positive when the page scrolls down
    let scrollGoal = 0;
    let flip = 1; // follows the scroll direction, easing between 1 and -1
    let skewNow = 0;
    let fling = 0; // velocity from dragging, px/s
    let hover = false;
    let raf = 0;
    let last = performance.now();
    let lastY = window.scrollY;
    let lastScrollAt = performance.now();
    let running = false;
    let visible = true;
    let down = false;
    const drag = { on: false, x: 0, t: 0, scale: 1 };

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - lastScrollAt, 1) / 1000;
      scrollGoal = (window.scrollY - lastY) / dt;
      lastY = window.scrollY;
      lastScrollAt = now;
    };

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const cfg = live.current;
      const width = g.offsetWidth || 1;

      // Scroll speed is a gust: it builds when you scroll and dies away when you stop.
      scrollVel += (scrollGoal - scrollVel) * (1 - Math.exp(-dt * 9));
      scrollGoal *= Math.exp(-dt * 7);
      flip += ((scrollVel < -40 ? -1 : 1) - flip) * (1 - Math.exp(-dt * 6));

      let v = 0;
      if (!drag.on) {
        const paused = cfg.pauseOnHover && hover;
        const boost = 1 + clamp(Math.abs(scrollVel) * 0.0045, 0, 7);
        v = paused ? 0 : cfg.direction * flip * cfg.speed * boost;
        fling *= Math.exp(-dt * 3.2);
        v += fling;
      }
      offset += v * dt;
      offset = ((offset % width) + width) % width;

      const lean = clamp(((scrollVel + fling * 0.6) / 60) * 0.5, -1, 1) * cfg.skew;
      skewNow += (lean - skewNow) * (1 - Math.exp(-dt * 10));
      el.style.transform = `translate3d(${-offset}px,0,0) skewX(${(-skewNow * cfg.direction).toFixed(2)}deg)`;
      raf = running ? requestAnimationFrame(tick) : 0;
    };
    const run = () => {
      if (running || calm) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const halt = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || calm) return;
      const r = host.getBoundingClientRect();
      drag.on = false;
      drag.x = e.clientX;
      drag.t = performance.now();
      drag.scale = host.offsetWidth / (r.width || 1);
      fling = 0;
      down = true;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = (e.clientX - drag.x) * drag.scale;
      if (!drag.on) {
        if (Math.abs(dx) < 4) return;
        drag.on = true;
        host.setPointerCapture(e.pointerId);
      }
      const now = performance.now();
      const dts = Math.max((now - drag.t) / 1000, 0.001);
      offset -= dx;
      // What you throw becomes the speed it carries after you let go.
      fling = clamp(dx / dts, -2400, 2400);
      drag.x = e.clientX;
      drag.t = now;
    };
    const onUp = () => {
      down = false;
      drag.on = false;
    };
    const onEnter = () => {
      hover = true;
    };
    const onLeave = () => {
      hover = false;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) run();
      else halt();
    });
    io.observe(host);
    const onVisibility = () => {
      if (document.hidden) halt();
      else if (visible) run();
    };
    document.addEventListener("visibilitychange", onVisibility);
    run();

    return () => {
      halt();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      {...props}
      ref={wrap}
      className={cn(
        "relative w-full cursor-grab touch-pan-y select-none overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] active:cursor-grabbing",
        className,
      )}
    >
      <div ref={track} className="flex w-max will-change-transform">
        {Array.from({ length: copies }, (_, i) => (
          <div
            key={i}
            ref={i === 0 ? group : undefined}
            aria-hidden={i > 0 || undefined}
            className="flex shrink-0 items-center"
            style={{ gap, paddingRight: gap }}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
