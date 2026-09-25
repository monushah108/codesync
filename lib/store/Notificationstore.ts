// lib/store/Notificationstore.ts

import { create } from "zustand";
import {
  AddNotificationInput,
  NotificationAction,
  NotificationCategory,
  NotificationFilter,
  NotificationItem,
  NotificationStore,
  NotificationType,
  RealtimeNotificationPayload,
} from "./types/notificationTypes";

// Re-export types for backward compatibility
export type {
  AddNotificationInput,
  NotificationAction,
  NotificationCategory,
  NotificationFilter,
  NotificationItem,
  NotificationStore,
  NotificationType,
  RealtimeNotificationPayload,
};

let toastTimer: ReturnType<typeof setTimeout> | null = null;

const MAX_NOTIFICATIONS = 100;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,
  activeToast: null,
  filter: "all",

  addNotification: (item: AddNotificationInput) => {
    const id = item.id || crypto.randomUUID();
    const newNotification: NotificationItem = {
      id,
      type: item.type,
      category: item.category || "system",
      title: item.title,
      message: item.message,
      source: item.source || "System",
      timestamp: Date.now(),
      read: false,
      actions: item.actions,
      pinned: item.pinned,
      metadata: item.metadata,
    };

    set((state) => {
      const nextList = [newNotification, ...state.notifications].slice(
        0,
        MAX_NOTIFICATIONS,
      );
      return {
        notifications: nextList,
        unreadCount: nextList.filter((n) => !n.read).length,
        activeToast: item.silentToast ? state.activeToast : newNotification,
      };
    });

    if (!item.silentToast) {
      if (toastTimer) clearTimeout(toastTimer);
      // Give errors and warnings longer toast duration
      const duration =
        item.type === "error" ? 7000 : item.type === "warning" ? 6000 : 4500;

      toastTimer = setTimeout(() => {
        set({ activeToast: null });
      }, duration);
    }

    return id;
  },

  removeNotification: (id: string) =>
    set((state) => {
      const nextList = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: nextList,
        unreadCount: nextList.filter((n) => !n.read).length,
        activeToast: state.activeToast?.id === id ? null : state.activeToast,
      };
    }),

  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
      activeToast: null,
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  markRead: (id: string) =>
    set((state) => {
      const nextList = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      return {
        notifications: nextList,
        unreadCount: nextList.filter((n) => !n.read).length,
      };
    }),

  toggleOpen: () => {
    const nextState = !get().isOpen;
    if (nextState) {
      get().markAllRead();
      set({ isOpen: true, activeToast: null });
    } else {
      set({ isOpen: false });
    }
  },

  setOpen: (isOpen: boolean) => {
    if (isOpen) {
      get().markAllRead();
      set({ isOpen: true, activeToast: null });
    } else {
      set({ isOpen: false });
    }
  },

  dismissToast: () => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ activeToast: null });
  },

  setFilter: (filter: NotificationFilter) => set({ filter }),
}));

/* Helper dispatchers */
export const notify = {
  error: (
    title: string,
    message: string,
    source = "System",
    actions?: NotificationAction[],
  ) =>
    useNotificationStore.getState().addNotification({
      type: "error",
      category: "system",
      title,
      message,
      source,
      actions,
    }),

  warning: (
    title: string,
    message: string,
    source = "System",
    actions?: NotificationAction[],
  ) =>
    useNotificationStore.getState().addNotification({
      type: "warning",
      category: "system",
      title,
      message,
      source,
      actions,
    }),

  info: (
    title: string,
    message: string,
    source = "System",
    actions?: NotificationAction[],
  ) =>
    useNotificationStore.getState().addNotification({
      type: "info",
      category: "system",
      title,
      message,
      source,
      actions,
    }),

  success: (
    title: string,
    message: string,
    source = "System",
    actions?: NotificationAction[],
  ) =>
    useNotificationStore.getState().addNotification({
      type: "success",
      category: "system",
      title,
      message,
      source,
      actions,
    }),

  system: (title: string, message: string, actions?: NotificationAction[]) =>
    useNotificationStore.getState().addNotification({
      type: "system",
      category: "system",
      title,
      message,
      source: "CodeSync Core",
      actions,
    }),
};
