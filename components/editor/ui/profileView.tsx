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
  ArrowRight,
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

export function ProfileView({
  side = "bottom",
  align = "end",
  sideOffset = 8,
  compact = false,
}: ProfileViewProps) {
  const { user, logout, isPending, is404 } = useAuth();
  const [open, setOpen] = useState(false);

  // Loading state
  if (isPending && !is404) {
    return (
      <div
        className={
          compact
            ? "size-5 rounded-md bg-white/20 animate-pulse border border-white/25 shrink-0"
            : "h-8 w-20 rounded-md bg-[#e8e8e8] dark:bg-[#313131] animate-pulse border border-[#cecece] dark:border-[#3c3c3c]"
        }
      />
    );
  }

  // Unauthenticated state
  if (is404 || !user?.id) {
    if (compact) {
      return (
        <Link
          href="/auth/login"
          className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs text-white/90 hover:text-white hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          title="Sign in to CodeSync"
        >
          <UserRound className="size-3.5 shrink-0" />
          <span className="hidden sm:inline text-[11px] font-medium">Sign in</span>
        </Link>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button
            variant="ghost"
            className="h-8 px-3 rounded-md text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc] hover:text-[#1e1e1e] dark:hover:text-white hover:bg-[#e8e8e8] dark:hover:bg-[#2a2d2e] border border-[#cecece] dark:border-[#3c3c3c] transition-colors"
          >
            Sign in
          </Button>
        </Link>

        <Link href="/auth/signup">
          <Button className="h-8 px-3.5 rounded-md text-xs font-medium text-white bg-[#007acc] hover:bg-[#0062a3] shadow-sm transition-colors gap-1.5">
            <span>Get Started</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>
    );
  }

  const name = user.name?.trim() || "User";
  const firstName = name.split(/\s+/)[0] || name;

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
        {compact ? (
          <button
            type="button"
            aria-label="Open user profile menu"
            title={`${name} (${user.email || "Active"})`}
            className={`group relative flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs text-white transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
              open
                ? "bg-black/20 text-white"
                : "hover:bg-white/15 text-white/95 hover:text-white"
            }`}
          >
            <div className="relative shrink-0">
              <Avatar className="size-4.5 rounded-sm border border-white/30 shadow-xs">
                <AvatarImage src={user.image ?? ""} alt={name} />
                <AvatarFallback className="bg-white/20 text-[9px] font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 size-1.5 rounded-full bg-[#89d185] ring-1 ring-[#007acc]" />
            </div>

            <span className="hidden sm:inline-block truncate max-w-24 text-[11px] font-medium leading-none">
              {firstName}
            </span>
          </button>
        ) : (
          <button
            type="button"
            aria-label="Open user profile menu"
            title={`${name} (${user.email || "Active"})`}
            className={`group relative flex items-center rounded-md p-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#007acc] ${
              open ? "ring-1 ring-[#007acc]" : ""
            }`}
          >
            <div className="relative shrink-0">
              <Avatar className="size-8 rounded-md border border-[#cecece] dark:border-[#3c3c3c] shadow-sm transition-transform duration-200 group-hover:scale-105">
                <AvatarImage src={user.image ?? ""} alt={name} />
                <AvatarFallback className="bg-[#007acc] text-[11px] font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[#89d185] ring-2 ring-white dark:ring-[#252526]" />
            </div>
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="w-68 p-0 rounded-md border border-[#cecece] dark:border-[#333333] bg-white dark:bg-[#252526] text-[#1e1e1e] dark:text-[#cccccc] shadow-2xl backdrop-blur-md overflow-hidden animate-in fade-in-50 zoom-in-95 z-50"
      >
        {/* User Card Header */}
        <div className="p-3.5 border-b border-[#cecece] dark:border-[#333333] bg-[#f8f8f8] dark:bg-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Avatar className="size-10 rounded-md border border-[#cecece] dark:border-[#3c3c3c] shadow-xs">
                <AvatarImage src={user.image ?? ""} alt={name} />
                <AvatarFallback className="bg-[#007acc] text-xs font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[#89d185] ring-2 ring-[#f8f8f8] dark:ring-[#1f1f1f]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1e1e1e] dark:text-white">
                {name}
              </p>
              {user.email ? (
                <div className="mt-0.5 flex items-center gap-1.5 text-[#616161] dark:text-[#9d9d9d]">
                  <Mail className="size-3 shrink-0 text-[#858585]" />
                  <p className="truncate text-xs">{user.email}</p>
                </div>
              ) : (
                <p className="truncate text-xs text-[#616161] dark:text-[#9d9d9d]">Developer</p>
              )}
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#cecece]/60 dark:border-[#333333] text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-[#107c41] dark:text-[#89d185] font-medium">
              <span className="size-1.5 rounded-full bg-[#89d185] animate-pulse" />
              Online
            </span>

            <span className="inline-flex items-center gap-1 rounded bg-[#007acc]/10 border border-[#007acc]/20 px-2 py-0.5 text-[#007acc] dark:text-[#3794ff] font-mono text-[10px] font-medium">
              <ShieldCheck className="size-3" />
              Pro Workspace
            </span>
          </div>
        </div>

        {/* Quick Menu Actions */}
        <div className="p-1 space-y-0.5">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded px-2.5 py-1.5 text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#e8e8e8] dark:hover:bg-[#2a2d2e] hover:text-[#1e1e1e] dark:hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="size-4 text-[#616161] dark:text-[#9d9d9d] group-hover:text-[#007acc] dark:group-hover:text-[#3794ff] transition-colors" />
              <span>Dashboard</span>
            </div>
            <ChevronRight className="size-3 text-[#9d9d9d]/60 group-hover:text-[#9d9d9d] transition-colors" />
          </Link>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded px-2.5 py-1.5 text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#e8e8e8] dark:hover:bg-[#2a2d2e] hover:text-[#1e1e1e] dark:hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <UserRound className="size-4 text-[#616161] dark:text-[#9d9d9d] group-hover:text-[#007acc] dark:group-hover:text-[#3794ff] transition-colors" />
              <span>Profile Details</span>
            </div>
            <ChevronRight className="size-3 text-[#9d9d9d]/60 group-hover:text-[#9d9d9d] transition-colors" />
          </Link>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded px-2.5 py-1.5 text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#e8e8e8] dark:hover:bg-[#2a2d2e] hover:text-[#1e1e1e] dark:hover:text-white transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="size-4 text-[#616161] dark:text-[#9d9d9d] group-hover:text-[#007acc] dark:group-hover:text-[#3794ff] group-hover:rotate-45 transition-all" />
              <span>Settings</span>
            </div>
            <ChevronRight className="size-3 text-[#9d9d9d]/60 group-hover:text-[#9d9d9d] transition-colors" />
          </Link>

          <div className="border-t border-[#cecece] dark:border-[#333333] my-1" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2.5 rounded px-2.5 py-1.5 text-xs font-medium text-[#f14c4c] hover:bg-[#f14c4c]/10 transition-colors cursor-pointer"
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ProfileView;
