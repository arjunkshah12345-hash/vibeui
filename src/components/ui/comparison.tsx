import { cn } from "@/lib/utils";

/** Two-sided proportion bar for comparing a pair of values. */
export function ComparisonBar({
  left,
  right,
  leftValue,
  rightValue,
  className,
}: {
  left: string;
  right: string;
  leftValue: number;
  rightValue: number;
  className?: string;
}) {
  const total = leftValue + rightValue || 1;
  const leftPct = (leftValue / total) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2.5 flex justify-between text-[13px]">
        <span className="font-medium text-ink">
          {left}{" "}
          <span className="ml-1 font-mono text-xs text-muted">
            {Math.round(leftPct)}%
          </span>
        </span>
        <span className="font-medium text-ink">
          <span className="mr-1 font-mono text-xs text-muted">
            {Math.round(100 - leftPct)}%
          </span>{" "}
          {right}
        </span>
      </div>
      <div className="flex h-2.5 gap-1">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
          style={{ width: `${leftPct}%` }}
        />
        <div
          className="h-full flex-1 rounded-full bg-surface-sunken ring-1 ring-inset ring-line-strong"
        />
      </div>
    </div>
  );
}
