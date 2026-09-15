"use client";

import { Bot, Check, Copy, Maximize2 } from "lucide-react";
import { useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  const isUser = role === "user";

  const LIMIT = 1000;
  const isLong = content.length > LIMIT;
  const preview = content.slice(0, LIMIT);

  const displayName = name ?? (isUser ? "You" : "CodeSync AI");

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

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div
      className={`group flex w-full gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI AVATAR */}
      {!isUser && (
        <Avatar className="mt-1 h-7 w-7 shrink-0">
          <AvatarImage src={image ?? undefined} alt={displayName} />

          <AvatarFallback className="bg-blue-600 text-white">
            <Bot className="h-3.5 w-3.5" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* MESSAGE COLUMN */}
      <div
        className={`flex min-w-0 max-w-[88%] flex-col sm:max-w-[82%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {/* HEADER */}
        <div
          className={`mb-1.5 flex items-center gap-2 px-1 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`text-[11px] font-medium ${
              isUser ? "text-blue-300" : "text-zinc-400"
            }`}
          >
            {displayName}
          </span>

          {formattedTime && (
            <span className="text-[10px] text-zinc-600">{formattedTime}</span>
          )}
        </div>

        {/* USER MESSAGE */}
        {isUser ? (
          <div
            className="
              max-w-full
              rounded-2xl
              rounded-br-md
              bg-blue-600
              px-4
              py-2.5
              text-sm
              leading-6
              text-white
              shadow-sm
            "
          >
            <p className="whitespace-pre-wrap break-words">{content}</p>
          </div>
        ) : (
          /* AI MESSAGE */
          <div className="min-w-0 max-w-full">
            <div
              className="
      rounded-xl
      border
      border-[#303033]
      bg-[#18181b]
      px-4
      py-3
    "
            >
              <MdMsg content={isLong ? `${preview}...` : content} />

              <div className="mt-3 flex items-center justify-end gap-2 border-t border-[#29292c] pt-2">
                {isLong && <ExpandCode content={content} />}

                <button
                  type="button"
                  onClick={handleCopy}
                  className="
          flex
          items-center
          gap-1.5
          rounded-md
          px-2
          py-1
          text-[11px]
          text-zinc-500
          transition-colors
          hover:bg-[#27272a]
          hover:text-zinc-200
        "
                  title="Copy response"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {isLong && (
              <div className="mt-1.5 px-1">
                <span className="text-[10px] text-zinc-600">
                  {content.length.toLocaleString()} characters
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* USER AVATAR */}
      {isUser && (
        <Avatar className="mt-1 h-7 w-7 shrink-0">
          <AvatarImage src={image ?? undefined} alt={displayName} />

          <AvatarFallback className="bg-zinc-700 text-[10px] text-white">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
