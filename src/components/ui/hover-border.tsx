import { cn } from "@/lib/utils";

/** Card whose border lights up in accent and gains a top rule on hover. */
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
        "group relative overflow-hidden rounded-lg border border-line bg-surface p-5 shadow-quiet transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-[0_0_0_3px_var(--accent-soft)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
