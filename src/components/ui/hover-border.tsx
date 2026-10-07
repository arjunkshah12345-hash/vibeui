import { cn } from "@/lib/utils";

export function HoverBorder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-[var(--radius-lg)] bg-surface p-5",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)] border border-line"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)] border border-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          maskImage:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          padding: 1,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
