"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  GitBranch,
  CheckCircle2,
  Bell,
  AlertCircle,
  Crown,
  Eye,
  Pencil,
  Ban,
  UserMinus,
  Check,
  ChevronDown,
  Shield,
  Loader2,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExplorerstore } from "@/lib/store/Explorerstore";
import { notify, useNotificationStore } from "@/lib/store/Notificationstore";
import { avatarGradients } from "../constant/dashboard";
import {
  NotificationCenter,
  NotificationToast,
} from "./ui/NotificationCenter";
import ActivityFeed from "./ui/ActivityFeed";
import ProfileView from "./ui/profileView";
import { useCodestore } from "@/lib/store/Codestore";
import { socket } from "@/lib/socket";
import {
  GetRoomMembers,
  UpdateMember,
  DeleteMember,
} from "@/lib/api/memberApi";

interface RoomMember {
  _id: string;
  userId: string;
  name: string;
  email: string;
  image: string;
  role: "owner" | "editor" | "viewer";
  banned: boolean;
  joinedAt?: string;
  lastActiveAt?: string;
  isOwner: boolean;
}

interface StatusBarProps {
  roomId?: string;
  initialRole?: "owner" | "editor" | "viewer";
}

function StatusBar({ roomId, initialRole }: StatusBarProps) {
  const currentRole = useCodestore((s) => s.role) || initialRole || "editor";
  const isOwner = currentRole === "owner";
  const isViewer = currentRole === "viewer";

  const onlineMembers = useExplorerstore((s) => s.members);
  const activity = useExplorerstore((s) => s.activity);
  const latestActivity = useMemo(() => {
    if (!activity.length) return null;
    return activity.at(0);
  }, [activity]);

  const notifications = useNotificationStore((s) => s.notifications);
  const toggleNotifications = useNotificationStore((s) => s.toggleOpen);
  const isNotificationOpen = useNotificationStore((s) => s.isOpen);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dbMembers, setDbMembers] = useState<RoomMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!roomId) return;
    try {
      setLoadingMembers(true);
      const data = await GetRoomMembers(roomId);
      if (data) {
        setDbMembers((data.members || []) as RoomMember[]);
        if (data.currentRole) {
          useCodestore.getState().setRole(data.currentRole);
        }
      }
    } catch (err) {
      console.error("Failed to fetch room members:", err);
    } finally {
      setLoadingMembers(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (popoverOpen && roomId) {
      fetchMembers();
    }
  }, [popoverOpen, roomId, fetchMembers]);

  // Initial fetch on mount & listen for real-time refresh events from socketProvider
  useEffect(() => {
    if (roomId) {
      fetchMembers();
    }
    const handleRefresh = () => {
      fetchMembers();
    };
    window.addEventListener("room:members-refresh", handleRefresh);
    return () => {
      window.removeEventListener("room:members-refresh", handleRefresh);
    };
  }, [roomId, fetchMembers]);

  const handleUpdateRole = async (
    member: RoomMember,
    newRole: "editor" | "viewer",
  ) => {
    if (!roomId || !isOwner || member.isOwner) return;

    try {
      setActionLoadingId(member._id);
      await UpdateMember(member._id, { role: newRole });

      setDbMembers((prev) =>
        prev.map((m) => (m._id === member._id ? { ...m, role: newRole } : m)),
      );

      notify.success(
        "Role Updated",
        `Updated ${member.name}'s role to ${newRole}`,
        "Room Access",
      );

      // Real-time broadcast to room participants via socket.io
      socket.emit("member:role-update", {
        roomId,
        targetUserId: member.userId,
        newRole,
        memberName: member.name,
      });
    } catch (err: any) {
      notify.error("Role Update Failed", err.message || "Failed to update role", "Room Access");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleBan = async (member: RoomMember) => {
    if (!roomId || !isOwner || member.isOwner) return;

    const willBan = !member.banned;
    try {
      setActionLoadingId(member._id);
      await UpdateMember(member._id, { banned: willBan });

      setDbMembers((prev) =>
        prev.map((m) =>
          m._id === member._id ? { ...m, banned: willBan } : m,
        ),
      );

      notify.warning(
        willBan ? "User Banned" : "User Unbanned",
        willBan
          ? `${member.name} has been banned from the room`
          : `${member.name} has been unbanned`,
        "Room Access",
      );

      // Real-time broadcast if banned
      if (willBan) {
        socket.emit("member:kick", {
          roomId,
          targetUserId: member.userId,
          reason: "banned",
          memberName: member.name,
        });
      }
    } catch (err: any) {
      notify.error("Action Failed", err.message || "Failed to update ban status", "Room Access");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemoveMember = async (member: RoomMember) => {
    if (!roomId || !isOwner || member.isOwner) return;

    try {
      setActionLoadingId(member._id);
      await DeleteMember(member._id);

      setDbMembers((prev) => prev.filter((m) => m._id !== member._id));

      notify.warning(
        "User Removed",
        `${member.name} was removed from the room`,
        "Room Access",
      );

      // Real-time broadcast to redirect removed user to dashboard
      socket.emit("member:kick", {
        roomId,
        targetUserId: member.userId,
        reason: "removed",
        memberName: member.name,
      });
    } catch (err: any) {
      notify.error("Action Failed", err.message || "Failed to remove member", "Room Access");
    } finally {
      setActionLoadingId(null);
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const errorCount = useMemo(
    () => notifications.filter((n) => n.type === "error").length,
    [notifications],
  );

  // Merge dbMembers and onlineMembers so newly joined online users are immediately visible in real time
  const combinedMembers = useMemo(() => {
    const map = new Map<string, RoomMember>();

    // First add dbMembers
    for (const m of dbMembers) {
      const key = m.userId || m._id || m.email;
      if (key) map.set(key, m);
    }

    // Add or merge online members who joined via socket
    for (const om of onlineMembers) {
      const key = om.id || om.email;
      if (key) {
        const existing = map.get(key);
        if (existing) {
          map.set(key, {
            ...existing,
            name: om.name || existing.name,
            image: om.image || existing.image,
          });
        } else {
          map.set(key, {
            _id: om.id,
            userId: om.id,
            name: om.name || "Collaborator",
            email: om.email || "",
            image: om.image || "",
            role: "editor",
            banned: false,
            isOwner: false,
          });
        }
      }
    }

    return Array.from(map.values());
  }, [dbMembers, onlineMembers]);

  // Cross-reference online status
  const isMemberOnline = (m: RoomMember) =>
    onlineMembers.some(
      (om) =>
        om.id === m.userId ||
        om.id === m._id ||
        (om.email && m.email && om.email === m.email) ||
        (m.isOwner && isOwner),
    );

  return (
    <>
      {/* Floating Toast & Notification Center Flyout Drawer */}
      <NotificationToast />
      <NotificationCenter />

      <footer className="relative z-40 flex h-7 select-none items-center justify-between border-t border-[#1e1e1e] bg-[#007acc] px-2.5 text-xs text-white">
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <ProfileView side="top" align="start" compact />

          {/* User Role Badge in Status Bar */}
          {isOwner ? (
            <span className="flex items-center gap-1 rounded bg-amber-400/20 border border-amber-300/40 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-amber-200">
              <Crown className="size-2.5 text-amber-300" />
              <span>Owner</span>
            </span>
          ) : isViewer ? (
            <span className="flex items-center gap-1 rounded bg-purple-400/20 border border-purple-300/40 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-purple-200">
              <Eye className="size-2.5 text-purple-300" />
              <span>Viewer</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded bg-sky-400/20 border border-sky-300/40 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-sky-100">
              <Pencil className="size-2.5 text-sky-200" />
              <span>Editor</span>
            </span>
          )}

          <div className="flex items-center gap-1 shrink-0 font-mono text-[11px] opacity-90 hover:opacity-100 cursor-pointer">
            <GitBranch className="size-3" />
            <span>main</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 shrink-0 text-[11px] opacity-90">
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
                className="hidden md:flex items-center gap-1.5 truncate text-[11px] font-medium bg-black/15 px-2 py-0.5 rounded"
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

          {/* Collaborators & Member Management Popover */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-white/10 transition-colors"
                title={`${combinedMembers.length} collaborator(s)`}
              >
                <div className="flex items-center -space-x-1.5">
                  {combinedMembers
                    .slice(0, 3)
                    .map((m: any, index: number) => (
                      <Avatar
                        key={m._id || m.id || index}
                        className="size-4 border border-[#007acc] ring-1 ring-white/30 shadow-sm"
                        style={{
                          background:
                            avatarGradients[index % avatarGradients.length],
                        }}
                      >
                        <AvatarImage src={m.image ?? ""} alt={m.name} />
                        <AvatarFallback className="text-[8px] font-bold text-white bg-transparent">
                          {m.name
                            ?.split(" ")
                            .map((x: string) => x[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}

                  {combinedMembers.length > 3 && (
                    <motion.div
                      key={combinedMembers.length - 3}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="relative z-10 flex size-4 shrink-0 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-white/35 to-white/15 text-[9px] font-mono font-bold text-white shadow-sm backdrop-blur-sm ring-1 ring-[#007acc] select-none"
                      title={`+${combinedMembers.length - 3} more collaborator(s)`}
                    >
                      +{combinedMembers.length - 3}
                    </motion.div>
                  )}
                </div>
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="end"
              className="w-80 sm:w-96 p-0 bg-[#1e1e1e] border-[#3c3c3c] text-xs text-white shadow-2xl backdrop-blur-md rounded-lg overflow-hidden"
            >
              {/* Header */}
              <div className="border-b border-[#3c3c3c] px-4 py-2.5 flex items-center justify-between bg-[#252526]">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="size-3.5 text-[#007acc]" />
                    <h3 className="font-semibold text-white text-xs">
                      Room Collaborators
                    </h3>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    {combinedMembers.length} member(s) in this room
                  </p>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Member List */}
              <div className="max-h-80 overflow-y-auto p-1.5 space-y-1 divide-y divide-[#2d2d30]/60">
                {loadingMembers && combinedMembers.length === 0 ? (
                  <div className="p-6 flex flex-col items-center justify-center gap-2 text-neutral-400">
                    <Loader2 className="size-4 animate-spin text-[#007acc]" />
                    <span className="text-xs">Loading members...</span>
                  </div>
                ) : combinedMembers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-400">
                    No members found
                  </div>
                ) : (
                  combinedMembers.map((member) => {
                    const online = isMemberOnline(member);
                    const isSelfOwner = member.isOwner;
                    const isActing = actionLoadingId === member._id;

                    return (
                      <div
                        key={member._id}
                        className={`pt-1.5 pb-1 flex flex-col gap-1.5 px-2.5 rounded transition-colors ${
                          member.banned
                            ? "bg-red-500/10 border border-red-500/20"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          {/* Member Avatar & Details */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative shrink-0">
                              <Avatar className="size-7 border border-white/10">
                                <AvatarImage src={member.image ?? ""} alt={member.name} />
                                <AvatarFallback className="text-xs bg-[#333333]">
                                  {member.name
                                    ?.split(" ")
                                    .map((x) => x[0])
                                    .join("")
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                title={online ? "Online" : "Offline"}
                                className={`absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-[#1e1e1e] ${
                                  online ? "bg-emerald-400" : "bg-neutral-500"
                                }`}
                              />
                            </div>

                            <div className="min-w-0 truncate">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-medium text-neutral-200 truncate">
                                  {member.name}
                                </p>
                                {member.banned && (
                                  <span className="shrink-0 rounded bg-red-500/20 border border-red-500/30 px-1 py-0.1 text-[9px] font-bold text-red-400">
                                    BANNED
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-neutral-400 truncate">
                                {member.email}
                              </p>
                            </div>
                          </div>

                          {/* Role Badge or Owner Controls */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isOwner && !isSelfOwner && !member.banned ? (
                              /* Owner Role Dropdown */
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild disabled={isActing}>
                                  <button
                                    type="button"
                                    className="flex items-center gap-1 rounded border border-[#3c3c3c] bg-[#2a2a2a] px-2 py-0.5 text-[10px] font-medium text-white hover:bg-[#333333] transition-colors"
                                  >
                                    {member.role === "editor" ? (
                                      <span className="flex items-center gap-1 text-sky-400">
                                        <Pencil className="size-2.5" />
                                        Editor
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1 text-purple-400">
                                        <Eye className="size-2.5" />
                                        Viewer
                                      </span>
                                    )}
                                    <ChevronDown className="size-2.5 opacity-60" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-32 bg-[#252526] border-[#3c3c3c] text-xs text-white p-1"
                                >
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateRole(member, "editor")}
                                    className="flex items-center justify-between text-[11px] cursor-pointer"
                                  >
                                    <span className="flex items-center gap-1.5 text-sky-400">
                                      <Pencil className="size-3" />
                                      Editor
                                    </span>
                                    {member.role === "editor" && (
                                      <Check className="size-3 text-sky-400" />
                                    )}
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => handleUpdateRole(member, "viewer")}
                                    className="flex items-center justify-between text-[11px] cursor-pointer"
                                  >
                                    <span className="flex items-center gap-1.5 text-purple-400">
                                      <Eye className="size-3" />
                                      Viewer
                                    </span>
                                    {member.role === "viewer" && (
                                      <Check className="size-3 text-purple-400" />
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              /* Static Role Badge */
                              <span
                                className={`flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-semibold border ${
                                  isSelfOwner
                                    ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                                    : member.role === "editor"
                                      ? "bg-sky-500/15 border-sky-500/30 text-sky-300"
                                      : "bg-purple-500/15 border-purple-500/30 text-purple-300"
                                }`}
                              >
                                {isSelfOwner ? (
                                  <>
                                    <Crown className="size-2.5 text-amber-400" />
                                    Owner
                                  </>
                                ) : member.role === "editor" ? (
                                  <>
                                    <Pencil className="size-2.5 text-sky-400" />
                                    Editor
                                  </>
                                ) : (
                                  <>
                                    <Eye className="size-2.5 text-purple-400" />
                                    Viewer
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Owner Management Buttons (Ban / Remove) */}
                        {isOwner && !isSelfOwner && (
                          <div className="flex items-center justify-end gap-1 pt-1 border-t border-[#333333]/50">
                            {/* Ban / Unban Button */}
                            <button
                              type="button"
                              disabled={isActing}
                              onClick={() => handleToggleBan(member)}
                              className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                                member.banned
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                              }`}
                            >
                              <Ban className="size-2.5" />
                              <span>{member.banned ? "Unban" : "Ban"}</span>
                            </button>

                            {/* Remove from Room Button */}
                            <button
                              type="button"
                              disabled={isActing}
                              onClick={() => handleRemoveMember(member)}
                              className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-colors"
                            >
                              <UserMinus className="size-2.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
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
