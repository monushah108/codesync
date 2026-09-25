"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, RotateCw, X, ShieldAlert, LogOut } from "lucide-react";
import { useLayoutstore } from "@/lib/store/Layoutstore";

export default function WorkspaceConfirmModal() {
  const modal = useLayoutstore((s) => s.confirmModal);
  const hideConfirmModal = useLayoutstore((s) => s.hideConfirmModal);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  // Auto focus cancel button on mount for safe keyboard navigation
  useEffect(() => {
    if (modal) {
      const timer = setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [modal]);

  // Handle Escape and Enter keyboard shortcuts
  useEffect(() => {
    if (!modal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        modal.onCancel?.();
        hideConfirmModal();
      } else if (e.key === "Enter" && !e.shiftKey) {
        if (document.activeElement === cancelBtnRef.current) {
          modal.onCancel?.();
          hideConfirmModal();
          return;
        }
        e.preventDefault();
        modal.onConfirm();
        hideConfirmModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal, hideConfirmModal]);

  if (!modal) return null;

  const isReload = modal.type === "reload";
  const isLeave = modal.type === "leave";

  const handleConfirm = () => {
    modal.onConfirm();
    hideConfirmModal();
  };

  const handleCancel = () => {
    modal.onCancel?.();
    hideConfirmModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleCancel}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* VS Code Style Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="relative z-10 w-full max-w-[440px] rounded-md border border-[#3c3c3c] bg-[#252526] shadow-2xl text-[#cccccc] font-sans overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#333333] bg-[#1f1f1f] px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <div
                className={`flex size-6 items-center justify-center rounded-full border ${
                  isReload
                    ? "border-[#007acc]/40 bg-[#007acc]/15 text-[#007acc]"
                    : isLeave
                    ? "border-[#e51400]/40 bg-[#e51400]/15 text-[#f48771]"
                    : "border-[#cca700]/40 bg-[#cca700]/15 text-[#cca700]"
                }`}
              >
                {isReload ? (
                  <RotateCw className="size-3.5" />
                ) : isLeave ? (
                  <LogOut className="size-3.5" />
                ) : (
                  <AlertTriangle className="size-3.5" />
                )}
              </div>
              <h2
                id="confirm-modal-title"
                className="text-xs font-semibold uppercase tracking-wider text-white"
              >
                {modal.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              title="Close (Esc)"
              className="rounded p-1 text-[#858585] hover:bg-[#333333] hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-3.5 space-y-3">
            <p className="text-xs text-[#d4d4d4] leading-relaxed">
              {modal.description}
            </p>

            {/* VS Code Warning Callout */}
            <div className="flex items-start gap-2.5 rounded bg-[#1e1e1e] border border-[#333333] p-2.5 text-[11px] text-[#9d9d9d]">
              <ShieldAlert className="size-4 shrink-0 text-[#cca700] mt-0.5" />
              <span className="leading-tight">
                {modal.warningNote ||
                  "Active collaboration state and unsaved buffer changes may be reset."}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-[#333333] bg-[#1e1e1e] px-4 py-2.5">
            <button
              ref={cancelBtnRef}
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 rounded-sm border border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#383838] px-3 py-1.5 text-xs font-medium text-[#cccccc] hover:text-white transition-colors cursor-pointer"
            >
              <span>{modal.cancelText || "Cancel"}</span>
              <kbd className="rounded bg-[#1e1e1e] px-1 py-0.2 text-[9px] font-mono text-[#858585]">
                Esc
              </kbd>
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className={`flex items-center gap-1.5 rounded-sm px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer ${
                isLeave
                  ? "bg-[#d9534f] hover:bg-[#c9302c]"
                  : "bg-[#007acc] hover:bg-[#0062a3]"
              }`}
            >
              {isReload && <RotateCw className="size-3" />}
              {isLeave && <LogOut className="size-3" />}
              <span>{modal.confirmText || (isReload ? "Reload" : "Leave")}</span>
              <kbd className="rounded bg-black/20 px-1 py-0.2 text-[9px] font-mono text-white/80">
                ↵
              </kbd>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
