"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** One-time-code input with auto-advance, backspace and paste support. */
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
  const code = (value ?? uncontrolled).replace(/\D/g, "").slice(0, length);
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  const commit = (next: string) => {
    setUncontrolled(next);
    onChange?.(next);
  };

  const focusAt = (i: number) =>
    refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1}`}
          maxLength={1}
          value={code[i] ?? ""}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const digit = e.target.value.replace(/\D/g, "").slice(-1);
            const arr = code.padEnd(length, " ").split("");
            arr[i] = digit || " ";
            commit(arr.join("").trimEnd().replace(/ /g, ""));
            if (digit) focusAt(i + 1);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !code[i]) focusAt(i - 1);
            if (e.key === "ArrowLeft") focusAt(i - 1);
            if (e.key === "ArrowRight") focusAt(i + 1);
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, length);
            if (!pasted) return;
            e.preventDefault();
            commit(pasted);
            focusAt(pasted.length);
          }}
          className="size-11 rounded-sm border border-line-strong bg-surface text-center font-mono text-base font-medium text-ink shadow-quiet outline-none transition-[border-color,box-shadow,transform] duration-150 hover:border-faint focus:-translate-y-0.5 focus:scale-105 focus:border-accent focus:ring-[3px] focus:ring-ring"
        />
      ))}
    </div>
  );
}
