"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Wand2,
  Bug,
  HelpCircle,
  FileCode,
  Square,
  Check,
  X,
  RotateCcw,
  ArrowUp,
  Copy,
  ChevronRight,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAiEditStore, AiMode } from "@/lib/store/useAiEditStore";
import { toast } from "sonner";

interface InlineAiPromptProps {
  onSendEdit: (prompt: string, mode: AiMode) => void;
  onStop: () => void;
  onAccept: () => void;
  onReject: () => void;
  onRetry: () => void;
}

export default function InlineAiPrompt({
  onSendEdit,
  onStop,
  onAccept,
  onReject,
  onRetry,
}: InlineAiPromptProps) {
  const {
    isOpen,
    status,
    mode,
    prompt,
    fileName,
    selection,
    cursorPosition,
    explanationText,
    error,
    diffRange,
    setPrompt,
    setMode,
    closeWidget,
  } = useAiEditStore();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && status === "idle") {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen, status]);

  // Global Esc / Ctrl+Enter handler when widget is active
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc: Stop if streaming, Reject if reviewing, Close if idle
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        if (status === "streaming") {
          onStop();
        } else if (status === "reviewing") {
          onReject();
        } else {
          closeWidget();
        }
        return;
      }

      // Ctrl+Enter or Cmd+Enter: Accept if reviewing, or Send if idle
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        if (status === "reviewing") {
          onAccept();
        } else if (status === "idle" && prompt.trim()) {
          onSendEdit(prompt.trim(), mode);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, status, prompt, mode, onStop, onAccept, onReject, closeWidget, onSendEdit]);

  if (!isOpen) return null;

  const handleQuickAction = (selectedMode: AiMode, quickPrompt?: string) => {
    setMode(selectedMode);
    const textToSend = quickPrompt || prompt.trim();
    if (textToSend) {
      onSendEdit(textToSend, selectedMode);
    } else {
      inputRef.current?.focus();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = prompt.trim();
      if (!trimmed || status === "streaming") return;
      onSendEdit(trimmed, mode);
    }
  };

  const handleCopyExplanation = () => {
    if (!explanationText) return;
    navigator.clipboard.writeText(explanationText);
    setCopied(true);
    toast.success("Explanation copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedLinesCount = selection
    ? selection.endLineNumber - selection.startLineNumber + 1
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        className="pointer-events-auto absolute top-3 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl rounded-xl border border-[#383842] bg-[#16161a]/95 p-3 text-white shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_25px_rgba(168,85,247,0.18)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Top Border Glowing Line during streaming */}
        {status === "streaming" && (
          <div className="absolute inset-x-0 -top-px h-[2px] overflow-hidden rounded-t-xl">
            <div className="h-full w-full bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500 animate-pulse" />
          </div>
        )}

        {/* 1. Header Bar: codesync  AI Title & Target Context */}
        <div className="flex items-center justify-between gap-2 border-b border-[#282830] pb-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-purple-600 to-cyan-500 shadow-sm">
              <Bot className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold tracking-wide text-zinc-100 flex items-center gap-1.5">
              <span>codesync  AI</span>
              <span className="rounded bg-purple-500/20 border border-purple-500/30 px-1 py-0.2 font-mono text-[9px] text-purple-300">
                Ctrl+K
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Target context badge */}
            {selection && selectedLinesCount > 0 ? (
              <span className="flex items-center gap-1 rounded-md bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                <FileCode className="h-3 w-3 text-cyan-400" />
                <span>
                  Lines {selection.startLineNumber}–{selection.endLineNumber} ({selectedLinesCount}L)
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-md bg-zinc-800/80 border border-zinc-700/50 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                <span>{fileName || "Active file"}</span>
                <span>:</span>
                <span>L{cursorPosition?.lineNumber ?? 1}</span>
              </span>
            )}

            {/* Close button */}
            <button
              type="button"
              onClick={closeWidget}
              title="Close (Esc)"
              className="rounded p-0.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Main Content Area */}
        <div className="pt-2.5">
          {/* STATE A: IDLE / EDIT INPUT */}
          {status === "idle" && (
            <div className="space-y-2">
              {/* Quick Action Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickAction("edit", "Refactor and optimize this code")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 transition-all ${mode === "edit"
                      ? "bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-sm"
                      : "bg-[#212128] text-zinc-400 border border-zinc-800 hover:bg-[#282832] hover:text-zinc-200"
                    }`}
                >
                  <Wand2 className="h-3 w-3 text-purple-400" />
                  <span>Edit / Refactor</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAction("fix", "Find and fix bugs or errors in this code")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 transition-all ${mode === "fix"
                      ? "bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm"
                      : "bg-[#212128] text-zinc-400 border border-zinc-800 hover:bg-[#282832] hover:text-zinc-200"
                    }`}
                >
                  <Bug className="h-3 w-3 text-amber-400" />
                  <span>Fix Bugs</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAction("explain", "Explain how this code works step by step")}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 transition-all ${mode === "explain"
                      ? "bg-cyan-600/30 text-cyan-200 border border-cyan-500/50 shadow-sm"
                      : "bg-[#212128] text-zinc-400 border border-zinc-800 hover:bg-[#282832] hover:text-zinc-200"
                    }`}
                >
                  <HelpCircle className="h-3 w-3 text-cyan-400" />
                  <span>Explain</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAction("edit", "Add TypeScript types and comprehensive JSDoc comments")}
                  className="flex items-center gap-1 rounded-md px-2 py-1 bg-[#212128] text-zinc-400 border border-zinc-800 hover:bg-[#282832] hover:text-zinc-200 transition-all"
                >
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  <span>Types & Docs</span>
                </button>
              </div>

              {/* Text Input Box */}
              <div className="relative rounded-lg border border-[#33333d] bg-[#1a1a20] transition-all focus-within:border-purple-500/80 focus-within:ring-1 focus-within:ring-purple-500/30">
                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  rows={2}
                  placeholder={
                    mode === "fix"
                      ? "Describe the issue or let AI detect & fix bugs..."
                      : mode === "explain"
                        ? "What would you like explained about this code? (e.g. 'explain recursion')"
                        : "Tell AI how to edit or generate code... (e.g. 'make it async', 'add validation')"
                  }
                  className="w-full resize-none bg-transparent px-3 py-2 text-xs leading-relaxed text-zinc-100 placeholder:text-zinc-500 outline-none"
                />

                <div className="flex items-center justify-between border-t border-[#26262f] px-2.5 py-1.5 text-[10px] text-zinc-500">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>↵ Enter to submit</span>
                    <span>·</span>
                    <span>Shift+↵ New line</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (prompt.trim()) {
                        onSendEdit(prompt.trim(), mode);
                      }
                    }}
                    disabled={!prompt.trim()}
                    className="flex h-6 items-center gap-1 rounded-md bg-purple-600 px-2.5 font-medium text-white transition-all hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                  >
                    <span>Send</span>
                    <ArrowUp className="h-3 w-3 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STATE B: STREAMING / GENERATING CODE */}
          {status === "streaming" && (
            <div className="space-y-3 py-1">
              <div className="flex items-center justify-between rounded-lg border border-purple-500/30 bg-purple-500/10 p-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-purple-500/20 text-purple-400">
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-purple-200">
                      codesync  AI is writing code...
                    </div>
                    <div className="text-[10px] text-purple-300/70">
                      Live cursor tracking and diff highlighting active in editor
                    </div>
                  </div>
                </div>

                {/* STOP BUTTON */}
                <button
                  type="button"
                  onClick={onStop}
                  title="Stop AI (Esc)"
                  className="flex items-center gap-1.5 rounded-md bg-red-500/20 border border-red-500/40 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/30 active:scale-95 transition-all shadow-sm"
                >
                  <Square className="h-3 w-3 fill-red-400" />
                  <span>Stop AI</span>
                  <span className="font-mono text-[9px] opacity-75">(Esc)</span>
                </button>
              </div>

              {/* Shimmering Progress Bar */}
              <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                <div className="h-full w-2/5 bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {/* STATE C: REVIEWING DIFF (ACCEPT / REJECT / RETRY) */}
          {status === "reviewing" && (
            <div className="space-y-2.5 py-1">
              <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-200">
                      AI Code Edits Ready for Review
                    </div>
                    <div className="text-[10px] text-emerald-300/80">
                      {diffRange
                        ? `Lines ${diffRange.startLine}–${diffRange.endLine} modified`
                        : "Changes highlighted in green"}
                    </div>
                  </div>
                </div>

                {/* Accept & Reject Action Buttons */}
                <div className="flex items-center gap-1.5">
                  {/* Reject / Discard */}
                  <button
                    type="button"
                    onClick={onReject}
                    title="Discard changes and revert (Esc)"
                    className="flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition-colors"
                  >
                    <X className="h-3 w-3 text-red-400" />
                    <span>Reject</span>
                    <span className="font-mono text-[9px] opacity-60">Esc</span>
                  </button>

                  {/* Accept */}
                  <button
                    type="button"
                    onClick={onAccept}
                    title="Accept and keep changes (Ctrl+Enter)"
                    className="flex items-center gap-1 rounded-md bg-emerald-500 px-3 py-1 text-xs font-semibold text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
                  >
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Accept</span>
                    <span className="font-mono text-[9px] opacity-75">Ctrl+↵</span>
                  </button>
                </div>
              </div>

              {/* Tweak / Follow-up prompt row */}
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="Ask AI to adjust this edit... (e.g. 'handle null cases', 'add comments')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && prompt.trim()) {
                      onRetry();
                    }
                  }}
                  className="flex-1 rounded-md border border-zinc-800 bg-[#1a1a20] px-2.5 py-1 text-[11px] text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-purple-500/60"
                />

                <button
                  type="button"
                  onClick={onRetry}
                  title="Retry with new prompt"
                  className="flex items-center gap-1 rounded-md border border-zinc-700 bg-[#212128] px-2 py-1 text-[11px] text-zinc-300 hover:bg-[#2b2b34] hover:text-white transition-colors"
                >
                  <RotateCcw className="h-3 w-3 text-sky-400" />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE D: EXPLAINING CODE */}
          {status === "explaining" && (
            <div className="space-y-2 py-1">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 text-xs">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Code Explanation
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopyExplanation}
                    className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={closeWidget}
                    className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    Done (Esc)
                  </button>
                </div>
              </div>

              {/* Markdown Explanation Body */}
              <div className="max-h-64 overflow-y-auto pr-1 text-xs leading-relaxed text-zinc-200 scrollbar-thin">
                {explanationText ? (
                  <div className="prose prose-invert prose-xs max-w-none space-y-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {explanationText}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 py-4 text-zinc-400 text-xs justify-center">
                    <Sparkles className="h-4 w-4 animate-spin text-cyan-400" />
                    <span>Analyzing code and compiling explanation...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ERROR ALERT */}
          {error && (
            <div className="mt-2 rounded-md border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300">
              <span className="font-semibold text-red-400">Error: </span>
              <span>{error}</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
