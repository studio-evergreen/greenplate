import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Button({
  children,
  variant = "primary",
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

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-lg py-3 px-4 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:cursor-not-allowed cursor-pointer",
        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {leftIcon && <span className="mr-1 flex items-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-1 flex items-center">{rightIcon}</span>}
    </button>
  );
} 