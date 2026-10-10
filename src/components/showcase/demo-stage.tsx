"use client";

import { cn } from "@/lib/utils";
import { widths } from "./demo";
import { demos } from "./demos";

/**
 * Renders a component's demo. `tile` fits a gallery card, `page` fills the detail stage, and
 * `shelf` renders at natural size for a parent that scales it to fit (the landing page).
 */
export function DemoStage({
  slug,
  mode = "page",
}: {
  slug: string;
  mode?: "page" | "tile" | "shelf";
}) {
  const demo = demos[slug];
  if (!demo) return <p className="text-sm text-muted">No preview yet.</p>;

  const { Component, Tile } = demo;

  if ((mode === "tile" || mode === "shelf") && Tile) {
    return (
      <div className="flex shrink-0 justify-center">
        <Tile />
      </div>
    );
  }

  const content = (
    <div className={cn("flex w-full justify-center", widths[demo.width ?? "md"])}>
      <Component />
    </div>
  );

  if (mode === "shelf") {
    return (
      <div className={cn("flex w-max shrink-0 justify-center", widths[demo.width ?? "md"])}>
        <Component />
      </div>
    );
  }

  if (mode === "tile") {
    const scale = demo.tileScale ?? 1;
    return (
      <div
        className="flex shrink-0 justify-center"
        style={{ width: `${100 / scale}%`, transform: `scale(${scale})` }}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full justify-center px-6 py-14 sm:px-10",
        demo.top ? "items-start" : "items-center",
      )}
      style={{ minHeight: demo.height ?? 340 }}
    >
      {content}
    </div>
  );
}
