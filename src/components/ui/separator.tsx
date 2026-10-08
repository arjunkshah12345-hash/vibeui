import { cn } from "@/lib/utils";

/** Hairline divider, horizontal or vertical. */
export function Separator({
  className,
  orientation = "horizontal",
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-line",
        orientation === "horizontal" ? "h-px w-full" : "h-full min-h-4 w-px",
        className,
      )}
    />
  );
}
