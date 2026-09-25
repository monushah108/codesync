// lib/store/actions/useNotificationAction.ts

import {
  AddNotificationInput,
  NotificationAction,
  NotificationCategory,
  NotificationFilter,
  NotificationType,
  RealtimeNotificationPayload,
} from "../types/notificationTypes";
import { useNotificationStore } from "../Notificationstore";
import { NotificationActionsMethods } from "./types";

// Debounce tracker for rapid incoming socket events
const recentNotificationSignatures = new Map<string, number>();
const DEDUPLICATION_INTERVAL_MS = 1500;

function isDuplicate(signature: string): boolean {
  const now = Date.now();
  const lastTime = recentNotificationSignatures.get(signature);

  if (lastTime && now - lastTime < DEDUPLICATION_INTERVAL_MS) {
    return true;
  }

  recentNotificationSignatures.set(signature, now);

  // Clean old entries periodically
  if (recentNotificationSignatures.size > 200) {
    for (const [key, time] of recentNotificationSignatures.entries()) {
      if (now - time > 10000) {
        recentNotificationSignatures.delete(key);
      }
    }
  }

  return false;
}

export const useNotificationActions: NotificationActionsMethods = {
  /* -------------------------------------------------------------------------- */
  /*                         Basic Notification Dispatchers                     */
  /* -------------------------------------------------------------------------- */

  info(
    title: string,
    message: string,
    source = "System",
    category: NotificationCategory = "system",
    actions?: NotificationAction[],
  ): string {
    return useNotificationStore.getState().addNotification({
      type: "info",
      category,
      title,
      message,
      source,
      actions,
    });
  },

  success(
    title: string,
    message: string,
    source = "System",
    category: NotificationCategory = "system",
    actions?: NotificationAction[],
  ): string {
    return useNotificationStore.getState().addNotification({
      type: "success",
      category,
      title,
      message,
      source,
      actions,
    });
  },

  warning(
    title: string,
    message: string,
    source = "System",
    category: NotificationCategory = "system",
    actions?: NotificationAction[],
  ): string {
    return useNotificationStore.getState().addNotification({
      type: "warning",
      category,
      title,
      message,
      source,
      actions,
    });
  },

  error(
    title: string,
    message: string,
    source = "System",
    category: NotificationCategory = "system",
    actions?: NotificationAction[],
  ): string {
    return useNotificationStore.getState().addNotification({
      type: "error",
      category,
      title,
      message,
      source,
      actions,
    });
  },

  system(title: string, message: string, actions?: NotificationAction[]): string {
    return useNotificationStore.getState().addNotification({
      type: "system",
      category: "system",
      title,
      message,
      source: "CodeSync Core",
      actions,
    });
  },

  /* -------------------------------------------------------------------------- */
  /*                     Real-Time Socket Event Handlers                        */
  /* -------------------------------------------------------------------------- */

  handleRealtimeEvent(payload: RealtimeNotificationPayload): string | null {
    const signature = `${payload.event}:${payload.title}:${payload.message}`;
    if (isDuplicate(signature)) {
      return null;
    }

    const type: NotificationType = payload.severity || "info";
    const category: NotificationCategory = payload.category || "collaborator";

    return useNotificationStore.getState().addNotification({
      type,
      category,
      title: payload.title,
      message: payload.message,
      source: payload.source || "Collaborator",
      silentToast: payload.silentToast,
      actions: payload.actions,
      metadata: payload.metadata,
    });
  },

  memberJoined(userName: string, userId?: string, currentUserId?: string): void {
    if (userId && currentUserId && userId === currentUserId) return;

    this.handleRealtimeEvent({
      event: "member:join",
      title: "Member Joined",
      message: `${userName} entered the workspace room`,
      category: "collaborator",
      severity: "info",
      source: "Collaborator",
      userId,
      userName,
    });
  },

  memberLeft(userName: string, userId?: string, currentUserId?: string): void {
    if (userId && currentUserId && userId === currentUserId) return;

    this.handleRealtimeEvent({
      event: "member:leave",
      title: "Member Left",
      message: `${userName} exited the room`,
      category: "collaborator",
      severity: "warning",
      source: "Collaborator",
      userId,
      userName,
    });
  },

  memberRoleUpdated(
    memberName: string,
    newRole: "owner" | "editor" | "viewer",
    isSelf: boolean,
  ): void {
    if (isSelf) {
      this.handleRealtimeEvent({
        event: "member:role-update",
        title: "Role Changed",
        message: `Your permission has been updated to "${newRole}".`,
        category: "security",
        severity: "info",
        source: "Access Control",
      });
    } else {
      this.handleRealtimeEvent({
        event: "member:role-update",
        title: "Collaborator Role Changed",
        message: `${memberName}'s role was updated to "${newRole}".`,
        category: "collaborator",
        severity: "info",
        source: "Room",
      });
    }
  },

  memberKickedOrBanned(
    memberName: string,
    reason: "banned" | "removed",
    isSelf: boolean,
  ): void {
    if (isSelf) {
      this.handleRealtimeEvent({
        event: reason === "banned" ? "member:banned" : "member:kicked",
        title: reason === "banned" ? "Banned from Room" : "Removed from Room",
        message:
          reason === "banned"
            ? "You have been banned from this workspace by the owner."
            : "You were removed from this room by the owner.",
        category: "security",
        severity: "error",
        source: "Access Control",
      });
    } else {
      this.handleRealtimeEvent({
        event: reason === "banned" ? "member:banned" : "member:kicked",
        title: reason === "banned" ? "Member Banned" : "Member Removed",
        message: `${memberName} was ${reason} from the room.`,
        category: "collaborator",
        severity: "warning",
        source: "Room Management",
      });
    }
  },

  fileSavedRemotely(fileName: string): void {
    this.handleRealtimeEvent({
      event: "file:saved",
      title: "File Saved",
      message: `${fileName} was synchronized and saved to storage.`,
      category: "file",
      severity: "success",
      source: "Storage",
      silentToast: true, // Don't interrupt editor with aggressive popup
    });
  },

  connectionStateChanged(state: "connected" | "disconnected" | "reconnecting"): void {
    if (state === "connected") {
      this.handleRealtimeEvent({
        event: "connection:status",
        title: "Connected",
        message: "Live collaborative session connected.",
        category: "system",
        severity: "success",
        source: "Network",
      });
    } else if (state === "disconnected") {
      this.handleRealtimeEvent({
        event: "connection:status",
        title: "Disconnected",
        message: "Connection lost. Reconnecting to collaborative session...",
        category: "system",
        severity: "error",
        source: "Network",
      });
    } else {
      this.handleRealtimeEvent({
        event: "connection:status",
        title: "Reconnecting",
        message: "Attempting to reconnect...",
        category: "system",
        severity: "warning",
        source: "Network",
        silentToast: true,
      });
    }
  },

  /* -------------------------------------------------------------------------- */
  /*                          Center & State Controls                           */
  /* -------------------------------------------------------------------------- */

  markAsRead(id: string): void {
    useNotificationStore.getState().markRead(id);
  },

  markAllAsRead(): void {
    useNotificationStore.getState().markAllRead();
  },

  remove(id: string): void {
    useNotificationStore.getState().removeNotification(id);
  },

  clearAll(): void {
    useNotificationStore.getState().clearAll();
  },

  toggleCenter(): void {
    useNotificationStore.getState().toggleOpen();
  },

  setCenterOpen(open: boolean): void {
    useNotificationStore.getState().setOpen(open);
  },

  dismissToast(): void {
    useNotificationStore.getState().dismissToast();
  },

  setFilter(filter: NotificationFilter): void {
    useNotificationStore.getState().setFilter(filter);
  },
};

// Aliases for naming flexibility
export const NotificationActions = useNotificationActions;
export const notificationActions = useNotificationActions;
