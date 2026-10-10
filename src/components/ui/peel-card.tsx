"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type V = { x: number; y: number };
type Corner = "br" | "bl" | "tr" | "tl";

// Keep the part of a polygon on one side of a line (Sutherland–Hodgman, one plane at a time).
function clip(poly: V[], at: V, n: V, keep: 1 | -1): V[] {
  const side = (q: V) => keep * ((q.x - at.x) * n.x + (q.y - at.y) * n.y);
  const out: V[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const sa = side(a);
    const sb = side(b);
    if (sa <= 0) out.push(a);
    if ((sa < 0 && sb > 0) || (sa > 0 && sb < 0)) {
      const t = sa / (sa - sb);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return out;
}

const path = (p: V[]) =>
  p.length < 3
    ? "polygon(0 0, 0 0, 0 0)"
    : `polygon(${p.map((q) => `${q.x}px ${q.y}px`).join(",")})`;

/**
 * A card whose corner you can lift and peel back, like a sticker, to see what is underneath.
 *
 * The fold is real geometry: the paper bends along the line halfway to your pointer, with a lit
 * curl and a shadow cast on what it uncovers. Let go and it springs back.
 */
export function PeelCard({
  children,
  under,
  corner = "br",
  threshold = 0.5,
  onPeel,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** The face of the card. */
  children: React.ReactNode;
  /** What is revealed underneath. */
  under?: React.ReactNode;
  /** Which corner lifts. */
  corner?: Corner;
  /** How far across the card (0 to 1 of its diagonal) a peel has to go to count. */
  threshold?: number;
  /** Called when you let go after peeling past the threshold. */
  onPeel?: () => void;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  const face = React.useRef<HTMLDivElement>(null);
  const flap = React.useRef<HTMLDivElement>(null);
  const shade = React.useRef<HTMLDivElement>(null);
  const cb = React.useRef({ onPeel, threshold });

  React.useEffect(() => {
    cb.current = { onPeel, threshold };
  }, [onPeel, threshold]);

  React.useEffect(() => {
    const el = root.current;
    const f = face.current;
    const fl = flap.current;
    const sh = shade.current;
    if (!el || !f || !fl || !sh) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sx = corner[1] === "r" ? 1 : -1; // which side the corner is on
    const sy = corner[0] === "b" ? 1 : -1;

    const cur = { x: 0, y: 0 }; // how far the corner has been pulled from home
    const vel = { x: 0, y: 0 };
    const goal = { x: 0, y: 0 };
    let down: { x: number; y: number; moved: boolean } | null = null;
    let raf = 0;
    let last = 0;
    let peak = 0;

    const draw = () => {
      const W = el.offsetWidth;
      const H = el.offsetHeight;
      const C: V = { x: sx > 0 ? W : 0, y: sy > 0 ? H : 0 };
      const P: V = {
        x: Math.min(W, Math.max(0, C.x + cur.x)),
        y: Math.min(H, Math.max(0, C.y + cur.y)),
      };
      const d = Math.hypot(C.x - P.x, C.y - P.y);
      if (d < 0.6) {
        f.style.clipPath = "none";
        fl.style.visibility = "hidden";
        sh.style.visibility = "hidden";
        return;
      }
      const m: V = { x: (C.x + P.x) / 2, y: (C.y + P.y) / 2 };
      const n: V = { x: (C.x - P.x) / d, y: (C.y - P.y) / d }; // from the fold toward the lifted corner
      const rect: V[] = [
        { x: 0, y: 0 },
        { x: W, y: 0 },
        { x: W, y: H },
        { x: 0, y: H },
      ];
      const kept = clip(rect, m, n, 1);
      const gone = clip(rect, m, n, -1);
      // The lifted paper is the removed piece, reflected across the fold.
      let curl = gone.map((q) => {
        const s = (q.x - m.x) * n.x + (q.y - m.y) * n.y;
        return { x: q.x - 2 * s * n.x, y: q.y - 2 * s * n.y };
      });
      for (const [at, nn] of [
        [
          { x: 0, y: 0 },
          { x: -1, y: 0 },
        ],
        [
          { x: W, y: 0 },
          { x: 1, y: 0 },
        ],
        [
          { x: 0, y: 0 },
          { x: 0, y: -1 },
        ],
        [
          { x: 0, y: H },
          { x: 0, y: 1 },
        ],
      ] as [V, V][]) {
        curl = clip(curl, at, nn, 1);
      }

      f.style.clipPath = path(kept);
      fl.style.visibility = "visible";
      fl.style.clipPath = path(curl);
      sh.style.visibility = "visible";
      sh.style.clipPath = path(gone);

      // Gradients measured along a direction, positioned by pixels from the fold.
      const ctr: V = { x: W / 2, y: H / 2 };
      const along = (g: V) => {
        const L = Math.abs(W * g.x) + Math.abs(H * g.y);
        const t = (m.x - ctr.x) * g.x + (m.y - ctr.y) * g.y + L / 2;
        const deg = (Math.atan2(g.x, -g.y) * 180) / Math.PI;
        return { t, deg, L };
      };
      const inward = along({ x: -n.x, y: -n.y });
      const reach = Math.min(d * 0.9, 120);
      fl.style.backgroundImage = `linear-gradient(${inward.deg}deg,
        rgb(0 0 0 / 0.22) ${inward.t}px,
        rgb(255 255 255 / 0.55) ${inward.t + 2.5}px,
        rgb(255 255 255 / 0) ${inward.t + reach * 0.5}px,
        rgb(0 0 0 / 0.1) ${inward.t + reach}px)`;
      const outward = along(n);
      sh.style.backgroundImage = `linear-gradient(${outward.deg}deg,
        rgb(0 0 0 / 0.42) ${outward.t}px,
        rgb(0 0 0 / 0.16) ${outward.t + 14}px,
        rgb(0 0 0 / 0) ${outward.t + 52}px)`;
    };

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.032);
      last = t;
      if (down?.moved) {
        // Follow the finger closely, with a little give.
        cur.x += (goal.x - cur.x) * (1 - Math.exp(-dt * 30));
        cur.y += (goal.y - cur.y) * (1 - Math.exp(-dt * 30));
        vel.x = vel.y = 0;
      } else {
        // Underdamped spring: it overshoots, flaps, and settles.
        const k = 230;
        const c = 15;
        vel.x += ((goal.x - cur.x) * k - vel.x * c) * dt;
        vel.y += ((goal.y - cur.y) * k - vel.y * c) * dt;
        cur.x += vel.x * dt;
        cur.y += vel.y * dt;
      }
      draw();
      const rest =
        !down &&
        Math.abs(goal.x - cur.x) + Math.abs(goal.y - cur.y) < 0.3 &&
        Math.abs(vel.x) + Math.abs(vel.y) < 2;
      if (rest) {
        cur.x = goal.x;
        cur.y = goal.y;
        draw();
        raf = 0;
      } else raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (calm) {
        cur.x = goal.x;
        cur.y = goal.y;
        draw();
        return;
      }
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const local = (e: PointerEvent): V => {
      const r = el.getBoundingClientRect();
      const k = el.offsetWidth / (r.width || 1);
      return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
    };
    const nearCorner = (q: V) => {
      const W = el.offsetWidth;
      const H = el.offsetHeight;
      const fx = sx > 0 ? q.x / W : 1 - q.x / W;
      const fy = sy > 0 ? q.y / H : 1 - q.y / H;
      return fx > 0.7 && fy > 0.7;
    };
    // A small lift at rest tells you the corner is there to take.
    const hint = (on: boolean) => {
      goal.x = on ? -sx * 20 : 0;
      goal.y = on ? -sy * 20 : 0;
      wake();
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const q = local(e);
      down = { x: q.x, y: q.y, moved: false };
      peak = 0;
    };
    const onMove = (e: PointerEvent) => {
      const q = local(e);
      if (!down) {
        hint(nearCorner(q));
        el.style.cursor = nearCorner(q) ? "grab" : "";
        return;
      }
      const dx = q.x - down.x;
      const dy = q.y - down.y;
      if (!down.moved) {
        if (Math.hypot(dx, dy) < 4) return;
        down.moved = true;
        el.setPointerCapture(e.pointerId);
        el.style.cursor = "grabbing";
      }
      // Only the part of the drag that pulls the corner inward counts as peeling.
      const W = el.offsetWidth;
      const H = el.offsetHeight;
      const gx = sx > 0 ? Math.min(0, dx) : Math.max(0, dx);
      const gy = sy > 0 ? Math.min(0, dy) : Math.max(0, dy);
      goal.x = Math.max(-W, Math.min(W, gx));
      goal.y = Math.max(-H, Math.min(H, gy));
      peak = Math.max(peak, Math.hypot(goal.x, goal.y) / Math.hypot(W, H));
      wake();
    };
    const onUp = () => {
      if (!down) return;
      const moved = down.moved;
      down = null;
      el.style.cursor = "";
      goal.x = goal.y = 0;
      wake();
      if (moved && peak >= cb.current.threshold) cb.current.onPeel?.();
    };
    const onLeave = () => {
      if (!down) hint(false);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [corner]);

  return (
    <div
      {...props}
      ref={root}
      className={cn(
        "relative h-48 w-full touch-none select-none overflow-hidden rounded-2xl border border-line bg-surface shadow-sm",
        className,
      )}
    >
      <div className="absolute inset-0">
        {under ?? (
          <div className="grid h-full place-items-center bg-ink text-sm font-medium text-surface">
            Nothing here yet
          </div>
        )}
      </div>
      <div ref={shade} aria-hidden className="pointer-events-none absolute inset-0 invisible" />
      <div ref={face} className="absolute inset-0 bg-surface">
        {children}
      </div>
      {/* the filter sits outside the clip so the lifted paper casts a shadow onto the face */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ filter: "drop-shadow(-2px -3px 5px rgb(0 0 0 / 0.28))" }}
      >
        <div
          ref={flap}
          className="absolute inset-0 invisible bg-[color-mix(in_oklab,var(--surface),var(--ink)_9%)]"
        />
      </div>
    </div>
  );
}
