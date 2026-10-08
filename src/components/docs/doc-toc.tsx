"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string };

/** “On this page”: lists the page's h2s and highlights the one in view. */
export function DocToc() {
  const pathname = usePathname();
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [active, setActive] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Wait a frame so the new page's headings exist after a client navigation.
    const raf = requestAnimationFrame(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("main h2[id]"));
      setHeadings(els.map((el) => ({ id: el.id, text: el.textContent?.replace(/#$/, "") ?? "" })));
      setActive(els[0]?.id ?? null);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  React.useEffect(() => {
    if (!headings.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-[13px]">
      <p className="mb-3 text-xs font-medium text-faint">On this page</p>
      <ul className="space-y-1 border-l border-line">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l py-1 pl-3.5 leading-snug transition-[color,border-color] duration-200",
                active === h.id
                  ? "border-accent font-medium text-ink"
                  : "border-transparent text-muted hover:border-line-strong hover:text-ink",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
