import { CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function Breadcrumb({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-sm", className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
            {i > 0 ? (
              <CaretRight size={12} className="text-faint" weight="bold" />
            ) : null}
            {last || !item.href ? (
              <span className={cn(last ? "font-medium text-ink" : "text-muted")}>
                {item.label}
              </span>
            ) : (
              <a href={item.href} className="text-muted transition-colors hover:text-ink">
                {item.label}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
