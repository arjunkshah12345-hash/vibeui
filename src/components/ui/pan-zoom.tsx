"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export type PanZoomView = { x: number; y: number; scale: number };

/**
 * An infinite canvas: drag to pan, pinch or scroll to zoom toward the cursor, double-click to zoom in.
 *
 * Release a drag and it glides on. Zoom stays under the pointer, the way a map or a design tool does.
 * Arrow keys pan, plus and minus zoom, and 0 resets.
 */
export function PanZoom({
  children,
  minScale = 0.4,
  maxScale = 4,
  initialScale = 1,
  grid = true,
  controls = true,
  onViewChange,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** What sits on the canvas. It is laid out from the centre. */
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
  /** Draw a dot grid that moves and scales with the canvas. */
  grid?: boolean;
  /** Show the zoom buttons. */
  controls?: boolean;
  onViewChange?: (view: PanZoomView) => void;
}) {
  const host = React.useRef<HTMLDivElement>(null);
  const stage = React.useRef<HTMLDivElement>(null);
  const dots = React.useRef<HTMLDivElement>(null);
  const label = React.useRef<HTMLSpanElement>(null);
  const api = React.useRef<{
    zoomBy: (f: number) => void;
    reset: () => void;
  } | null>(null);
  const cb = React.useRef(onViewChange);

  React.useEffect(() => {
    cb.current = onViewChange;
  }, [onViewChange]);

  React.useEffect(() => {
    const el = host.current;
    const st = stage.current;
    if (!el || !st) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const view = { x: 0, y: 0, scale: initialScale };
    let vx = 0;
    let vy = 0;
    let raf = 0;
    let animating = false;
    let goal: PanZoomView | null = null; // an eased move (double-click, buttons, reset)

    const paint = () => {
      st.style.transform = `translate3d(${view.x}px,${view.y}px,0) scale(${view.scale})`;
      const d = dots.current;
      if (d) {
        const s = 28 * view.scale;
        d.style.backgroundSize = `${s}px ${s}px`;
        d.style.backgroundPosition = `${el.offsetWidth / 2 + view.x}px ${el.offsetHeight / 2 + view.y}px`;
        d.style.opacity = String(clamp(view.scale * 1.2, 0.25, 1));
      }
      if (label.current) label.current.textContent = `${Math.round(view.scale * 100)}%`;
      cb.current?.({ ...view });
    };

    // Zoom about a point given relative to the centre of the viewport.
    const zoomAt = (cx: number, cy: number, next: number) => {
      const s = clamp(next, minScale, maxScale);
      const k = s / view.scale;
      view.x = cx - (cx - view.x) * k;
      view.y = cy - (cy - view.y) * k;
      view.scale = s;
    };
    const centre = (clientX: number, clientY: number) => {
      const r = el.getBoundingClientRect();
      const sx = el.offsetWidth / (r.width || 1);
      return [
        (clientX - r.left - r.width / 2) * sx,
        (clientY - r.top - r.height / 2) * sx,
      ] as const;
    };

    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      let moving = false;
      if (goal) {
        const k = 1 - Math.exp(-dt * 11);
        view.x += (goal.x - view.x) * k;
        view.y += (goal.y - view.y) * k;
        view.scale += (goal.scale - view.scale) * k;
        if (
          Math.abs(goal.x - view.x) + Math.abs(goal.y - view.y) < 0.4 &&
          Math.abs(goal.scale - view.scale) < 0.002
        ) {
          Object.assign(view, goal);
          goal = null;
        } else moving = true;
      } else if (Math.abs(vx) + Math.abs(vy) > 8) {
        view.x += vx * dt;
        view.y += vy * dt;
        const f = Math.exp(-dt * 4.5);
        vx *= f;
        vy *= f;
        moving = true;
      }
      paint();
      if (moving) raf = requestAnimationFrame(tick);
      else animating = false;
    };
    const kick = () => {
      if (animating) return;
      animating = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const glideTo = (g: PanZoomView) => {
      vx = vy = 0;
      if (calm) {
        Object.assign(view, g);
        paint();
        return;
      }
      goal = g;
      kick();
    };

    // Pointers: one pans, two pinch.
    const pts = new Map<number, { x: number; y: number }>();
    let pinch = 0;
    let lastT = 0;
    let moved = false;
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-pz-ui]")) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      goal = null;
      vx = vy = 0;
      moved = false;
      lastT = performance.now();
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        pinch = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };
    const onMove = (e: PointerEvent) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      if (!moved) {
        // Only a real drag takes the pointer, so a plain click still reaches what is on the canvas.
        if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < 4 && pts.size === 1) return;
        for (const id of pts.keys()) el.setPointerCapture(id);
        el.style.cursor = "grabbing";
      }
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      moved = true;
      if (pts.size === 1) {
        const sx = el.offsetWidth / (el.getBoundingClientRect().width || 1);
        view.x += dx * sx;
        view.y += dy * sx;
        const now = performance.now();
        const dts = Math.max((now - lastT) / 1000, 0.001);
        lastT = now;
        vx = clamp((dx * sx) / dts, -2600, 2600);
        vy = clamp((dy * sx) / dts, -2600, 2600);
      } else if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch > 0) {
          const [cx, cy] = centre((a.x + b.x) / 2, (a.y + b.y) / 2);
          zoomAt(cx, cy, view.scale * (d / pinch));
        }
        pinch = d;
        vx = vy = 0;
      }
      paint();
    };
    const onUp = (e: PointerEvent) => {
      if (!pts.delete(e.pointerId)) return;
      if (pts.size === 0) {
        el.style.cursor = "";
        if (moved && performance.now() - lastT < 80 && !calm) kick();
        else vx = vy = 0;
      } else if (pts.size === 1) {
        vx = vy = 0;
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      goal = null;
      vx = vy = 0;
      if (e.ctrlKey || e.metaKey || Math.abs(e.deltaY) > Math.abs(e.deltaX) * 2) {
        // Pinch on a trackpad arrives as ctrl + wheel with small deltas; a mouse wheel arrives in big steps.
        const [cx, cy] = centre(e.clientX, e.clientY);
        const step = e.ctrlKey ? 0.012 : 0.0016;
        zoomAt(cx, cy, view.scale * Math.exp(-e.deltaY * step));
      } else {
        view.x -= e.deltaX;
        view.y -= e.deltaY;
      }
      paint();
    };
    const onDouble = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-pz-ui]")) return;
      const [cx, cy] = centre(e.clientX, e.clientY);
      const s = clamp(view.scale * 2, minScale, maxScale);
      const k = s / view.scale;
      glideTo({ x: cx - (cx - view.x) * k, y: cy - (cy - view.y) * k, scale: s });
    };
    const onKey = (e: KeyboardEvent) => {
      const stepPx = e.shiftKey ? 160 : 60;
      const cur = goal ?? view;
      if (e.key === "ArrowLeft") glideTo({ ...cur, x: cur.x + stepPx });
      else if (e.key === "ArrowRight") glideTo({ ...cur, x: cur.x - stepPx });
      else if (e.key === "ArrowUp") glideTo({ ...cur, y: cur.y + stepPx });
      else if (e.key === "ArrowDown") glideTo({ ...cur, y: cur.y - stepPx });
      else if (e.key === "+" || e.key === "=") api.current?.zoomBy(1.4);
      else if (e.key === "-" || e.key === "_") api.current?.zoomBy(1 / 1.4);
      else if (e.key === "0") api.current?.reset();
      else return;
      e.preventDefault();
    };

    api.current = {
      zoomBy: (f) => {
        const cur = goal ?? view;
        const s = clamp(cur.scale * f, minScale, maxScale);
        const k = s / cur.scale;
        glideTo({ x: cur.x * k, y: cur.y * k, scale: s });
      },
      reset: () => glideTo({ x: 0, y: 0, scale: initialScale }),
    };

    paint();
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("dblclick", onDouble);
    el.addEventListener("keydown", onKey);
    const ro = new ResizeObserver(paint);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("dblclick", onDouble);
      el.removeEventListener("keydown", onKey);
    };
  }, [minScale, maxScale, initialScale]);

  return (
    <div
      tabIndex={0}
      role="application"
      aria-label="Pannable canvas. Arrow keys pan, plus and minus zoom, zero resets."
      {...props}
      ref={host}
      className={cn(
        "relative h-80 w-full cursor-grab touch-none select-none overflow-hidden rounded-2xl border border-line bg-surface-muted outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {grid && (
        <div
          ref={dots}
          aria-hidden
          className="pointer-events-none absolute inset-0 text-ink/25"
          style={{
            backgroundImage: "radial-gradient(currentColor 1.1px, transparent 1.3px)",
          }}
        />
      )}
      <div
        ref={stage}
        className="absolute left-1/2 top-1/2 will-change-transform [transform-origin:0_0]"
      >
        {/* children are centred on the origin, so scaling about it keeps the middle fixed */}
        <div className="-translate-x-1/2 -translate-y-1/2">{children}</div>
      </div>

      {controls && (
        <div
          data-pz-ui
          className="absolute bottom-3 right-3 flex items-center gap-0.5 rounded-full border border-line bg-surface p-1 text-xs shadow-sm"
        >
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => api.current?.zoomBy(1 / 1.4)}
            className="grid size-7 place-items-center rounded-full text-ink transition-colors hover:bg-surface-muted"
          >
            −
          </button>
          <button
            type="button"
            aria-label="Reset view"
            onClick={() => api.current?.reset()}
            className="min-w-11 rounded-full px-1 py-1 text-center tabular-nums text-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <span ref={label}>100%</span>
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => api.current?.zoomBy(1.4)}
            className="grid size-7 place-items-center rounded-full text-ink transition-colors hover:bg-surface-muted"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
