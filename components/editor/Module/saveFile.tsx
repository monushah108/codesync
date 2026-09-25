"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Save, ShieldAlert, X } from "lucide-react";
import { useCodestore } from "@/lib/store/Codestore";

type Props = {
  fileName?: string;
  fileId?: string;
  onSave: () => void | Promise<void>;
  onDiscard: () => void;
};

export default function SaveFile({ fileName, fileId, onSave, onDiscard }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const setEdited = useCodestore((s) => s.setFileEdited);
  const activeFileId = useCodestore((s) => s.activeFileId);
  const targetId = fileId || activeFileId;

  const saveBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto focus save button on mount for quick Enter confirmation
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        saveBtnRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Keyboard navigation: Escape cancels, Enter saves
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleSave = async () => {
    setOpen(false);
    await onSave();
    if (targetId) {
      setEdited(targetId, false);
    }
  };

  const handleDiscard = () => {
    setOpen(false);
    onDiscard();
    if (targetId) {
      setEdited(targetId, false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-modal-title"
            className="relative z-10 w-full max-w-[430px] rounded-md border border-[#3c3c3c] bg-[#252526] shadow-2xl text-[#cccccc] font-sans overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-[#333333] bg-[#1f1f1f] px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full border border-[#cca700]/40 bg-[#cca700]/15 text-[#cca700]">
                  <AlertTriangle className="size-3.5" />
                </div>
                <h2
                  id="save-modal-title"
                  className="text-xs font-semibold uppercase tracking-wider text-white"
                >
                  Unsaved Changes
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Cancel (Esc)"
                className="rounded p-1 text-[#858585] hover:bg-[#333333] hover:text-white transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-3.5 space-y-3">
              <p className="text-xs text-[#d4d4d4] leading-relaxed">
                Do you want to save the changes you made to{" "}
                <span className="font-semibold text-white px-1.5 py-0.5 rounded bg-[#1e1e1e] border border-[#333333] font-mono text-[11px]">
                  {fileName || "this file"}
                </span>
                ?
              </p>

              {/* Warning Note */}
              <div className="flex items-start gap-2.5 rounded bg-[#1e1e1e] border border-[#333333] p-2.5 text-[11px] text-[#9d9d9d]">
                <ShieldAlert className="size-4 shrink-0 text-[#cca700] mt-0.5" />
                <span className="leading-tight">
                  Your changes will be lost if you close this file without saving.
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-[#333333] bg-[#1e1e1e] px-4 py-2.5">
              {/* Discard button */}
              <button
                type="button"
                onClick={handleDiscard}
                className="flex items-center gap-1.5 rounded-sm border border-[#e51400]/40 bg-[#e51400]/15 hover:bg-[#e51400]/30 text-[#f48771] px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Don&apos;t Save</span>
              </button>

              {/* Cancel button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 rounded-sm border border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#383838] px-3 py-1.5 text-xs font-medium text-[#cccccc] hover:text-white transition-colors cursor-pointer"
              >
                <span>Cancel</span>
                <kbd className="rounded bg-[#1e1e1e] px-1 py-0.2 text-[9px] font-mono text-[#858585]">
                  Esc
                </kbd>
              </button>

              {/* Save button */}
              <button
                ref={saveBtnRef}
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-sm bg-[#007acc] hover:bg-[#0062a3] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
              >
                <Save className="size-3.5" />
                <span>Save</span>
                <kbd className="rounded bg-black/20 px-1 py-0.2 text-[9px] font-mono text-white/80">
                  ↵
                </kbd>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Trigger: unsaved dot that transforms into close icon on hover */}
      <span
        role="button"
        tabIndex={0}
        title={`Unsaved changes in ${fileName || "file"}. Click to close or save.`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            setOpen(true);
          }
        }}
        className="
          group/save relative flex size-5 items-center justify-center
          rounded-sm cursor-pointer transition-colors
          hover:bg-[#454545]
        "
      >
        {/* Unsaved dot (default) */}
        <span className="size-2 rounded-full bg-[#cccccc] transition-opacity group-hover/save:opacity-0" />

        {/* Close X icon (on hover) */}
        <X className="absolute size-3.5 text-[#cccccc] opacity-0 transition-opacity group-hover/save:opacity-100" />
      </span>

      {/* Save Modal portaled to document.body */}
      {mounted && typeof document !== "undefined"
        ? createPortal(modalContent, document.body)
        : null}
    </>
  );
}
