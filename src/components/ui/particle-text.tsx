"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const QUERY = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return React.useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * Text made of thousands of particles that scatter away from your cursor, spring back, and burst when you click.
 *
 * It takes the font, weight and colour of the element it sits in, and fits the text to the width.
 */
export function ParticleText({
  text,
  fontSize,
  gap = 2.6,
  radius = 90,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The words to draw. */
  text: string;
  /** Font size in px. By default the text is sized to fill the width. */
  fontSize?: number;
  /** Space between particles in px. Smaller is denser and heavier to draw. */
  gap?: number;
  /** How far from the pointer particles are pushed away, in px. */
  radius?: number;
}) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const live = React.useRef({ text, fontSize, gap, radius });

  React.useEffect(() => {
    live.current = { text, fontSize, gap, radius };
  }, [text, fontSize, gap, radius]);

  React.useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!host || !cv || !ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    // x, y, vx, vy, home x, home y, per particle
    let P = new Float32Array(0);
    let n = 0;
    const ptr = { x: -9999, y: -9999, down: false };
    let ink = "#1b1a17";
    let accent = "#1b1a17";
    let raf = 0;
    let last = performance.now();
    let running = false;
    let visible = true;
    let built = false;

    const build = () => {
      const cfg = live.current;
      w = host.offsetWidth;
      h = host.offsetHeight;
      if (w < 4 || h < 4) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const cs = getComputedStyle(host);
      ink = cs.color || ink;
      accent = cs.getPropertyValue("--accent").trim() || ink;
      const family = cs.fontFamily;
      const weight = cs.fontWeight;

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      o.font = `${weight} 100px ${family}`;
      const tw = o.measureText(cfg.text).width || 1;
      const size = cfg.fontSize ?? Math.min(h * 0.82, (w * 0.92 * 100) / tw);
      o.font = `${weight} ${size}px ${family}`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillStyle = "#000";
      o.fillText(cfg.text, w / 2, h / 2 + size * 0.04);
      const img = o.getImageData(0, 0, w, h).data;

      const pitch = Math.max(cfg.gap, 1.5);
      const pts: number[] = [];
      for (let y = 0; y < h; y += pitch) {
        for (let x = 0; x < w; x += pitch) {
          if (img[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 140) {
            // Start scattered, so the first thing you see is the text assembling.
            const a = Math.random() * Math.PI * 2;
            const d = (0.4 + Math.random()) * Math.max(w, h) * 0.55;
            const sx = reduce ? x : w / 2 + Math.cos(a) * d;
            const sy = reduce ? y : h / 2 + Math.sin(a) * d;
            // A touch of jitter breaks the sampling grid, so it reads as particles and not a dot matrix.
            const jx = x + (Math.random() - 0.5) * pitch * 0.7;
            const jy = y + (Math.random() - 0.5) * pitch * 0.7;
            pts.push(sx, sy, 0, 0, jx, jy);
          }
        }
      }
      P = new Float32Array(pts);
      n = P.length / 6;
      built = true;
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const s = Math.max(live.current.gap * 0.62, 1.4);
      // Calm particles in the text colour, fast ones in the accent, in two batches.
      ctx.fillStyle = ink;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const j = i * 6;
        if (Math.abs(P[j + 2]) + Math.abs(P[j + 3]) <= 55)
          ctx.rect(P[j] - s / 2, P[j + 1] - s / 2, s, s);
      }
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const j = i * 6;
        if (Math.abs(P[j + 2]) + Math.abs(P[j + 3]) > 55)
          ctx.rect(P[j] - s / 2, P[j + 1] - s / 2, s, s);
      }
      ctx.fill();
    };

    const step = (dt: number) => {
      const R = live.current.radius;
      const R2 = R * R;
      const damp = Math.exp(-dt * 10);
      for (let i = 0; i < n; i++) {
        const j = i * 6;
        let vx = P[j + 2];
        let vy = P[j + 3];
        const dx = P[j] - ptr.x;
        const dy = P[j + 1] - ptr.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) ** 2 * 5200 * dt;
          vx += (dx / d) * f;
          vy += (dy / d) * f;
        }
        // A spring back to the home position.
        vx += (P[j + 4] - P[j]) * 85 * dt;
        vy += (P[j + 5] - P[j + 1]) * 85 * dt;
        vx *= damp;
        vy *= damp;
        P[j + 2] = vx;
        P[j + 3] = vy;
        P[j] += vx * dt;
        P[j + 1] += vy * dt;
      }
    };

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.033);
      last = t;
      step(dt);
      draw();
      raf = running ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (running || reduce || !built) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const toLocal = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const k = host.offsetWidth / (r.width || 1);
      return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      ptr.x = p.x;
      ptr.y = p.y;
    };
    const onLeave = () => {
      ptr.x = -9999;
      ptr.y = -9999;
    };
    // A click throws the particles outward from the pointer.
    const onDown = (e: PointerEvent) => {
      if (reduce) return;
      const p = toLocal(e);
      for (let i = 0; i < n; i++) {
        const j = i * 6;
        const dx = P[j] - p.x;
        const dy = P[j + 1] - p.y;
        const d = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - d / (live.current.radius * 3.4)) * 900 * (0.5 + Math.random());
        P[j + 2] += (dx / d) * f;
        P[j + 3] += (dy / d) * f;
      }
    };

    let timer = 0;
    const rebuild = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        build();
        if (reduce) draw();
        else start();
      }, 120);
    };

    // Wait for the web font, or the first build would sample a fallback face.
    void document.fonts.ready.then(() => {
      build();
      draw();
      start();
    });

    const ro = new ResizeObserver(rebuild);
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    io.observe(host);
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);

    return () => {
      window.clearTimeout(timer);
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [reduce, text, fontSize, gap]);

  return (
    <div
      {...props}
      ref={wrap}
      role="img"
      aria-label={props["aria-label"] ?? text}
      className={cn("relative h-40 w-full touch-pan-y text-ink", className)}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
    </div>
  );
}
