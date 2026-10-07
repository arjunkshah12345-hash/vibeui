import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,color,border-color,opacity] duration-200 ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-surface hover:bg-ink-soft border border-transparent",
        secondary:
          "bg-surface text-ink border border-line hover:border-line-strong hover:bg-surface-muted",
        ghost:
          "bg-transparent text-ink-soft hover:bg-surface-muted hover:text-ink border border-transparent",
        soft: "bg-surface-muted text-ink border border-transparent hover:bg-line",
      },
      size: {
        sm: "h-8 px-3 text-[13px] rounded-[var(--radius-sm)]",
        md: "h-10 px-4 text-sm rounded-[var(--radius-sm)]",
        lg: "h-11 px-5 text-[15px] rounded-[var(--radius-md)]",
        icon: "size-10 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
