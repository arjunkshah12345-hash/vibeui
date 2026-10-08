import { cn } from "@/lib/utils";

/** Indeterminate loading ring. Inherits `currentColor`. */
export function Spinner({
  className,
  size = 18,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin-quiet text-ink", className)}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="2.5"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
