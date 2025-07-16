"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import clsx from "clsx";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  fullScreenOnMobile?: boolean;
  className?: string;
}

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  fullScreenOnMobile = false,
  className
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeStyles = {
    sm: fullScreenOnMobile ? "w-full h-full sm:max-w-md sm:h-auto" : "max-w-md mx-4 sm:mx-0",
    md: fullScreenOnMobile ? "w-full h-full sm:max-w-lg sm:h-auto" : "max-w-lg mx-4 sm:mx-0",
    lg: fullScreenOnMobile ? "w-full h-full sm:max-w-2xl sm:h-auto" : "max-w-2xl mx-4 sm:mx-0",
    xl: fullScreenOnMobile ? "w-full h-full sm:max-w-4xl sm:h-auto" : "max-w-4xl mx-4 sm:mx-0"
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",
        fullScreenOnMobile ? "p-0 sm:p-4" : "p-4"
      )}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={clsx(
          "relative bg-[var(--card)] shadow-xl",
          fullScreenOnMobile ? "rounded-none sm:rounded-xl" : "rounded-xl",
          sizeStyles[size],
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 sm:p-1 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  return (
    <div
      className={clsx(
        "px-4 py-4 sm:px-6 sm:py-4 border-b border-[var(--border)]",
        className
      )}
    >
      <h3 className="text-lg font-semibold text-[var(--foreground)] pr-8">
        {children}
      </h3>
    </div>
  );
}

export function ModalBody({ children, className, ...props }: ModalBodyProps) {
  return (
    <div className={clsx("px-4 py-4 sm:px-6 sm:py-4", className)} {...props}>
      <div className="text-[var(--muted)]">{children}</div>
    </div>
  );
}

export function ModalFooter({ children, className, ...props }: ModalFooterProps) {
  return (
    <div
      className={clsx(
        "px-4 py-4 sm:px-6 sm:py-4 border-t border-[var(--border)] flex flex-col sm:flex-row justify-end gap-2 sm:gap-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info"
}: ConfirmModalProps) {
  const variantStyles = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-emerald-600 hover:bg-emerald-700"
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <p>{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          className={variantStyles[variant]}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default Modal;