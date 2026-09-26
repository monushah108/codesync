"use client";

import React, { useEffect } from "react";
import {
  Bot,
  Check,
  X,
  RotateCcw,
  Square,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAiEditStore } from "@/lib/store/useAiEditStore";

interface EditorAiControlBarProps {
  onStop: () => void;
  onAccept: () => void;
  onReject: () => void;
  onRetry: () => void;
}

export default function EditorAiControlBar({
  onStop,
  onAccept,
  onReject,
  onRetry,
}: EditorAiControlBarProps) {
  const { status, fileName, diffRange } = useAiEditStore();

  const isVisible = status === "streaming" || status === "reviewing";

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();

        if (status === "streaming") {
          onStop();
        } else {
          onReject();
        }

        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (status === "reviewing") {
          e.preventDefault();
          e.stopPropagation();
          onAccept();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isVisible, status, onStop, onAccept, onReject]);

  if (!isVisible) return null;

  const modifiedLinesCount = diffRange
    ? Math.max(1, diffRange.endLine - diffRange.startLine + 1)
    : 1;

  const isStreaming = status === "streaming";

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: 6,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 6,
          scale: 0.98,
        }}
        transition={{
          duration: 0.14,
          ease: "easeOut",
        }}
        onClick={(e) => e.stopPropagation()}
        className="
    absolute
    bottom-10
    left-1/2
    z-50
    -translate-x-1/2

    flex
    items-center

    h-[38px]

    rounded-md
    border
    border-[#3e3e42]

    bg-[#252526]

    text-[#cccccc]

    shadow-[0_4px_14px_rgba(0,0,0,0.45)]

    select-none
    overflow-hidden
  "
      >
        {/* AI indicator */}

        <div className="flex items-center gap-2 px-2.5">
          <div
            className="
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded
              bg-[#333333]
              text-[#cccccc]
            "
          >
            {isStreaming ? (
              <Bot className="h-3.5 w-3.5" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
          </div>

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[12px] font-medium text-[#cccccc]">
              {isStreaming ? "AI editing" : "AI changes"}
            </span>

            {fileName && (
              <>
                <span className="text-[#666666]">·</span>

                <span
                  className="
                    max-w-[130px]
                    truncate
                    font-mono
                    text-[11px]
                    text-[#858585]
                  "
                >
                  {fileName}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Streaming indicator */}

        {isStreaming && (
          <>
            <div className="mx-1 h-4 w-px bg-[#3e3e42]" />

            <div className="flex items-center gap-1.5 px-2">
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#3794ff]
                  animate-pulse
                "
              />

              <span className="text-[11px] text-[#858585]">
                Generating
              </span>
            </div>
          </>
        )}

        {/* Review info */}

        {!isStreaming && (
          <>
            <div className="mx-1 h-4 w-px bg-[#3e3e42]" />

            <div className="px-2 text-[11px] text-[#858585]">
              {modifiedLinesCount}{" "}
              {modifiedLinesCount === 1 ? "line" : "lines"} changed
            </div>
          </>
        )}

        {/* Divider */}

        <div className="mx-1 h-5 w-px bg-[#3e3e42]" />

        {/* Controls */}

        <div className="flex items-center gap-0.5 pr-1.5">
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              title="Stop AI (Esc)"
              className="
                group
                flex
                h-7
                items-center
                gap-1.5
                rounded
                px-2

                text-[#cccccc]

                hover:bg-[#3e3e42]
                hover:text-white

                transition-colors
                cursor-pointer
              "
            >
              <Square
                className="
                  h-3
                  w-3
                  fill-current
                  text-[#858585]
                  group-hover:text-[#cccccc]
                "
              />

              <span className="text-[11px]">
                Stop
              </span>

              <kbd
                className="
                  ml-0.5
                  rounded
                  border
                  border-[#454545]
                  bg-[#1e1e1e]
                  px-1
                  py-[1px]
                  font-mono
                  text-[9px]
                  text-[#858585]
                "
              >
                Esc
              </kbd>
            </button>
          ) : (
            <>
              {/* Reject */}

              <button
                type="button"
                onClick={onReject}
                title="Reject changes (Esc)"
                className="
                  group
                  flex
                  h-7
                  items-center
                  gap-1.5
                  rounded
                  px-2

                  text-[#858585]

                  hover:bg-[#3e3e42]
                  hover:text-[#cccccc]

                  transition-colors
                  cursor-pointer
                "
              >
                <X className="h-3.5 w-3.5" />

                <span className="text-[11px]">
                  Reject
                </span>

                <kbd
                  className="
                    ml-0.5
                    rounded
                    border
                    border-[#454545]
                    bg-[#1e1e1e]
                    px-1
                    py-[1px]
                    font-mono
                    text-[9px]
                    text-[#858585]
                  "
                >
                  Esc
                </kbd>
              </button>

              {/* Accept */}

              <button
                type="button"
                onClick={onAccept}
                title="Accept changes (Ctrl+Enter)"
                className="
                  flex
                  h-7
                  items-center
                  gap-1.5
                  rounded

                  bg-[#0e639c]

                  px-2.5

                  text-white

                  hover:bg-[#1177bb]

                  transition-colors
                  cursor-pointer
                "
              >
                <Check className="h-3.5 w-3.5" />

                <span className="text-[11px] font-medium">
                  Accept
                </span>

                <kbd
                  className="
                    ml-0.5
                    rounded
                    border
                    border-white/15
                    bg-black/10
                    px-1
                    py-[1px]
                    font-mono
                    text-[9px]
                    text-white/70
                  "
                >
                  Ctrl+↵
                </kbd>
              </button>

              {/* Retry */}

              <button
                type="button"
                onClick={onRetry}
                title="Retry AI generation"
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded

                  text-[#858585]

                  hover:bg-[#3e3e42]
                  hover:text-[#cccccc]

                  transition-colors
                  cursor-pointer
                "
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}