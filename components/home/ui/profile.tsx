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
  const { user, logout, isPending, is404 } = useAuth();
  const [open, setOpen] = useState(false);

  if (isPending && !is404) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 rounded-md bg-[#e8e8e8] dark:bg-[#313131] animate-pulse border border-[#cecece] dark:border-[#3c3c3c]" />
      </div>
    );
  }

  if (is404 || !user?.id) {
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
          <Button
            className="h-8 px-3.5 rounded-md text-xs font-medium text-white bg-[#007acc] hover:bg-[#0062a3] shadow-sm transition-colors gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="size-3.5" />
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
          className="group relative flex items-center rounded-md p-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#007acc]"
        >
          <Avatar className="size-8 rounded-md border border-[#cecece] dark:border-[#3c3c3c] shadow-sm">
            <AvatarImage src={user.image ?? ""} alt={name} />
            <AvatarFallback className="bg-[#007acc] text-[11px] font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-64 p-0 rounded-md border border-[#cecece] dark:border-[#333333] bg-white dark:bg-[#252526] shadow-md overflow-hidden text-[#1e1e1e] dark:text-[#cccccc]"
      >
        {/* User Card Header */}
        <div className="p-3.5 border-b border-[#cecece] dark:border-[#333333] bg-[#f8f8f8] dark:bg-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <Avatar className="size-9 rounded-md border border-[#cecece] dark:border-[#3c3c3c]">
              <AvatarImage src={user.image ?? ""} alt={name} />
              <AvatarFallback className="bg-[#007acc] text-xs font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-semibold text-[#1e1e1e] dark:text-white">
                  {name}
                </p>
              </div>
              <p className="truncate text-xs text-[#616161] dark:text-[#9d9d9d]">
                {user.email || "Free Member"}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#cecece]/60 dark:border-[#333333] text-[11px]">
            <span className="inline-flex items-center gap-1 text-[#107c41] dark:text-[#89d185] font-medium">
              <span className="size-1.5 rounded-full bg-[#89d185]" />
              Active
            </span>
            <span className="rounded bg-[#007acc]/10 border border-[#007acc]/20 px-2 py-0.5 text-[#007acc] dark:text-[#3794ff] font-mono text-[10px] font-medium">
              Pro Workspace
            </span>
          </div>
        </div>

        {/* Menu Links */}
        <div className="p-1 space-y-0.5">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#e8e8e8] dark:hover:bg-[#2a2d2e] transition-colors group"
          >
            <LayoutDashboard className="size-4 text-[#616161] dark:text-[#9d9d9d] group-hover:text-[#007acc] transition-colors" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#e8e8e8] dark:hover:bg-[#2a2d2e] transition-colors group"
          >
            <User className="size-4 text-[#616161] dark:text-[#9d9d9d] group-hover:text-[#007acc] transition-colors" />
            <span>My Profile</span>
          </Link>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#e8e8e8] dark:hover:bg-[#2a2d2e] transition-colors group"
          >
            <Settings className="size-4 text-[#616161] dark:text-[#9d9d9d] group-hover:text-[#007acc] transition-colors" />
            <span>Settings</span>
          </Link>

          <div className="border-t border-[#cecece] dark:border-[#333333] my-1" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs font-medium text-[#f14c4c] hover:bg-[#f14c4c]/10 transition-colors"
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
