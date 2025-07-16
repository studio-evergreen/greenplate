import { InputHTMLAttributes, ReactNode, forwardRef, useId } from "react";
import clsx from "clsx";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
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
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const inputId = useId();
    const errorId = useId();

    const sizeStyles = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 sm:py-2.5 text-base",
      lg: "px-5 py-4 sm:py-3 text-lg"
    };

    const iconSizeStyles = {
      sm: "left-2.5 text-sm",
      md: "left-3 text-base",
      lg: "left-4 text-lg"
    };

    const iconRightSizeStyles = {
      sm: "right-2.5 text-sm",
      md: "right-3 text-base",
      lg: "right-4 text-lg"
    };

    const iconSpacingStyles = {
      sm: "pl-8",
      md: "pl-10",
      lg: "pl-12"
    };

    const iconRightSpacingStyles = {
      sm: "pr-8",
      md: "pr-10",
      lg: "pr-12"
    };

    return (
      <div className={clsx("flex flex-col gap-1", fullWidth && "w-full")}> 
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--foreground)] mb-1 select-none">
            {label}
          </label>
        )}
        <div className={clsx("relative flex items-center", fullWidth && "w-full")}>
          {leftIcon && (
            <span className={clsx("absolute text-[var(--muted)] pointer-events-none flex items-center", iconSizeStyles[size])}>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "bg-[var(--input)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-colors w-full",
              sizeStyles[size],
              leftIcon && iconSpacingStyles[size],
              rightIcon && iconRightSpacingStyles[size],
              error && "border-red-500 focus:ring-red-500",
              props.disabled && "opacity-60 cursor-not-allowed",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          {rightIcon && (
            <span className={clsx("absolute text-[var(--muted)] flex items-center", iconRightSizeStyles[size])}>
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