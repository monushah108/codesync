"use client";

import { memo } from "react";
import { TerminalIcon, Trash, X } from "lucide-react";

const TerminalSkeleton = memo(function TerminalSkeleton() {
  return (
    <div className="relative flex h-full w-full flex-col bg-[#181818] font-mono text-xs select-none overflow-hidden">
      {/* 1. Terminal Panel Header Tabs */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-3">
        <div className="flex items-center gap-4 text-xs font-sans">
          {/* Active Terminal Tab */}
          <div className="relative flex items-center gap-1.5 text-white font-semibold text-[11px] uppercase tracking-wider">
            <TerminalIcon className="size-3 text-[#007acc]" />
            <span>Terminal</span>
            <span className="absolute -bottom-2.5 inset-x-0 h-0.5 bg-[#007acc] animate-pulse" />
          </div>

          {/* Inactive Tab hints */}
          <span className="text-[11px] font-medium text-[#6e6e6e] opacity-50 hidden sm:inline">
            Problems
          </span>
          <span className="text-[11px] font-medium text-[#6e6e6e] opacity-50 hidden sm:inline">
            Output
          </span>
        </div>

        {/* Right Tab Controls */}
        <div className="flex items-center gap-1 opacity-50">
          <div className="size-5 rounded-xs bg-[#2d2d2d] animate-pulse" />
          <div className="h-3 w-px bg-[#2d2d30] mx-0.5" />
          <div className="size-5 rounded-xs bg-[#2d2d2d] animate-pulse" />
        </div>
      </div>

      {/* 2. Terminal Info Sub-Banner */}
      <div className="flex items-center gap-2 border-b border-[#2d2d30] bg-[#1e1e1e] px-3 py-1.5 text-[11px] text-[#858585] font-sans">
        <span className="size-2 rounded-full bg-[#89d185] animate-pulse" />
        <span className="text-[10px] text-[#9d9d9d]">CodeSync (Node.js runtime environment)</span>
      </div>

      {/* 3. Terminal Prompt & Output Stream */}
      <div className="flex-1 p-3 space-y-2.5 font-mono text-[12px] overflow-hidden">
        {/* Previous Command Line */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-[#89d185]">user@codesync</span>
            <span className="text-[#858585]">:</span>
            <span className="text-[#4ec9b0]">~/workspace</span>
            <span className="text-[#cccccc]">$</span>
            <span className="text-[#ce9178] font-semibold">npm run dev</span>
          </div>

          {/* Command Output Shimmer */}
          <div className="pl-2 space-y-1 text-[#858585] text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-[#4ec9b0]">›</span>
              <div className="h-2.5 w-40 rounded-xs bg-[#2d2d30] animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#89d185]">✓</span>
              <div className="h-2.5 w-64 rounded-xs bg-[#2d2d30] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Active Prompt with Blinking Cursor */}
        <div className="flex items-center gap-1.5 text-[11px] pt-1">
          <span className="text-[#89d185]">user@codesync</span>
          <span className="text-[#858585]">:</span>
          <span className="text-[#4ec9b0]">~/workspace</span>
          <span className="text-[#cccccc]">$</span>
          <span className="inline-block h-3.5 w-2 bg-[#007acc] animate-[pulse_1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
});

export default TerminalSkeleton;
