"use client";

import Link from "next/link";
import { ChevronRight, Columns2, MoreHorizontal, X } from "lucide-react";

interface VSCodeTabsProps {
  activeFile: "login.tsx" | "signup.tsx";
}

export default function VSCodeTabs({ activeFile }: VSCodeTabsProps) {
  return (
    <div className="shrink-0 select-none bg-[#181818] border-b border-[#2d2d30]">
      {/* ── Top Tabs Strip ── */}
      <div className="flex h-9 items-center justify-between overflow-x-auto bg-[#181818]">
        <div className="flex h-full items-center">
          {/* Tab 1: login.tsx */}
          <Link
            href="/auth/login"
            className={`group relative flex h-full items-center gap-2 border-r border-[#2d2d30] px-3.5 text-xs transition-colors ${
              activeFile === "login.tsx"
                ? "bg-[#1e1e1e] text-white font-medium border-t-2 border-t-[#007acc]"
                : "bg-[#181818] text-[#858585] hover:bg-[#1f1f1f] hover:text-[#cccccc]"
            }`}
          >
            <span className="font-mono text-[10px] font-bold text-[#3794ff]">
              TSX
            </span>
            <span>login.tsx</span>
            {activeFile === "login.tsx" ? (
              <span className="p-0.5 rounded hover:bg-[#333333] transition-colors ml-1">
                <X className="size-3 text-[#858585] hover:text-white" />
              </span>
            ) : (
              <span className="size-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </Link>

          {/* Tab 2: signup.tsx */}
          <Link
            href="/auth/signup"
            className={`group relative flex h-full items-center gap-2 border-r border-[#2d2d30] px-3.5 text-xs transition-colors ${
              activeFile === "signup.tsx"
                ? "bg-[#1e1e1e] text-white font-medium border-t-2 border-t-[#007acc]"
                : "bg-[#181818] text-[#858585] hover:bg-[#1f1f1f] hover:text-[#cccccc]"
            }`}
          >
            <span className="font-mono text-[10px] font-bold text-[#3794ff]">
              TSX
            </span>
            <span>signup.tsx</span>
            {activeFile === "signup.tsx" ? (
              <span className="p-0.5 rounded hover:bg-[#333333] transition-colors ml-1">
                <X className="size-3 text-[#858585] hover:text-white" />
              </span>
            ) : (
              <span className="size-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </Link>
        </div>

        {/* Tab Right Controls */}
        <div className="flex items-center gap-1 pr-2 text-[#858585]">
          <button
            type="button"
            title="Split Editor Right"
            className="p-1 rounded hover:bg-[#2d2d2d] hover:text-[#cccccc] transition-colors"
          >
            <Columns2 className="size-3.5" />
          </button>
          <button
            type="button"
            title="More Actions"
            className="p-1 rounded hover:bg-[#2d2d2d] hover:text-[#cccccc] transition-colors"
          >
            <MoreHorizontal className="size-3.5" />
          </button>
        </div>
      </div>

      {/* ── Breadcrumb Navigation Strip ── */}
      <div className="flex h-6 items-center gap-1 bg-[#1e1e1e] px-4 text-[11px] text-[#858585] font-mono border-t border-[#252526]">
        <span className="hover:text-[#cccccc] cursor-pointer">codesync</span>
        <ChevronRight className="size-3 text-[#555555]" />
        <span className="hover:text-[#cccccc] cursor-pointer">src</span>
        <ChevronRight className="size-3 text-[#555555]" />
        <span className="hover:text-[#cccccc] cursor-pointer">auth</span>
        <ChevronRight className="size-3 text-[#555555]" />
        <span className="flex items-center gap-1 text-[#cccccc] font-medium">
          <span className="font-mono text-[9px] text-[#3794ff]">TSX</span>
          <span>{activeFile}</span>
        </span>
      </div>
    </div>
  );
}
