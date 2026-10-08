"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** On/off switch with an accent track and sprung thumb. */
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
        "group relative inline-flex h-6 w-[42px] shrink-0 items-center rounded-full border p-0.5 transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-45",
        isOn
          ? "border-transparent bg-accent"
          : "border-line-strong bg-surface-sunken hover:border-faint",
        className,
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full shadow-[0_1px_3px_rgb(0_0_0/0.3)] transition-[transform,width,background-color] duration-300 ease-spring group-active:w-[22px]",
          isOn ? "bg-accent-ink" : "bg-muted",
          isOn ? "translate-x-[18px] group-active:translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}
