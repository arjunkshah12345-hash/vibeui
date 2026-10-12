"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type TourStep = {
  // A CSS selector for the element to point at. If it is not found the card centres on screen.
  target: string;
  title: string;
  body?: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right" | "auto";
};

type Side = "top" | "bottom" | "left" | "right";

const CARD_W = 320;
const GAP = 16;

/**
 * A guided product tour: the page dims, a spotlight glides to each element in turn, and a card explains it.
 *
 * The spotlight and the card follow their target even while the page scrolls or resizes, and move
 * with a spring between steps. Arrow keys step, Escape ends the tour.
 */
export function Tour({
  steps,
  open,
  onClose,
  step: stepProp,
  defaultStep = 0,
  onStepChange,
  padding = 8,
  radius = 14,
  doneLabel = "Done",
}: {
  steps: TourStep[];
  open: boolean;
  /** Called when the tour is skipped, closed or finished. */
  onClose: () => void;
  /** Controlled step index. */
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  /** Space around the highlighted element, in px. */
  padding?: number;
  /** Corner radius of the spotlight. */
  radius?: number;
  /** Label of the last step's button. */
  doneLabel?: string;
}) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <Overlay
      steps={steps}
      onClose={onClose}
      stepProp={stepProp}
      defaultStep={defaultStep}
      onStepChange={onStepChange}
      padding={padding}
      radius={radius}
      doneLabel={doneLabel}
    />,
    document.body,
  );
}

function Overlay({
  steps,
  onClose,
  stepProp,
  defaultStep,
  onStepChange,
  padding,
  radius,
  doneLabel,
}: {
  steps: TourStep[];
  onClose: () => void;
  stepProp?: number;
  defaultStep: number;
  onStepChange?: (step: number) => void;
  padding: number;
  radius: number;
  doneLabel: string;
}) {
  const [own, setOwn] = React.useState(defaultStep);
  const index = Math.min(steps.length - 1, Math.max(0, stepProp ?? own));
  const step = steps[index];
  const id = React.useId();
  const hole = React.useRef<SVGRectElement>(null);
  const card = React.useRef<HTMLDivElement>(null);
  const arrow = React.useRef<HTMLSpanElement>(null);
  const last = index === steps.length - 1;

  const go = React.useCallback(
    (i: number) => {
      const next = Math.min(steps.length - 1, Math.max(0, i));
      if (stepProp === undefined) setOwn(next);
      onStepChange?.(next);
    },
    [steps.length, stepProp, onStepChange],
  );

  React.useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === "Enter")
        (last ? onClose : () => go(index + 1))();
      else if (e.key === "ArrowLeft") go(index - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [go, index, last, onClose]);

  // Bring the target into view, then follow it every frame so the spotlight stays glued to it.
  React.useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = () => document.querySelector<HTMLElement>(step.target);
    target()?.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: calm ? "auto" : "smooth",
    });
    card.current?.focus({ preventScroll: true });

    const cur = { x: 0, y: 0, w: 0, h: 0, cx: 0, cy: 0, ready: false };
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const k = calm || !cur.ready ? 1 : 1 - Math.exp(-dt * 12);
      const el = target();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const c = card.current;
      const cw = c?.offsetWidth ?? CARD_W;
      const ch = c?.offsetHeight ?? 160;
      let goal: { x: number; y: number; w: number; h: number };
      let cx: number;
      let cy: number;
      let side: Side | null = null;
      if (el) {
        const r = el.getBoundingClientRect();
        goal = {
          x: r.left - padding,
          y: r.top - padding,
          w: r.width + padding * 2,
          h: r.height + padding * 2,
        };
        const room = {
          top: goal.y,
          bottom: vh - goal.y - goal.h,
          left: goal.x,
          right: vw - goal.x - goal.w,
        };
        const want = step.placement ?? "auto";
        side =
          want !== "auto"
            ? want
            : room.bottom >= ch + GAP + 12
              ? "bottom"
              : room.top >= ch + GAP + 12
                ? "top"
                : room.right >= cw + GAP + 12
                  ? "right"
                  : "left";
        if (side === "bottom") [cx, cy] = [goal.x + goal.w / 2 - cw / 2, goal.y + goal.h + GAP];
        else if (side === "top") [cx, cy] = [goal.x + goal.w / 2 - cw / 2, goal.y - ch - GAP];
        else if (side === "right") [cx, cy] = [goal.x + goal.w + GAP, goal.y + goal.h / 2 - ch / 2];
        else [cx, cy] = [goal.x - cw - GAP, goal.y + goal.h / 2 - ch / 2];
        cx = Math.min(vw - cw - 12, Math.max(12, cx));
        cy = Math.min(vh - ch - 12, Math.max(12, cy));
      } else {
        goal = { x: vw / 2, y: vh / 2, w: 0, h: 0 };
        cx = vw / 2 - cw / 2;
        cy = vh / 2 - ch / 2;
      }
      if (!cur.ready) {
        Object.assign(cur, { x: goal.x, y: goal.y, w: goal.w, h: goal.h, cx, cy, ready: true });
      } else {
        cur.x += (goal.x - cur.x) * k;
        cur.y += (goal.y - cur.y) * k;
        cur.w += (goal.w - cur.w) * k;
        cur.h += (goal.h - cur.h) * k;
        cur.cx += (cx - cur.cx) * k;
        cur.cy += (cy - cur.cy) * k;
      }
      const h = hole.current;
      if (h) {
        h.setAttribute("x", String(cur.x));
        h.setAttribute("y", String(cur.y));
        h.setAttribute("width", String(Math.max(0, cur.w)));
        h.setAttribute("height", String(Math.max(0, cur.h)));
      }
      if (c) c.style.transform = `translate3d(${cur.cx}px, ${cur.cy}px, 0)`;
      const a = arrow.current;
      if (a) {
        if (side) {
          // The little pointer sits on the card edge that faces the target, centred on it.
          const mx = Math.min(cw - 22, Math.max(22, goal.x + goal.w / 2 - cur.cx));
          const my = Math.min(ch - 22, Math.max(22, goal.y + goal.h / 2 - cur.cy));
          a.style.opacity = "1";
          a.style.left =
            side === "top" || side === "bottom"
              ? `${mx - 6}px`
              : side === "right"
                ? "-6px"
                : `${cw - 6}px`;
          a.style.top =
            side === "left" || side === "right"
              ? `${my - 6}px`
              : side === "bottom"
                ? "-6px"
                : `${ch - 6}px`;
        } else a.style.opacity = "0";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [step, padding]);

  return (
    <div className="fixed inset-0 z-[100]" role="presentation">
      <svg className="absolute inset-0 size-full" aria-hidden onClick={onClose}>
        <defs>
          <mask id={`${id}-m`}>
            <rect width="100%" height="100%" fill="white" />
            <rect ref={hole} rx={radius} ry={radius} fill="black" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgb(11 10 9 / 0.66)" mask={`url(#${id}-m)`} />
      </svg>
      <div
        ref={card}
        role="dialog"
        aria-modal="true"
        aria-label={step.title}
        tabIndex={-1}
        className="absolute left-0 top-0 rounded-2xl border border-line bg-surface p-5 shadow-lift outline-none"
        style={{ width: CARD_W, maxWidth: "calc(100vw - 24px)" }}
      >
        <span
          ref={arrow}
          aria-hidden
          className="absolute size-3 rotate-45 border-l border-t border-line bg-surface opacity-0"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />
        <div key={index} className="animate-fade-in">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Step {index + 1} of {steps.length}
          </p>
          <h3 className="mt-2 font-display text-2xl leading-tight tracking-tight text-ink">
            {step.title}
          </h3>
          {step.body && <div className="mt-2 text-sm leading-relaxed text-muted">{step.body}</div>}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex gap-1.5" aria-hidden>
            {steps.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-5 bg-ink" : "w-1.5 bg-line-strong",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2.5 py-1.5 text-[13px] text-muted outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-ring"
            >
              Skip
            </button>
            {index > 0 && (
              <button
                type="button"
                onClick={() => go(index - 1)}
                className="rounded-lg border border-line px-3 py-1.5 text-[13px] font-medium text-ink outline-none transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => (last ? onClose() : go(index + 1))}
              className="rounded-lg bg-ink px-3.5 py-1.5 text-[13px] font-medium text-surface outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {last ? doneLabel : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
