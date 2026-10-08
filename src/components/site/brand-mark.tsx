import { cn } from "@/lib/utils";

/** The VibeUI mark, drawn with tokens so it inverts cleanly in dark mode. */
export function BrandMark({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <rect width="64" height="64" rx="16" className="fill-ink" />
      <path
        d="M19 22.5 32 45l13-22.5"
        fill="none"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-canvas"
      />
      <circle cx="45" cy="22.5" r="6" className="fill-accent dark:fill-canvas" />
    </svg>
  );
}
