"use client";

import { memo } from "react";
import { ChevronDown, ChevronRight, FilePlus, FolderPlus, RotateCw } from "lucide-react";

const FileExploreSkeleton = memo(function FileExploreSkeleton() {
  return (
    <div className="flex h-full w-full flex-col bg-[#1e1e1e] select-none text-[#cccccc] font-sans">
      {/* 1. Explorer Header */}
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-[#2d2d30] px-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9d9d9d]">
          Explorer
        </span>

        <div className="flex items-center gap-1 opacity-50">
          <div className="size-4 rounded-xs bg-[#333333] animate-pulse" />
          <div className="size-4 rounded-xs bg-[#333333] animate-pulse" />
          <div className="size-4 rounded-xs bg-[#333333] animate-pulse" />
        </div>
      </div>

      {/* 2. File Tree Structure */}
      <div className="flex-1 p-2 space-y-1.5 overflow-hidden text-xs">
        {/* Project Root Folder */}
        <div className="flex items-center gap-1.5 py-1 px-1 rounded-sm bg-[#2a2d2e]/40">
          <ChevronDown className="size-3.5 text-[#858585] shrink-0" />
          <div className="size-3.5 rounded-xs bg-[#007acc]/40 animate-pulse shrink-0" />
          <div className="h-3 w-28 rounded-xs bg-[#3a3d3e] animate-pulse" />
        </div>

        {/* Tree Branch: src folder */}
        <div className="pl-3 space-y-1.5 border-l border-[#2d2d30] ml-2">
          {/* src folder */}
          <div className="flex items-center gap-1.5 py-0.5">
            <ChevronDown className="size-3 text-[#757575] shrink-0" />
            <div className="size-3.5 rounded-xs bg-amber-500/25 animate-pulse shrink-0" />
            <div className="h-3 w-14 rounded-xs bg-[#3a3d3e] animate-pulse" />
          </div>

          {/* src files */}
          <div className="pl-3.5 space-y-1.5 border-l border-[#2d2d30]/70 ml-1.5">
            <div className="flex items-center gap-2 py-0.5">
              <div className="size-3 rounded-xs bg-blue-400/30 animate-pulse shrink-0" />
              <div className="h-2.5 w-24 rounded-xs bg-[#333336] animate-pulse" />
            </div>

            <div className="flex items-center gap-2 py-0.5">
              <div className="size-3 rounded-xs bg-cyan-400/30 animate-pulse shrink-0" />
              <div className="h-2.5 w-20 rounded-xs bg-[#333336] animate-pulse" />
            </div>

            <div className="flex items-center gap-2 py-0.5">
              <div className="size-3 rounded-xs bg-pink-400/30 animate-pulse shrink-0" />
              <div className="h-2.5 w-28 rounded-xs bg-[#333336] animate-pulse" />
            </div>
          </div>

          {/* components folder */}
          <div className="flex items-center gap-1.5 py-0.5 pt-1">
            <ChevronRight className="size-3 text-[#757575] shrink-0" />
            <div className="size-3.5 rounded-xs bg-amber-500/25 animate-pulse shrink-0" />
            <div className="h-3 w-24 rounded-xs bg-[#3a3d3e] animate-pulse" />
          </div>

          {/* public folder */}
          <div className="flex items-center gap-1.5 py-0.5">
            <ChevronRight className="size-3 text-[#757575] shrink-0" />
            <div className="size-3.5 rounded-xs bg-amber-500/25 animate-pulse shrink-0" />
            <div className="h-3 w-16 rounded-xs bg-[#3a3d3e] animate-pulse" />
          </div>
        </div>

        {/* Root level files */}
        <div className="pl-4 space-y-1.5 pt-1">
          <div className="flex items-center gap-2 py-0.5">
            <div className="size-3 rounded-xs bg-yellow-400/30 animate-pulse shrink-0" />
            <div className="h-2.5 w-24 rounded-xs bg-[#333336] animate-pulse" />
          </div>

          <div className="flex items-center gap-2 py-0.5">
            <div className="size-3 rounded-xs bg-blue-500/30 animate-pulse shrink-0" />
            <div className="h-2.5 w-28 rounded-xs bg-[#333336] animate-pulse" />
          </div>

          <div className="flex items-center gap-2 py-0.5">
            <div className="size-3 rounded-xs bg-emerald-400/30 animate-pulse shrink-0" />
            <div className="h-2.5 w-20 rounded-xs bg-[#333336] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default FileExploreSkeleton;
