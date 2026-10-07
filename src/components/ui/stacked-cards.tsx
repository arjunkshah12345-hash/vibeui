import { cn } from "@/lib/utils";

export function StackedCards({
  items,
  className,
}: {
  items: { title: string; body: string }[];
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto h-48 w-full max-w-sm", className)}>
      {items.slice(0, 3).map((item, i) => (
        <div
          key={item.title}
          className="absolute inset-x-0 rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-[var(--shadow-quiet)] transition-transform duration-300 ease-[var(--ease-out)]"
          style={{
            top: i * 12,
            transform: `scale(${1 - i * 0.04})`,
            zIndex: 3 - i,
            opacity: 1 - i * 0.15,
          }}
        >
          <p className="text-sm font-medium text-ink">{item.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
