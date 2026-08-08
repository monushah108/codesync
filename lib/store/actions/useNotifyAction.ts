import { create } from "zustand";

export type NotificationAction = "accepted" | "declined" | "read";

export interface Notification {
  _id: string;

  senderId: string;
  receiverId: string;

  senderName: string;
  roomId: string;
  roomName: string;

  action?: NotificationAction | null;

  readAt?: string | null;

  createdAt: string;
  updatedAt?: string;
}

export interface NotificationCache {
  data: Notification[];
  unreadCount: number;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export interface NotificationStore {
  cache: NotificationCache;

  LoadNotify: (data: Notification[]) => void;

  addNotify: (payload: Notification) => void;

  setNotifyPending: (pending: boolean) => void;

  setNotifyError: (error: string | null) => void;

  markAsRead: (id: string) => void;

  restoreNotify: (notification: Notification) => void;

  updateNotify: (payload: { id: string; action: NotificationAction }) => void;

  removeNotify: (payload: { id: string }) => void;
}

export const useNotifystore = create<NotificationStore>((set) => ({
  cache: {
    data: [],
    unreadCount: 0,
    loading: false,
    loaded: false,
    error: null,
  },

  LoadNotify: (data) =>
    set((state) => {
      const notifications = data ?? [];

      const unreadCount = notifications.filter((n) => !n.readAt).length;

      return {
        cache: {
          ...state.cache,
          data: notifications,
          unreadCount,
          loading: false,
          loaded: true,
          error: null,
        },
      };
    }),

  addNotify: (payload) =>
    set((state) => {
      if (state.cache.data.some((n) => n._id === payload._id)) {
        return state;
      }

      const data = [...state.cache.data, payload];

      return {
        cache: {
          ...state.cache,
          data,
          unreadCount: data.filter((n) => !n.readAt).length,
        },
      };
    }),

  setNotifyPending: (pending) =>
    set((state) => ({
      cache: {
        ...state.cache,
        loading: pending,
        error: null,
      },
    })),

  setNotifyError: (error) =>
    set((state) => ({
      cache: {
        ...state.cache,
        loading: false,
        error,
      },
    })),

  markAsRead: (id) =>
    set((state) => {
      const notification = state.cache.data.find((n) => n._id === id);

      // Already read → don't change unread count
      if (!notification || notification.readAt) {
        return state;
      }

      const data = state.cache.data.map((notification) =>
        notification._id === id
          ? {
              ...notification,
              readAt: new Date().toISOString(),
            }
          : notification,
      );

      return {
        cache: {
          ...state.cache,
          data,
          unreadCount: Math.max(0, state.cache.unreadCount - 1),
        },
      };
    }),

  restoreNotify: (notification) =>
    set((state) => ({
      cache: {
        ...state.cache,
        data: state.cache.data.map((n) =>
          n._id === notification._id ? notification : n,
        ),
      },
    })),

  updateNotify: ({ id, action }) =>
    set((state) => {
      const data = state.cache.data.map((n) =>
        n._id === id
          ? {
              ...n,
              action,
              readAt: action === "read" ? new Date().toISOString() : n.readAt,
            }
          : n,
      );

      return {
        cache: {
          ...state.cache,
          data,
          unreadCount: data.filter((n) => !n.readAt).length,
        },
      };
    }),

  removeNotify: ({ id }) =>
    set((state) => {
      const data = state.cache.data.filter((n) => n._id !== id);

      return {
        cache: {
          ...state.cache,
          data,
          unreadCount: data.filter((n) => !n.readAt).length,
        },
      };
    }),
}));
