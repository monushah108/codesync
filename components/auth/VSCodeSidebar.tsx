"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

interface VSCodeSidebarProps {
  activeFile: "login.tsx" | "signup.tsx";
}

export default function VSCodeSidebar({ activeFile }: VSCodeSidebarProps) {
  const [isAuthFolderOpen, setIsAuthFolderOpen] = useState(true);
  const [isOpenEditorsOpen, setIsOpenEditorsOpen] = useState(true);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);

  return (
    <aside className="w-56 lg:w-64 shrink-0 select-none flex-col border-r border-[#2d2d30] bg-[#181818] text-[#cccccc] font-sans text-xs hidden md:flex">
      {/* ── Explorer Header ── */}
      <div className="flex h-9 shrink-0 items-center justify-between px-4 border-b border-[#2d2d30] text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase">
        <span>Explorer</span>
        <button
          type="button"
          className="text-[#858585] hover:text-[#cccccc] p-0.5 rounded transition-colors"
          title="More Actions"
        >
          <MoreHorizontal className="size-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Section: OPEN EDITORS ── */}
        <div>
          <button
            type="button"
            onClick={() => setIsOpenEditorsOpen(!isOpenEditorsOpen)}
            className="flex w-full items-center gap-1 px-2 py-1 text-[11px] font-bold text-[#bbbbbb] hover:bg-[#2a2d2e] transition-colors"
          >
            {isOpenEditorsOpen ? (
              <ChevronDown className="size-3" />
            ) : (
              <ChevronRight className="size-3" />
            )}
            <span className="uppercase tracking-wider">Open Editors</span>
          </button>

          {isOpenEditorsOpen && (
            <div className="space-y-0.5 pb-1">
              <Link
                href="/auth/login"
                className={`flex items-center gap-1.5 px-6 py-1 text-xs transition-colors ${
                  activeFile === "login.tsx"
                    ? "bg-[#37373d] text-white font-medium"
                    : "text-[#9d9d9d] hover:bg-[#2a2d2e] hover:text-[#cccccc]"
                }`}
              >
                <span className="text-[#007acc] font-bold text-[10px]">TSX</span>
                <span>login.tsx</span>
                {activeFile === "login.tsx" && (
                  <span className="ml-auto size-1.5 rounded-full bg-[#007acc]" />
                )}
              </Link>

              <Link
                href="/auth/signup"
                className={`flex items-center gap-1.5 px-6 py-1 text-xs transition-colors ${
                  activeFile === "signup.tsx"
                    ? "bg-[#37373d] text-white font-medium"
                    : "text-[#9d9d9d] hover:bg-[#2a2d2e] hover:text-[#cccccc]"
                }`}
              >
                <span className="text-[#007acc] font-bold text-[10px]">TSX</span>
                <span>signup.tsx</span>
                {activeFile === "signup.tsx" && (
                  <span className="ml-auto size-1.5 rounded-full bg-[#007acc]" />
                )}
              </Link>
            </div>
          )}
        </div>

        {/* ── Section: CODESYNC WORKSPACE ── */}
        <div className="border-t border-[#2d2d30] pt-1">
          <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-[#bbbbbb] uppercase tracking-wider">
            <ChevronDown className="size-3" />
            <span>CodeSync: Auth</span>
          </div>

          {/* src folder */}
          <div className="pl-3 space-y-0.5">
            <button
              type="button"
              onClick={() => setIsAuthFolderOpen(!isAuthFolderOpen)}
              className="flex w-full items-center gap-1 px-2 py-1 text-xs text-[#cccccc] hover:bg-[#2a2d2e] transition-colors"
            >
              {isAuthFolderOpen ? (
                <FolderOpen className="size-3.5 text-[#dcb67a]" />
              ) : (
                <Folder className="size-3.5 text-[#dcb67a]" />
              )}
              <span className="font-medium">src / auth</span>
            </button>

            {/* Auth folder children */}
            {isAuthFolderOpen && (
              <div className="pl-4 space-y-0.5">
                {/* login.tsx */}
                <Link
                  href="/auth/login"
                  className={`flex items-center gap-2 px-2 py-1 rounded-sm text-xs transition-colors ${
                    activeFile === "login.tsx"
                      ? "bg-[#37373d] text-white font-medium"
                      : "text-[#cccccc] hover:bg-[#2a2d2e]"
                  }`}
                >
                  <span className="rounded bg-[#007acc]/20 px-1 py-0.2 font-mono text-[9px] font-bold text-[#3794ff]">
                    TSX
                  </span>
                  <span>login.tsx</span>
                </Link>

                {/* signup.tsx */}
                <Link
                  href="/auth/signup"
                  className={`flex items-center gap-2 px-2 py-1 rounded-sm text-xs transition-colors ${
                    activeFile === "signup.tsx"
                      ? "bg-[#37373d] text-white font-medium"
                      : "text-[#cccccc] hover:bg-[#2a2d2e]"
                  }`}
                >
                  <span className="rounded bg-[#007acc]/20 px-1 py-0.2 font-mono text-[9px] font-bold text-[#3794ff]">
                    TSX
                  </span>
                  <span>signup.tsx</span>
                </Link>

                {/* session.ts */}
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-[#858585]">
                  <span className="rounded bg-[#3178c6]/20 px-1 py-0.2 font-mono text-[9px] font-bold text-[#3178c6]">
                    TS
                  </span>
                  <span>session.config.ts</span>
                </div>

                {/* oauth-providers.json */}
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-[#858585]">
                  <FileJson className="size-3 text-[#cbcb41]" />
                  <span>oauth-providers.json</span>
                </div>
              </div>
            )}

            {/* README.md */}
            <div className="flex items-center gap-2 px-2 py-1 text-xs text-[#858585]">
              <FileText className="size-3 text-[#519aba]" />
              <span>README.md</span>
            </div>
          </div>
        </div>

        {/* ── Section: OUTLINE (VS Code Symbols) ── */}
        <div className="border-t border-[#2d2d30] mt-3 pt-1">
          <button
            type="button"
            onClick={() => setIsOutlineOpen(!isOutlineOpen)}
            className="flex w-full items-center gap-1 px-2 py-1 text-[11px] font-bold text-[#bbbbbb] hover:bg-[#2a2d2e] transition-colors"
          >
            {isOutlineOpen ? (
              <ChevronDown className="size-3" />
            ) : (
              <ChevronRight className="size-3" />
            )}
            <span className="uppercase tracking-wider">Outline</span>
          </button>

          {isOutlineOpen && (
            <div className="px-5 py-1 text-[11px] font-mono text-[#858585] space-y-1">
              <div className="flex items-center gap-1.5 text-[#4ec9b0]">
                <span>ƒ</span>
                <span className="text-[#cccccc]">
                  {activeFile === "login.tsx" ? "handleLogin" : "handleSignup"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#4ec9b0]">
                <span>ƒ</span>
                <span className="text-[#cccccc]">handleSocialLogin</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#9cdcfe]">
                <span>{}</span>
                <span className="text-[#cccccc]">credentials</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Copilot Status Widget ── */}
      <div className="p-3 border-t border-[#2d2d30] bg-[#1f1f1f]/80 space-y-1 text-[11px]">
        <div className="flex items-center gap-1.5 text-white font-medium">
          <Sparkles className="size-3 text-[#007acc]" />
          <span>CodeSync Copilot</span>
        </div>
        <p className="text-[10px] text-[#858585] leading-snug">
          Sign in to unlock AI pair programming and live CRDT sync.
        </p>
      </div>
    </aside>
  );
}
