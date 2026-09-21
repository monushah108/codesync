"use client";

import { useEffect } from "react";
import { getTimeOfDay } from "@/lib/features";
import { useAuth } from "@/lib/hooks/useAuth";
import { Code2, Plus, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Profile from "../home/ui/profile";


export default function Hero() {
  const { user } = useAuth();

  useEffect(() => {
    // Keep dashboard in dark mode
    document.documentElement.classList.add("dark");
  }, []);

  const firstName = user?.name ? user.name.split(" ")[0] : "Developer";

  return (
    <section className="space-y-6">
      {/* Integrated Minimal Top Bar (Replaces clunky separate header) */}
      <div className="flex items-center justify-between pb-1">
        {/* Brand & Home */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#007acc] text-white">
              <Code2 className="h-4 w-4" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#1e1e1e] dark:text-[#ffffff]">
                Code<span className="text-[#007acc]">Sync</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#007acc]/10 text-[#007acc] border border-[#007acc]/20">
                Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Top Controls: Home link & ProfileView */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#616161] dark:text-[#cccccc] hover:text-[#1e1e1e] dark:hover:text-[#ffffff] hover:bg-[#e5e5e5] dark:hover:bg-[#2d2d2d] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Profile />
        </div>
      </div>

      {/* Greeting & Quick Action Banner - Classic Solid VS Code Surface */}
      <div className="rounded-xl border border-[#cecece] dark:border-[#333333] bg-[#ffffff] dark:bg-[#252526] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-colors">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-[#89d185] border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Active CRDT Mesh • Sub-15ms Sync</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1e1e1e] dark:text-[#ffffff]">
            {getTimeOfDay()},{" "}
            <span className="text-[#007acc] dark:text-[#3794ff]">
              {firstName}
            </span>
            .
          </h1>

          <p className="text-xs sm:text-sm text-[#616161] dark:text-[#969696] leading-relaxed">
            Pick up where you left off or launch a new real-time collaboration workspace with your peers and AI co-pilot.
          </p>
        </div>

        {/* Quick Launch Button - Classic VS Code Blue Solid */}
        <div className="shrink-0 flex items-center gap-3">
          <Link href="/playground">
            <Button className="h-10 px-5 rounded-md font-medium text-white bg-[#007acc] hover:bg-[#0062a3] dark:hover:bg-[#0e639c] transition-colors gap-2 text-xs sm:text-sm shadow-none">
              <Plus className="w-4 h-4" />
              <span>Create New Room</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
