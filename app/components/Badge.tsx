import { HTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export function Badge({
  children,
  variant = "primary",
  size = "md",
  rounded = false,
  removable = false,
  onRemove,
  className,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium",
        variantStyles[variant],
        sizeStyles[size],
        rounded ? "rounded-full" : "rounded-md",
        removable && "gap-1",
        className
      )}
      {...props}
    >
      {children}
      {removable && (
        <button
          onClick={handleRemove}
          className="ml-1 inline-flex items-center justify-center rounded-full hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 transition-colors"
          style={{ width: "14px", height: "14px" }}
          aria-label="Remove"
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
}

interface DotBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

export function DotBadge({
  variant = "primary",
  size = "md",
  pulse = false,
  className,
  ...props
}: DotBadgeProps) {
  const variantStyles = {
    primary: "bg-emerald-500",
    secondary: "bg-gray-500", 
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
    info: "bg-blue-500"
  };

  const sizeStyles = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  return (
    <span
      className={clsx(
        "inline-flex rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        pulse && "animate-pulse",
        className
      )}
      {...props}
    />
  );
}

interface NumberBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  count: number;
  max?: number;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  showZero?: boolean;
}

export function NumberBadge({
  count,
  max = 99,
  variant = "danger",
  size = "md",
  showZero = false,
  className,
  ...props
}: NumberBadgeProps) {
  if (count <= 0 && !showZero) {
    return null;
  }

  const variantStyles = {
    primary: "bg-emerald-500 text-white",
    secondary: "bg-gray-500 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white",
    info: "bg-blue-500 text-white"
  };

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-xs min-w-[16px] h-4",
    md: "px-2 py-0.5 text-xs min-w-[20px] h-5",
    lg: "px-2.5 py-1 text-sm min-w-[24px] h-6"
  };

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center font-medium rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {displayCount}
    </span>
  );
}

interface StatusBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  status: "online" | "offline" | "away" | "busy" | "idle";
  withDot?: boolean;
  children?: ReactNode;
}

export function StatusBadge({
  status,
  withDot = true,
  children,
  className,
  ...props
}: StatusBadgeProps) {
  const statusConfig = {
    online: {
      label: "Online",
      color: "bg-green-500",
      textColor: "text-green-800",
      bgColor: "bg-green-100 dark:bg-green-900 dark:text-green-200"
    },
    offline: {
      label: "Offline",
      color: "bg-gray-500",
      textColor: "text-gray-800",
      bgColor: "bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
    },
    away: {
      label: "Away",
      color: "bg-yellow-500",
      textColor: "text-yellow-800",
      bgColor: "bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200"
    },
    busy: {
      label: "Busy",
      color: "bg-red-500",
      textColor: "text-red-800",
      bgColor: "bg-red-100 dark:bg-red-900 dark:text-red-200"
    },
    idle: {
      label: "Idle",
      color: "bg-orange-500",
      textColor: "text-orange-800",
      bgColor: "bg-orange-100 dark:bg-orange-900 dark:text-orange-200"
    }
  };

  const config = statusConfig[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium rounded-md",
        config.bgColor,
        config.textColor,
        className
      )}
      {...props}
    >
      {withDot && (
        <span className={clsx("w-2 h-2 rounded-full", config.color)} />
      )}
      {children || config.label}
    </span>
  );
}

export default Badge;