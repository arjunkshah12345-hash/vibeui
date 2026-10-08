import { cn } from "@/lib/utils";

/** One-row footer: brand, links and a small note. */
export function FooterSimple({
  brand,
  links,
  note,
  className,
}: {
  brand: React.ReactNode;
  links: { label: string; href: string }[];
  note?: string;
  className?: string;
}) {
  return (
    <footer className={cn("border-t border-line", className)}>
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-ink">{brand}</div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((l) => (
            <a
              key={l.href + l.label}
              href={l.href}
              className="text-[13px] text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        {note ? <p className="text-xs text-faint">{note}</p> : null}
      </div>
    </footer>
  );
}
