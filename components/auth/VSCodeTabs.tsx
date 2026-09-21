"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface VSCodeTabsProps {
  activeFile: "login.tsx" | "signup.tsx";
}

export default function VSCodeTabs({ activeFile }: VSCodeTabsProps) {
  return (
    <div className="shrink-0 select-none bg-[#181818] border-b border-[#2d2d30]">
      {/* ── Top Tabs Strip ── */}
      <div className="flex h-9 items-center overflow-x-auto bg-[#181818] border-b border-[#252526]">
        <div className="flex h-full items-center">
          {/* Tab 1: login.tsx */}
          <Link
            href="/auth/login"
            className={`flex h-full items-center gap-2 border-r border-[#2d2d30] px-4 text-xs transition-colors whitespace-nowrap ${
              activeFile === "login.tsx"
                ? "bg-[#1e1e1e] text-white font-medium border-t-2 border-t-[#007acc]"
                : "bg-[#181818] text-[#858585] hover:bg-[#1f1f1f] hover:text-[#cccccc]"
            }`}
          >
            <span className="font-mono text-[10px] font-bold text-[#3794ff]">
              TSX
            </span>
            <span>login.tsx</span>
          </Link>

          {/* Tab 2: signup.tsx */}
          <Link
            href="/auth/signup"
            className={`flex h-full items-center gap-2 border-r border-[#2d2d30] px-4 text-xs transition-colors whitespace-nowrap ${
              activeFile === "signup.tsx"
                ? "bg-[#1e1e1e] text-white font-medium border-t-2 border-t-[#007acc]"
                : "bg-[#181818] text-[#858585] hover:bg-[#1f1f1f] hover:text-[#cccccc]"
            }`}
          >
            <span className="font-mono text-[10px] font-bold text-[#3794ff]">
              TSX
            </span>
            <span>signup.tsx</span>
          </Link>
        </div>
      </div>

      {/* ── Breadcrumb Navigation Strip ── */}
      <div className="flex h-6 items-center gap-1.5 bg-[#1e1e1e] px-3 sm:px-4 text-[11px] text-[#858585] font-mono overflow-x-auto whitespace-nowrap">
        <span>codesync</span>
        <ChevronRight className="size-3 text-[#555555] shrink-0" />
        <span>src</span>
        <ChevronRight className="size-3 text-[#555555] shrink-0" />
        <span>auth</span>
        <ChevronRight className="size-3 text-[#555555] shrink-0" />
        <span className="flex items-center gap-1 text-[#cccccc] font-medium">
          <span className="font-mono text-[9px] text-[#3794ff]">TSX</span>
          <span>{activeFile}</span>
        </span>
      </div>
    </div>
  );
}
