"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  Minus,
  Moon,
  PanelLeft,
  Search,
  Square,
  Sun,
  X,
} from "lucide-react";

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
    <header className="flex h-9 shrink-0 select-none items-center justify-between border-b border-[#2d2d30] bg-[#1f1f1f] px-2.5 text-xs text-[#cccccc] transition-colors">
      {/* ── Left: Window Controls & VS Code Menu ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* macOS Style Traffic Light Dots */}
        <div className="hidden sm:flex items-center gap-1.5 pr-1">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer" />
        </div>

        {/* CodeSync Brand Logo */}
        <Link
          href="/"
          title="Return to Home"
          className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs font-semibold text-white hover:bg-[#2d2d2d] transition-colors"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[#007acc] text-white">
            <Code2 className="size-3.5" />
          </div>
          <span className="font-bold tracking-tight hidden md:inline">
            Code<span className="text-[#007acc]">Sync</span>
          </span>
        </Link>

        {/* Top App Menu Items */}
        <nav className="hidden lg:flex items-center gap-0.5 text-[11px] text-[#9d9d9d]">
          <span className="px-2 py-0.5 rounded hover:bg-[#2d2d2d] hover:text-[#cccccc] cursor-pointer transition-colors">
            File
          </span>
          <span className="px-2 py-0.5 rounded hover:bg-[#2d2d2d] hover:text-[#cccccc] cursor-pointer transition-colors">
            Edit
          </span>
          <span className="px-2 py-0.5 rounded hover:bg-[#2d2d2d] hover:text-[#cccccc] cursor-pointer transition-colors">
            Selection
          </span>
          <span className="px-2 py-0.5 rounded hover:bg-[#2d2d2d] hover:text-[#cccccc] cursor-pointer transition-colors">
            View
          </span>
          <span className="px-2 py-0.5 rounded hover:bg-[#2d2d2d] hover:text-[#cccccc] cursor-pointer transition-colors">
            Terminal
          </span>
          <span className="px-2 py-0.5 rounded hover:bg-[#2d2d2d] hover:text-[#cccccc] cursor-pointer transition-colors">
            Help
          </span>
        </nav>
      </div>

      {/* ── Center: Signature VS Code Command Center Pill ── */}
      <div className="flex items-center justify-center flex-1 max-w-md mx-2">
        <div className="w-full flex items-center justify-between h-6 px-2.5 rounded bg-[#252526] hover:bg-[#2a2d2e] border border-[#3c3c3c] text-[11px] text-[#858585] hover:text-[#cccccc] transition-colors cursor-pointer select-none">
          <div className="flex items-center gap-1.5 truncate">
            <Search className="w-3 h-3 text-[#858585] shrink-0" />
            <span className="truncate">
              CodeSync: Authenticate (src/auth/{activeFile})
            </span>
          </div>
          <kbd className="hidden sm:inline px-1.5 py-0.2 rounded bg-[#313131] border border-[#3c3c3c] text-[9px] font-mono text-[#969696]">
            Ctrl+P
          </kbd>
        </div>
      </div>

      {/* ── Right: Sidebar Toggle, Theme & Navigation ── */}
      <div className="flex items-center gap-1">
        {/* Toggle Explorer Sidebar */}
        <button
          type="button"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "Hide Explorer Side Bar" : "Show Explorer Side Bar"}
          className={`h-7 w-7 flex items-center justify-center rounded transition-colors ${
            isSidebarOpen
              ? "bg-[#2d2d2d] text-[#007acc]"
              : "text-[#858585] hover:bg-[#2d2d2d] hover:text-[#cccccc]"
          }`}
        >
          <PanelLeft className="size-3.5" />
        </button>

        {/* Dark/Light Theme Toggle */}
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

        {/* Back to Home Link */}
        <Link
          href="/"
          title="Back to Landing Page"
          className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-[#858585] hover:text-white hover:bg-[#2d2d2d] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Home</span>
        </Link>

        {/* Window action controls (Windows style) */}
        <div className="hidden sm:flex items-center gap-0.5 ml-1 border-l border-[#2d2d30] pl-1.5 text-[#858585]">
          <span className="p-1 hover:bg-[#2d2d2d] hover:text-white rounded cursor-pointer">
            <Minus className="size-3" />
          </span>
          <span className="p-1 hover:bg-[#2d2d2d] hover:text-white rounded cursor-pointer">
            <Square className="size-2.5" />
          </span>
          <Link
            href="/"
            title="Close"
            className="p-1 hover:bg-[#c42b1c] hover:text-white rounded transition-colors"
          >
            <X className="size-3" />
          </Link>
        </div>
      </div>
    </header>
  );
}
