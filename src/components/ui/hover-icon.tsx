import { cn } from "@/lib/utils";

/** Square icon button that scales its glyph and reveals a label on hover. */
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
        "group relative flex size-11 items-center justify-center rounded-md border border-line bg-surface text-ink-soft shadow-quiet transition-[border-color,color,transform] duration-200 hover:border-line-strong hover:text-ink active:scale-95",
        className,
      )}
    >
      <span className="transition-transform duration-300 ease-spring group-hover:scale-110">
        {icon}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[7px] bg-ink px-2 py-1 text-[11px] font-medium text-surface opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </button>
  );
}
