import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = "info",
  title,
  children,
  ...props
}) => {
  const iconMap = {
    info: <Info className="h-5 w-5 text-lumera-info shrink-0" />,
    success: <CheckCircle2 className="h-5 w-5 text-lumera-success shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-lumera-warning shrink-0" />,
    danger: <AlertCircle className="h-5 w-5 text-lumera-danger shrink-0" />,
  };

  const styleMap = {
    info: "border-lumera-info/20 bg-lumera-info/5 text-lumera-text",
    success: "border-lumera-success/20 bg-lumera-success/5 text-lumera-text",
    warning: "border-lumera-warning/20 bg-lumera-warning/5 text-lumera-text",
    danger: "border-lumera-danger/20 bg-lumera-danger/5 text-lumera-text",
  };

  return (
    <div
      role={variant === "danger" ? "alert" : "status"}
      className={twMerge(
        clsx(
          "flex gap-3 rounded-md border p-4 text-sm",
          styleMap[variant],
          className
        )
      )}
      {...props}
    >
      {iconMap[variant]}
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-1">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
};
