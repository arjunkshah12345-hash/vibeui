import { cn } from "@/lib/utils";

export function Stepper({
  steps,
  current,
  className,
}: {
  steps: { label: string; description?: string }[];
  current: number;
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-col gap-0", className)}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border text-[11px] font-medium",
                  done && "border-ink bg-ink text-surface",
                  active && "border-ink bg-surface text-ink",
                  !done && !active && "border-line text-faint",
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              {i < steps.length - 1 ? (
                <span
                  className={cn(
                    "my-1 w-px flex-1 min-h-6",
                    done ? "bg-ink" : "bg-line",
                  )}
                />
              ) : null}
            </div>
            <div className={cn("pb-6", i === steps.length - 1 && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-medium",
                  active || done ? "text-ink" : "text-muted",
                )}
              >
                {step.label}
              </p>
              {step.description ? (
                <p className="mt-0.5 text-xs text-muted">{step.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
