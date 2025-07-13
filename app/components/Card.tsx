import { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  hover?: boolean;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({
  children,
  padding = "md",
  shadow = "sm",
  border = true,
  hover = false,
  className,
  ...props
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-6",
    lg: "p-8"
  };

  const shadowStyles = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg"
  };

  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-800 rounded-xl transition-colors",
        paddingStyles[padding],
        shadowStyles[shadow],
        border && "border border-gray-200 dark:border-gray-700",
        hover && "hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div
      className={clsx("border-b border-gray-200 dark:border-gray-700 pb-4 mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }: CardBodyProps) {
  return (
    <div className={clsx("text-gray-700 dark:text-gray-300", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={clsx("border-t border-gray-200 dark:border-gray-700 pt-4 mt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;