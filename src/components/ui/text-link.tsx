import { cn } from "@/lib/utils";

/** Inline link with a sliding underline. */
export function TextLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        "font-medium text-ink underline decoration-line-strong decoration-1 underline-offset-[5px] transition-[text-decoration-color,color] duration-200 hover:text-accent hover:decoration-accent",
        className,
      )}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
