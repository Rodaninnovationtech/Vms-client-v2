import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = "", id, ...rest }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border text-sm px-3.5 py-2.5 bg-white text-slate-800
            placeholder:text-slate-400 transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-300" : "border-slate-200"}
            ${className}`}
            {...rest}
          />
        </div>
        {error && <span className="text-xs text-red-600">{error}</span>}
        {hint && !error && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
