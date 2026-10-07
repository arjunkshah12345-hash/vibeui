"use client";

import * as React from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function NumberField({
  value,
  defaultValue = 0,
  min = 0,
  max = 99,
  step = 1,
  onChange,
  className,
}: {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  className?: string;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = value ?? uncontrolled;

  const set = (n: number) => {
    const next = Math.min(max, Math.max(min, n));
    setUncontrolled(next);
    onChange?.(next);
  };

  return (
    <div
      className={cn(
        "inline-flex h-10 items-center overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease"
        className="flex size-10 items-center justify-center text-muted transition-colors hover:bg-surface-muted hover:text-ink"
        onClick={() => set(current - step)}
      >
        <Minus size={14} weight="bold" />
      </button>
      <input
        type="number"
        value={current}
        min={min}
        max={max}
        onChange={(e) => set(Number(e.target.value))}
        className="h-full w-14 border-x border-line bg-transparent text-center text-sm tabular-nums text-ink outline-none"
      />
      <button
        type="button"
        aria-label="Increase"
        className="flex size-10 items-center justify-center text-muted transition-colors hover:bg-surface-muted hover:text-ink"
        onClick={() => set(current + step)}
      >
        <Plus size={14} weight="bold" />
      </button>
    </div>
  );
}
