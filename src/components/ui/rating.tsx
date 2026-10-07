"use client";

import * as React from "react";
import { Star } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  className,
  readOnly,
}: {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  className?: string;
  readOnly?: boolean;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const [hover, setHover] = React.useState<number | null>(null);
  const current = value ?? uncontrolled;
  const display = hover ?? current;

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      onMouseLeave={() => setHover(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= display;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            onMouseEnter={() => !readOnly && setHover(n)}
            onClick={() => {
              if (readOnly) return;
              setUncontrolled(n);
              onChange?.(n);
            }}
            className="p-0.5 text-ink disabled:cursor-default"
          >
            <Star
              size={18}
              weight={filled ? "fill" : "regular"}
              className={filled ? "text-ink" : "text-line-strong"}
            />
          </button>
        );
      })}
    </div>
  );
}
