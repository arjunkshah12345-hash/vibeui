"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type IslandView = {
  id: string;
  // Announced to screen readers when this view becomes active.
  label: string;
  // Size of this view in px. The pill morphs to it.
  width: number;
  height: number;
  // Corner radius in px. Defaults to a pill, capped at 34.
  radius?: number;
  content: React.ReactNode;
};

const MORPH = "0.65s cubic-bezier(0.3, 1.25, 0.45, 1)";

/**
 * A pill that flows between states, resizing and cross-fading its content with a soft overshoot.
 *
 * Drive it with `value`, one view per state.
 */
export function DynamicIsland({
  views,
  value,
  className,
}: {
  views: IslandView[];
  /** The id of the active view. */
  value: string;
  className?: string;
}) {
  const active = views.find((v) => v.id === value) ?? views[0];
  if (!active) return null;
  const reserve = Math.max(...views.map((v) => v.height));
  const radius = active.radius ?? Math.min(active.height / 2, 34);

  return (
    <div
      className={cn("flex w-full items-start justify-center", className)}
      style={{ height: reserve }}
    >
      <div
        className="relative overflow-hidden bg-ink text-surface shadow-[0_10px_34px_-8px_rgb(0_0_0/0.45)] ring-1 ring-white/10"
        style={{
          width: active.width,
          height: active.height,
          borderRadius: radius,
          transition: `width ${MORPH}, height ${MORPH}, border-radius ${MORPH}`,
        }}
      >
        <span role="status" aria-live="polite" className="sr-only">
          {active.label}
        </span>
        {views.map((view) => {
          const on = view.id === active.id;
          return (
            <div
              key={view.id}
              inert={!on}
              aria-hidden={!on}
              className="absolute left-1/2 top-1/2"
              style={{
                width: view.width,
                height: view.height,
                opacity: on ? 1 : 0,
                filter: on ? "blur(0px)" : "blur(7px)",
                transform: `translate(-50%, -50%) scale(${on ? 1 : 0.88})`,
                pointerEvents: on ? "auto" : "none",
                transition: on
                  ? "opacity 0.35s ease-out 0.14s, filter 0.35s ease-out 0.14s, transform 0.5s var(--ease-out) 0.14s"
                  : "opacity 0.18s ease-in, filter 0.18s ease-in, transform 0.18s ease-in",
              }}
            >
              {view.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
