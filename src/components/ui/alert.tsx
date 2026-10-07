import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const alertVariants = cva(
  "relative w-full rounded-[var(--radius-md)] border px-4 py-3 text-sm leading-relaxed",
  {
    variants: {
      tone: {
        neutral: "border-line bg-surface-muted text-ink-soft",
        sky: "border-transparent bg-pastel-sky text-pastel-sky-ink",
        sage: "border-transparent bg-pastel-sage text-pastel-sage-ink",
        sand: "border-transparent bg-pastel-sand text-pastel-sand-ink",
        rose: "border-transparent bg-pastel-rose text-pastel-rose-ink",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Alert({
  className,
  tone,
  title,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & { title?: string }) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ tone }), className)}
      {...props}
    >
      {title ? (
        <p className="mb-0.5 font-medium tracking-[-0.01em]">{title}</p>
      ) : null}
      <div className="opacity-90">{children}</div>
    </div>
  );
}
