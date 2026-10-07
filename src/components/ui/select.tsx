"use client";

import * as React from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function Select({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select…",
  className,
  id,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  id?: string;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "");
  const current = value ?? uncontrolled;

  return (
    <div className={cn("relative", className)}>
      <select
        id={id}
        value={current}
        onChange={(e) => {
          setUncontrolled(e.target.value);
          onValueChange?.(e.target.value);
        }}
        className="h-10 w-full appearance-none rounded-[var(--radius-sm)] border border-line bg-surface px-3 pr-9 text-sm text-ink transition-[border-color,box-shadow] duration-150 hover:border-line-strong focus-visible:border-ink focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--ink)_10%,transparent)]"
      >
        {!current ? <option value="">{placeholder}</option> : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <CaretDown
        size={14}
        weight="bold"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
