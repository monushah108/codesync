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
    <div className="w-full select-text transition-all">
      {/* ================= USER QUERY BLOCK ================= */}
      {isUser ? (
        <div className="group relative rounded-lg border border-[#313642] bg-[#21242b] p-3.5 text-xs shadow-sm transition-all hover:border-[#3e4554]">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="size-5.5 rounded-md border border-[#3b414f]">
                <AvatarImage src={image ?? undefined} alt={displayName} />
                <AvatarFallback className="rounded-md bg-[#2b2f38] text-[10px] text-[#cccccc]">
                  <User className="size-3 text-sky-400" />
                </AvatarFallback>
              </Avatar>

              <span className="text-xs font-semibold text-[#f0f0f0]">
                {displayName}
              </span>

              <span className="rounded bg-[#2a2e38] px-1.5 py-0.5 text-[9px] font-medium text-[#8c94a6] border border-[#353a47]">
                You
              </span>

              {formattedTime && (
                <span className="text-[10px] text-[#717888]">{formattedTime}</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-[#858585] transition-colors hover:bg-[#2b2f3a] hover:text-[#cccccc]"
              title="Copy prompt"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                </>
              )}
            </button>
          </div>

          {/* User Prompt Text */}
          <p className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-[#e2e4e9]">
            {content}
          </p>
        </div>
      ) : (
        /* ================= AI RESPONSE BLOCK ================= */
        <div className="group relative rounded-lg border border-[#2b2b30] bg-[#1a1a1c] p-3.5 text-xs shadow-sm transition-all hover:border-[#383840]">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between border-b border-[#29292e] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex size-5.5 items-center justify-center rounded-md bg-gradient-to-br from-sky-500/20 via-sky-500/10 to-transparent border border-sky-500/30 text-sky-400 shadow-sm">
                <Sparkles className="size-3" />
              </div>

              <span className="text-xs font-semibold text-white">
                {displayName}
              </span>

              <span className="rounded bg-sky-500/10 px-1.5 py-0.5 font-mono text-[9px] text-sky-400 border border-sky-500/20">
                Copilot
              </span>

              {formattedTime && (
                <span className="text-[10px] text-[#707078]">{formattedTime}</span>
              )}
            </div>

            <span className="rounded bg-[#222226] px-1.5 py-0.5 font-mono text-[9px] text-[#808088] border border-[#2e2e34]">
              GPT-4o
            </span>
          </div>

          {/* Markdown Content */}
          <div className="min-w-0 text-[13px] leading-relaxed text-[#d4d4d8]">
            <MdMsg content={isLong ? `${preview}...` : content} />
          </div>

          {/* Action Footer */}
          <div className="mt-3.5 flex items-center justify-between border-t border-[#26262a] pt-2.5 text-[11px] text-[#808088]">
            <div className="flex items-center gap-2">
              {isLong && <ExpandCode content={content} />}

              {isLong && (
                <span className="text-[10px] text-[#63636b]">
                  {content.length.toLocaleString()} chars
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Feedback */}
              <button
                type="button"
                onClick={() => setFeedback(feedback === "up" ? null : "up")}
                className={`p-1 rounded transition-colors hover:bg-[#28282c] ${
                  feedback === "up"
                    ? "text-emerald-400 bg-emerald-500/10"
                    : "text-[#808088] hover:text-[#cccccc]"
                }`}
                title="Helpful response"
              >
                <ThumbsUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFeedback(feedback === "down" ? null : "down")}
                className={`p-1 rounded transition-colors hover:bg-[#28282c] ${
                  feedback === "down"
                    ? "text-red-400 bg-red-500/10"
                    : "text-[#808088] hover:text-[#cccccc]"
                }`}
                title="Not helpful"
              >
                <ThumbsDown className="size-3.5" />
              </button>

              <div className="h-3 w-px bg-[#2f2f35] mx-1" />

              {/* Copy Full Response */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-[#909098] transition-colors hover:bg-[#26262b] hover:text-white"
                title="Copy entire response"
              >
                {copied ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
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
