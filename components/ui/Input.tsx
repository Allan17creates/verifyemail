import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-input border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-subtext outline-none transition-colors duration-100 focus:border-accent",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
