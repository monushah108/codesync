"use client";

import { useEffect, useState } from "react";
import { Code2, Moon, Sun } from "lucide-react";
import Link from "next/link";

export default function AuthHeaderActions() {
  const [darkMode, setDarkMode] = useState(false);

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
    <div className="flex items-center gap-3">
      {/* Theme Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="p-2 rounded-md text-[#616161] dark:text-[#cccccc] hover:text-[#1e1e1e] dark:hover:text-[#ffffff] hover:bg-[#e5e5e5] dark:hover:bg-[#2d2d2d] border border-[#cecece] dark:border-[#3c3c3c] bg-[#ffffff] dark:bg-[#252526] transition-colors"
      >
        {darkMode ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-[#007acc]" />
        )}
      </button>

      {/* Brand Icon Link */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-md bg-[#007acc] flex items-center justify-center text-white transition-transform">
          <Code2 className="w-4 h-4" />
        </div>
        <span className="font-bold text-sm tracking-tight text-[#1e1e1e] dark:text-[#ffffff] hidden sm:inline">
          Code<span className="text-[#007acc]">Sync</span>
        </span>
      </Link>
    </div>
  );
}
