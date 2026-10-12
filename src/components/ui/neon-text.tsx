"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Glowing neon lettering that switches on letter by letter with a stutter, then hums with the odd flicker.
 *
 * Every letter is an unlit glass tube with a lit one on top of it, so you see the dark outline until the
 * power reaches it. The glow spreads onto the wall behind. Set the size with a text class.
 */
export function NeonText({
  children,
  color = "#ff3d9a",
  flicker = true,
  halo = true,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** The text. Keep it a plain string. */
  children: string;
  /** Colour of the gas. The core of the tube is a paler tint of it. */
  color?: string;
  /** Let a random letter stutter now and then. */
  flicker?: boolean;
  /** Spill a soft glow behind the letters. */
  halo?: boolean;
}) {
  const root = React.useRef<HTMLSpanElement>(null);
  const letters = Array.from(children);
  const core = `color-mix(in oklab, ${color}, white 72%)`;

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lit = Array.from(el.querySelectorAll<HTMLElement>("[data-lit]"));
    const halos = Array.from(el.querySelectorAll<HTMLElement>("[data-halo]"));
    if (calm) {
      for (const l of [...lit, ...halos])
        l.style.opacity = l.dataset.halo !== undefined ? "0.5" : "1";
      return;
    }
    let timer = 0;
    let cancelled = false;
    const ignite = () => {
      lit.forEach((l, i) => {
        // The tube stutters on: bright, dim, bright, then holds.
        const delay = 150 + i * 130 + Math.random() * 160;
        l.animate(
          [
            { opacity: 0 },
            { opacity: 0.95, offset: 0.12 },
            { opacity: 0.1, offset: 0.26 },
            { opacity: 1, offset: 0.4 },
            { opacity: 0.35, offset: 0.56 },
            { opacity: 1, offset: 0.7 },
            { opacity: 0.8, offset: 0.82 },
            { opacity: 1 },
          ],
          { duration: 780, delay, fill: "both" },
        );
        halos[i]?.animate([{ opacity: 0 }, { opacity: 0.5 }], {
          duration: 900,
          delay: delay + 200,
          fill: "both",
        });
      });
    };
    const hum = () => {
      if (cancelled) return;
      const i = Math.floor(Math.random() * lit.length);
      const l = lit[i];
      const h = halos[i];
      if (l && l.dataset.dead === undefined) {
        const keys = [
          { opacity: 1 },
          { opacity: 0.15, offset: 0.15 },
          { opacity: 1, offset: 0.3 },
          { opacity: 0.3, offset: 0.5 },
          { opacity: 1, offset: 0.62 },
          { opacity: 0.6, offset: 0.78 },
          { opacity: 1 },
        ];
        l.animate(keys, { duration: 520 });
        h?.animate(
          keys.map((k) => ({ ...k, opacity: k.opacity * 0.5 })),
          { duration: 520 },
        );
      }
      timer = window.setTimeout(hum, 2200 + Math.random() * 4200);
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      ignite();
      if (flicker) timer = window.setTimeout(hum, 1800 + lit.length * 150 + 1200);
    });
    io.observe(el);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [children, flicker]);

  return (
    <span
      role="img"
      aria-label={children}
      {...props}
      ref={root}
      className={cn("inline-flex whitespace-pre font-sans font-extrabold tracking-wide", className)}
    >
      {letters.map((ch, i) => (
        <span key={i} aria-hidden className="relative inline-block">
          {halo && ch.trim() && (
            <span
              data-halo
              className="absolute inset-0 opacity-0 blur-[26px]"
              style={{ color, WebkitTextStroke: `6px ${color}` }}
            >
              {ch}
            </span>
          )}
          {/* the unlit glass: only an outline, dark until the gas takes */}
          <span
            className="relative text-transparent"
            style={{ WebkitTextStroke: "0.045em rgb(255 255 255 / 0.2)" }}
          >
            {ch}
          </span>
          {ch.trim() && (
            <span
              data-lit
              className="absolute inset-0 text-transparent opacity-0"
              style={{
                WebkitTextStroke: `0.045em ${core}`,
                filter: `drop-shadow(0 0 0.04em ${core}) drop-shadow(0 0 0.1em ${color}) drop-shadow(0 0 0.28em ${color}) drop-shadow(0 0 0.7em ${color})`,
              }}
            >
              {ch}
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
