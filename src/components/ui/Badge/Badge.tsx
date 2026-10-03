import type { ReactNode } from "react";
import type { BadgeVariant } from "@/types";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-primary-50 text-primary-700 ring-primary-200",
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
};

const Badge = ({ children, variant = "neutral" }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
