"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useAuth } from "@/lib/hooks/useAuth";
import { Mail, User, Settings, LogOut } from "lucide-react";

export default function ProfileView() {
  const { user, logout, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="size-6 rounded-full bg-white/10 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const name = user.name ?? "User";

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="
            flex items-center gap-2
            rounded-md
            px-2 py-1
            hover:bg-white/10
            transition-colors
            outline-none
          "
        >
          <Avatar className="size-6">
            <AvatarImage src={user.image ?? ""} alt={name} />

            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        className="w-64 p-0 bg-[#252526] border-[#3c3c3c]"
      >
        {/* Profile Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#3c3c3c]">
          <Avatar className="size-10">
            <AvatarImage src={user.image ?? ""} alt={name} />

            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>

            {user.email && (
              <div className="flex items-center gap-1 mt-0.5">
                <Mail className="size-3 text-muted-foreground" />

                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-xs"
          >
            <User className="size-4" />
            Profile
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-xs"
          >
            <Settings className="size-4" />
            Settings
          </Button>

          <div className="my-1 border-t border-[#3c3c3c]" />

          <Button
            variant="ghost"
            onClick={logout}
            className="
              w-full
              justify-start
              gap-2
              text-xs
              text-red-400
              hover:text-red-300
              hover:bg-red-500/10
            "
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
