import { cn } from "@/lib/utils";

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
        "font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink",
        className,
      )}
      {...(external
        ? { target: "_blank", rel: "noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}
