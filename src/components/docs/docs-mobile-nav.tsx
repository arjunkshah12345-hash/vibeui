"use client";

import { List } from "@phosphor-icons/react";
import { Sheet } from "@/components/ui/sheet";
import { DocsNav } from "./docs-nav";

/** Below lg the sidebar lives in a sheet. */
export function DocsMobileNav() {
  return (
    <div className="mb-8 lg:hidden">
      <Sheet
        side="left"
        title="Documentation"
        trigger={
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-surface px-3 text-[13px] font-medium text-ink shadow-quiet transition-[transform,border-color] duration-150 hover:border-line-strong active:scale-95"
          >
            <List size={15} weight="bold" /> Menu
          </button>
        }
      >
        <DocsNav />
      </Sheet>
    </div>
  );
}
