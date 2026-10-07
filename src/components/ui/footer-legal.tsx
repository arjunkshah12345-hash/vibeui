import { cn } from "@/lib/utils";

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
      <nav className="flex flex-wrap gap-4">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="hover:text-muted">
            {l.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
