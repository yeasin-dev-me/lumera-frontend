"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  asBottomSheetOnMobile?: boolean;
  showCloseButton?: boolean;
}

const MAX_WIDTH_CLASSES = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
  asBottomSheetOnMobile = true,
  showCloseButton = true,
}: ModalProps) {
  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        className={`relative z-10 w-full ${
          asBottomSheetOnMobile
            ? "rounded-t-2xl sm:rounded-2xl max-h-[90vh]"
            : "rounded-2xl max-h-[85vh]"
        } ${
          MAX_WIDTH_CLASSES[maxWidth]
        } bg-surface border border-border/80 shadow-2xl flex flex-col overflow-hidden transform transition-all duration-300 ease-out`}
      >
        {/* Mobile bottom-sheet drag handle */}
        {asBottomSheetOnMobile && (
          <div className="sm:hidden flex justify-center pt-2 pb-1">
            <div className="w-12 h-1.5 rounded-full bg-border" />
          </div>
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
            <div>
              {title && (
                <h3 id="modal-title" className="text-lg font-serif font-medium text-lumera-text">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-lumera-text-muted mt-0.5">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="min-w-[40px] min-h-[40px] -mr-2 rounded-full flex items-center justify-center text-lumera-text-muted hover:text-lumera-text hover:bg-surface-muted transition-colors active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)] overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
