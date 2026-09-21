"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export interface ProfileViewProps {
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  compact?: boolean;
}

export default function ProfileView({
  side = "bottom",
  align = "end",
  sideOffset = 8,
  compact = false,
}: ProfileViewProps) {
  const { user, logout, isPending } = useAuth();
  const [open, setOpen] = useState(false);

  if (isPending) {
    return (
      <div
        className={`${
          compact ? "size-5" : "size-8"
        } animate-pulse rounded-full bg-slate-800/80 border border-white/10`}
      />
    );
  }

  if (!user) return null;

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
          aria-label="Open user profile menu"
          className={`group relative flex items-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 ${
            compact
              ? "rounded-md p-0.5 hover:bg-white/15"
              : "rounded-full p-0.5 hover:ring-2 hover:ring-indigo-500/40"
          }`}
        >
          <Avatar
            className={`${
              compact ? "size-5" : "size-8.5"
            } border border-white/20 transition-transform duration-200 group-hover:scale-105 shadow-sm`}
          >
            <AvatarImage src={user.image ?? ""} alt={name} />
            <AvatarFallback className="bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 text-[10px] font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          {!compact && (
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900 transition-transform group-hover:scale-110" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="w-68 rounded-2xl border border-white/10 bg-[#121318]/95 p-0 text-slate-200 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95"
      >
        {/* Profile Card Banner */}
        <div className="relative border-b border-white/[0.08] bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="size-11 rounded-xl border border-indigo-500/30 shadow-md">
                <AvatarImage src={user.image ?? ""} alt={name} />
                <AvatarFallback className="bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 text-xs font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-[#121318]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{name}</p>

              {user.email && (
                <div className="mt-0.5 flex items-center gap-1 text-slate-400">
                  <Mail className="size-3 shrink-0 text-slate-500" />
                  <p className="truncate text-xs">{user.email}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-indigo-300 font-mono text-[10px]">
              <ShieldCheck className="size-3" />
              Member
            </span>
          </div>
        </div>

        {/* Quick Menu Actions */}
        <div className="space-y-0.5 p-1.5">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white group"
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="size-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span>Dashboard</span>
            </div>
            <ChevronRight className="size-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
          </Link>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white group"
          >
            <div className="flex items-center gap-2.5">
              <UserRound className="size-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span>Profile Details</span>
            </div>
            <ChevronRight className="size-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
          </Link>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white group"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="size-4 text-slate-400 group-hover:text-indigo-400 group-hover:rotate-45 transition-all" />
              <span>Settings</span>
            </div>
            <ChevronRight className="size-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
          </Link>

          <div className="my-1 border-t border-white/[0.08]" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
