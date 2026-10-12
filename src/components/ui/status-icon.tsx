"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusKind = "success" | "error" | "warning" | "info";

const COLOR: Record<StatusKind, string> = {
  success: "#16a34a",
  error: "#dc2626",
  warning: "#d97706",
  info: "#2563eb",
};

const GLYPH: Record<StatusKind, string[]> = {
  success: ["M16 33.5l10 10 22-23"],
  error: ["M21 21l22 22", "M43 21L21 43"],
  warning: ["M32 19v17", "M32 45v.5"],
  info: ["M32 29v16", "M32 20v.5"],
};

// Each stroke draws itself in when it first appears. Keeping these functions outside the
// component keeps them stable, so a re-render does not replay the animation.
const stroke = (delay: number, ms: number) => (el: SVGElement | null) => {
  el?.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
    duration: ms,
    delay,
    easing: "cubic-bezier(0.3, 0.8, 0.3, 1)",
    fill: "both",
  });
};
const drawRing = stroke(0, 520);
const drawGlyph = stroke(300, 380);

const pop = (el: Element | null) => {
  el?.animate(
    [
      { transform: "scale(0.7)", opacity: 0 },
      { transform: "scale(1.08)", opacity: 1, offset: 0.6 },
      { transform: "scale(1)", opacity: 1 },
    ],
    { duration: 520, easing: "cubic-bezier(0.3, 1.2, 0.5, 1)", fill: "both" },
  );
};

const halo = (el: Element | null) => {
  el?.animate(
    [
      { transform: "scale(0.8)", opacity: 0.45 },
      { transform: "scale(1.5)", opacity: 0 },
    ],
    { duration: 900, delay: 350, easing: "ease-out", fill: "both" },
  );
};

/**
 * A status mark that draws itself: a ring sweeps round, then a tick, cross or exclamation is written inside it.
 *
 * Use it for a result a person is waiting on. Success also sends out a soft halo. Change `status`
 * and the new mark draws in from scratch.
 */
export function StatusIcon({
  status = "success",
  size = 64,
  filled = false,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  status?: StatusKind;
  /** Diameter in px. */
  size?: number;
  /** Fill the circle with a soft tint instead of leaving it open. */
  filled?: boolean;
}) {
  const color = COLOR[status];
  return (
    <span
      role="img"
      aria-label={status}
      {...props}
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size, color, ...props.style }}
    >
      {status === "success" && (
        <span
          key={`h-${status}`}
          ref={halo}
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${color}33, transparent 70%)` }}
        />
      )}
      <svg
        key={status}
        ref={pop}
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        aria-hidden
        className="relative overflow-visible"
      >
        {filled && <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.12" />}
        <circle
          ref={drawRing}
          cx="32"
          cy="32"
          r="28"
          pathLength={1}
          strokeDasharray={1}
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
        {GLYPH[status].map((d) => (
          <path
            key={d}
            ref={drawGlyph}
            d={d}
            pathLength={1}
            strokeDasharray={1}
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </span>
  );
}
