"use client";

import { memo } from "react";
import { Code2, Play, Eye, MoreHorizontal, FileCode2 } from "lucide-react";

const EditorSkeleton = memo(function EditorSkeleton() {
  return (
    <div className="flex h-full w-full flex-col bg-[#1e1e1e] select-none overflow-hidden font-sans">
      {/* 1. VS Code Tab Bar Skeleton */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-1 text-xs">
        {/* Left Tabs */}
        <div className="flex items-center h-full min-w-0">
          {/* Active Tab Placeholder */}
          <div className="relative flex h-full items-center gap-2 border-r border-[#1e1e1e] bg-[#1e1e1e] px-3 text-[#cccccc] shadow-xs">
            <span className="absolute top-0 inset-x-0 h-[2px] bg-[#007acc] animate-pulse" />
            <div className="size-3.5 rounded-sm bg-[#007acc]/30 animate-pulse flex items-center justify-center">
              <FileCode2 className="size-2.5 text-[#007acc]" />
            </div>
            <div className="h-3 w-20 rounded-xs bg-[#3a3d3e] animate-pulse" />
            <div className="ml-1 size-3.5 rounded-xs bg-[#2d2d2d]" />
          </div>

          {/* Inactive Tab 1 */}
          <div className="hidden sm:flex h-full items-center gap-2 border-r border-[#1e1e1e] bg-[#2d2d2d]/60 px-3 opacity-60">
            <div className="size-3 rounded-xs bg-[#4ec9b0]/20" />
            <div className="h-2.5 w-16 rounded-xs bg-[#3a3d3e]" />
          </div>

          {/* Inactive Tab 2 */}
          <div className="hidden md:flex h-full items-center gap-2 border-r border-[#1e1e1e] bg-[#2d2d2d]/40 px-3 opacity-40">
            <div className="size-3 rounded-xs bg-[#ce9178]/20" />
            <div className="h-2.5 w-24 rounded-xs bg-[#3a3d3e]" />
          </div>
        </div>

        {/* Right Tab Bar Actions */}
        <div className="flex items-center gap-1 text-[#858585] px-2 opacity-50">
          <div className="size-5 rounded-xs bg-[#2d2d2d]" />
          <div className="size-5 rounded-xs bg-[#2d2d2d]" />
          <div className="size-5 rounded-xs bg-[#2d2d2d]" />
        </div>
      </div>

      {/* 2. Breadcrumbs Bar Skeleton */}
      <div className="flex h-6 shrink-0 items-center gap-1.5 border-b border-[#252526] bg-[#1e1e1e] px-4 text-[11px] text-[#5a5a5a]">
        <div className="h-2.5 w-12 rounded-xs bg-[#2a2a2d] animate-pulse" />
        <span>›</span>
        <div className="h-2.5 w-20 rounded-xs bg-[#2a2a2d] animate-pulse" />
        <span>›</span>
        <div className="h-2.5 w-16 rounded-xs bg-[#333336] animate-pulse" />
      </div>

      {/* 3. Main Editor Body: Line Numbers + Shimmering Code Lines + Minimap */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Line Numbers Gutter */}
        <div className="flex w-12 shrink-0 flex-col items-end gap-1.5 border-r border-[#252526] bg-[#1e1e1e] py-3 pr-3 font-mono text-[11px] text-[#4a4a4d] select-none">
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} className="leading-5">
              {i + 1}
            </span>
          ))}
        </div>

        {/* Code Lines Shimmer Area */}
        <div className="flex-1 min-w-0 p-3 space-y-2 font-mono overflow-hidden">
          {/* Import statements */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-16 rounded-xs bg-[#c586c0]/25 animate-pulse" />
            <div className="h-3 w-48 rounded-xs bg-[#9cdcfe]/20 animate-pulse" />
            <div className="h-3 w-12 rounded-xs bg-[#c586c0]/25 animate-pulse" />
            <div className="h-3 w-32 rounded-xs bg-[#ce9178]/25 animate-pulse" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-16 rounded-xs bg-[#c586c0]/25 animate-pulse" />
            <div className="h-3 w-36 rounded-xs bg-[#4ec9b0]/20 animate-pulse" />
            <div className="h-3 w-12 rounded-xs bg-[#c586c0]/25 animate-pulse" />
            <div className="h-3 w-40 rounded-xs bg-[#ce9178]/25 animate-pulse" />
          </div>

          {/* Blank line */}
          <div className="h-2" />

          {/* Comment */}
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-64 rounded-xs bg-[#6a9955]/30 animate-pulse" />
          </div>

          {/* Function declaration */}
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-24 rounded-xs bg-[#569cd6]/30 animate-pulse" />
            <div className="h-3.5 w-32 rounded-xs bg-[#dcdcaa]/30 animate-pulse" />
            <div className="h-3.5 w-20 rounded-xs bg-[#9cdcfe]/20 animate-pulse" />
          </div>

          {/* State hook */}
          <div className="flex items-center gap-2 pl-6">
            <div className="h-3 w-12 rounded-xs bg-[#569cd6]/25 animate-pulse" />
            <div className="h-3 w-44 rounded-xs bg-[#9cdcfe]/20 animate-pulse" />
            <div className="h-3 w-28 rounded-xs bg-[#dcdcaa]/25 animate-pulse" />
          </div>

          <div className="flex items-center gap-2 pl-6">
            <div className="h-3 w-12 rounded-xs bg-[#569cd6]/25 animate-pulse" />
            <div className="h-3 w-36 rounded-xs bg-[#9cdcfe]/20 animate-pulse" />
            <div className="h-3 w-24 rounded-xs bg-[#dcdcaa]/25 animate-pulse" />
          </div>

          {/* Blank line */}
          <div className="h-2" />

          {/* Hook call */}
          <div className="flex items-center gap-2 pl-6">
            <div className="h-3 w-20 rounded-xs bg-[#dcdcaa]/30 animate-pulse" />
            <div className="h-3 w-10 rounded-xs bg-[#569cd6]/20 animate-pulse" />
          </div>

          {/* Async function */}
          <div className="flex items-center gap-2 pl-12">
            <div className="h-3 w-14 rounded-xs bg-[#569cd6]/25 animate-pulse" />
            <div className="h-3 w-28 rounded-xs bg-[#dcdcaa]/25 animate-pulse" />
            <div className="h-3 w-16 rounded-xs bg-[#569cd6]/20 animate-pulse" />
          </div>

          <div className="flex items-center gap-2 pl-16">
            <div className="h-3 w-12 rounded-xs bg-[#569cd6]/20 animate-pulse" />
            <div className="h-3 w-24 rounded-xs bg-[#9cdcfe]/20 animate-pulse" />
            <div className="h-3 w-48 rounded-xs bg-[#ce9178]/25 animate-pulse" />
          </div>

          <div className="flex items-center gap-2 pl-12">
            <div className="h-3 w-4 rounded-xs bg-[#d4d4d4]/20" />
          </div>

          {/* Blank line */}
          <div className="h-2" />

          {/* Return statement */}
          <div className="flex items-center gap-2 pl-6">
            <div className="h-3 w-16 rounded-xs bg-[#c586c0]/30 animate-pulse" />
            <div className="h-3 w-6 rounded-xs bg-[#d4d4d4]/20" />
          </div>

          {/* JSX Tag */}
          <div className="flex items-center gap-2 pl-12">
            <div className="h-3.5 w-16 rounded-xs bg-[#4ec9b0]/30 animate-pulse" />
            <div className="h-3 w-20 rounded-xs bg-[#9cdcfe]/20 animate-pulse" />
            <div className="h-3 w-32 rounded-xs bg-[#ce9178]/25 animate-pulse" />
          </div>

          <div className="flex items-center gap-2 pl-16">
            <div className="h-3.5 w-24 rounded-xs bg-[#4ec9b0]/30 animate-pulse" />
            <div className="h-3 w-16 rounded-xs bg-[#9cdcfe]/20 animate-pulse" />
            <div className="h-3 w-20 rounded-xs bg-[#ce9178]/25 animate-pulse" />
          </div>

          <div className="flex items-center gap-2 pl-12">
            <div className="h-3.5 w-14 rounded-xs bg-[#4ec9b0]/30 animate-pulse" />
          </div>

          <div className="flex items-center gap-2 pl-6">
            <div className="h-3 w-4 rounded-xs bg-[#d4d4d4]/20" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-4 rounded-xs bg-[#d4d4d4]/20" />
          </div>
        </div>

        {/* Right VS Code Minimap Skeleton */}
        <div className="hidden lg:flex w-16 shrink-0 flex-col gap-1 border-l border-[#252526] bg-[#1e1e1e] p-2 opacity-25 select-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-xs bg-[#5a5a5a]"
              style={{ width: `${Math.floor(20 + ((i * 37) % 65))}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default EditorSkeleton;
