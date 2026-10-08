import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Primary action button with variants (primary, accent, secondary, ghost, soft, danger). */
const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[transform,background-color,color,border-color,box-shadow,opacity] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border border-transparent bg-ink text-surface shadow-quiet shadow-inset hover:bg-ink-soft",
        accent:
          "border border-transparent bg-accent text-accent-ink shadow-quiet shadow-inset hover:brightness-110",
        secondary:
          "border border-line bg-surface text-ink shadow-quiet hover:border-line-strong hover:bg-surface-muted",
        ghost:
          "border border-transparent bg-transparent text-ink-soft hover:bg-surface-muted hover:text-ink",
        soft: "border border-transparent bg-surface-muted text-ink hover:bg-surface-sunken",
        danger:
          "border border-transparent bg-pastel-rose text-pastel-rose-ink hover:brightness-95",
      },
      size: {
        sm: "h-8 gap-1.5 rounded-sm px-3 text-[13px]",
        md: "h-10 rounded-sm px-4 text-sm",
        lg: "h-12 rounded-md px-6 text-[15px]",
        icon: "size-10 rounded-sm",
        "icon-sm": "size-8 rounded-sm",
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
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
