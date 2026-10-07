"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function OtpField({
  length = 6,
  value,
  onChange,
  className,
}: {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  const [uncontrolled, setUncontrolled] = React.useState("");
  const current = (value ?? uncontrolled).slice(0, length).padEnd(length, " ");
  const digits = current.split("");
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (index: number, char: string) => {
    const arr = digits.map((d) => (d === " " ? "" : d));
    arr[index] = char.replace(/\D/g, "").slice(-1);
    const next = arr.join("").replace(/\s/g, "");
    setUncontrolled(next);
    onChange?.(next);
    if (char && index < length - 1) refs.current[index + 1]?.focus();
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={d === " " ? "" : d}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i]?.trim() && i > 0) {
              refs.current[i - 1]?.focus();
            }
          }}
          className="size-10 rounded-[var(--radius-sm)] border border-line bg-surface text-center text-sm font-medium text-ink outline-none transition-[border-color,box-shadow] focus:border-ink focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--ink)_10%,transparent)]"
        />
      ))}
    </div>
  );
}
