import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "accent" | "success" | "warning" | "danger" | "muted";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "muted",
  children,
  ...props
}) => {
  const variantStyles = {
    primary: "bg-lumera-primary/10 text-lumera-primary border-lumera-primary/20",
    accent: "bg-lumera-accent/15 text-lumera-accent border-lumera-accent/30",
    success: "bg-lumera-success/10 text-lumera-success border-lumera-success/20",
    warning: "bg-lumera-warning/10 text-lumera-warning border-lumera-warning/20",
    danger: "bg-lumera-danger/10 text-lumera-danger border-lumera-danger/20",
    muted: "bg-surface-muted text-lumera-text-muted border-border",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium tracking-wide",
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
