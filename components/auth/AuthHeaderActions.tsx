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
        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors"
      >
        {darkMode ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600" />
        )}
      </button>

      {/* Brand Icon Link */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-md shadow-indigo-500/25 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
          <Code2 className="w-4 h-4" />
        </div>
        <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white hidden sm:inline">
          Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Sync</span>
        </span>
      </Link>
    </div>
  );
}
