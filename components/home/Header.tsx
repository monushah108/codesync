"use client";

import { Code2, Moon, Sun, Menu, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { NavItems } from "../constant/main-constant.js";
import Profile from "./ui/profile";
import Link from "next/link";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Initialize theme from system or classList
  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-[#ffffff] dark:bg-[#1f1f1f] border-b border-[#cecece] dark:border-[#333333] ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-7.5 h-7.5 rounded-md bg-[#007acc] text-white">
            <Code2 className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg tracking-tight text-[#1e1e1e] dark:text-[#ffffff]">
              Code<span className="text-[#007acc]">Sync</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#007acc]/10 text-[#007acc] border border-[#007acc]/20">
              v2.0
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f0f0f0] dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] px-2 py-1 rounded-md">
          {NavItems.map((item, index) => {
            const anchor = `#${item.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <a
                key={index}
                href={anchor}
                className="px-2.5 py-1 text-xs font-medium text-[#616161] dark:text-[#cccccc] hover:text-[#1e1e1e] dark:hover:text-[#ffffff] rounded hover:bg-[#e5e5e5] dark:hover:bg-[#2d2d2d] transition-colors"
              >
                {item}
              </a>
            );
          })}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-2 rounded-md text-[#616161] dark:text-[#cccccc] hover:text-[#1e1e1e] dark:hover:text-[#ffffff] hover:bg-[#e5e5e5] dark:hover:bg-[#2d2d2d] border border-[#cecece] dark:border-[#3c3c3c] bg-[#ffffff] dark:bg-[#252526] transition-colors"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#007acc]" />
            )}
          </button>

          <Profile />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-md text-[#616161] dark:text-[#cccccc] hover:bg-[#e5e5e5] dark:hover:bg-[#2d2d2d] border border-[#cecece] dark:border-[#3c3c3c]"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#007acc]" />
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className="p-1.5 rounded-md text-[#616161] dark:text-[#cccccc] hover:bg-[#e5e5e5] dark:hover:bg-[#2d2d2d] border border-[#cecece] dark:border-[#3c3c3c] transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#ffffff] dark:bg-[#1f1f1f] border-b border-[#cecece] dark:border-[#333333] px-5 py-4 space-y-3">
          <nav className="flex flex-col space-y-1">
            {NavItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-3 py-1.5 text-xs font-medium text-[#616161] dark:text-[#cccccc] hover:bg-[#f0f0f0] dark:hover:bg-[#252526] rounded-md transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#cecece] dark:border-[#333333] flex flex-col gap-2">
            <Profile />
          </div>
        </div>
      )}
    </header>
  );
}
