"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Segmented control with a sliding selection thumb. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  return (
    <div
      role="radiogroup"
      className={cn(
        "relative inline-grid rounded-md bg-surface-muted p-1",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 rounded-sm bg-surface shadow-quiet transition-transform duration-300 ease-out"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(${index * 100}%)`,
        }}
      />
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative z-10 h-8 rounded-sm px-4 text-[13px] font-medium transition-colors duration-200",
              selected ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
