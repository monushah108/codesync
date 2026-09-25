"use client";

import { memo } from "react";
import { Bot, Plus, Send, Sparkles, Trash2, User, X } from "lucide-react";

const ChatSkeleton = memo(function ChatSkeleton() {
  return (
    <div className="flex h-full w-full flex-col bg-[#181818] select-none text-[#cccccc] font-sans overflow-hidden">
      {/* 1. VS Code Secondary Sidebar Header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-[#007acc]" />
          <span className="text-[11px] font-semibold text-[#cccccc] uppercase tracking-wider">
            Chat
          </span>
          <span className="rounded bg-[#1e1e1e] border border-[#2d2d30] px-1.5 py-0.5 font-mono text-[9px] text-[#858585]">
            Copilot
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-50">
          <div className="size-5 rounded-xs bg-[#2d2d30]" />
          <div className="size-5 rounded-xs bg-[#2d2d30]" />
          <div className="h-3 w-px bg-[#2d2d30] mx-0.5" />
          <div className="size-5 rounded-xs bg-[#2d2d30]" />
        </div>
      </div>

      {/* 2. Messages Stream Skeleton */}
      <div className="min-h-0 flex-1 overflow-hidden p-3 space-y-4">
        {/* User Prompt Message Bubble */}
        <div className="flex items-start gap-2.5 justify-end">
          <div className="max-w-[85%] rounded-md bg-[#252526] border border-[#333333] p-2.5 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[10px] text-[#858585] mb-1">
              <User className="size-2.5" />
              <span>You</span>
            </div>
            <div className="h-3 w-36 rounded-xs bg-[#3a3d3e] animate-pulse" />
            <div className="h-3 w-24 rounded-xs bg-[#3a3d3e] animate-pulse" />
          </div>
        </div>

        {/* AI Assistant Response Bubble */}
        <div className="flex items-start gap-2.5">
          <div className="size-6 rounded-full bg-[#007acc]/20 border border-[#007acc]/40 flex items-center justify-center shrink-0 mt-0.5">
            <Bot className="size-3.5 text-[#007acc]" />
          </div>

          <div className="flex-1 space-y-2.5">
            <div className="space-y-1.5">
              <div className="h-3 w-full max-w-xs rounded-xs bg-[#2d2d30] animate-pulse" />
              <div className="h-3 w-4/5 rounded-xs bg-[#2d2d30] animate-pulse" />
              <div className="h-3 w-2/3 rounded-xs bg-[#2d2d30] animate-pulse" />
            </div>

            {/* Code Block Snippet Placeholder */}
            <div className="rounded border border-[#2d2d30] bg-[#1e1e1e] overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-2.5 py-1 text-[10px] text-[#858585]">
                <span className="font-mono text-[9px] text-[#9cdcfe]">typescript</span>
                <span className="text-[9px]">copy</span>
              </div>
              <div className="p-2.5 space-y-1.5 font-mono">
                <div className="h-2.5 w-40 rounded-xs bg-[#4ec9b0]/25 animate-pulse" />
                <div className="h-2.5 w-52 rounded-xs bg-[#ce9178]/25 animate-pulse" />
                <div className="h-2.5 w-28 rounded-xs bg-[#9cdcfe]/25 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Input Box Skeleton */}
      <div className="shrink-0 border-t border-[#2d2d30] bg-[#181818] p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[#858585]">
          <span className="h-2.5 w-20 rounded-xs bg-[#2a2a2d] animate-pulse" />
          <span className="h-2.5 w-14 rounded-xs bg-[#2a2a2d] animate-pulse" />
        </div>

        <div className="relative rounded-md border border-[#3c3c3c] bg-[#222225] p-2.5">
          <div className="h-10 w-full space-y-1.5">
            <div className="h-2.5 w-44 rounded-xs bg-[#2d2d30] animate-pulse" />
            <div className="h-2.5 w-32 rounded-xs bg-[#2d2d30] animate-pulse" />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#2d2d30] text-[#858585]">
            <div className="h-4 w-16 rounded-xs bg-[#2d2d30]" />
            <div className="size-6 rounded-sm bg-[#007acc]/40 flex items-center justify-center text-white">
              <Send className="size-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatSkeleton;
