"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type LightboxImage = { src: string; alt: string; caption?: string };

type Box = { left: number; top: number; width: number; height: number };

const EASE = "cubic-bezier(0.22, 0.9, 0.24, 1)";

/**
 * A photo grid whose pictures open full screen by growing out of their own place, and shrink back on close.
 *
 * Arrow keys, swipes and the side buttons move between pictures; Escape, a click outside, or a swipe
 * up or down closes. The enlarged picture is the same element the whole way, so it never jumps.
 */
export function Lightbox({
  images,
  columns = 3,
  gap = 12,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  images: LightboxImage[];
  /** Columns in the grid. */
  columns?: number;
  /** Space between thumbnails, in px. */
  gap?: number;
}) {
  const [open, setOpen] = React.useState<{ i: number; dir: 1 | -1 } | null>(null);
  const thumbs = React.useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div {...props} className={cn("w-full", className)}>
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap }}
      >
        {images.map((im, i) => (
          <button
            key={im.src}
            ref={(el) => {
              thumbs.current[i] = el;
            }}
            type="button"
            aria-label={`Open ${im.alt}`}
            onClick={() => setOpen({ i, dir: 1 })}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={im.src}
              alt=""
              draggable={false}
              className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
            />
          </button>
        ))}
      </div>
      {open !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <Viewer
            images={images}
            index={open.i}
            dir={open.dir}
            thumbs={thumbs}
            onIndex={(i, dir) => setOpen({ i, dir })}
            onClose={() => setOpen(null)}
          />,
          document.body,
        )}
    </div>
  );
}

// Where a thumbnail sits on screen, or null if it has scrolled out of view.
function boxOf(list: (HTMLElement | null)[] | null, i: number): Box | null {
  const el = list?.[i];
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.bottom < 0 || r.top > window.innerHeight) return null;
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

// The picture at its largest that still leaves room for the controls.
function fitBox(list: (HTMLElement | null)[] | null, i: number): Box {
  const t = list?.[i]?.querySelector("img");
  const nw = t?.naturalWidth || 4;
  const nh = t?.naturalHeight || 3;
  const s = Math.min((window.innerWidth * 0.88) / nw, (window.innerHeight * 0.76) / nh);
  const width = nw * s;
  const height = nh * s;
  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2 - 18,
    width,
    height,
  };
}

function place(el: HTMLElement | null, box: Box) {
  if (!el) return;
  el.style.left = `${box.left}px`;
  el.style.top = `${box.top}px`;
  el.style.width = `${box.width}px`;
  el.style.height = `${box.height}px`;
}

function Viewer({
  images,
  index,
  dir,
  thumbs,
  onIndex,
  onClose,
}: {
  images: LightboxImage[];
  index: number;
  dir: 1 | -1;
  thumbs: React.RefObject<(HTMLButtonElement | null)[]>;
  onIndex: (i: number, dir: 1 | -1) => void;
  onClose: () => void;
}) {
  const img = React.useRef<HTMLImageElement>(null);
  const veil = React.useRef<HTMLDivElement>(null);
  const first = React.useRef(true);
  const closing = React.useRef(false);
  const origin = React.useRef<HTMLButtonElement | null>(null);

  // Open: grow out of the thumbnail. Navigate: slide the new picture in.
  React.useLayoutEffect(() => {
    const el = img.current;
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const list = thumbs.current;
    const to = fitBox(list, index);
    place(el, to);
    if (first.current) {
      first.current = false;
      origin.current = list?.[index] ?? null;
      const from = boxOf(list, index);
      veil.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: calm ? 1 : 350,
        fill: "both",
      });
      if (from && !calm) {
        el.animate(
          [
            { ...px(from), borderRadius: "12px" },
            { ...px(to), borderRadius: "10px" },
          ],
          { duration: 520, easing: EASE },
        );
      } else if (!calm) {
        el.animate(
          [
            { opacity: 0, transform: "scale(0.94)" },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: 320,
            easing: EASE,
          },
        );
      }
    } else if (!calm) {
      el.animate(
        [
          { opacity: 0, transform: `translateX(${dir * 56}px) scale(0.96)` },
          { opacity: 1, transform: "none" },
        ],
        { duration: 380, easing: EASE },
      );
    }
  }, [index, dir, thumbs]);

  const close = React.useCallback(async () => {
    if (closing.current) return;
    closing.current = true;
    const el = img.current;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = el ? el.getBoundingClientRect() : null;
    const back = boxOf(thumbs.current, index);
    if (el && from && !calm) {
      const fade = veil.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 380,
        easing: "ease-in",
        fill: "both",
      });
      const move = el.animate(
        back
          ? [
              {
                ...px({ left: from.left, top: from.top, width: from.width, height: from.height }),
                borderRadius: "10px",
              },
              { ...px(back), borderRadius: "12px" },
            ]
          : [
              { opacity: 1, transform: "none" },
              { opacity: 0, transform: "scale(0.94)" },
            ],
        { duration: 420, easing: EASE, fill: "both" },
      );
      await Promise.allSettled([move.finished, fade?.finished]);
    }
    onClose();
    origin.current?.focus({ preventScroll: true });
  }, [index, onClose, thumbs]);

  const go = React.useCallback(
    (d: 1 | -1) => onIndex((index + d + images.length) % images.length, d),
    [index, images.length, onIndex],
  );

  React.useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") void close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else return;
      e.preventDefault();
    };
    const resize = () => place(img.current, fitBox(thumbs.current, index));
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
      document.body.style.overflow = prev;
    };
  }, [close, go, index, thumbs]);

  // Swipe sideways to move, or up and down to dismiss.
  const swipe = React.useRef<{ x: number; y: number } | null>(null);

  const current = images[index];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
      className="fixed inset-0 z-[100] touch-none select-none"
      onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
      onPointerUp={(e) => {
        const s = swipe.current;
        swipe.current = null;
        if (!s) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
        else if (Math.abs(dy) > 90) void close();
      }}
    >
      <div
        ref={veil}
        onClick={() => void close()}
        className="absolute inset-0 bg-[#0b0a09]/90 backdrop-blur-xl"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={index}
        ref={img}
        src={current.src}
        alt={current.alt}
        draggable={false}
        className="pointer-events-none fixed rounded-[10px] object-cover shadow-[0_30px_80px_-10px_rgb(0_0_0/0.6)]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-6 text-center">
        {current.caption && <p className="text-sm text-white/85">{current.caption}</p>}
        <p className="mt-1 font-mono text-[11px] tabular-nums tracking-[0.2em] text-white/45">
          {index + 1} / {images.length}
        </p>
      </div>
      {images.length > 1 &&
        ([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            aria-label={d === 1 ? "Next picture" : "Previous picture"}
            onClick={(e) => {
              e.stopPropagation();
              go(d);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white outline-none backdrop-blur transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60",
              d === 1 ? "right-4" : "left-4",
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d={d === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      <button
        type="button"
        autoFocus
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          void close();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white outline-none backdrop-blur transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

// A box as CSS keyframe values.
const px = (b: Box) => ({
  left: `${b.left}px`,
  top: `${b.top}px`,
  width: `${b.width}px`,
  height: `${b.height}px`,
});
