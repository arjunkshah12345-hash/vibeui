"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CoverItem = {
  id: string;
  title: string;
  subtitle?: string;
  // What fills the square: a gradient, an image, anything.
  art: React.ReactNode;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * The classic cover-flow browser: a row of covers in 3D, the middle one facing you and the rest angled away.
 *
 * Drag, scroll sideways, press the arrow keys or click a cover to bring it forward. It eases with momentum.
 */
export function CoverFlow({
  items,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  size = 168,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  items: CoverItem[];
  /** Controlled index of the cover in front. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Size of each square cover in px. */
  size?: number;
}) {
  const [inner, setInner] = React.useState(clamp(defaultIndex, 0, items.length - 1));
  const index = clamp(controlled ?? inner, 0, items.length - 1);
  const stage = React.useRef<HTMLDivElement>(null);
  const covers = React.useRef<(HTMLDivElement | null)[]>([]);
  const pos = React.useRef(index); // where the row is now, as a fractional index
  const want = React.useRef(index);
  const drag = React.useRef<{
    x: number;
    pos: number;
    t: number;
    v: number;
    moved: boolean;
    scale: number;
  } | null>(null);
  const wheelAt = React.useRef(0);
  // Lets handlers wake the animation loop when it has gone to sleep.
  const kick = React.useRef<() => void>(() => {});

  const go = React.useCallback(
    (next: number) => {
      const i = clamp(Math.round(next), 0, items.length - 1);
      want.current = i;
      if (controlled === undefined) setInner(i);
      onIndexChange?.(i);
    },
    [controlled, items.length, onIndexChange],
  );

  // When the index is set from outside, ease toward it.
  React.useEffect(() => {
    want.current = index;
    kick.current();
  }, [index]);

  React.useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let running = false;

    const place = () => {
      covers.current.forEach((el, i) => {
        if (!el) return;
        const d = i - pos.current;
        const a = Math.min(Math.abs(d), 1);
        const sign = Math.sign(d);
        // The middle cover sits flat; the others fan out, turn away, and sink back.
        const x = d * size * 0.3 + sign * a * size * 0.5;
        const z = -a * size * 0.7 - Math.max(Math.abs(d) - 1, 0) * size * 0.08;
        el.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${-sign * a * 58}deg) scale(${1 - a * 0.06})`;
        el.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
        el.style.opacity = String(clamp(1.15 - Math.max(Math.abs(d) - 2.2, 0) * 0.5, 0, 1));
      });
    };

    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (!drag.current) {
        const k = calm ? 1 : 1 - Math.exp(-dt * 9);
        pos.current += (want.current - pos.current) * k;
        if (Math.abs(want.current - pos.current) < 0.0008) pos.current = want.current;
      }
      place();
      const settled = !drag.current && pos.current === want.current;
      raf = settled || !running ? 0 : requestAnimationFrame(tick);
      if (settled) running = false;
    };
    const start = () => {
      if (running || !visible) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    kick.current = start;
    place();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    if (stage.current) io.observe(stage.current);
    start();
    return () => {
      kick.current = () => {};
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [size]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    drag.current = {
      x: e.clientX,
      pos: pos.current,
      t: performance.now(),
      v: 0,
      moved: false,
      scale: e.currentTarget.offsetWidth / (r.width || 1),
    };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.x) * d.scale;
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      // Only now is it a drag: capturing earlier would swallow the click on a cover.
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const now = performance.now();
    const prev = pos.current;
    pos.current = clamp(d.pos - dx / (size * 0.42), -0.3, items.length - 0.7);
    d.v = (pos.current - prev) / Math.max((now - d.t) / 1000, 0.001);
    d.t = now;
    kick.current();
  };
  const end = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    // Throw: carry a little of the release speed, then settle on the nearest cover.
    go(pos.current - clamp(d.v, -6, 6) * 0.12);
    kick.current();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const to =
      e.key === "ArrowRight"
        ? index + 1
        : e.key === "ArrowLeft"
          ? index - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? items.length - 1
              : null;
    if (to === null) return;
    e.preventDefault();
    go(to);
  };

  const cur = items[index];
  return (
    <div {...props} className={cn("w-full select-none", className)}>
      <div
        ref={stage}
        role="listbox"
        tabIndex={0}
        aria-label="Covers"
        aria-orientation="horizontal"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
        onKeyDown={onKeyDown}
        onWheel={(e) => {
          // Sideways scrolling moves through the row; ordinary vertical scrolling is left to the page.
          if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
          const now = performance.now();
          if (now - wheelAt.current < 160) return;
          wheelAt.current = now;
          go(index + (e.deltaX > 0 ? 1 : -1));
        }}
        className="relative cursor-grab touch-pan-y overflow-hidden rounded-xl outline-none [perspective:1100px] focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
        style={{ height: size * 1.32 }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              covers.current[i] = el;
            }}
            role="option"
            aria-selected={i === index}
            aria-label={item.subtitle ? `${item.title}, ${item.subtitle}` : item.title}
            onClick={() => {
              if (drag.current?.moved) return;
              go(i);
            }}
            className="absolute left-1/2 top-[8%] cursor-pointer overflow-hidden rounded-lg shadow-[0_18px_38px_-14px_rgb(0_0_0/0.55)] ring-1 ring-black/10 [backface-visibility:hidden] [-webkit-box-reflect:below_3px_linear-gradient(transparent_62%,rgb(255_255_255/0.22))]"
            style={{ width: size, height: size, marginLeft: -size / 2 }}
          >
            {item.art}
          </div>
        ))}
      </div>
      <div className="mt-2 text-center" aria-live="polite">
        <p className="text-[15px] font-medium text-ink">{cur.title}</p>
        {cur.subtitle && <p className="text-[13px] text-muted">{cur.subtitle}</p>}
      </div>
    </div>
  );
}
