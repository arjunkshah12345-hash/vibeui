"use client";

import * as React from "react";
import { CaretUpDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Native select with the shared field styling and a custom caret. */
export function Select({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select…",
  className,
  id,
  disabled,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "");
  const current = value ?? uncontrolled;

  return (
    <div className={cn("relative", className)}>
      <select
        id={id}
        value={current}
        disabled={disabled}
        onChange={(e) => {
          setUncontrolled(e.target.value);
          onValueChange?.(e.target.value);
        }}
        className={cn(
          "h-10 w-full appearance-none rounded-sm border border-line-strong bg-surface pl-3 pr-9 text-sm shadow-quiet transition-[border-color,box-shadow] duration-150 hover:border-faint focus-visible:border-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          current ? "text-ink" : "text-faint",
        )}
      >
        {!current ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <CaretUpDown
        size={14}
        weight="bold"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
