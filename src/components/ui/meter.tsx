import { cn } from "@/lib/utils";

export function Meter({
  value,
  max = 100,
  label,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-2 flex justify-between text-xs text-muted">
          <span>{label}</span>
          <span className="font-mono tabular-nums text-ink-soft">
            {Math.round(pct)}%
          </span>
        </div>
      ) : null}
      <div
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-muted"
      >
        <div
          className="h-full rounded-full bg-ink transition-[width] duration-500 ease-[var(--ease-out)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
