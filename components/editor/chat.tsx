"use client";

import { ResizablePanel } from "@/components/ui/resizable";
import { Bot, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import Bubble from "./ui/bubble";
import { Spinner } from "../ui/spinner";
import { useLayout } from "@/context/layout-context";
import { useCodestore } from "@/lib/store/Codestore";
import { useCodeActions } from "@/lib/store/actions/useCodeAction";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useSocket from "@/context/socketProvider";

export default function Chat() {
  const { panels } = useLayout();

  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const response = useCodestore((s) => s.response);
  const user = useCodestore((s) => s.user);
  const addMessage = useCodestore((s) => s.addMessage);
  const setClearResponse = useCodestore((s) => s.setClearResponse);

  const { applyResponse } = useSocket();

  const data = response?.data ?? [];
  const error = response?.error;
  const loading = response?.loading;

  // ---------------- SCROLL TO BOTTOM ----------------

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [data.length, loading]);

  // ---------------- GENERATE AI RESPONSE ----------------

  const sendMessage = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || loading) return;

      try {
        const content = await useCodeActions.generateCode(prompt);

        return content;
      } catch (error) {
        console.error("AI generation failed:", error);
        throw error;
      }
    },
    [loading],
  );

  // ---------------- HANDLE MESSAGE ----------------

  const handleMessage = async () => {
    const prompt = input.trim();

    if (!prompt || loading) return;

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "24px";
    }

    // Add user message ONCE
    addMessage({
      id: crypto.randomUUID(),
      name: user?.name ?? "You",
      img: user?.image ?? null,
      msg: prompt,
      role: "user",
    });

    try {
      const content = await sendMessage(prompt);

      if (content) {
        applyResponse({
          prompt,
          content,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- ENTER KEY ----------------

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
      <div className="flex h-full min-h-0 flex-col bg-[#1e1e1e]">
        {/* Header */}

        <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#2d2d30] px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
              <Bot className="h-4 w-4 text-white" />
            </div>

            <span className="text-sm font-medium text-zinc-200">
              codesync AI
            </span>
          </div>

          <button
            onClick={setClearResponse}
            disabled={data.length === 0}
            className="text-xs text-zinc-500 transition-colors hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear
          </button>
        </div>

        {/* Messages */}

        <ScrollArea.Root className="min-h-0 flex-1 overflow-hidden">
          <ScrollArea.Viewport className="h-full w-full">
            <div className="mx-auto max-w-4xl space-y-5 p-4">
              {data.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* AI Avatar */}

                    {!isUser && (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage
                          src={message.img ?? undefined}
                          alt={message.name}
                        />

                        <AvatarFallback className="bg-blue-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {/* Message */}

                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        isUser
                          ? "rounded-br-md bg-blue-600 text-white"
                          : "rounded-bl-md border border-[#383838] bg-[#2a2d2e] text-zinc-100"
                      }`}
                    >
                      {/* Name */}

                      <div
                        className={`mb-1 text-[11px] font-medium ${
                          isUser ? "text-blue-100" : "text-zinc-400"
                        }`}
                      >
                        {message.name}
                      </div>

                      {/* Content */}

                      <Bubble content={message.msg} />
                    </div>

                    {/* User Avatar */}

                    {isUser && (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage
                          src={message.img ?? undefined}
                          alt={message.name}
                        />

                        <AvatarFallback>
                          {message.name?.slice(0, 2).toUpperCase() ?? "YO"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}

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

          <ScrollArea.Scrollbar
            orientation="vertical"
            className="flex touch-none select-none p-0.5"
          >
            <ScrollArea.Thumb className="relative flex-1 rounded-full bg-zinc-700" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        {/* Input */}

        <div className="shrink-0 border-t border-[#2d2d30] p-3">
          <div className="flex flex-col gap-2">
            <div
              className="
                flex
                items-end
                gap-2
                rounded-xl
                border
                border-[#3c3c3c]
                bg-[#252526]
                px-3
                py-2
                transition-colors
                focus-within:border-blue-500
              "
            >
              <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                maxLength={4000}
                placeholder="Ask codesync AI..."
                disabled={loading}
                className="
                  max-h-40
                  flex-1
                  resize-none
                  overflow-y-auto
                  bg-transparent
                  text-sm
                  text-zinc-100
                  placeholder:text-zinc-500
                  outline-none
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                onChange={(e) => {
                  setInput(e.target.value);

                  e.target.style.height = "auto";

                  e.target.style.height = `${Math.min(
                    e.target.scrollHeight,
                    160,
                  )}px`;
                }}
                onKeyDown={handleKeyDown}
              />

              <button
                onClick={handleMessage}
                disabled={!input.trim() || loading}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-600
                  text-white
                  transition-all
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:bg-[#3c3c3c]
                  disabled:text-zinc-500
                "
              >
                {loading ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>↵ Send • Shift + ↵ New line</span>

              <span>{input.length}/4000</span>
            </div>
          </div>
        </div>
      </div>
    </ResizablePanel>
  );
}
