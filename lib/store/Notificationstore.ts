import { create } from "zustand";

export type NotificationType = "error" | "warning" | "info" | "success";

export interface NotificationAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  source?: string;
  timestamp: number;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationStore {
  notifications: NotificationItem[];
  isOpen: boolean;
  activeToast: NotificationItem | null;

  addNotification: (
    item: Omit<NotificationItem, "id" | "timestamp" | "read"> & {
      id?: string;
      silentToast?: boolean;
    },
  ) => string;

  removeNotification: (id: string) => void;
  clearAll: () => void;
  markAllRead: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  dismissToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isOpen: false,
  activeToast: null,

  addNotification: (item) => {
    const id = item.id || crypto.randomUUID();
    const newNotification: NotificationItem = {
      id,
      type: item.type,
      title: item.title,
      message: item.message,
      source: item.source || "System",
      timestamp: Date.now(),
      read: false,
      actions: item.actions,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50),
      activeToast: item.silentToast ? state.activeToast : newNotification,
    }));

    if (!item.silentToast) {
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        set({ activeToast: null });
      }, 5000);
    }

    return id;
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      activeToast: state.activeToast?.id === id ? null : state.activeToast,
    })),

  clearAll: () =>
    set({
      notifications: [],
      activeToast: null,
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  toggleOpen: () => {
    const nextState = !get().isOpen;
    if (nextState) {
      get().markAllRead();
      set({ isOpen: true, activeToast: null });
    } else {
      set({ isOpen: false });
    }
  },

  setOpen: (isOpen) => {
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
}));

/* Helper dispatchers */
export const notify = {
  error: (title: string, message: string, source = "System") =>
    useNotificationStore.getState().addNotification({
      type: "error",
      title,
      message,
      source,
    }),
  warning: (title: string, message: string, source = "System") =>
    useNotificationStore.getState().addNotification({
      type: "warning",
      title,
      message,
      source,
    }),
  info: (title: string, message: string, source = "System") =>
    useNotificationStore.getState().addNotification({
      type: "info",
      title,
      message,
      source,
    }),
  success: (title: string, message: string, source = "System") =>
    useNotificationStore.getState().addNotification({
      type: "success",
      title,
      message,
      source,
    }),
};
