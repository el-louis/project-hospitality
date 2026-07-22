// apps/web/src/components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-accent",
        secondary:
          "bg-secondary text-text-primary hover:bg-accent hover:text-white",
        outline:
          "border border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "text-primary hover:bg-primary/10",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || disabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></div>
            {children}
          </div>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
export { Button, buttonVariants };
