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

// What the pointer wraps itself around, and what it turns into a caret over.
const ACTIONABLE =
  "a[href], button, summary, select, [role='button'], [role='tab'], [role='switch'], [role='checkbox'], [data-morph]";
const TEXTUAL =
  "input:not([type='checkbox']):not([type='radio']):not([type='range']), textarea, [contenteditable='true']";

type Mode = "dot" | "box" | "caret";

/**
 * The iPadOS pointer for the web: a dot that morphs into the shape of whatever you hover, and gently pulls it toward you.
 *
 * Wrap any region. Buttons, links and tabs get wrapped; text fields turn it into a caret. Touch is left alone.
 */
export function PointerMorph({
  children,
  pull = 0.28,
  padding = 6,
  hideNative = true,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** How far a hovered element leans toward the pointer, as a fraction of the offset (0 turns it off). */
  pull?: number;
  /** Space between the hovered element and the pointer's outline, in px. */
  padding?: number;
  /** Hide the system cursor inside the region. */
  hideNative?: boolean;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  const blob = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const live = React.useRef({ pull, padding });

  React.useEffect(() => {
    live.current = { pull, padding };
  }, [pull, padding]);

  React.useEffect(() => {
    const host = root.current;
    const el = blob.current;
    if (!host || !el) return;

    const cur = { x: -50, y: -50, w: 10, h: 10, r: 5, o: 0, s: 1, px: 0, py: 0 };
    const ptr = { x: -50, y: -50, inside: false, pressed: false };
    let target: HTMLElement | null = null;
    let mode: Mode = "dot";
    let raf = 0;
    let last = performance.now();
    let running = false;

    // Pull a hovered element toward the pointer using the standalone `translate` property,
    // so we never clobber a transform the element already has.
    const release = (node: HTMLElement | null) => {
      if (node) node.style.translate = "";
    };

    // Position of a client point in the region's own layout pixels, whatever scale a parent applies.
    const rel = (clientX: number, clientY: number) => {
      const r = host.getBoundingClientRect();
      const k = host.offsetWidth / (r.width || 1);
      return { x: (clientX - r.left) * k, y: (clientY - r.top) * k, k, left: r.left, top: r.top };
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const p = rel(e.clientX, e.clientY);
      ptr.x = p.x;
      ptr.y = p.y;
      if (!ptr.inside) {
        // First entry: appear where the pointer is, not where we last were.
        cur.x = p.x;
        cur.y = p.y;
      }
      ptr.inside = true;
      const t = e.target instanceof Element ? e.target : null;
      const text = t?.closest<HTMLElement>(TEXTUAL) ?? null;
      const act = text ? null : (t?.closest<HTMLElement>(ACTIONABLE) ?? null);
      const next = text ?? act;
      if (next !== target) {
        release(target);
        target = next && host.contains(next) ? next : null;
        cur.px = 0;
        cur.py = 0;
      }
      mode = target ? (target.matches(TEXTUAL) ? "caret" : "box") : "dot";
      el.dataset.mode = mode;
      start();
    };
    const onLeave = () => {
      ptr.inside = false;
      release(target);
      target = null;
      mode = "dot";
      el.dataset.mode = mode;
    };
    const onDown = () => {
      ptr.pressed = true;
    };
    const onUp = () => {
      ptr.pressed = false;
    };

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const { pull: pullK, padding: pad } = live.current;
      const calm = reduce;

      let gx = ptr.x;
      let gy = ptr.y;
      let gw = 10;
      let gh = 10;
      let gr = 5;
      if (target && mode === "box") {
        const r = target.getBoundingClientRect();
        const a = rel(r.left, r.top);
        const w = r.width * a.k;
        const h = r.height * a.k;
        gx = a.x + w / 2;
        gy = a.y + h / 2;
        gw = w + pad * 2;
        gh = h + pad * 2;
        const radius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
        gr = Math.min(radius + pad, gh / 2);
        // Lean the element toward the pointer, a little.
        if (!calm && pullK > 0) {
          const dx = (ptr.x - gx) * pullK;
          const dy = (ptr.y - gy) * pullK;
          const lim = 9;
          cur.px += (Math.max(-lim, Math.min(lim, dx)) - cur.px) * (1 - Math.exp(-dt * 16));
          cur.py += (Math.max(-lim, Math.min(lim, dy)) - cur.py) * (1 - Math.exp(-dt * 16));
          target.style.translate = `${cur.px.toFixed(2)}px ${cur.py.toFixed(2)}px`;
          // The outline travels with the element it holds.
          gx += cur.px;
          gy += cur.py;
        }
      } else if (target && mode === "caret") {
        const fs = parseFloat(getComputedStyle(target).fontSize) || 16;
        gw = 2.5;
        gh = fs * 1.35;
        gr = 1.5;
      }

      const snap = calm ? 1 : 1 - Math.exp(-dt * 24);
      const morph = calm ? 1 : 1 - Math.exp(-dt * 17);
      cur.x += (gx - cur.x) * snap;
      cur.y += (gy - cur.y) * snap;
      cur.w += (gw - cur.w) * morph;
      cur.h += (gh - cur.h) * morph;
      cur.r += (gr - cur.r) * morph;
      cur.o += ((ptr.inside ? 1 : 0) - cur.o) * (calm ? 1 : 1 - Math.exp(-dt * 20));
      cur.s += ((ptr.pressed ? 0.88 : 1) - cur.s) * (calm ? 1 : 1 - Math.exp(-dt * 26));

      el.style.width = `${cur.w}px`;
      el.style.height = `${cur.h}px`;
      el.style.borderRadius = `${cur.r}px`;
      el.style.opacity = cur.o.toFixed(3);
      el.style.transform = `translate(${cur.x - cur.w / 2}px, ${cur.y - cur.h / 2}px) scale(${cur.s})`;

      if (!ptr.inside && cur.o < 0.01) {
        running = false;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerenter", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      release(target);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [reduce]);

  return (
    <div
      {...props}
      ref={root}
      className={cn("relative", hideNative && "cursor-none [&_*]:!cursor-none", className)}
    >
      {children}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
        <div
          ref={blob}
          data-mode="dot"
          className="absolute left-0 top-0 opacity-0 will-change-transform data-[mode=box]:bg-ink/[0.09] data-[mode=box]:ring-1 data-[mode=box]:ring-ink/25 data-[mode=caret]:bg-accent data-[mode=dot]:bg-ink"
          style={{ width: 10, height: 10, borderRadius: 5 }}
        />
      </div>
    </div>
  );
}
