import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "error" | "warning" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success/10 text-success border-success/30",
  error: "bg-error/10 text-error border-error/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  neutral: "bg-surface text-subtext border-border",
};

export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-input border px-2.5 py-1 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
