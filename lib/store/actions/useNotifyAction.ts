import * as notifyApi from "@/lib/api/notifyApi";
import { useNotifystore } from "../Notifystore";
import { NotifyActionMethods } from "./types";

export const useNotifyActions: NotifyActionMethods = {
  /* ---------------- LOAD ---------------- */

  async loadNotify() {
    const store = useNotifystore.getState();

    // Prevent duplicate API calls
    if (store.cache.loaded || store.cache.loading) {
      return;
    }

    store.setNotifyPending(true);

    try {
      const data = await notifyApi.fetchNotify();

      store.LoadNotify(data);
    } catch (err: unknown) {
      store.setNotifyError(
        err instanceof Error ? err.message : "Failed to load notifications",
      );
    } finally {
      store.setNotifyPending(false);
    }
  },

  /* ---------------- SEND ---------------- */

  async sendNotify(payload) {
    const store = useNotifystore.getState();

    try {
      const { data } = await notifyApi.sendNotify(payload);

      store.addNotify(data);

      return data;
    } catch (err: unknown) {
      store.setNotifyError(
        err instanceof Error ? err.message : "Failed to send notification",
      );

      return undefined;
    }
  },

  /* ---------------- UPDATE ---------------- */

  async updateNotify({ id, action }) {
    const store = useNotifystore.getState();

    /*
     * Save previous notification
     * for rollback.
     */
    const previous = store.cache.data.find(
      (notification) => notification._id === id,
    );

    if (!previous) {
      return;
    }

    /*
     * Optimistic update
     */
    store.updateNotify({
      id,
      action,
    });

    try {
      await notifyApi.updateNotify({
        id,
        action,
      });

      /*
       * Accepted / declined notifications
       * can be removed from the list.
       *
       * Read notifications should stay.
       */
      if (action === "accepted" || action === "declined") {
        store.removeNotify({
          id,
        });
      }
    } catch (err: unknown) {
      /*
       * Rollback optimistic update
       */
      store.restoreNotify(previous);

      store.setNotifyError(
        err instanceof Error ? err.message : "Failed to update notification",
      );
    }
  },

  /* ---------------- MARK READ ---------------- */

  async markViewNotify(id) {
    const store = useNotifystore.getState();

    const notification = store.cache.data.find(
      (notification) => notification._id === id,
    );

    /*
     * Already read or doesn't exist.
     * Don't make another API request.
     */
    if (!notification || notification.readAt) {
      return;
    }

    try {
      await notifyApi.updateNotify({
        id,
        action: "read",
      });

      store.markAsRead(id);
    } catch (err: unknown) {
      store.setNotifyError(
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read",
      );
    }
  },
};
