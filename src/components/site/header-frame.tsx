"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};
const scrolled = () => window.scrollY > 12;

/** Header shell: clear at the top of the page, frosted and hairlined once you scroll. */
export function HeaderFrame({ children }: { children: React.ReactNode }) {
  const isScrolled = React.useSyncExternalStore(subscribe, scrolled, () => false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        isScrolled
          ? "border-line bg-canvas/80 backdrop-blur-xl"
          : "border-transparent bg-canvas/0",
      )}
    >
      {children}
    </header>
  );
}
