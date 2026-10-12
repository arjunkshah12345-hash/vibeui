"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type DonutSlice = { label: string; value: number; color?: string };

const PALETTE = ["#1b1a17", "#e0763a", "#3f7f93", "#c9a24b", "#7a6aa8", "#8aa86b", "#b95a6a"];

/**
 * A donut chart whose slices sweep in, lift when you point at them, and report their share in the middle.
 *
 * The rest of the ring fades back while one slice is active. Hover or Tab to a slice, or to a
 * legend row, and the centre shows its name, value and percentage.
 */
export function DonutChart({
  data,
  size = 220,
  thickness = 26,
  gap = 3,
  total: totalLabel = "Total",
  format = (n: number) => String(n),
  legend = true,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  data: DonutSlice[];
  /** Diameter in px. */
  size?: number;
  /** Ring width in px. */
  thickness?: number;
  /** Space between slices, in px along the ring. */
  gap?: number;
  /** Label under the sum when nothing is active. */
  total?: string;
  format?: (n: number) => string;
  /** Show a list of slices beside the chart. */
  legend?: boolean;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const [grown, setGrown] = React.useState(false);
  const [hot, setHot] = React.useState<number | null>(null);

  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setGrown(true), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const sum = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = (size - thickness - 12) / 2;
  const c = 2 * Math.PI * r;
  const colorOf = (i: number) => data[i].color ?? PALETTE[i % PALETTE.length];
  const starts = data.reduce<number[]>((acc, d, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + (data[i - 1].value / sum) * c);
    return acc;
  }, []);
  const active = hot !== null ? data[hot] : null;

  return (
    <div
      {...props}
      ref={box}
      className={cn("flex flex-wrap items-center gap-8", className)}
      onPointerLeave={() => setHot(null)}
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90 overflow-visible"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--line)"
            strokeWidth={thickness}
          />
          {data.map((d, i) => {
            const len = Math.max(0, (d.value / sum) * c - gap);
            const lifted = hot === i;
            return (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={colorOf(i)}
                strokeWidth={lifted ? thickness + 8 : thickness}
                strokeDasharray={`${grown ? len : 0} ${c}`}
                strokeDashoffset={-starts[i] - gap / 2}
                strokeLinecap="butt"
                opacity={hot === null || lifted ? 1 : 0.28}
                tabIndex={0}
                role="img"
                aria-label={`${d.label}: ${format(d.value)}, ${Math.round((d.value / sum) * 100)} percent`}
                onPointerEnter={() => setHot(i)}
                onFocus={() => setHot(i)}
                onBlur={() => setHot(null)}
                className="cursor-pointer outline-none"
                style={{
                  transition: `stroke-dasharray 900ms cubic-bezier(0.25, 0.8, 0.25, 1) ${i * 90}ms, stroke-width 220ms cubic-bezier(0.3, 1.4, 0.5, 1), opacity 180ms`,
                }}
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-display text-4xl leading-none tabular-nums tracking-tight text-ink">
              {format(active ? active.value : sum)}
            </p>
            <p className="mt-1.5 max-w-24 truncate text-xs text-muted">
              {active ? `${active.label} · ${Math.round((active.value / sum) * 100)}%` : totalLabel}
            </p>
          </div>
        </div>
      </div>
      {legend && (
        <ul className="min-w-40 flex-1 space-y-1">
          {data.map((d, i) => (
            <li key={d.label}>
              <button
                type="button"
                onPointerEnter={() => setHot(i)}
                onFocus={() => setHot(i)}
                onBlur={() => setHot(null)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2.5 py-1.5 text-left text-sm outline-none transition-colors",
                  hot === i ? "bg-surface-muted" : "hover:bg-surface-muted",
                )}
              >
                <span className="size-2.5 rounded-full" style={{ background: colorOf(i) }} />
                <span className="flex-1 text-ink-soft">{d.label}</span>
                <span className="font-mono text-xs tabular-nums text-muted">{format(d.value)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
