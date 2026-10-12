"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers and insecure pages: fall back to a hidden textarea.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;top:-1000px;opacity:0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } finally {
      area.remove();
    }
    return ok;
  }
}

// The ring that pulses out of the button when a copy lands.
const pulse = (el: HTMLSpanElement | null) => {
  el?.animate(
    [
      { opacity: 0.9, transform: "scale(1)" },
      { opacity: 0, transform: "scale(1.45)" },
    ],
    { duration: 600, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)", fill: "both" },
  );
};

/**
 * A copy button that confirms itself: the clipboard icon folds into a tick and a ring pulses outward.
 *
 * Works as an icon on its own or with a label. It falls back to a hidden textarea where the
 * clipboard API is unavailable, and tells screen readers when the copy lands.
 */
export function CopyButton({
  value,
  label,
  copiedLabel = "Copied",
  timeout = 1800,
  onCopy,
  className,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onCopy"> & {
  /** The text that goes on the clipboard. */
  value: string;
  /** Text beside the icon. Leave out for an icon-only button. */
  label?: React.ReactNode;
  /** Replaces the label for a moment after copying. */
  copiedLabel?: React.ReactNode;
  /** How long the tick stays, in ms. */
  timeout?: number;
  onCopy?: (value: string) => void;
}) {
  const [done, setDone] = React.useState(false);
  const [burst, setBurst] = React.useState(0);
  const timer = React.useRef<number>(0);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    if (!(await copyText(value))) return;
    setDone(true);
    setBurst((n) => n + 1);
    onCopy?.(value);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(false), timeout);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label ? undefined : done ? "Copied" : "Copy to clipboard"}
      {...props}
      className={cn(
        "group relative inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-[13px] font-medium text-ink-soft shadow-quiet outline-none transition-[color,background-color,border-color,transform] duration-200 hover:border-line-strong hover:bg-surface-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-ring active:scale-95",
        !label && "w-9 justify-center px-0",
        done && "border-[#16a34a]/40 text-[#16a34a] hover:text-[#16a34a]",
        className,
      )}
    >
      {burst > 0 && (
        <span
          key={burst}
          aria-hidden
          ref={pulse}
          className="pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-[#16a34a]/50"
        />
      )}
      <span className="relative size-4">
        {/* the clipboard folds away as the tick draws in; each one has a turn */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={cn(
            "absolute inset-0 transition-[transform,opacity,filter] duration-300 ease-[cubic-bezier(0.3,1.4,0.5,1)]",
            done ? "scale-50 rotate-12 opacity-0 blur-[2px]" : "scale-100 opacity-100",
          )}
        >
          <rect x="8" y="8" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
          <path
            d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={cn(
            "absolute inset-0 transition-[transform,opacity,filter] duration-300 ease-[cubic-bezier(0.3,1.4,0.5,1)]",
            done ? "scale-100 opacity-100" : "scale-50 -rotate-12 opacity-0 blur-[2px]",
          )}
        >
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label != null && (
        <span className="relative grid">
          <span
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-200",
              done && "opacity-0",
            )}
          >
            {label}
          </span>
          <span
            aria-hidden
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-200",
              !done && "opacity-0",
            )}
          >
            {copiedLabel}
          </span>
        </span>
      )}
      <span className="sr-only" aria-live="polite">
        {done ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
