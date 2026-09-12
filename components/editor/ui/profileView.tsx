"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/hooks/useAuth";
import { LogOut, Mail, Settings, UserRound } from "lucide-react";

export default function ProfileView() {
  const { user, logout, isPending } = useAuth();

  if (isPending) {
    return <div className="size-7 animate-pulse rounded-full bg-slate-800" />;
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
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Open profile menu"
          className="rounded-lg transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
        >
          <Avatar className="size-7 border border-slate-700">
            <AvatarImage src={user.image ?? ""} alt={name} />
            <AvatarFallback className="bg-indigo-500/15 text-[10px] text-indigo-300">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={8}
        className="w-60 rounded-lg border border-slate-700 bg-[#18181b] p-0 text-white"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-800 px-3 py-3">
          <Avatar className="size-9">
            <AvatarImage src={user.image ?? ""} alt={name} />
            <AvatarFallback className="bg-indigo-500/15 text-xs text-indigo-300">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">{name}</p>

            {user.email && (
              <div className="mt-0.5 flex items-center gap-1">
                <Mail className="size-3 text-slate-500" />
                <p className="truncate text-[11px] text-slate-400">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-0.5 p-1.5">
          <Button
            asChild
            variant="ghost"
            className="h-8 w-full justify-start gap-2 rounded-md px-2 text-xs"
          >
            <Link href="/profile">
              <UserRound className="size-3.5" />
              Profile
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="h-8 w-full justify-start gap-2 rounded-md px-2 text-xs"
          >
            <Link href="/settings">
              <Settings className="size-3.5" />
              Settings
            </Link>
          </Button>

          <Separator className="my-1 bg-slate-800" />

          <Button
            variant="ghost"
            disabled={isPending}
            onClick={logout}
            className="h-8 w-full justify-start gap-2 rounded-md px-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="size-3.5" />
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
