import Link from "next/link";
import { cn } from "@/lib/utils";

export function DocHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-12 border-b border-line pb-10">
      <p className="mb-3 text-[13px] font-medium text-accent">{eyebrow}</p>
      <h1 className="font-display text-[clamp(2.75rem,6vw,4rem)] leading-[0.98] tracking-[-0.02em] text-ink">
        {title}
      </h1>
      {children ? (
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">{children}</p>
      ) : null}
    </header>
  );
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="group mb-4 mt-14 scroll-mt-24 font-display text-[32px] leading-tight tracking-[-0.01em] text-ink first:mt-0"
    >
      <a href={`#${id}`} className="no-underline">
        {children}
        <span aria-hidden className="ml-2 text-[0.7em] text-faint opacity-0 transition-opacity group-hover:opacity-100">
          #
        </span>
      </a>
    </h2>
  );
}

export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("my-4 text-[15px] leading-[1.75] text-ink-soft", className)}>{children}</p>;
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-[6px] border border-line bg-surface-muted px-1.5 py-0.5 font-mono text-[12.5px] text-ink">
      {children}
    </code>
  );
}

export function DocLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  const cls =
    "font-medium text-ink underline decoration-line-strong underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function List({ children }: { children: React.ReactNode }) {
  return (
    <ul className="my-4 space-y-2 pl-5 text-[15px] leading-[1.7] text-ink-soft marker:text-faint [&>li]:list-disc">
      {children}
    </ul>
  );
}

export function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative border-l border-line-strong pb-10 pl-8 last:border-transparent last:pb-0">
      <span className="absolute -left-[15px] top-0 flex size-[30px] items-center justify-center rounded-full border border-line-strong bg-surface font-mono text-xs text-ink shadow-quiet">
        {n}
      </span>
      <h3 className="text-lg font-medium leading-[30px] tracking-[-0.02em] text-ink">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}
