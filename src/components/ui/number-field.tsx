"use client";

import * as React from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Numeric stepper with min/max clamping. */
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
    if (Number.isNaN(n)) return;
    const next = Math.min(max, Math.max(min, n));
    setUncontrolled(next);
    onChange?.(next);
  };

  const stepper =
    "flex size-full w-10 items-center justify-center text-muted transition-[background-color,color,transform] duration-150 hover:bg-surface-muted hover:text-ink active:scale-90 disabled:pointer-events-none disabled:opacity-35";

  return (
    <div
      className={cn(
        "inline-flex h-10 w-fit items-stretch overflow-hidden rounded-sm border border-line-strong bg-surface shadow-quiet transition-[border-color,box-shadow] duration-150 focus-within:border-accent focus-within:ring-[3px] focus-within:ring-ring",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease"
        disabled={current <= min}
        className={stepper}
        onClick={() => set(current - step)}
      >
        <Minus size={14} weight="bold" />
      </button>
      <input
        type="number"
        value={current}
        min={min}
        max={max}
        step={step}
        onChange={(e) => set(e.target.valueAsNumber)}
        className="w-14 border-x border-line bg-transparent text-center text-sm tabular-nums text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Increase"
        disabled={current >= max}
        className={stepper}
        onClick={() => set(current + step)}
      >
        <Plus size={14} weight="bold" />
      </button>
    </div>
  );
}
