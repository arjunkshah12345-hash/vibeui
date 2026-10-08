import { Check } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/** Progress through numbered steps. Circles pop and the connector fills as `current` advances. */
export function Stepper({
  steps,
  current,
  orientation = "vertical",
  className,
}: {
  steps: { label: string; description?: string }[];
  current: number;
  orientation?: "vertical" | "horizontal";
  className?: string;
}) {
  const horizontal = orientation === "horizontal";

  return (
    <ol
      className={cn(horizontal ? "flex items-start" : "flex flex-col", className)}
    >
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === steps.length - 1;
        return (
          <li
            key={step.label}
            aria-current={active ? "step" : undefined}
            className={cn(
              "relative flex",
              horizontal ? "flex-1 flex-col gap-3 pr-4" : "gap-3.5 pb-7 last:pb-0",
            )}
          >
            {!last ? (
              <span
                aria-hidden
                className={cn(
                  "absolute overflow-hidden bg-line-strong",
                  horizontal
                    ? "left-9 right-2 top-[13px] h-px"
                    : "bottom-1 left-[13px] top-8 w-px",
                )}
              >
                <span
                  className={cn(
                    "absolute inset-0 bg-accent transition-transform duration-500 ease-out",
                    horizontal ? "origin-left" : "origin-top",
                    done
                      ? "scale-100"
                      : horizontal
                        ? "scale-x-0"
                        : "scale-y-0",
                  )}
                />
              </span>
            ) : null}
            <span
              className={cn(
                "relative z-10 flex size-[27px] shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-[background-color,border-color,color,transform] duration-300 ease-spring",
                done && "scale-100 bg-accent text-accent-ink",
                active && "scale-110 border-2 border-accent bg-surface text-accent",
                !done && !active && "border border-line-strong bg-surface text-faint",
              )}
            >
              {done ? (
                <Check size={12} weight="bold" className="animate-pop-in" />
              ) : (
                i + 1
              )}
              {active ? (
                <span
                  aria-hidden
                  className="absolute inset-0 animate-ping-soft rounded-full border border-accent opacity-40"
                />
              ) : null}
            </span>
            <div>
              <p
                className={cn(
                  "text-sm font-medium leading-[27px] transition-colors duration-300",
                  active || done ? "text-ink" : "text-muted",
                  horizontal && "leading-snug",
                )}
              >
                {step.label}
              </p>
              {step.description ? (
                <p className="text-[13px] leading-snug text-muted">
                  {step.description}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
