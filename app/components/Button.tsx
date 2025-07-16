import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60",
    secondary: "bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--border)] active:bg-[var(--border)] border border-[var(--border)] disabled:opacity-50",
    ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--card)] active:bg-[var(--border)] disabled:opacity-50"
  };

  const sizeStyles = {
    sm: "py-2 px-3 text-sm gap-1",
    md: "py-3 px-4 sm:py-2.5 sm:px-4 text-base gap-2",
    lg: "py-4 px-6 sm:py-3 sm:px-5 text-lg gap-2"
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:cursor-not-allowed cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
} 