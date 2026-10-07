import { cn } from "@/lib/utils";

export function HoverSlide({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative h-40 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface",
        className,
      )}
    >
      <div className="absolute inset-0 flex items-end p-5 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-2">
        <div>
          <p className="text-sm font-medium text-ink">{title}</p>
          <p className="mt-1 max-h-0 overflow-hidden text-xs leading-relaxed text-muted opacity-0 transition-all duration-500 ease-[var(--ease-out)] group-hover:max-h-20 group-hover:opacity-100">
            {description}
          </p>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100"
      />
    </div>
  );
}
