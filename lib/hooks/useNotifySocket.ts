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

    return () => {
      socket.off("notify", handleNotify);
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

  return {
    applyNotify,
  };
}
