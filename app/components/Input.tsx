import { InputHTMLAttributes, ReactNode, forwardRef, useId } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const inputId = useId();
    const errorId = useId();

    return (
      <div className={clsx("flex flex-col gap-1", fullWidth && "w-full")}> 
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--foreground)] mb-1 select-none">
            {label}
          </label>
        )}
        <div className={clsx("relative flex items-center", fullWidth && "w-full")}>
          {leftIcon && (
            <span className="absolute left-3 text-[var(--muted)] pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-colors w-full",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 focus:ring-red-500",
              props.disabled && "opacity-60 cursor-not-allowed",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-[var(--muted)] flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {helperText && !error && (
          <span className="text-xs text-[var(--muted)] mt-1">{helperText}</span>
        )}
        {error && (
          <span id={errorId} className="text-xs text-red-400 mt-1">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input; 