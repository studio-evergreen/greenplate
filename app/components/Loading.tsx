import { HTMLAttributes } from "react";
import clsx from "clsx";

interface LoadingProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse";
  color?: "primary" | "white" | "gray";
  text?: string;
  overlay?: boolean;
}

interface SpinnerProps {
  size: "sm" | "md" | "lg" | "xl";
  color: "primary" | "white" | "gray";
  className?: string;
}

function Spinner({ size, color, className }: SpinnerProps) {
  const sizeStyles = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const colorStyles = {
    primary: "border-emerald-600 border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-400 border-t-transparent"
  };

  return (
    <div
      className={clsx(
        "animate-spin rounded-full border-2",
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

function Dots({ size, color, className }: SpinnerProps) {
  const sizeStyles = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3", 
    xl: "w-4 h-4"
  };

  const colorStyles = {
    primary: "bg-emerald-600",
    white: "bg-white",
    gray: "bg-gray-400"
  };

  return (
    <div className={clsx("flex space-x-1", className)} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            "rounded-full animate-pulse",
            sizeStyles[size],
            colorStyles[color]
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: "0.6s"
          }}
        />
      ))}
    </div>
  );
}

function Pulse({ size, color, className }: SpinnerProps) {
  const sizeStyles = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8", 
    xl: "w-12 h-12"
  };

  const colorStyles = {
    primary: "bg-emerald-600",
    white: "bg-white",
    gray: "bg-gray-400"
  };

  return (
    <div
      className={clsx(
        "rounded-full animate-pulse",
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function Loading({
  size = "md",
  variant = "spinner",
  color = "primary",
  text,
  overlay = false,
  className,
  ...props
}: LoadingProps) {
  const LoadingComponent = {
    spinner: Spinner,
    dots: Dots,
    pulse: Pulse
  }[variant];

  const content = (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3",
        overlay && "fixed inset-0 z-50 bg-white bg-opacity-75 dark:bg-black dark:bg-opacity-75",
        className
      )}
      {...props}
    >
      <LoadingComponent size={size} color={color} />
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {text}
        </span>
      )}
    </div>
  );

  return content;
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function LoadingButton({
  isLoading,
  children,
  loadingText = "Loading...",
  size = "md",
  disabled,
  className,
  onClick,
  ...props
}: LoadingButtonProps) {
  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base", 
    lg: "px-6 py-4 text-lg"
  };

  const spinnerSizes = {
    sm: "sm" as const,
    md: "sm" as const,
    lg: "md" as const
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors",
        "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <Spinner 
          size={spinnerSizes[size]} 
          color="white" 
          className="animate-spin"
        />
      )}
      {isLoading ? loadingText : children}
    </button>
  );
}

export default Loading;