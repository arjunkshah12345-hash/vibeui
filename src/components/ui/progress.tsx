import { cn } from "@/lib/utils";

/** Determinate progress bar with an optional label and percentage. */
export function Progress({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="font-medium text-ink-soft">{label}</span>
          <span className="font-mono text-xs tabular-nums text-muted">
            {Math.round(clamped)}%
          </span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
      >
        <div
          className="h-full origin-left animate-grow-x rounded-full bg-accent transition-[width] duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
