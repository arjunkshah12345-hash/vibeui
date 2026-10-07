"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  id,
  "aria-label": ariaLabel,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(!!defaultChecked);
  const isOn = checked ?? uncontrolled;

  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={isOn}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        const next = !isOn;
        setUncontrolled(next);
        onCheckedChange?.(next);
      }}
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full border transition-colors duration-200 ease-[var(--ease-out)] disabled:opacity-40",
        isOn ? "border-ink bg-ink" : "border-line bg-surface-muted",
        className,
      )}
    >
      <span
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-surface shadow-[var(--shadow-quiet)] transition-transform duration-200 ease-[var(--ease-out)]",
          isOn ? "translate-x-[1.15rem]" : "translate-x-1",
        )}
      />
    </button>
  );
}
