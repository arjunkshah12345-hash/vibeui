import { cn } from "@/lib/utils";

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
      <div className="mb-2 flex justify-between text-xs">
        <span className="font-medium text-ink">
          {left}{" "}
          <span className="font-mono text-faint">{Math.round(leftPct)}%</span>
        </span>
        <span className="font-medium text-ink">
          <span className="font-mono text-faint">
            {Math.round(100 - leftPct)}%
          </span>{" "}
          {right}
        </span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full bg-ink transition-[width] duration-500"
          style={{ width: `${leftPct}%` }}
        />
        <div
          className="h-full bg-line-strong"
          style={{ width: `${100 - leftPct}%` }}
        />
      </div>
    </div>
  );
}
