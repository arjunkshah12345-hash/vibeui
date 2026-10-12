"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const field =
  "w-full resize-none rounded-md border border-line-strong bg-surface px-3.5 py-3 text-sm leading-relaxed text-ink shadow-quiet placeholder:text-faint transition-[border-color,box-shadow] duration-150 hover:border-faint focus-visible:border-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

/**
 * A textarea that grows with what you write and shows how much room is left as a ring.
 *
 * It stops growing at `maxRows` and scrolls from there. The counter ring fills as you type, turns
 * amber near the limit and red past it. Press ⌘ or Ctrl with Enter to submit.
 */
export function AutosizeTextarea({
  value,
  defaultValue = "",
  onChange,
  onSubmit,
  minRows = 2,
  maxRows = 10,
  maxLength,
  className,
  ...props
}: Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onSubmit" | "rows"> & {
  /** Fewest lines to show. */
  minRows?: number;
  /** Most lines to grow to before scrolling. */
  maxRows?: number;
  /** Character budget. Shows the ring; does not block typing, so people can paste and trim. */
  maxLength?: number;
  /** Called with the text when ⌘/Ctrl + Enter is pressed. */
  onSubmit?: (value: string) => void;
}) {
  const el = React.useRef<HTMLTextAreaElement>(null);
  const [own, setOwn] = React.useState(String(defaultValue));
  const text = value !== undefined ? String(value) : own;

  // Fit the box to its text after every change, including ones that come from outside.
  React.useLayoutEffect(() => {
    const t = el.current;
    if (!t) return;
    const cs = getComputedStyle(t);
    const line = parseFloat(cs.lineHeight) || 20;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    t.style.height = "auto";
    const min = line * minRows + pad;
    const max = line * maxRows + pad;
    t.style.height = `${Math.min(max, Math.max(min, t.scrollHeight))}px`;
    t.style.overflowY = t.scrollHeight > max ? "auto" : "hidden";
  }, [text, minRows, maxRows]);

  const used = text.length;
  const ratio = maxLength ? used / maxLength : 0;
  const tone = ratio > 1 ? "#dc2626" : ratio > 0.85 ? "#d97706" : "var(--ink)";
  const R = 9;
  const C = 2 * Math.PI * R;
  return (
    <div className={cn("relative w-full", className)}>
      <textarea
        ref={el}
        value={text}
        onChange={(e) => {
          if (value === undefined) setOwn(e.target.value);
          onChange?.(e);
        }}
        onKeyDown={(e) => {
          props.onKeyDown?.(e);
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onSubmit?.(text);
          }
        }}
        rows={minRows}
        aria-invalid={maxLength && used > maxLength ? true : undefined}
        {...props}
        className={cn(field, maxLength && "pb-9")}
      />
      {maxLength != null && (
        <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center gap-2">
          <span
            className={cn(
              "text-xs tabular-nums transition-opacity duration-200",
              ratio > 0.85 ? "opacity-100" : "opacity-0",
            )}
            style={{ color: tone }}
          >
            {maxLength - used}
          </span>
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
            <circle
              cx="11"
              cy="11"
              r={R}
              fill="none"
              stroke="var(--line-strong)"
              strokeWidth="2.2"
            />
            <circle
              cx="11"
              cy="11"
              r={R}
              fill="none"
              stroke={tone}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - Math.min(1, ratio))}
              transform="rotate(-90 11 11)"
              style={{ transition: "stroke-dashoffset 180ms ease-out, stroke 200ms" }}
            />
          </svg>
          <span className="sr-only" aria-live="polite">
            {ratio > 0.85 ? `${maxLength - used} characters left` : ""}
          </span>
        </div>
      )}
    </div>
  );
}
