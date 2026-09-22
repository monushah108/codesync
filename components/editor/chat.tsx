"use client";

import { Plus, RotateCcw, Sparkles, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import Bubble from "./ui/bubble";
import { useCodestore } from "@/lib/store/Codestore";
import { useLayoutstore } from "@/lib/store/Layoutstore";
import useSocket from "@/context/socketProvider";
import ChatInput from "./ui/chatInput";
import EmptyChat from "./ui/emptyChat";

export default function Chat() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { applyResponse, clearMessage } = useSocket();
  const closePanel = useLayoutstore((s) => s.closePanel);

  const response = useCodestore((s) => s.response);

  const data = response?.data ?? [];
  const error = response?.error;
  const loading = response?.loading ?? false;

  const generating = loading;

  /* ---------------- SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [data.length, loading]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = useCallback(
    (prompt: string) => {
      const message = prompt.trim();
      if (!message || loading) return;

      setInput("");
      applyResponse(message);
    },
    [loading, applyResponse],
  );

  /* ---------------- ENTER ---------------- */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();

    const message = input.trim();
    if (!message || loading) return;

    sendMessage(message);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#181818] text-[#cccccc] font-sans">
      {/* =========================================================================
          VS CODE SECONDARY SIDEBAR HEADER
      ========================================================================= */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-3 select-none">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-[#007acc]" />
          <span className="text-[11px] font-semibold text-[#cccccc] uppercase tracking-wider">
            Chat
          </span>
          <span className="rounded bg-[#1e1e1e] px-1.5 py-0.5 font-mono text-[9px] text-[#858585] border border-[#2d2d30]">
            Copilot
          </span>
        </div>

        <div className="flex items-center gap-1 text-[#858585]">
          <button
            type="button"
            onClick={clearMessage}
            disabled={data.length === 0}
            title="New Chat Session"
            className="p-1 rounded hover:bg-[#333333] hover:text-[#cccccc] transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <Plus className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={clearMessage}
            disabled={data.length === 0}
            title="Clear Chat Messages"
            className="p-1 rounded hover:bg-[#333333] hover:text-[#cccccc] transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <Trash2 className="size-3.5" />
          </button>

          <div className="h-3 w-px bg-[#2d2d30] mx-0.5" />

          <button
            type="button"
            onClick={() => closePanel("chat")}
            title="Close Side Bar"
            className="p-1 rounded hover:bg-[#333333] hover:text-[#cccccc] transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MESSAGES STREAM / EMPTY STATE
      ========================================================================= */}
      <ScrollArea.Root className="min-h-0 flex-1 overflow-hidden bg-[#181818]">
        {data.length === 0 ? (
          <EmptyChat onPromptClick={(prompt) => sendMessage(prompt)} />
        ) : (
          <ScrollArea.Viewport className="h-full w-full">
            <div className="flex flex-col gap-4 p-3.5 pb-6">
              {data.map((message) => (
                <Bubble
                  key={message.id}
                  id={message.id}
                  content={message.content}
                  role={message.role}
                  name={message.name}
                  image={message.image}
                  createdAt={message.createdAt}
                />
              ))}

              {/* GENERATING / THINKING STATE */}
              {loading && (
                <div className="rounded-lg border border-sky-500/20 bg-[#1a1e26] p-3.5 text-xs space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#2a2f3b] pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-5 items-center justify-center rounded bg-sky-500/15 text-sky-400">
                        <Sparkles className="size-3 animate-spin" />
                      </div>
                      <span className="text-xs font-semibold text-white">
                        CodeSync AI
                      </span>
                      <span className="rounded bg-[#222733] px-1.5 py-0.5 font-mono text-[9px] text-sky-400 border border-sky-500/30">
                        Copilot
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] text-sky-400">
                      <span className="size-1.5 rounded-full bg-sky-400 animate-pulse" />
                      Thinking...
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#959eb3]">
                    <span className="size-1.5 rounded-full bg-sky-400 animate-ping" />
                    <span>Analyzing workspace and generating solution...</span>
                  </div>

                  <div className="h-1 w-full bg-[#242935] overflow-hidden rounded-full">
                    <div className="h-full w-2/5 bg-gradient-to-r from-sky-500 to-indigo-500 animate-pulse rounded-full" />
                  </div>
                </div>
              )}

              {/* ERROR STATE */}
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-[#261517] p-3 text-xs font-mono text-red-300 shadow-sm">
                  <span className="font-semibold text-red-400">Error: </span>
                  <span>{error}</span>
                </div>
              )}

              <div ref={bottomRef} className="h-px" />
            </div>
          </ScrollArea.Viewport>
        )}

        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-150 w-2.5"
        >
          <ScrollArea.Thumb className="flex-1 bg-[#333333] hover:bg-[#444444] rounded-sm relative" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* =========================================================================
          CHAT INPUT
      ========================================================================= */}
      <ChatInput
        generating={generating}
        onSend={sendMessage}
        message={input}
        setMessage={setInput}
        handleKeyDown={handleKeyDown}
      />
    </div>
  );
}
