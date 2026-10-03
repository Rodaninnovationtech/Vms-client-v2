import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  noPadding?: boolean;
}

const Card = ({
  title,
  subtitle,
  actions,
  noPadding,
  className = "",
  children,
  ...rest
}: CardProps) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-card border border-primary-50 ${className}`}
      {...rest}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-primary-50">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-4 sm:p-5"}>{children}</div>
    </div>
  );
};

export default Card;
