"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Range slider with an accent fill, built on a native range input. */
export function Slider({
  value,
  defaultValue = 40,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  className,
  label,
  disabled,
}: {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  className?: string;
  label?: string;
  disabled?: boolean;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = value ?? uncontrolled;
  const pct = ((current - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-1 flex items-center justify-between text-[13px]">
          <span className="font-medium text-ink-soft">{label}</span>
          <span className="font-mono text-xs tabular-nums text-muted">
            {current}
          </span>
        </div>
      ) : null}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => {
          const next = Number(e.target.value);
          setUncontrolled(next);
          onValueChange?.(next);
        }}
        style={{
          background: `linear-gradient(to right, var(--accent) ${pct}%, var(--surface-sunken) ${pct}%)`,
        }}
        className={cn(
          "my-2.5 block h-1.5 w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed disabled:opacity-45",
          "[&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:bg-surface [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgb(0_0_0/0.25)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95",
          "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:bg-surface [&::-moz-range-thumb]:shadow-[0_1px_3px_rgb(0_0_0/0.25)]",
          "focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:ring-[3px] focus-visible:[&::-webkit-slider-thumb]:ring-ring",
        )}
      />
    </div>
  );
}
