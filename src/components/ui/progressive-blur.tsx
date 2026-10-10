import * as React from "react";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";

const TOWARD: Record<Side, string> = {
  // The gradient runs from clear (0%) to fully blurred (100%) at the edge.
  top: "to top",
  bottom: "to bottom",
  left: "to left",
  right: "to right",
};

/**
 * A blur that builds gradually toward an edge, with no visible line where it starts.
 *
 * Stack it over the end of a scrolling list, or the bottom of an image, to dissolve whatever passes
 * under it. Several backdrop-blur layers, each stronger and masked to a narrower band, make the ramp smooth.
 * Place it inside a `relative` parent.
 */
export function ProgressiveBlur({
  side = "bottom",
  size = 96,
  blur = 14,
  layers = 8,
  tint = false,
  className,
  style,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Which edge of the parent it sits on. */
  side?: Side;
  /** How deep the band is, in px. */
  size?: number;
  /** Blur radius at the very edge, in px. */
  blur?: number;
  /** More layers make a smoother ramp and cost a little more to draw. */
  layers?: number;
  /** Fade into the page colour as well, so text on top stays readable. */
  tint?: boolean;
}) {
  const n = Math.max(2, Math.min(12, Math.round(layers)));
  const step = 100 / (n + 1);
  const horizontal = side === "left" || side === "right";
  const dir = TOWARD[side];

  return (
    <div
      aria-hidden
      {...props}
      className={cn("pointer-events-none absolute z-10", className)}
      style={{
        [side]: 0,
        ...(horizontal ? { top: 0, bottom: 0, width: size } : { left: 0, right: 0, height: size }),
        ...style,
      }}
    >
      {Array.from({ length: n }, (_, i) => {
        // Each layer blurs twice as much as the one before; the last one reaches `blur`.
        const radius = blur * Math.pow(2, i - (n - 1));
        const a = i * step;
        const stops = [
          `rgb(0 0 0 / 0) ${a}%`,
          `rgb(0 0 0 / 1) ${a + step}%`,
          i === n - 1 ? "rgb(0 0 0 / 1) 100%" : `rgb(0 0 0 / 1) ${a + step * 2}%`,
          i < n - 2 ? `rgb(0 0 0 / 0) ${a + step * 3}%` : null,
        ]
          .filter(Boolean)
          .join(", ");
        const mask = `linear-gradient(${dir}, ${stops})`;
        const filter = `blur(${radius.toFixed(2)}px)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: filter,
              WebkitBackdropFilter: filter,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
      {tint && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${dir}, transparent, color-mix(in oklab, var(--canvas) 70%, transparent))`,
          }}
        />
      )}
    </div>
  );
}
