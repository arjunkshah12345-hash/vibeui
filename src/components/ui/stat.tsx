import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/** Metric tile with a value and an optional trend delta. */
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
        "rounded-lg border border-line bg-surface p-5 shadow-quiet",
        className,
      )}
    >
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-2 text-[28px] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums">
        {value}
      </p>
      {delta ? (
        <p
          className={cn(
            "mt-3 inline-flex items-center gap-1 text-xs font-medium",
            trend === "up" && "text-pastel-sage-ink",
            trend === "down" && "text-pastel-rose-ink",
            trend === "neutral" && "text-muted",
          )}
        >
          {trend === "up" ? <ArrowUpRight size={12} weight="bold" /> : null}
          {trend === "down" ? <ArrowDownRight size={12} weight="bold" /> : null}
          {delta}
        </p>
      ) : null}
    </div>
  );
}
