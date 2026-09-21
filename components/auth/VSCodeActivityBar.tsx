"use client";

import {
  Boxes,
  Bug,
  Files,
  GitBranch,
  Search,
  Settings,
  User,
} from "lucide-react";

interface VSCodeActivityBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function VSCodeActivityBar({
  isSidebarOpen,
  onToggleSidebar,
}: VSCodeActivityBarProps) {
  return (
    <aside className="hidden sm:flex w-12 shrink-0 select-none flex-col justify-between border-r border-[#2d2d30] bg-[#181818] py-2 text-[#858585]">
      {/* ── Top Activity Icons ── */}
      <div className="flex flex-col items-center gap-1">
        {/* Explorer (Active) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          title="Explorer (Ctrl+Shift+E)"
          className={`group relative flex h-10 w-full items-center justify-center transition-colors ${
            isSidebarOpen
              ? "text-white"
              : "text-[#858585] hover:text-[#cccccc]"
          }`}
        >
          {isSidebarOpen && (
            <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#007acc]" />
          )}
          <Files className="size-5 transition-transform group-hover:scale-105" />
        </button>

        {/* Search */}
        <button
          type="button"
          title="Search (Ctrl+Shift+F)"
          className="flex h-10 w-full items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <Search className="size-5" />
        </button>

        {/* Source Control */}
        <button
          type="button"
          title="Source Control (Ctrl+Shift+G)"
          className="relative flex h-10 w-full items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <GitBranch className="size-5" />
          <span className="absolute top-2 right-2.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#007acc] px-1 text-[8px] font-bold text-white">
            1
          </span>
        </button>

        {/* Run & Debug */}
        <button
          type="button"
          title="Run and Debug (Ctrl+Shift+D)"
          className="flex h-10 w-full items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <Bug className="size-5" />
        </button>

        {/* Extensions */}
        <button
          type="button"
          title="Extensions (Ctrl+Shift+X)"
          className="flex h-10 w-full items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <Boxes className="size-5" />
        </button>
      </div>

      {/* ── Bottom Utility Icons ── */}
      <div className="flex flex-col items-center gap-1">
        {/* Accounts Profile */}
        <button
          type="button"
          title="Accounts"
          className="flex h-10 w-full items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <User className="size-5" />
        </button>

        {/* Settings */}
        <button
          type="button"
          title="Manage & Settings"
          className="flex h-10 w-full items-center justify-center text-[#858585] hover:text-[#cccccc] transition-colors"
        >
          <Settings className="size-5" />
        </button>
      </div>
    </aside>
  );
}
