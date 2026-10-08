"use client";

import * as React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const noop = () => () => {};
const todayKey = () => key(new Date());

/** Month grid date picker. Months slide in the direction you navigate; days respond to press. */
export function Calendar({
  value,
  defaultMonth,
  onChange,
  className,
}: {
  value?: Date;
  defaultMonth?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}) {
  const [cursor, setCursor] = React.useState(
    () => value ?? defaultMonth ?? new Date(2026, 0, 1),
  );
  const [dir, setDir] = React.useState<"next" | "prev" | null>(null);
  const [prevValue, setPrevValue] = React.useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value) setCursor(value);
  }

  // Empty on the server so markup matches, real "today" on the client.
  const today = React.useSyncExternalStore(noop, todayKey, () => "");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstDay }, () => null as number | null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const go = (delta: number) => {
    setDir(delta > 0 ? "next" : "prev");
    setCursor(new Date(year, month + delta, 1));
  };

  const nav =
    "flex size-8 items-center justify-center rounded-sm text-muted transition-[background-color,color,transform] duration-150 hover:bg-surface-muted hover:text-ink active:scale-90";

  return (
    <div
      className={cn(
        "w-full max-w-[320px] rounded-lg border border-line bg-surface p-3 shadow-quiet",
        className,
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <button type="button" aria-label="Previous month" className={nav} onClick={() => go(-1)}>
          <CaretLeft size={14} weight="bold" />
        </button>
        <p
          key={`${year}-${month}`}
          className={cn(
            "text-sm font-medium tracking-[-0.01em] text-ink",
            dir && "animate-tick",
          )}
        >
          {cursor.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </p>
        <button type="button" aria-label="Next month" className={nav} onClick={() => go(1)}>
          <CaretRight size={14} weight="bold" />
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-1.5 text-center font-mono text-[10px] uppercase text-faint"
          >
            {d}
          </div>
        ))}
      </div>
      <div
        key={`${year}-${month}`}
        className={cn(
          "grid grid-cols-7 gap-y-0.5",
          dir === "next" && "animate-month-next",
          dir === "prev" && "animate-month-prev",
        )}
      >
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const date = new Date(year, month, day);
          const selected = !!value && key(value) === key(date);
          const isToday = today === key(date);
          return (
            <button
              key={day}
              type="button"
              aria-pressed={selected}
              aria-current={isToday ? "date" : undefined}
              onClick={() => onChange?.(date)}
              className={cn(
                "mx-auto flex size-9 items-center justify-center rounded-full text-[13px] tabular-nums transition-[background-color,color,transform] duration-150 active:scale-90",
                selected
                  ? "scale-105 bg-accent font-medium text-accent-ink"
                  : "text-ink-soft hover:bg-surface-muted",
                isToday && !selected && "font-semibold text-accent",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
