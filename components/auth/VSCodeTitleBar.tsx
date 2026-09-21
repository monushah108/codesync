"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Code2, Moon, PanelLeft, Sun } from "lucide-react";

interface VSCodeTitleBarProps {
  activeFile: "login.tsx" | "signup.tsx";
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function VSCodeTitleBar({
  activeFile,
  isSidebarOpen,
  onToggleSidebar,
}: VSCodeTitleBarProps) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="flex h-10 shrink-0 select-none items-center justify-between border-b border-[#2d2d30] bg-[#1f1f1f] px-3 text-xs text-[#cccccc]">
      {/* ── Left: Brand & Explorer Toggle ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* CodeSync Logo */}
        <Link
          href="/"
          title="Return to Home"
          className="flex items-center gap-2 rounded px-1.5 py-1 text-xs font-semibold text-white hover:bg-[#2d2d2d] transition-colors"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[#007acc] text-white">
            <Code2 className="size-3.5" />
          </div>
          <span className="font-bold tracking-tight text-white">
            Code<span className="text-[#007acc]">Sync</span>
          </span>
        </Link>

        {/* Explorer Toggle Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "Close Explorer" : "Open Explorer"}
          className={`flex items-center gap-1.5 h-7 px-2.5 rounded text-xs transition-colors border ${
            isSidebarOpen
              ? "bg-[#2a2d2e] border-[#007acc]/50 text-white font-medium shadow-xs"
              : "border-transparent text-[#858585] hover:bg-[#2a2d2e] hover:text-[#cccccc]"
          }`}
        >
          <PanelLeft className="size-3.5 text-[#007acc]" />
          <span className="text-[11px] font-medium">Explorer</span>
        </button>
      </div>

      {/* ── Center: Clean Context Tag ── */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-[#252526] border border-[#333333] text-[11px] text-[#9d9d9d] font-mono">
        <span className="text-[#3794ff] font-bold text-[9px]">TSX</span>
        <span>src/auth/{activeFile}</span>
      </div>

      {/* ── Right: Theme Toggle & Home ── */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleTheme}
          title={darkMode ? "Switch to Light theme" : "Switch to Dark theme"}
          className="h-7 w-7 flex items-center justify-center rounded text-[#858585] hover:bg-[#2d2d2d] hover:text-[#cccccc] transition-colors"
        >
          {darkMode ? (
            <Sun className="size-3.5 text-amber-400" />
          ) : (
            <Moon className="size-3.5 text-[#007acc]" />
          )}
        </button>

        <Link
          href="/"
          title="Back to Landing Page"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium text-[#858585] hover:text-white hover:bg-[#2d2d2d] transition-colors"
        >
          <ArrowLeft className="size-3" />
          <span className="hidden xs:inline">Home</span>
        </Link>
      </div>
    </header>
  );
}
