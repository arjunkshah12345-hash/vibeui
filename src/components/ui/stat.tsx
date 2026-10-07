import { cn } from "@/lib/utils";

export function Stat({
  label,
  value,
  delta,
  trend = "neutral",
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-line bg-surface p-5",
        className,
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
        {label}
      </p>
      <p className="mt-2 text-2xl font-medium tracking-[-0.03em] text-ink">
        {value}
      </p>
      {delta ? (
        <p
          className={cn(
            "mt-1 text-xs",
            trend === "up" && "text-pastel-sage-ink",
            trend === "down" && "text-pastel-rose-ink",
            trend === "neutral" && "text-muted",
          )}
        >
          {delta}
        </p>
      ) : null}
    </div>
  );
}
