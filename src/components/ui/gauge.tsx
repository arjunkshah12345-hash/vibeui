"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type GaugeZone = { to: number; color: string };

const CX = 110;
const CY = 110;
const R = 84;

// A point on the dial: 0 is the far left, 1 the far right, both on the horizon.
const polar = (t: number, radius: number) => {
  const a = Math.PI * (1 - t);
  return [CX + Math.cos(a) * radius, CY - Math.sin(a) * radius] as const;
};

const arc = (t0: number, t1: number, radius: number) => {
  const [x0, y0] = polar(t0, radius);
  const [x1, y1] = polar(t1, radius);
  return `M ${x0} ${y0} A ${radius} ${radius} 0 0 1 ${x1} ${y1}`;
};

/**
 * A dial gauge: coloured bands, a ticked scale and a needle that swings to the value and overshoots a little.
 *
 * The readout counts up to match. Good for scores, speeds, loads and anything with a healthy
 * zone and an unhealthy one.
 */
export function Gauge({
  value,
  min = 0,
  max = 100,
  zones,
  unit,
  label,
  format = (n: number) => String(Math.round(n)),
  ticks = 10,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  value: number;
  min?: number;
  max?: number;
  /** Coloured bands from the left, each ending at `to`. Without them the dial is a single arc. */
  zones?: GaugeZone[];
  /** Printed after the number. */
  unit?: string;
  /** Printed under the number. */
  label?: string;
  format?: (n: number) => string;
  /** Number of divisions on the scale. */
  ticks?: number;
}) {
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const [shown, setShown] = React.useState(min);
  const from = React.useRef(min);

  // Count the readout up (or down) to the new value in step with the needle.
  React.useEffect(() => {
    const start = from.current;
    const t0 = performance.now();
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const step = (now: number) => {
      const k = calm ? 1 : Math.min(1, (now - t0) / 900);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = start + (value - start) * eased;
      from.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const bands: GaugeZone[] = zones?.length ? zones : [{ to: max, color: "var(--ink)" }];
  const drawn = bands.map((z, i) => {
    const start = i === 0 ? min : bands[i - 1].to;
    return {
      a: (start - min) / (max - min),
      b: (Math.min(z.to, max) - min) / (max - min),
      color: z.color,
    };
  });
  const current = bands.find((z) => value <= z.to) ?? bands[bands.length - 1];

  return (
    <div
      role="meter"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      {...props}
      className={cn("inline-block w-full max-w-[320px]", className)}
    >
      <svg viewBox="0 0 220 138" className="block w-full" aria-hidden>
        {/* the track and the coloured bands over it */}
        <path
          d={arc(0, 1, R)}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {drawn.map((d, i) => (
          <path
            key={i}
            d={arc(d.a + 0.004, Math.max(d.a + 0.004, d.b - 0.004), R)}
            fill="none"
            stroke={d.color}
            strokeWidth="14"
            strokeLinecap="butt"
            opacity={zones?.length ? 0.9 : 1}
          />
        ))}
        {/* the scale */}
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const u = i / ticks;
          const major = i % 5 === 0 || ticks <= 5;
          const [x0, y0] = polar(u, R - 14);
          const [x1, y1] = polar(u, R - (major ? 22 : 19));
          return (
            <line
              key={i}
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              stroke="var(--muted)"
              strokeWidth={major ? 1.6 : 1}
              strokeLinecap="round"
            />
          );
        })}
        {[0, 1].map((u) => {
          const [x, y] = polar(u, R + 1);
          return (
            <text
              key={u}
              x={x}
              y={y + 16}
              textAnchor="middle"
              className="fill-muted font-mono text-[9px]"
            >
              {format(u ? max : min)}
            </text>
          );
        })}
        {/* the needle: it points up at rest and turns about the hub */}
        <g
          style={{
            transform: `rotate(${(t - 0.5) * 180}deg)`,
            transformOrigin: `${CX}px ${CY}px`,
            transition: "transform 1000ms cubic-bezier(0.3, 1.45, 0.5, 1)",
          }}
        >
          <path
            d={`M ${CX - 4.5} ${CY} L ${CX} ${CY - R + 14} L ${CX + 4.5} ${CY} Z`}
            fill="var(--ink)"
          />
          <line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY + 14}
            stroke="var(--ink)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
        <circle cx={CX} cy={CY} r="9" fill="var(--surface)" stroke="var(--ink)" strokeWidth="3" />
        <circle cx={CX} cy={CY} r="3" fill={current.color} />
      </svg>
      <div className="-mt-1 text-center">
        <p className="font-display text-5xl leading-none tabular-nums tracking-tight text-ink">
          {format(shown)}
          {unit && <span className="ml-1 text-xl text-muted">{unit}</span>}
        </p>
        {label && (
          <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
