"use client";

import { ResizablePanel } from "@/components/ui/resizable";
import { Bot } from "lucide-react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import Bubble from "./ui/bubble";
import { Spinner } from "../ui/spinner";
import { useLayout } from "@/context/layout-context";
import { useCodestore } from "@/lib/store/Codestore";

import { Avatar, AvatarFallback } from "../ui/avatar";
import useSocket from "@/context/socketProvider";
import ChatInput from "./ui/chatInput";
import EmptyChat from "./ui/emptyChat";
import ChatSkeleton from "./Skeleton/chatSkeleton";

export default function Chat() {
  const { panels } = useLayout();

  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const generating = useCodestore.getState().response.loading;
  const { applyResponse } = useSocket();

  const response = useCodestore((s) => s.response);
  const user = useCodestore((s) => s.user);

  const setClearResponse = useCodestore((s) => s.setClearResponse);

  const data = response?.data ?? [];
  const error = response?.error;
  const loading = response?.loading ?? false;

  // ---------------- SCROLL TO BOTTOM ----------------

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [data.length, loading]);

  const sendMessage = useCallback(
    async (prompt: string) => {
      const message = prompt.trim();

      if (!message || loading) {
        return;
      }

      applyResponse(message);
    },
    [loading, applyResponse],
  );
  const handleMessage = () => {
    const prompt = input.trim();

    if (!prompt || loading) return;

    setInput("");

    sendMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessage();
    }
  };

  return (
    <ResizablePanel
      defaultSize={panels.chat ? 35 : 0}
      className="border-l border-[#2d2d30]"
    >
      <Suspense fallback={<ChatSkeleton />}>
        <div className="flex h-full min-h-0 flex-col bg-[#1e1e1e]">
          {/* Header */}

          <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#2d2d30] px-3">
            <div className="flex items-center gap-2">
              <div className="relative flex size-7 items-center justify-center rounded-md bg-purple-600">
                <Bot className="size-4 text-white" />

                <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-[#1e1e1e] bg-emerald-400" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-zinc-200">
                    CodeSync AI
                  </span>

                  <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-medium text-blue-400">
                    AI
                  </span>
                </div>

                <p className="text-[10px] text-zinc-500">Coding assistant</p>
              </div>
            </div>

            <button
              type="button"
              onClick={setClearResponse}
              disabled={data.length === 0}
              className="
      rounded-md
      px-2
      py-1
      text-[11px]
      text-zinc-500
      transition-colors
      hover:bg-zinc-800
      hover:text-zinc-300
      disabled:pointer-events-none
      disabled:opacity-30
    "
            >
              Clear
            </button>
          </div>

          {/* Messages */}

          <ScrollArea.Root className="min-h-0 flex-1 overflow-hidden">
            {data.length == 0 ? (
              <EmptyChat />
            ) : (
              <ScrollArea.Viewport className="h-full w-full">
                <div className="mx-auto max-w-4xl space-y-5 p-4">
                  {data.map((message) => (
                    <Bubble
                      key={message.id}
                      content={message.content}
                      role={message.role}
                      name={message.user}
                      image={message.image}
                    />
                  ))}

                  {/* AI Loading */}

                  {loading && (
                    <div className="flex justify-start gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-blue-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#383838] bg-[#2a2d2e] px-4 py-3 text-sm text-zinc-400">
                        <Spinner className="h-4 w-4" />
                        <span>Generating...</span>
                      </div>
                    </div>
                  )}

                  {/* Error */}

                  {error && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
              </ScrollArea.Viewport>
            )}

            <ScrollArea.Scrollbar
              orientation="vertical"
              className="flex touch-none select-none p-0.5"
            >
              <ScrollArea.Thumb className="relative flex-1 rounded-full bg-zinc-700" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>

          {/* Input */}

          <ChatInput
            generating={generating}
            onSend={sendMessage}
            message={input}
            setMessage={setInput}
            handleKeyDown={handleKeyDown}
          />
        </div>
      </Suspense>
    </ResizablePanel>
  );
}
