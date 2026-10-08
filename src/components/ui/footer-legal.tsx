import { cn } from "@/lib/utils";

/** Copyright line with legal links. */
export function FooterLegal({
  copyright,
  links,
  className,
}: {
  copyright: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-line py-5 text-xs text-faint sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p>{copyright}</p>
      <nav aria-label="Legal" className="flex flex-wrap gap-5">
        {links.map((l) => (
          <a
            key={l.href + l.label}
            href={l.href}
            className="transition-colors hover:text-ink"
          >
            {l.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
