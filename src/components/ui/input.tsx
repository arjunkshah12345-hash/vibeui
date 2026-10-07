import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-10 w-full rounded-[var(--radius-sm)] border border-line bg-surface px-3 text-sm text-ink placeholder:text-faint transition-[border-color,box-shadow] duration-150",
      "hover:border-line-strong focus-visible:border-ink focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(28,28,26,0.08)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[96px] w-full resize-y rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-faint transition-[border-color,box-shadow] duration-150",
      "hover:border-line-strong focus-visible:border-ink focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(28,28,26,0.08)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[13px] font-medium text-ink-soft",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  className,
  label,
  hint,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
  hint?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {label ? <Label>{label}</Label> : null}
      {children}
      {hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
