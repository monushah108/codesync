"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useAuth } from "@/lib/hooks/useAuth";

import { LogOut, SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const { user, logout, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <>
      {user?.id ? (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="
                flex items-center
                rounded-full
                outline-none
                hover:opacity-80
                transition-opacity
              "
            >
              <Avatar className="size-7">
                <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />

                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() || "M"}
                </AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="
              max-w-max
              p-0
              bg-background
              text-foreground
              border
              rounded-xl
              shadow-xl
            "
          >
            <div className="px-4 py-3">
              <p className="text-sm font-medium">{user.name}</p>

              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>

            <div className="border-t" />

            <div className="p-1 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={logout}
                className="
                  flex items-center
                  px-4 py-2
                  text-sm
                  text-red-500
                  hover:bg-red-600/10
                  hover:text-red-500
                "
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>

              <Link href="/setting">
                <Button
                  variant="ghost"
                  className="bg-transparent hover:rotate-180 transition-transform"
                >
                  <SettingsIcon className="size-5" />
                </Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/auth/sign-in">
            <Button
              variant="outline"
              className="font-medium dark:border-gray-700"
            >
              Sign in
            </Button>
          </Link>

          <Link href="/auth/sign-up">
            <Button
              className="
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                hover:from-blue-700
                hover:to-purple-700
                text-white
                font-medium
              "
            >
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
