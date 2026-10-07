"use client";

import * as React from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function PasswordField({
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <input
        type={visible ? "text" : "password"}
        className="flex h-10 w-full rounded-[var(--radius-sm)] border border-line bg-surface px-3 pr-10 text-sm text-ink placeholder:text-faint transition-[border-color,box-shadow] hover:border-line-strong focus-visible:border-ink focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--ink)_10%,transparent)]"
        {...props}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint hover:text-ink"
      >
        {visible ? (
          <EyeSlash size={16} weight="bold" />
        ) : (
          <Eye size={16} weight="bold" />
        )}
      </button>
    </div>
  );
}
