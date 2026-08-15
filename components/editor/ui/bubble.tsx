"use client";

import { Bot } from "lucide-react";
import { useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiMessage } from "@/context/types";

export default function Bubble({
  content,
  role,
  name,
  image,
  createdAt,
}: AiMessage) {
  const [expanded, setExpanded] = useState(false);

  const isUser = role === "user";

  const LIMIT = 1000;
  const isLong = content.length > LIMIT;
  const preview = content.slice(0, LIMIT);

  const displayName = name ?? (isUser ? "You" : "CodeSync AI");

  // ---------------- TIME ----------------

  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`flex w-full gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* ================= AI AVATAR ================= */}

      {!isUser && (
        <Avatar className="mt-6 h-8 w-8 shrink-0">
          <AvatarImage src={image ?? undefined} alt={displayName} />

          <AvatarFallback className="bg-blue-600 text-white">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* ================= MESSAGE COLUMN ================= */}

      <div
        className={`
          flex min-w-0 max-w-[80%] flex-col
          sm:max-w-[75%]
          ${isUser ? "items-end" : "items-start"}
        `}
      >
        {/* ================= NAME + TIME ================= */}

        <div
          className={`
            mb-1 flex items-center gap-2 px-1
            ${isUser ? "justify-end" : "justify-start"}
          `}
        >
          <span
            className={`
              text-[11px] font-medium
              ${isUser ? "text-blue-300" : "text-zinc-400"}
            `}
          >
            {displayName}
          </span>

          {formattedTime && (
            <span className="text-[10px] text-zinc-600">{formattedTime}</span>
          )}
        </div>

        {/* ================= MESSAGE BOX ================= */}

        <div
          className={`
            min-w-0 max-w-full overflow-hidden
            rounded-2xl px-4 py-3
            shadow-sm
            ${
              isUser
                ? `
                  rounded-br-md
                  bg-blue-600
                  text-white
                `
                : `
                  rounded-bl-md
                  border border-[#383838]
                  bg-[#252526]
                  text-zinc-200
                `
            }
          `}
        >
          {/* ================= USER ================= */}

          {isUser ? (
            <p
              className="
                whitespace-pre-wrap
                break-words
                text-sm
                leading-6
              "
            >
              {content}
            </p>
          ) : (
            /* ================= AI ================= */
            <>
              {expanded ? (
                <ScrollArea.Root
                  className="
                    h-[500px]
                    max-w-full
                    overflow-hidden
                    rounded-lg
                    border
                    border-[#3c3c3c]
                    bg-[#181818]
                  "
                >
                  <ScrollArea.Viewport className="h-full w-full">
                    <pre
                      className="
                        whitespace-pre-wrap
                        break-words
                        p-3
                        font-mono
                        text-xs
                        leading-6
                        text-zinc-200
                      "
                    >
                      {content}
                    </pre>
                  </ScrollArea.Viewport>

                  <ScrollArea.Scrollbar
                    orientation="vertical"
                    className="
                      flex
                      w-2
                      touch-none
                      select-none
                      bg-transparent
                      p-0.5
                    "
                  >
                    <ScrollArea.Thumb
                      className="
                        relative
                        flex-1
                        rounded-full
                        bg-zinc-600
                      "
                    />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Root>
              ) : (
                <pre
                  className="
                    max-w-full
                    whitespace-pre-wrap
                    break-words
                    font-mono
                    text-xs
                    leading-6
                    text-zinc-200
                  "
                >
                  {isLong ? `${preview}...` : content}
                </pre>
              )}

              {/* Show More */}

              {isLong && (
                <div
                  className="
                    mt-2
                    flex
                    items-center
                    justify-between
                    gap-4
                    border-t
                    border-[#3c3c3c]
                    pt-2
                  "
                >
                  <span className="text-[10px] text-zinc-500">
                    {content.length.toLocaleString()} characters
                  </span>

                  <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="
                      shrink-0
                      rounded-md
                      px-2
                      py-1
                      text-xs
                      font-medium
                      text-blue-400
                      transition-colors
                      hover:bg-[#333]
                      hover:text-blue-300
                    "
                  >
                    {expanded ? "Show Less" : "Show More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ================= USER AVATAR ================= */}

      {isUser && (
        <Avatar className="mt-6 h-8 w-8 shrink-0">
          <AvatarImage src={image ?? undefined} alt={displayName} />

          <AvatarFallback className="bg-zinc-700 text-xs text-white">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
