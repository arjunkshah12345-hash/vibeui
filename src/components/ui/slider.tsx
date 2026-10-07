"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Slider({
  value,
  defaultValue = 40,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  className,
  label,
}: {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  className?: string;
  label?: string;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = value ?? uncontrolled;
  const pct = ((current - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-xs text-muted">
          <span>{label}</span>
          <span className="font-mono tabular-nums text-ink-soft">{current}</span>
        </div>
      ) : null}
      <div className="relative flex h-6 items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-surface-muted" />
        <div
          className="absolute left-0 h-1.5 rounded-full bg-ink"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(e) => {
            const next = Number(e.target.value);
            setUncontrolled(next);
            onValueChange?.(next);
          }}
          className="relative z-10 w-full cursor-pointer appearance-none bg-transparent accent-[var(--ink)] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-line [&::-webkit-slider-thumb]:bg-surface [&::-webkit-slider-thumb]:shadow-[var(--shadow-quiet)]"
        />
      </div>
    </div>
  );
}
