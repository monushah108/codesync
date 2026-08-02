import { useCallback, useEffect } from "react";
import { socket } from "../socket";
import { useCodestore } from "../store/Codestore";
import { useNotifystore } from "../store/Notifystore";
import { useRoomStore } from "../store/Roomstore";

export default function useNotifySocket() {
  const user = useCodestore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    socket.emit("notify:join", {
      userId: user.id,
    });

    const handleNotify = ({ payload }) => {
      useNotifystore.getState().addNotify(payload);
      // useRoomStore.getState().loadRooms(useRoomStore.getState().rooms);
    };

    const handleOperation = ({ payload }) => {
      const store = useNotifystore.getState();

      const { id, action, roomId, senderId, receiverId } = payload;

      switch (action) {
        case "read":
          store.updateNotify({ id, action });
          break;

        // case "accepted": {
        //   store.removeNotify({ id });

        //   store.addNotify({
        //     _id: crypto.randomUUID(),
        //     senderId,
        //     receiverId,
        //     roomId,
        //     type: "request",
        //     action,
        //     isRead: false,
        //     message:
        //       action === "accepted"
        //         ? "Your request was accepted"
        //         : "Your request was declined",
        //     createdAt: new Date(),
        //   });

        //   useRoomStore.getState().loadRooms(useRoomStore.getState().rooms);
        //   useRoomStore.getState().addRoom({

        //   }
        //   break;

        // case "declined":
        //   store.removeNotify({ id });
        //   store.addNotify({
        //     _id: crypto.randomUUID(),
        //     senderId,
        //     receiverId,
        //     roomId,
        //     type: "request",
        //     action,
        //     isRead: false,
        //     message: "Your request was declined",
        //     createdAt: new Date(),
        //   });

        //   break;

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
  const applyNotify = useCallback(
    (receiverId, payload) => {
      if (!user || !receiverId) return;

      socket.emit("notify", {
        receiverId,
        payload,
      });
    },
    [user],
  );

  const notifyOperation = useCallback(
    (receiverId, payload) => {
      if (!user || !receiverId) return;

      socket.emit("notify:operation", {
        receiverId,
        payload,
      });
    },
    [user],
  );

  return {
    applyNotify,
    notifyOperation,
  };
}
