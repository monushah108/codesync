"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  X,
} from "lucide-react";
import { useState } from "react";

interface VSCodeSidebarProps {
  activeFile: "login.tsx" | "signup.tsx";
  isOpen: boolean;
  onClose?: () => void;
}

export default function VSCodeSidebar({
  activeFile,
  isOpen,
  onClose,
}: VSCodeSidebarProps) {
  const [isAuthFolderOpen, setIsAuthFolderOpen] = useState(true);
  const [isOpenEditorsOpen, setIsOpenEditorsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <>
      {/* ── Mobile Backdrop Overlay ── */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Explorer Sidebar / Mobile Drawer ── */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] bg-[#181818] border-r border-[#2d2d30] text-[#cccccc] font-sans text-xs select-none shadow-2xl flex flex-col md:static md:z-auto md:w-56 lg:w-60 md:shadow-none shrink-0 transition-all">
        {/* Header */}
        <div className="flex h-10 shrink-0 items-center justify-between px-3 border-b border-[#2d2d30] text-[11px] font-semibold tracking-wider text-[#bbbbbb] uppercase">
          <span>Explorer</span>
          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1 text-[#858585] hover:text-white rounded transition-colors"
            title="Close Explorer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {/* ── Section: OPEN EDITORS ── */}
          <div>
            <button
              type="button"
              onClick={() => setIsOpenEditorsOpen(!isOpenEditorsOpen)}
              className="flex w-full items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-[#bbbbbb] hover:bg-[#2a2d2e] transition-colors"
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
                  onClick={onClose}
                  className={`flex items-center gap-2 px-6 py-1.5 text-xs transition-colors ${
                    activeFile === "login.tsx"
                      ? "bg-[#37373d] text-white font-medium"
                      : "text-[#9d9d9d] hover:bg-[#2a2d2e] hover:text-[#cccccc]"
                  }`}
                >
                  <span className="text-[#007acc] font-bold text-[10px] font-mono">
                    TSX
                  </span>
                  <span>login.tsx</span>
                  {activeFile === "login.tsx" && (
                    <span className="ml-auto size-1.5 rounded-full bg-[#007acc]" />
                  )}
                </Link>

                <Link
                  href="/auth/signup"
                  onClick={onClose}
                  className={`flex items-center gap-2 px-6 py-1.5 text-xs transition-colors ${
                    activeFile === "signup.tsx"
                      ? "bg-[#37373d] text-white font-medium"
                      : "text-[#9d9d9d] hover:bg-[#2a2d2e] hover:text-[#cccccc]"
                  }`}
                >
                  <span className="text-[#007acc] font-bold text-[10px] font-mono">
                    TSX
                  </span>
                  <span>signup.tsx</span>
                  {activeFile === "signup.tsx" && (
                    <span className="ml-auto size-1.5 rounded-full bg-[#007acc]" />
                  )}
                </Link>
              </div>
            )}
          </div>

          {/* ── Section: WORKSPACE FILES ── */}
          <div className="border-t border-[#2d2d30] mt-1 pt-1">
            <div className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#bbbbbb] uppercase tracking-wider">
              <ChevronDown className="size-3" />
              <span>Workspace</span>
            </div>

            {/* src / auth folder */}
            <div className="pl-2 space-y-0.5">
              <button
                type="button"
                onClick={() => setIsAuthFolderOpen(!isAuthFolderOpen)}
                className="flex w-full items-center gap-1.5 px-2 py-1 text-xs text-[#cccccc] hover:bg-[#2a2d2e] transition-colors"
              >
                {isAuthFolderOpen ? (
                  <FolderOpen className="size-3.5 text-[#dcb67a]" />
                ) : (
                  <Folder className="size-3.5 text-[#dcb67a]" />
                )}
                <span className="font-medium">src / auth</span>
              </button>

              {/* Children */}
              {isAuthFolderOpen && (
                <div className="pl-4 space-y-0.5">
                  <Link
                    href="/auth/login"
                    onClick={onClose}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xs text-xs transition-colors ${
                      activeFile === "login.tsx"
                        ? "bg-[#37373d] text-white font-medium"
                        : "text-[#cccccc] hover:bg-[#2a2d2e]"
                    }`}
                  >
                    <span className="rounded bg-[#007acc]/20 px-1 py-0.5 font-mono text-[9px] font-bold text-[#3794ff]">
                      TSX
                    </span>
                    <span>login.tsx</span>
                  </Link>

                  <Link
                    href="/auth/signup"
                    onClick={onClose}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xs text-xs transition-colors ${
                      activeFile === "signup.tsx"
                        ? "bg-[#37373d] text-white font-medium"
                        : "text-[#cccccc] hover:bg-[#2a2d2e]"
                    }`}
                  >
                    <span className="rounded bg-[#007acc]/20 px-1 py-0.5 font-mono text-[9px] font-bold text-[#3794ff]">
                      TSX
                    </span>
                    <span>signup.tsx</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
