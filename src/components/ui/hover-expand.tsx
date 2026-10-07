import { cn } from "@/lib/utils";

export function HoverExpand({
  items,
  className,
}: {
  items: { id: string; label: string; body: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex h-44 gap-2", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative min-w-0 flex-[1] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface p-4 transition-[flex] duration-500 ease-[var(--ease-out)] hover:flex-[2.2]"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
            {item.id}
          </p>
          <p className="mt-2 text-sm font-medium text-ink">{item.label}</p>
          <p className="mt-2 max-h-0 overflow-hidden text-xs leading-relaxed text-muted opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}
