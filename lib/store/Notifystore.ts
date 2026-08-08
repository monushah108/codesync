import { create } from "zustand";
import type { NotificationStore } from "../store/types/notifyTypes";

export const useNotifystore = create<NotificationStore>((set) => ({
  cache: {
    data: [],
    unreadCount: 0,
    loading: false,
    loaded: false,
    error: null,
  },

  /* ---------------- LOAD ---------------- */

  LoadNotify: (data) =>
    set(() => {
      const unreadCount = data.filter(
        (notification) => !notification.readAt,
      ).length;

      return {
        cache: {
          data,
          unreadCount,
          loading: false,
          loaded: true,
          error: null,
        },
      };
    }),

  /* ---------------- ADD ---------------- */

  addNotify: (notification) =>
    set((state) => {
      const exists = state.cache.data.some((n) => n._id === notification._id);

      if (exists) {
        return state;
      }

      const data = [...state.cache.data, notification];

      return {
        cache: {
          ...state.cache,

          data,

          unreadCount: data.filter((n) => !n.readAt).length,
        },
      };
    }),

  /* ---------------- LOADING ---------------- */

  setNotifyPending: (pending) =>
    set((state) => ({
      cache: {
        ...state.cache,

        loading: pending,

        // Don't set loaded=false
        // when a refresh starts.
        error: null,
      },
    })),

  /* ---------------- ERROR ---------------- */

  setNotifyError: (error) =>
    set((state) => ({
      cache: {
        ...state.cache,

        loading: false,

        error,
      },
    })),

  /* ---------------- READ ---------------- */

  markAsRead: (id) =>
    set((state) => {
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

          unreadCount: data.filter((n) => !n.readAt).length,
        },
      };
    }),

  /* ---------------- RESTORE ---------------- */

  restoreNotify: (notification) =>
    set((state) => ({
      cache: {
        ...state.cache,

        data: state.cache.data.map((n) =>
          n._id === notification._id ? notification : n,
        ),
      },
    })),

  /* ---------------- UPDATE ---------------- */

  updateNotify: ({ id, action }) =>
    set((state) => {
      const data = state.cache.data.map((notification) =>
        notification._id === id
          ? {
              ...notification,

              action,

              ...(action === "read"
                ? {
                    readAt: notification.readAt ?? new Date().toISOString(),
                  }
                : {}),
            }
          : notification,
      );

      return {
        cache: {
          ...state.cache,

          data,

          unreadCount: data.filter((n) => !n.readAt).length,
        },
      };
    }),

  /* ---------------- REMOVE ---------------- */

  removeNotify: ({ id }) =>
    set((state) => {
      const data = state.cache.data.filter(
        (notification) => notification._id !== id,
      );

      return {
        cache: {
          ...state.cache,

          data,

          unreadCount: data.filter((n) => !n.readAt).length,
        },
      };
    }),
}));
