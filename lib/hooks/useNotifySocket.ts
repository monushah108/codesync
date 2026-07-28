import { useCallback, useEffect } from "react";
import { socket } from "../socket";
import { useCodestore } from "../store/Codestore";
import { useNotifystore } from "../store/Notifystore";

export default function useNotifySocket() {
  const user = useCodestore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    socket.emit("notify:join", {
      userId: user.id,
    });

    const handleNotify = ({ payload }) => {
      const store = useNotifystore.getState();

      const exists = store.cache?.data?.some((n) => n._id === payload._id);

      if (!exists) {
        store.addNotify(payload);
      }
    };

    const handleOperation = ({ payload }) => {
      const store = useNotifystore.getState();

      const { id, action, type } = payload;

      switch (type) {
        case "read":
          store.updateNotify({ id, action });
          break;

        case "accepted":
        case "declined":
          store.updateNotify({ id, action });
          store.removeNotify({ id });
          break;

        case "system":
        case "ban":
          store.updateNotify({ id, action });
          break;

        default:
          break;
      }
    };

    socket.on("notify", handleNotify);
    socket.on("notify:operation", handleOperation);

    return () => {
      socket.off("notify", handleNotify);
      socket.off("notify:operation", handleOperation);
    };
  }, [user]);

  /**
   * Send a brand new notification.
   * Example: invite user to room.
   */
  const sendNotify = useCallback(
    (payload) => {
      if (!user) return;

      socket.emit("notify", {
        payload,
        userId: user.id,
      });
    },
    [user],
  );

  return {
    sendNotify,
  };
}
