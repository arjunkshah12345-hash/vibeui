"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Toggle({
  pressed,
  defaultPressed,
  onPressedChange,
  children,
  className,
  disabled,
}: {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
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
        "inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-[13px] font-medium transition-colors disabled:opacity-40",
        isOn
          ? "border-ink bg-ink text-surface"
          : "border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink",
        className,
      )}
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
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => {
        const on = value.includes(opt.value);
        return (
          <Toggle
            key={opt.value}
            pressed={on}
            onPressedChange={(next) => {
              onChange(
                next
                  ? [...value, opt.value]
                  : value.filter((v) => v !== opt.value),
              );
            }}
          >
            {opt.label}
          </Toggle>
        );
      })}
    </div>
  );
}
