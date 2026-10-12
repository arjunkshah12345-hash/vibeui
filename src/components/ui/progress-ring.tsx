import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A circular progress indicator with room in the middle: a smooth ring, or a dial of ticks that light up.
 *
 * The ring eases to each new value and can run on a gradient. With no value it spins as an indeterminate
 * loader. Put a number, an icon or a label in the centre.
 */
export function ProgressRing({
  value,
  size = 112,
  thickness = 9,
  variant = "ring",
  from = "var(--ink)",
  to,
  children,
  label = "Progress",
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** 0 to 100. Leave it out for an indeterminate spinner. */
  value?: number;
  /** Diameter in px. */
  size?: number;
  /** Stroke width of the ring in px. */
  thickness?: number;
  /** `ticks` draws a dial of 60 marks instead of a solid ring. */
  variant?: "ring" | "ticks";
  /** Start colour of the progress. */
  from?: string;
  /** End colour. When set, the ring becomes a gradient. */
  to?: string;
  /** What sits in the centre. */
  children?: React.ReactNode;
  /** Announced to screen readers. */
  label?: string;
}) {
  const id = React.useId();
  const indeterminate = value === undefined;
  const v = Math.min(100, Math.max(0, value ?? 28));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const TICKS = 60;
  const lit = Math.round((v / 100) * TICKS);
  const grad = to ? `url(#${id})` : from;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : Math.round(v)}
      {...props}
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size, ...props.style }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
        className={cn(
          "absolute inset-0 -rotate-90",
          indeterminate && "animate-spin-quiet [animation-duration:1.1s]",
        )}
      >
        {to && (
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={from} />
              <stop offset="1" stopColor={to} />
            </linearGradient>
          </defs>
        )}
        {variant === "ring" ? (
          <>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="var(--line-strong)"
              strokeWidth={thickness}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={grad}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - v / 100)}
              style={{
                transition: indeterminate
                  ? undefined
                  : "stroke-dashoffset 800ms cubic-bezier(0.25, 0.8, 0.25, 1)",
              }}
            />
          </>
        ) : (
          Array.from({ length: TICKS }, (_, i) => {
            const a = (i / TICKS) * Math.PI * 2;
            const outer = size / 2 - 1;
            const inner = outer - thickness * 1.5;
            const on = i < lit;
            return (
              <line
                key={i}
                x1={size / 2 + Math.cos(a) * inner}
                y1={size / 2 + Math.sin(a) * inner}
                x2={size / 2 + Math.cos(a) * outer}
                y2={size / 2 + Math.sin(a) * outer}
                stroke={on ? grad : "var(--line-strong)"}
                strokeWidth={Math.max(1.5, size / 56)}
                strokeLinecap="round"
                style={{
                  transition: `stroke 200ms ${on ? i * 6 : 0}ms, opacity 200ms`,
                  opacity: on ? 1 : 0.9,
                }}
              />
            );
          })
        )}
      </svg>
      <div className="relative grid place-items-center text-center">{children}</div>
    </div>
  );
}
