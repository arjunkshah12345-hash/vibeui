"use client";

import * as React from "react";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function Checkbox({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  id,
  className,
  label,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  label?: string;
}) {
  const [uncontrolled, setUncontrolled] = React.useState(!!defaultChecked);
  const isOn = checked ?? uncontrolled;

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
    >
      <button
        type="button"
        role="checkbox"
        id={id}
        aria-checked={isOn}
        disabled={disabled}
        onClick={() => {
          const next = !isOn;
          setUncontrolled(next);
          onCheckedChange?.(next);
        }}
        className={cn(
          "flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-150",
          isOn
            ? "border-ink bg-ink text-surface"
            : "border-line-strong bg-surface hover:border-ink",
        )}
      >
        {isOn ? <Check size={12} weight="bold" /> : null}
      </button>
      {label ? <span>{label}</span> : null}
    </label>
  );
}
