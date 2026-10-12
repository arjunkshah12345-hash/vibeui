"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// A smooth curve that never overshoots the data (monotone cubic, as in d3's curveMonotoneX).
function smooth(pts: [number, number][]) {
  const n = pts.length;
  if (n < 2) return "";
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0]);
    m.push((pts[i + 1][1] - pts[i][1]) / dx[i]);
  }
  const t = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  t.push(m[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C ${pts[i][0] + h} ${pts[i][1] + t[i] * h}, ${pts[i + 1][0] - h} ${pts[i + 1][1] - t[i + 1] * h}, ${pts[i + 1][0]} ${pts[i + 1][1]}`;
  }
  return d;
}

const drawIn = (el: SVGPathElement | null) => {
  el?.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
    duration: 1100,
    easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
    fill: "both",
  });
};
const fadeIn = (el: SVGPathElement | null) => {
  el?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 350, fill: "both" });
};

/**
 * A tiny trend line for dropping into a table cell or a stat: smooth, gradient-filled, with a live end point.
 *
 * It draws itself in, picks green or red from the direction of the trend, and scrubs on hover to
 * show the value under the pointer.
 */
export function Sparkline({
  data,
  color,
  format = (n: number) => String(n),
  area = true,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  data: number[];
  /** Line colour. By default it follows the trend: green up, red down, ink flat. */
  color?: string;
  /** How a value is written in the hover bubble. */
  format?: (n: number) => string;
  /** Fill under the line. */
  area?: boolean;
}) {
  const id = React.useId();
  const [hot, setHot] = React.useState<number | null>(null);
  const H = 40;
  const lo = Math.min(...data);
  const hi = Math.max(...data);
  const span = hi - lo || 1;
  const pts: [number, number][] = data.map((v, i) => [
    (i / Math.max(1, data.length - 1)) * 100,
    H - 4 - ((v - lo) / span) * (H - 8),
  ]);
  const line = smooth(pts);
  const trend = data[data.length - 1] - data[0];
  const tone = color ?? (trend > 0 ? "#16a34a" : trend < 0 ? "#dc2626" : "var(--ink)");
  const i = hot ?? data.length - 1;
  const [px, py] = pts[i] ?? [0, 0];

  return (
    <div
      {...props}
      className={cn("relative h-10 w-full min-w-24", className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const t = (e.clientX - r.left) / r.width;
        setHot(Math.min(data.length - 1, Math.max(0, Math.round(t * (data.length - 1)))));
      }}
      onPointerLeave={() => setHot(null)}
      role="img"
      aria-label={`Trend from ${format(data[0])} to ${format(data[data.length - 1])}`}
    >
      <svg
        viewBox={`0 0 100 ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full overflow-visible"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={tone} stopOpacity="0.28" />
            <stop offset="1" stopColor={tone} stopOpacity="0" />
          </linearGradient>
        </defs>
        {area && line && (
          <path ref={fadeIn} d={`${line} L 100 ${H} L 0 ${H} Z`} fill={`url(#${id})`} />
        )}
        <path
          ref={drawIn}
          d={line}
          pathLength={1}
          strokeDasharray={1}
          fill="none"
          stroke={tone}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {hot !== null && (
          <line
            x1={px}
            x2={px}
            y1={0}
            y2={H}
            stroke={tone}
            strokeOpacity="0.35"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      {/* the dot is HTML so it stays round however the chart is stretched */}
      <span
        aria-hidden
        className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface"
        style={{
          left: `${px}%`,
          top: `${(py / H) * 100}%`,
          background: tone,
          transition: hot === null ? "left 200ms, top 200ms" : undefined,
        }}
      >
        {hot === null && (
          <span
            className="absolute inset-[-5px] animate-pulse-quiet rounded-full opacity-40"
            style={{ background: tone }}
          />
        )}
      </span>
      {hot !== null && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-7 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-surface"
          style={{ left: `${Math.min(88, Math.max(12, px))}%` }}
        >
          {format(data[hot])}
        </span>
      )}
    </div>
  );
}
