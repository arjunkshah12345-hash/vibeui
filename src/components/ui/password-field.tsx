"use client";

import * as React from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Password input with a show/hide toggle. */
export function PasswordField({
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <input
        type={visible ? "text" : "password"}
        className="h-10 w-full rounded-sm border border-line-strong bg-surface pl-3 pr-10 text-sm text-ink shadow-quiet placeholder:text-faint transition-[border-color,box-shadow] duration-150 hover:border-faint focus-visible:border-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:opacity-50"
        {...props}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-[6px] text-faint transition-colors hover:bg-surface-muted hover:text-ink"
      >
        {visible ? (
          <EyeSlash key="hide" size={16} weight="bold" className="animate-pop-in" />
        ) : (
          <Eye key="show" size={16} weight="bold" className="animate-pop-in" />
        )}
      </button>
    </div>
  );
}
