"use client";

import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

export type ButtonStatus = "idle" | "loading" | "success" | "error";

// Draws a path stroke from nothing to complete when it first appears.
const draw = (el: SVGPathElement | null) => {
  el?.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
    duration: 360,
    easing: "cubic-bezier(0.3, 0.9, 0.3, 1)",
    fill: "both",
  });
};

/**
 * A button that carries a task from start to finish: it shrinks to a spinner, then lands on a tick or a cross.
 *
 * Give it an async `onClick` and it runs the whole sequence itself, or drive it with `status`. The width
 * glides between states so nothing around it jumps.
 */
export function StatusButton({
  children = "Save changes",
  status: statusProp,
  onClick,
  loadingLabel = "Saving",
  successLabel = "Saved",
  errorLabel = "Try again",
  resetAfter = 2000,
  variant,
  size,
  className,
  disabled,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> &
  VariantProps<typeof buttonVariants> & {
    /** The label when idle. */
    children?: React.ReactNode;
    /** Controlled state. Leave it out and the button runs itself from `onClick`. */
    status?: ButtonStatus;
    /** May return a promise: pending is loading, resolved is success, rejected is error. */
    onClick?: () => void | Promise<unknown>;
    loadingLabel?: React.ReactNode;
    successLabel?: React.ReactNode;
    errorLabel?: React.ReactNode;
    /** Milliseconds before success or error returns to idle. 0 keeps it. */
    resetAfter?: number;
  }) {
  const [own, setOwn] = React.useState<ButtonStatus>("idle");
  const status = statusProp ?? own;
  const timer = React.useRef<number>(0);
  const gauge = React.useRef<Record<ButtonStatus, HTMLSpanElement | null>>({
    idle: null,
    loading: null,
    success: null,
    error: null,
  });
  const [widths, setWidths] = React.useState<Partial<Record<ButtonStatus, number>> | null>(null);

  // Measure each state's natural width once, off-screen, so the button can glide between them.
  React.useEffect(() => {
    const measure = () => {
      const next: Partial<Record<ButtonStatus, number>> = {};
      for (const k of Object.keys(gauge.current) as ButtonStatus[]) {
        const el = gauge.current[k];
        if (el) next[k] = el.offsetWidth;
      }
      setWidths(next);
    };
    const ro = new ResizeObserver(measure);
    for (const el of Object.values(gauge.current)) if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [children, loadingLabel, successLabel, errorLabel]);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const run = async () => {
    if (status === "loading") return;
    if (statusProp) {
      void onClick?.();
      return;
    }
    window.clearTimeout(timer.current);
    try {
      const out = onClick?.();
      if (out && typeof (out as Promise<unknown>).then === "function") {
        setOwn("loading");
        await out;
        setOwn("success");
      } else setOwn("success");
    } catch {
      setOwn("error");
    }
    if (resetAfter > 0) timer.current = window.setTimeout(() => setOwn("idle"), resetAfter);
  };

  const labels: Record<ButtonStatus, React.ReactNode> = {
    idle: children,
    loading: loadingLabel,
    success: successLabel,
    error: errorLabel,
  };
  const icon = (s: ButtonStatus) =>
    s === "loading" ? (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin-quiet"
        aria-hidden
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2.6"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
    ) : s === "success" ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          ref={draw}
          d="M5 12.5l4.5 4.5L19 7.5"
          pathLength={1}
          strokeDasharray={1}
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : s === "error" ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          ref={draw}
          d="M6 6l12 12M18 6L6 18"
          pathLength={1}
          strokeDasharray={1}
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>
    ) : null;

  const inner = (s: ButtonStatus) => (
    <>
      {icon(s)}
      <span>{labels[s]}</span>
    </>
  );
  const w = widths?.[status];
  return (
    <button
      type="button"
      disabled={disabled}
      aria-busy={status === "loading" || undefined}
      onClick={run}
      {...props}
      className={cn(
        buttonVariants({ variant: status === "error" ? "danger" : variant, size }),
        "relative overflow-hidden transition-[width,background-color,color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.3,1.2,0.4,1)]",
        status === "success" && "!bg-[#16a34a] !text-white",
        className,
      )}
      style={{ width: w, ...props.style }}
    >
      <span key={status} className="inline-flex items-center gap-2 animate-fade-in">
        {inner(status)}
      </span>
      {/* hidden twins of every state, only here to be measured */}
      <span aria-hidden className="pointer-events-none invisible absolute left-0 top-0 -z-10">
        {(["idle", "loading", "success", "error"] as const).map((s) => (
          <span
            key={s}
            ref={(el) => {
              gauge.current[s] = el;
            }}
            className="absolute left-0 top-0 inline-flex items-center gap-2 whitespace-nowrap px-4"
          >
            {inner(s)}
          </span>
        ))}
      </span>
      <span className="sr-only" aria-live="polite">
        {status === "success" ? successLabel : status === "error" ? errorLabel : ""}
      </span>
    </button>
  );
}
