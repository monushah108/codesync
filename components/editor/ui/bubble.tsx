import { Bot, Check, Copy } from "lucide-react";
import { useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AiMessage } from "@/context/types";
import MdMsg from "./mdMsg";

export default function Bubble({
  content,
  role,
  name,
  image,
  createdAt,
}: AiMessage) {
  const [expanded, setExpanded] = useState(false);
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
      {/* ================= AI AVATAR ================= */}

      {!isUser && (
        <Avatar className="mt-1 h-7 w-7 shrink-0">
          <AvatarImage src={image ?? undefined} alt={displayName} />

          <AvatarFallback className="bg-blue-600 text-white">
            <Bot className="h-3.5 w-3.5" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* ================= MESSAGE COLUMN ================= */}

      <div
        className={`flex min-w-0 max-w-[88%] flex-col sm:max-w-[82%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {/* ================= HEADER ================= */}

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

        {/* ================= USER MESSAGE ================= */}

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
          /* ================= AI MESSAGE ================= */

          <div className="min-w-0 max-w-full">
            {expanded ? (
              <ScrollArea.Root
                className="
                  max-h-[500px]
                  w-full
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#303033]
                  bg-[#18181b]
                "
              >
                <ScrollArea.Viewport className="max-h-[500px] w-full">
                  <div className="px-4 py-3">
                    <MdMsg content={content} />

                    {/* Copy Response */}

                    <div className="mt-3 flex justify-end border-t border-[#29292c] pt-2">
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
                      bg-zinc-700
                    "
                  />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            ) : (
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
              </div>
            )}

            {/* ================= SHOW MORE ================= */}

            {isLong && (
              <div className="mt-1.5 flex items-center justify-between gap-3 px-1">
                <span className="text-[10px] text-zinc-600">
                  {content.length.toLocaleString()} characters
                </span>

                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="
                    rounded-md
                    px-2
                    py-1
                    text-[11px]
                    font-medium
                    text-blue-400
                    transition-colors
                    hover:bg-blue-500/10
                    hover:text-blue-300
                  "
                >
                  {expanded ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= USER AVATAR ================= */}

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
