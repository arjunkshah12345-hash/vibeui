import * as React from "react";
import { cn } from "@/lib/utils";

/** Text input, textarea, label and Field wrapper sharing one focus language. */
const fieldBase =
  "w-full rounded-sm border border-line-strong bg-surface text-sm text-ink shadow-quiet placeholder:text-faint transition-[border-color,box-shadow] duration-150 hover:border-faint focus-visible:border-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-pastel-rose-ink aria-invalid:ring-pastel-rose-ink/20";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(fieldBase, "h-10 px-3", className)}
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
    className={cn(fieldBase, "min-h-24 resize-y px-3 py-2.5 leading-relaxed", className)}
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
      className={cn("mb-1.5 block text-[13px] font-medium text-ink-soft", className)}
      {...props}
    />
  );
}

export function Field({
  className,
  label,
  hint,
  error,
  children,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {label ? <Label>{label}</Label> : null}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-pastel-rose-ink">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
