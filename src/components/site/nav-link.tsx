"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-sm px-3 py-1.5 text-[13px] font-medium transition-colors duration-150",
        active ? "text-ink" : "text-muted hover:text-ink",
        className,
      )}
    >
      {children}
    </Link>
  );
}
