"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:.";

const SIZES = {
  sm: "h-10 w-7 text-xl rounded-[5px]",
  md: "h-14 w-10 text-3xl rounded-[7px]",
  lg: "h-20 w-14 text-5xl rounded-[9px]",
} as const;

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/**
 * An airport departures board: every character is a flap that turns over until it shows the right one.
 *
 * Change `value` and the cells cascade through the alphabet in order, the way the real ones do.
 */
export function SplitFlap({
  value,
  length,
  charset = CHARS,
  size = "md",
  stagger = 45,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** What to show. Letters are upper-cased; anything not in `charset` becomes a blank. */
  value: string;
  /** Number of cells. The value is padded with blanks, or cut, to fit. Defaults to its length. */
  length?: number;
  /** The characters a flap can show, in the order it cycles through them. Keep the blank first. */
  charset?: string;
  size?: keyof typeof SIZES;
  /** Delay between one cell starting and the next, in ms. */
  stagger?: number;
  className?: string;
}) {
  const n = length ?? value.length;
  const text = value.toUpperCase().padEnd(n, " ").slice(0, n);
  return (
    <div
      role="img"
      aria-label={value}
      {...props}
      className={cn("inline-flex gap-[3px]", className)}
    >
      {Array.from(text, (ch, i) => (
        <Cell key={i} ch={ch} charset={charset} delay={i * stagger} className={SIZES[size]} />
      ))}
    </div>
  );
}

function Half({
  k,
  top,
  initial,
  className,
}: {
  k: string;
  top: boolean;
  initial: string;
  className?: string;
}) {
  return (
    <div
      data-k={k}
      aria-hidden
      className={cn(
        "absolute inset-x-0 h-1/2 overflow-hidden bg-[#2b2925] [backface-visibility:hidden]",
        top ? "top-0 origin-bottom rounded-t-[inherit]" : "bottom-0 origin-top rounded-b-[inherit]",
        className,
      )}
      style={{
        backgroundImage: top
          ? "linear-gradient(to bottom, rgb(255 255 255 / 0.11), rgb(255 255 255 / 0.03))"
          : "linear-gradient(to bottom, rgb(0 0 0 / 0.22), rgb(0 0 0 / 0) 70%)",
      }}
    >
      <span
        className={cn(
          "absolute inset-x-0 flex h-[200%] items-center justify-center font-mono font-semibold leading-none text-[#f4f2ee]",
          top ? "top-0" : "bottom-0",
        )}
      >
        {initial}
      </span>
    </div>
  );
}

function Cell({
  ch,
  charset,
  delay,
  className,
}: {
  ch: string;
  charset: string;
  delay: number;
  className: string;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  // The first character is rendered by React; after that the flaps are changed directly,
  // so React never rewrites a glyph in the middle of a turn.
  const [initial] = React.useState(ch);
  const at = React.useRef(Math.max(0, charset.indexOf(initial)));

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const half = (k: string) => el.querySelector<HTMLElement>(`[data-k='${k}']`)!;
    const baseTop = half("bt");
    const baseBottom = half("bb");
    const flapTop = half("ft");
    const flapBottom = half("fb");
    const size = charset.length;
    const target = Math.max(0, charset.indexOf(ch));
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = true;

    const glyph = (e: HTMLElement, i: number) => {
      e.firstElementChild!.textContent = charset[i] ?? " ";
    };
    const settle = (i: number) => {
      for (const e of [baseTop, baseBottom, flapTop, flapBottom]) glyph(e, i);
      flapTop.style.visibility = "visible";
      flapBottom.style.visibility = "hidden";
    };

    settle(at.current);
    if (calm) {
      at.current = target;
      settle(target);
      return;
    }

    const run = async () => {
      if (delay) await sleep(delay);
      while (alive && at.current !== target) {
        const left = (target - at.current + size) % size;
        // Far to go: turn faster. Close: let each flap read.
        const dur = Math.min(78, Math.max(34, 900 / left));
        const next = (at.current + 1) % size;
        glyph(baseTop, next);
        glyph(baseBottom, at.current);
        glyph(flapTop, at.current);
        glyph(flapBottom, next);
        flapTop.style.visibility = "visible";
        flapBottom.style.visibility = "hidden";

        const down = flapTop.animate(
          [
            { transform: "rotateX(0deg)", filter: "brightness(1)" },
            { transform: "rotateX(-90deg)", filter: "brightness(0.5)" },
          ],
          { duration: dur, easing: "cubic-bezier(0.5, 0, 0.9, 0.6)", fill: "forwards" },
        );
        await down.finished.catch(() => {});
        if (!alive) break;
        flapTop.style.visibility = "hidden";
        flapBottom.style.visibility = "visible";
        const land = flapBottom.animate(
          [
            { transform: "rotateX(90deg)", filter: "brightness(0.6)" },
            { transform: "rotateX(0deg)", filter: "brightness(1)" },
          ],
          { duration: dur, easing: "cubic-bezier(0.2, 0.5, 0.5, 1)", fill: "forwards" },
        );
        await land.finished.catch(() => {});
        down.cancel();
        land.cancel();
        if (!alive) break;
        at.current = next;
        settle(next);
      }
    };
    void run();

    return () => {
      alive = false;
      for (const a of el.getAnimations({ subtree: true })) a.cancel();
      settle(at.current);
    };
  }, [ch, charset, delay]);

  return (
    <div
      ref={root}
      aria-hidden
      className={cn(
        "relative select-none shadow-[0_2px_4px_rgb(0_0_0/0.3),inset_0_0_0_1px_rgb(255_255_255/0.06)] [perspective:420px]",
        className,
      )}
    >
      <Half k="bt" top initial={initial} />
      <Half k="bb" top={false} initial={initial} />
      <Half k="ft" top initial={initial} className="z-[2]" />
      <Half k="fb" top={false} initial={initial} className="z-[3]" />
      {/* the hinge */}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-[2px] -translate-y-1/2 bg-black/70" />
      <span className="pointer-events-none absolute left-0 top-1/2 z-10 size-[3px] -translate-y-1/2 rounded-full bg-black/70" />
      <span className="pointer-events-none absolute right-0 top-1/2 z-10 size-[3px] -translate-y-1/2 rounded-full bg-black/70" />
    </div>
  );
}
