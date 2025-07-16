"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import clsx from "clsx";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  className,
  showCloseButton = true,
  closeOnOverlayClick = true
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sheetContent = (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        ref={sheetRef}
        className={clsx(
          "relative w-full max-w-md bg-[var(--card)] rounded-t-2xl shadow-xl animate-slide-up",
          "max-h-[80vh] overflow-hidden",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "bottom-sheet-title" : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          {title && (
            <h3 id="bottom-sheet-title" className="text-lg font-semibold text-[var(--foreground)]">
              {title}
            </h3>
          )}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors ml-auto"
              aria-label="Close bottom sheet"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-64px)]">
          {children}
        </div>

        {/* Drag indicator */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-[var(--muted)] rounded-full opacity-50" />
      </div>
    </div>
  );

  return createPortal(sheetContent, document.body);
}

export default BottomSheet;