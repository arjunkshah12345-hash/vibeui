"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex size-9 items-center justify-center rounded-sm text-muted transition-colors duration-200 hover:bg-surface-muted hover:text-ink",
        className,
      )}
    >
      {/* Icons swap with CSS so the first paint always matches the real theme. */}
      <Sun size={18} weight="bold" className="hidden dark:block" />
      <Moon size={18} weight="bold" className="dark:hidden" />
    </button>
  );
}
