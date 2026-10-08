import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Small status label with semantic pastel tones and an optional live dot. */
const pillVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium leading-4 tracking-[0.02em] whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-surface-muted text-ink-soft",
        accent: "bg-accent-soft text-accent",
        rose: "bg-pastel-rose text-pastel-rose-ink",
        sky: "bg-pastel-sky text-pastel-sky-ink",
        sage: "bg-pastel-sage text-pastel-sage-ink",
        sand: "bg-pastel-sand text-pastel-sand-ink",
        outline: "border border-line bg-transparent text-muted",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {
  dot?: boolean;
  /** Adds a soft expanding ring to the dot, for live status. */
  pulse?: boolean;
}

export function Pill({ className, tone, dot, pulse, children, ...props }: PillProps) {
  return (
    <span className={cn(pillVariants({ tone }), className)} {...props}>
      {dot ? (
        <span aria-hidden className="relative flex size-1.5">
          {pulse ? (
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-current opacity-50" />
          ) : null}
          <span className="relative size-1.5 rounded-full bg-current" />
        </span>
      ) : null}
      {children}
    </span>
  );
}
