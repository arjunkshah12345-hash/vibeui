import { cn } from "@/lib/utils";

export function HoverIcon({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "group relative flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-line bg-surface text-ink-soft transition-colors duration-200 hover:border-ink hover:text-ink",
        className,
      )}
    >
      <span className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-110">
        {icon}
      </span>
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[4px] border border-line bg-ink px-2 py-0.5 text-[10px] font-medium text-surface opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}
