"use client";

import { useMemo } from "react";
import {
  GitBranch,
  CheckCircle2,
  Bell,
  AlertCircle,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useExplorerstore } from "@/lib/store/Explorerstore";
import { useNotificationStore } from "@/lib/store/Notificationstore";
import ProfileView from "./ui/profileView";
import { avatarGradients } from "../constant/dashboard";
import {
  NotificationCenter,
  NotificationToast,
} from "./ui/NotificationCenter";
import ActivityFeed from "./ui/ActivityFeed";

function StatusBar() {
  const members = useExplorerstore((s) => s.members);
  const activity = useExplorerstore((s) => s.activity);
  const latestActivity = useMemo(() => {
    if (!activity.length) return null;
    return activity.at(0);
  }, [activity]);

  const notifications = useNotificationStore((s) => s.notifications);
  const toggleNotifications = useNotificationStore((s) => s.toggleOpen);
  const isNotificationOpen = useNotificationStore((s) => s.isOpen);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const errorCount = useMemo(
    () => notifications.filter((n) => n.type === "error").length,
    [notifications],
  );

  return (
    <>
      {/* Floating Toast & Notification Center Flyout Drawer */}
      <NotificationToast />
      <NotificationCenter />

      <footer className="relative z-40 flex h-7 select-none items-center justify-between border-t border-[#1e1e1e] bg-[#007acc] px-2.5 text-xs text-white">
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className="flex items-center gap-3 overflow-hidden">
          <ProfileView side="top" align="start" compact />

          <div className="flex items-center gap-1 shrink-0 font-mono text-[11px] opacity-90 hover:opacity-100 cursor-pointer">
            <GitBranch className="size-3" />
            <span>main</span>
          </div>

          <div className="flex items-center gap-1 shrink-0 text-[11px] opacity-90">
            <CheckCircle2 className="size-3 text-white" />
            <span>Ready</span>
          </div>

          {/* Live Activity Ticker */}
          <AnimatePresence mode="wait">
            {latestActivity && (
              <motion.div
                key={latestActivity.id}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 truncate text-[11px] font-medium bg-black/15 px-2 py-0.5 rounded"
              >
                <span className="size-1.5 rounded-full bg-white animate-pulse" />
                <span className="truncate">
                  {latestActivity.message ??
                    `${latestActivity.userName} ${latestActivity.type}`}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Activity Section */}
          <ActivityFeed />

          {/* Online Collaborators Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center rounded px-1.5 py-0.5 hover:bg-white/10 transition-colors"
                title={`${members.length} collaborator(s) online`}
              >
                <AvatarGroup>
                  {members.slice(0, 3).map((member, index) => (
                    <Avatar
                      key={member.id}
                      className="size-4 border border-white/20"
                      style={{
                        background:
                          avatarGradients[index % avatarGradients.length],
                      }}
                    >
                      <AvatarImage src={member.image ?? ""} alt={member.name} />
                      <AvatarFallback className="text-[9px]">
                        {member.name
                          ?.split(" ")
                          .map((x) => x[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ))}

                  {members.length > 3 && (
                    <AvatarGroupCount className="text-[10px]">
                      +{members.length - 3}
                    </AvatarGroupCount>
                  )}
                </AvatarGroup>
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="end"
              className="w-72 p-0 bg-[#1e1e1e]/98 border-[#3c3c3c] text-xs text-white shadow-2xl backdrop-blur-md rounded-lg"
            >
              <div className="border-b border-[#3c3c3c] px-4 py-2.5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Collaborators</h3>
                  <p className="text-[11px] text-neutral-400">
                    {members.length} active member(s)
                  </p>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto p-1 space-y-0.5">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between px-3 py-2 rounded hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Avatar className="size-7 border border-white/10">
                        <AvatarImage src={member.image ?? ""} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name
                            ?.split(" ")
                            .map((x) => x[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="truncate">
                        <p className="text-xs font-medium text-neutral-200 truncate">
                          {member.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
                  </div>
                ))}

                {members.length === 0 && (
                  <div className="p-6 text-center text-xs text-neutral-400">
                    No other members online
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* VS Code-Style Notifications Bell */}
          <button
            type="button"
            onClick={toggleNotifications}
            title={
              unreadCount > 0
                ? `${unreadCount} unread notification(s)`
                : "Notifications"
            }
            className={`relative flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors ${
              isNotificationOpen
                ? "bg-black/25 text-white"
                : "hover:bg-white/10 text-white"
            }`}
          >
            <Bell className="size-3.5" />

            {/* Error or Count Badge */}
            {errorCount > 0 ? (
              <span className="flex items-center gap-0.5 rounded-full bg-red-600 px-1 py-0.2 text-[9px] font-bold text-white shadow">
                <AlertCircle className="size-2.5" />
                {errorCount}
              </span>
            ) : unreadCount > 0 ? (
              <span className="flex size-3.5 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#007acc] shadow">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </button>
        </div>
      </footer>
    </>
  );
}

export default StatusBar;
