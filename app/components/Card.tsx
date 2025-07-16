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
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8"
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
        "bg-[var(--card)] rounded-xl transition-colors",
        paddingStyles[padding],
        shadowStyles[shadow],
        border && "border border-[var(--border)]",
        hover && "hover:shadow-md hover:border-[var(--muted)] transition-all duration-200",
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
      className={clsx("border-b border-[var(--border)] pb-3 mb-3 sm:pb-4 sm:mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }: CardBodyProps) {
  return (
    <div className={clsx("text-[var(--muted)]", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div
      className={clsx("border-t border-[var(--border)] pt-3 mt-3 sm:pt-4 sm:mt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;