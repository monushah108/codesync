"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  ArrowRight,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Profile() {
  const { user, logout, isPending } = useAuth();
  const [open, setOpen] = useState(false);

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-20 rounded-full bg-slate-800/60 animate-pulse border border-slate-700/50" />
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="flex items-center gap-2.5">
        <Link href="/auth/login">
          <Button
            variant="ghost"
            className="h-9 px-4 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-all duration-200"
          >
            Sign in
          </Button>
        </Link>

        <Link href="/auth/signup">
          <Button
            className="group relative h-9 px-4 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] gap-1.5 overflow-hidden"
          >
            <Sparkles className="size-3 text-indigo-200 transition-transform group-hover:rotate-12" />
            <span>Get Started</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>
    );
  }

  const name = user.name?.trim() || "User";
  const initials =
    name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="User account menu"
          className="group relative flex items-center rounded-full p-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 hover:ring-2 hover:ring-indigo-400/40"
        >
          <Avatar className="size-8.5 rounded-full border border-white/15 transition-transform duration-200 group-hover:scale-105 shadow-sm">
            <AvatarImage src={user.image ?? ""} alt={name} />
            <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-[11px] font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background transition-transform group-hover:scale-110" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-68 p-0 rounded-2xl border border-white/10 bg-[#12141a]/95 backdrop-blur-xl shadow-2xl overflow-hidden text-slate-200 animate-in fade-in-50 zoom-in-95"
      >
        {/* User Card Header */}
        <div className="relative p-4 border-b border-white/[0.08] bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 rounded-xl border border-indigo-500/30 shadow-md">
              <AvatarImage src={user.image ?? ""} alt={name} />
              <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-xs font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-semibold text-white">
                  {name}
                </p>
              </div>
              <p className="truncate text-xs text-slate-400">
                {user.email || "Free Member"}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-indigo-300 font-mono text-[10px]">
              Pro Workspace
            </span>
          </div>
        </div>

        {/* Menu Links */}
        <div className="p-1.5 space-y-0.5">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
          >
            <LayoutDashboard className="size-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
          >
            <User className="size-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <span>My Profile</span>
          </Link>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors group"
          >
            <Settings className="size-4 text-slate-400 group-hover:text-indigo-400 group-hover:rotate-45 transition-all" />
            <span>Settings</span>
          </Link>

          <div className="border-t border-white/[0.08] my-1" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
