"use client";

import * as React from "react";
import { Star } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Star rating with hover preview. Use readOnly to display a score. */
export function Rating({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  size = 20,
  className,
  readOnly,
}: {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: number;
  className?: string;
  readOnly?: boolean;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const [hover, setHover] = React.useState<number | null>(null);
  const current = value ?? uncontrolled;
  const display = hover ?? current;

  return (
    <div
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`Rating: ${current} of ${max}`}
      className={cn("inline-flex items-center", className)}
      onMouseLeave={() => setHover(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= display;
        return (
          <button
            key={n}
            type="button"
            role={readOnly ? undefined : "radio"}
            aria-checked={readOnly ? undefined : n === current}
            disabled={readOnly}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            onMouseEnter={() => !readOnly && setHover(n)}
            onClick={() => {
              if (readOnly) return;
              setUncontrolled(n);
              onChange?.(n);
            }}
            className="rounded-sm p-0.5 transition-transform duration-150 enabled:hover:scale-110 enabled:active:scale-95 disabled:cursor-default"
          >
            <Star
              size={size}
              weight={filled ? "fill" : "regular"}
              className={cn(
                "transition-colors duration-150",
                filled ? "text-accent" : "text-line-strong",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
