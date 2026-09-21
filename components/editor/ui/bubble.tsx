"use client";

import { Check, Copy, Sparkles, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiMessage } from "@/context/types";
import MdMsg from "./mdMsg";
import ExpandCode from "../Module/expandCode";

export default function Bubble({
  content,
  role,
  name,
  image,
  createdAt,
}: AiMessage) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const isUser = role === "user";
  const LIMIT = 1200;
  const isLong = content.length > LIMIT;
  const preview = content.slice(0, LIMIT);

  const displayName = isUser ? name || "You" : "CodeSync AI";

  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="w-full space-y-1 select-text">
      {/* =========================================================================
          USER QUERY BLOCK
      ========================================================================= */}
      {isUser ? (
        <div className="rounded-sm border border-[#2d2d30] bg-[#222225] p-3 text-xs transition-colors hover:border-[#3c3c3c]">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="size-5 rounded-sm">
                <AvatarImage src={image ?? undefined} alt={displayName} />
                <AvatarFallback className="rounded-sm bg-[#333333] text-[10px] text-[#cccccc]">
                  <User className="size-3" />
                </AvatarFallback>
              </Avatar>

              <span className="text-xs font-medium text-[#cccccc]">
                {displayName}
              </span>

              {formattedTime && (
                <span className="text-[10px] text-[#858585]">{formattedTime}</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="text-[#858585] transition-colors hover:text-[#cccccc]"
              title="Copy prompt"
            >
              {copied ? (
                <Check className="size-3 text-[#89d185]" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>

          {/* User Prompt Text */}
          <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-[#e0e0e0]">
            {content}
          </p>
        </div>
      ) : (
        /* =========================================================================
            AI RESPONSE BLOCK
        ========================================================================= */
        <div className="rounded-sm border border-[#2d2d30] bg-[#1e1e1e] p-3 text-xs transition-colors hover:border-[#383838]">
          {/* Header */}
          <div className="mb-2.5 flex items-center justify-between border-b border-[#2d2d30] pb-2">
            <div className="flex items-center gap-2">
              <div className="flex size-5 items-center justify-center rounded-sm bg-[#007acc]/15 text-[#007acc]">
                <Sparkles className="size-3" />
              </div>

              <span className="text-xs font-semibold text-[#cccccc]">
                {displayName}
              </span>

              <span className="rounded bg-[#252526] px-1.5 py-0.5 font-mono text-[9px] text-[#007acc] border border-[#2d2d30]">
                Copilot
              </span>

              {formattedTime && (
                <span className="text-[10px] text-[#858585]">{formattedTime}</span>
              )}
            </div>

            <span className="text-[10px] font-mono text-[#6e7681]">
              CodeSync-4o
            </span>
          </div>

          {/* Markdown Content */}
          <div className="min-w-0">
            <MdMsg content={isLong ? `${preview}...` : content} />
          </div>

          {/* Action Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-[#2d2d30] pt-2 text-[11px] text-[#858585]">
            <div className="flex items-center gap-2">
              {isLong && <ExpandCode content={content} />}

              {isLong && (
                <span className="text-[10px] text-[#6e7681]">
                  {content.length.toLocaleString()} chars
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Feedback */}
              <button
                type="button"
                onClick={() => setFeedback(feedback === "up" ? null : "up")}
                className={`p-1 rounded transition-colors hover:bg-[#2d2d30] ${
                  feedback === "up" ? "text-[#89d185]" : "text-[#858585] hover:text-[#cccccc]"
                }`}
                title="Good response"
              >
                <ThumbsUp className="size-3" />
              </button>
              <button
                type="button"
                onClick={() => setFeedback(feedback === "down" ? null : "down")}
                className={`p-1 rounded transition-colors hover:bg-[#2d2d30] ${
                  feedback === "down" ? "text-[#f14c4c]" : "text-[#858585] hover:text-[#cccccc]"
                }`}
                title="Bad response"
              >
                <ThumbsDown className="size-3" />
              </button>

              <div className="h-3 w-px bg-[#2d2d30] mx-0.5" />

              {/* Copy Full Response */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-[#858585] transition-colors hover:bg-[#2d2d30] hover:text-[#cccccc]"
                title="Copy entire response"
              >
                {copied ? (
                  <>
                    <Check className="size-3 text-[#89d185]" />
                    <span className="text-[#89d185]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
