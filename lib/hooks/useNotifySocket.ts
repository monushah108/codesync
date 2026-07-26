import { useCallback, useEffect } from "react";
import { useCodestore } from "../store/Codestore";
import { socket } from "../socket";
import { useNotifystore } from "../store/Notifystore";

export default function useNotifySocket() {
  const user = useCodestore((s) => s.user);

  useEffect(() => {
    if (!user) return;
    /* ------------- join ---------------- */

    socket.emit("notify:join", {
      userId: user.id,
    });

    /* ------------- Add ------------------ */

    const handleNotify = ({ payload }) => {
      const store = useNotifystore.getState();

      store.addNotify(payload);
    };

    socket.on("notify", handleNotify);

    const handleOperation = ({ payload }) => {
      switch (payload.type) {
        case "system":
          break;
        case "ban":
          break;
        case ["accepted", "decline"].includes(payload.type):
          break;
        case "readed":
          break;
      }
    };

    socket.on("notify:operation", handleOperation);

    return () => {
      socket.off("notify", handleNotify);
      socket.off("notify:operation", handleOperation);
    };
  }, [user]);

  const applyNotify = useCallback(
    (payload) => {
      if (!user) return;

      socket.emit("notify", {
        payload,
        userId: user.id,
      });
    },
    [user],
  );

  const applyOperation = useCallback(
    (payload) => {
      if (!user) return;
      socket.emit("notify:operation", {
        payload,
        userId: user.id,
      });
    },
    [user],
  );

  return {
    applyNotify,
    applyOperation,
  };
}
