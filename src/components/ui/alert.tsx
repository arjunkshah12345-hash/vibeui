import * as React from "react";
import {
  CheckCircle,
  Info,
  Warning,
  WarningOctagon,
} from "@phosphor-icons/react/dist/ssr";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Inline status message with tone, icon and optional title. */
const alertVariants = cva(
  "relative flex w-full animate-pop-in gap-3 rounded-md border px-4 py-3.5 text-sm leading-relaxed",
  {
    variants: {
      tone: {
        neutral: "border-line bg-surface-muted text-ink-soft",
        sky: "border-pastel-sky-ink/15 bg-pastel-sky text-pastel-sky-ink",
        sage: "border-pastel-sage-ink/15 bg-pastel-sage text-pastel-sage-ink",
        sand: "border-pastel-sand-ink/15 bg-pastel-sand text-pastel-sand-ink",
        rose: "border-pastel-rose-ink/15 bg-pastel-rose text-pastel-rose-ink",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

const icons = {
  neutral: Info,
  sky: Info,
  sage: CheckCircle,
  sand: Warning,
  rose: WarningOctagon,
} as const;

export function Alert({
  className,
  tone = "neutral",
  title,
  children,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof alertVariants> & { title?: React.ReactNode }) {
  const Icon = icons[tone ?? "neutral"];
  return (
    <div
      role="alert"
      className={cn(alertVariants({ tone }), className)}
      {...props}
    >
      <Icon size={18} weight="fill" className="mt-0.5 shrink-0 animate-pop-in [animation-delay:120ms]" />
      <div className="min-w-0">
        {title ? (
          <p className="font-medium tracking-[-0.01em]">{title}</p>
        ) : null}
        {children ? (
          <div className={cn(title && "mt-0.5", "opacity-85")}>{children}</div>
        ) : null}
      </div>
    </div>
  );
}
