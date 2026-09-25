import FileExploreSkeleton from "@/components/editor/Skeleton/FileExploreSkeleton";
import EditorSkeleton from "@/components/editor/Skeleton/codeWindowSkeleton";
import { Code2, Loader2, Search } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-svh max-h-svh flex-col overflow-hidden bg-[#1e1e1e] text-[#cccccc] select-none font-sans">
      {/* 1. Header Bar Skeleton */}
      <header className="flex h-9 shrink-0 select-none items-center justify-between border-b border-[#2d2d30] bg-[#1f1f1f] px-2">
        {/* Left: Logo */}
        <div className="flex items-center gap-1.5 px-1 py-1">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[#007acc] text-white">
            <Code2 className="size-3.5" />
          </div>
          <span className="hidden md:inline tracking-tight font-bold text-xs text-white">
            Code<span className="text-[#007acc]">Sync</span>
          </span>
        </div>

        {/* Center: Command Center Skeleton */}
        <div className="flex items-center justify-between h-6 w-full max-w-[150px] sm:max-w-xs md:max-w-sm px-2.5 rounded bg-[#252526] border border-[#3c3c3c] text-[11px] text-[#858585]">
          <div className="flex items-center gap-1.5">
            <Search className="w-3 h-3 text-[#858585]" />
            <span className="text-[10px] sm:text-[11px]">Initializing workspace...</span>
          </div>
          <span className="size-2 rounded-full bg-[#007acc] animate-pulse" />
        </div>

        {/* Right: Layout buttons placeholder */}
        <div className="flex items-center gap-1 opacity-50">
          <div className="size-7 rounded bg-[#2d2d2d] animate-pulse" />
          <div className="size-7 rounded bg-[#2d2d2d] animate-pulse" />
          <div className="size-7 rounded bg-[#2d2d2d] animate-pulse" />
          <div className="size-7 rounded bg-[#2d2d2d] animate-pulse" />
        </div>
      </header>

      {/* 2. Workspace Body: Explorer + Editor Skeletons */}
      <div className="flex min-h-0 flex-1 w-full overflow-hidden">
        {/* Left: Explorer Pane */}
        <div className="hidden md:flex w-60 shrink-0 flex-col border-r border-[#2d2d30] bg-[#1e1e1e]">
          <FileExploreSkeleton />
        </div>

        {/* Center: Code Window Pane */}
        <div className="flex-1 min-h-0 min-w-0 flex flex-col bg-[#1e1e1e]">
          <EditorSkeleton />
        </div>
      </div>

      {/* 3. Bottom Status Bar Skeleton */}
      <footer className="flex h-6 shrink-0 items-center justify-between border-t border-[#2d2d30] bg-[#007acc] px-2.5 text-[11px] text-white">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <span>main</span>
          </span>
          <span className="flex items-center gap-1.5 opacity-90 text-[10px]">
            <Loader2 className="size-2.5 animate-spin" />
            <span>Connecting session...</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] opacity-90 font-mono">
          <span>UTF-8</span>
          <span>TypeScript</span>
        </div>
      </footer>
    </div>
  );
}
