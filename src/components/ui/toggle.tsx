"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Two-state pressed button, plus a connected multi-select ToggleGroup. */
export function Toggle({
  pressed,
  defaultPressed,
  onPressedChange,
  children,
  className,
  disabled,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(!!defaultPressed);
  const isOn = pressed ?? uncontrolled;

  return (
    <button
      type="button"
      aria-pressed={isOn}
      disabled={disabled}
      onClick={() => {
        const next = !isOn;
        setUncontrolled(next);
        onPressedChange?.(next);
      }}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-sm border px-3 text-[13px] font-medium transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45",
        isOn
          ? "border-ink bg-ink text-surface"
          : "border-line bg-surface text-ink-soft shadow-quiet hover:border-line-strong hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ToggleGroup({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: string; label: React.ReactNode }[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex rounded-sm border border-line bg-surface p-0.5 shadow-quiet",
        className,
      )}
    >
      {options.map((opt) => {
        const on = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={on}
            onClick={() =>
              onChange(
                on ? value.filter((v) => v !== opt.value) : [...value, opt.value],
              )
            }
            className={cn(
              "h-8 rounded-[6px] px-3 text-[13px] font-medium transition-[background-color,color,transform] duration-150 active:scale-95",
              on
                ? "bg-ink text-surface"
                : "text-muted hover:bg-surface-muted hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
