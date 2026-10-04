import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  lifted?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  lifted = false,
  children,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-lg border border-border bg-surface p-6 transition-shadow",
          lifted ? "shadow-lifted" : "shadow-soft",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
