"use client";

import {
  AlertCircle,
  Bell,
  Check,
  CheckCircle2,
  GitBranch,
  Radio,
} from "lucide-react";

export default function VSCodeStatusBar() {
  return (
    <footer className="relative z-20 flex h-6 select-none items-center justify-between border-t border-[#1e1e1e] bg-[#007acc] px-2 text-[11px] text-white">
      {/* ── Left Side: Environment, Branch, Status ── */}
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Remote badge */}
        <div className="flex items-center gap-1 bg-[#005a9e] px-1.5 py-0.5 rounded text-[10px] font-mono">
          <span className="font-bold">&gt;&lt;</span>
          <span>CodeSync</span>
        </div>

        {/* Git branch */}
        <div className="flex items-center gap-1 opacity-90 hover:opacity-100 cursor-pointer">
          <GitBranch className="size-3" />
          <span className="font-mono">main*</span>
        </div>

        {/* Errors & Warnings */}
        <div className="flex items-center gap-2 opacity-90">
          <span className="flex items-center gap-0.5">
            <AlertCircle className="size-3" />
            <span>0</span>
          </span>
          <span className="flex items-center gap-0.5">
            <span className="text-[10px]">▲</span>
            <span>0</span>
          </span>
        </div>

        {/* Live sync ready */}
        <div className="hidden sm:flex items-center gap-1 opacity-90">
          <CheckCircle2 className="size-3" />
          <span>Ready</span>
        </div>
      </div>

      {/* ── Right Side: Cursor, Encoding, Language, Prettier ── */}
      <div className="flex items-center gap-3 text-[11px] opacity-90">
        <span className="hidden md:inline font-mono">Ln 14, Col 22</span>
        <span className="hidden md:inline font-mono">Spaces: 2</span>
        <span className="hidden sm:inline">UTF-8</span>
        <span className="hidden sm:inline">TypeScript JSX</span>
        <div className="flex items-center gap-1">
          <Check className="size-3" />
          <span className="hidden lg:inline">Prettier</span>
        </div>
        <button
          type="button"
          title="Notifications"
          className="p-0.5 hover:bg-white/20 rounded transition-colors"
        >
          <Bell className="size-3" />
        </button>
      </div>
    </footer>
  );
}
