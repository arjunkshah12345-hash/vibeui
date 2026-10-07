"use client";

import * as React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function Calendar({
  value,
  onChange,
  className,
}: {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}) {
  // Fixed fallback avoids prerender time-skew; sync from `value` after mount.
  const [cursor, setCursor] = React.useState(() => value ?? new Date(2026, 9, 1));

  React.useEffect(() => {
    if (value) setCursor(value);
  }, [value]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstDay }, () => null as number | null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selected =
    value &&
    value.getFullYear() === year &&
    value.getMonth() === month
      ? value.getDate()
      : null;

  return (
    <div
      className={cn(
        "w-[280px] rounded-[var(--radius-lg)] border border-line bg-surface p-3",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-surface-muted hover:text-ink"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
        >
          <CaretLeft size={14} weight="bold" />
        </button>
        <p className="text-sm font-medium text-ink">
          {cursor.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-surface-muted hover:text-ink"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
        >
          <CaretRight size={14} weight="bold" />
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-1 text-center font-mono text-[10px] uppercase text-faint"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) =>
          day === null ? (
            <div key={`e-${i}`} />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => onChange?.(new Date(year, month, day))}
              className={cn(
                "flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-[13px] transition-colors",
                selected === day
                  ? "bg-ink text-surface"
                  : "text-ink-soft hover:bg-surface-muted",
              )}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
