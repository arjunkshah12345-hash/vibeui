import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Infinite horizontal ticker with edge fade. Pauses on hover. */
export function Marquee({
  children,
  className,
  pauseOnHover = true,
  reverse = false,
  duration = 40,
}: {
  children: ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
  /** Seconds for one full loop. */
  duration?: number;
}) {
  return (
    <div
      className={cn(
        "group/marquee relative w-full overflow-hidden py-3",
        "mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max animate-marquee",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
        )}
        style={
          {
            animationDuration: `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as CSSProperties
        }
      >
        <div className="flex shrink-0 items-center gap-10 pr-10">{children}</div>
        <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
