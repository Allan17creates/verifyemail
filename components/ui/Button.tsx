import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-bg border border-accent disabled:bg-muted disabled:text-subtext",
  secondary: "bg-surface text-text border border-border disabled:opacity-50",
  ghost: "bg-transparent text-text border border-transparent disabled:opacity-50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-input px-4 py-2.5 text-sm font-medium transition-colors duration-[80ms] hover:bg-bg hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:hover:bg-muted disabled:hover:border-transparent disabled:hover:text-subtext",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
