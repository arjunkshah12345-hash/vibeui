import { cn } from "@/lib/utils";

export function UnderlineReveal({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const Comp = href ? "a" : "span";
  return (
    <Comp
      href={href}
      className={cn(
        "group relative inline-block font-medium text-ink",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100"
      />
    </Comp>
  );
}
