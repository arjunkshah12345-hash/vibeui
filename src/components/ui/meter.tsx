import { cn } from "@/lib/utils";

const tones = {
  ink: "bg-ink",
  accent: "bg-accent",
  sage: "bg-pastel-sage-ink",
  sand: "bg-pastel-sand-ink",
  rose: "bg-pastel-rose-ink",
} as const;

/** Segmented gauge for a value within a known range. */
export function Meter({
  value,
  max = 100,
  label,
  tone = "ink",
  segments = 20,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  tone?: keyof typeof tones;
  segments?: number;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const filled = Math.round((pct / 100) * segments);

  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="font-medium text-ink-soft">{label}</span>
          <span className="font-mono text-xs tabular-nums text-muted">
            {Math.round(pct)}%
          </span>
        </div>
      ) : null}
      <div
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="flex h-2.5 w-full gap-[3px]"
      >
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-full flex-1 rounded-[2px] transition-colors duration-300",
              i < filled ? tones[tone] : "bg-surface-sunken",
            )}
            style={{ transitionDelay: `${i * 12}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
