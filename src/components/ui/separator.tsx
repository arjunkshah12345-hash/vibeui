import { cn } from "@/lib/utils";

/** Hairline divider, horizontal or vertical. */
export function Separator({
  className,
  orientation = "horizontal",
  animated,
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
  /** Draws the line in on mount. */
  animated?: boolean;
}) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-line",
        orientation === "horizontal" ? "h-px w-full" : "h-full min-h-4 w-px",
        animated &&
          (orientation === "horizontal"
            ? "origin-left animate-grow-x"
            : "origin-top animate-grow-y"),
        className,
      )}
    />
  );
}
