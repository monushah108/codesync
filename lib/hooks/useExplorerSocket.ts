// lib/hooks/useExplorerSocket.ts
import { useCallback } from "react";
import { socket } from "../socket";
import { useExplorerstore } from "../store/Explorerstore";
import { ExplorerOperation, UseExplorerSocket } from "./types";
import { User } from "../store/types/codeTypes";
import { useRoomStore } from "../store/Roomstore";
import { Activity } from "../store/types/explorerTypes";

export const handleMembers = (members: User[]) => {
  useExplorerstore.getState().setMembers(members);
};

export const handleError = ({ message }: { message: string }) => {
  useRoomStore.getState().setError(message);
};

/* ---------------- ACTIVITY ---------------- */
export const handleActivity = (activity: Activity) => {
  const store = useExplorerstore.getState();

  store.setActivity(activity);

  setTimeout(() => {
    useExplorerstore.getState().removeActivity(activity.id);
  }, 5000); // remove after 5 seconds
};

/* ---------------- OPERATIONS ---------------- */

export const handleExplorerOperation = (operation: ExplorerOperation) => {
  const explorer = useExplorerstore.getState();

  switch (operation.type) {
    case "add":
      if (operation.target === "file") {
        explorer.insertFile(operation.payload.parentId, operation.payload.file);
      } else {
        explorer.insertFolder(
          operation.payload.parentId,
          operation.payload.folder,
        );
      }
      break;

    case "update":
      if (operation.target === "file") {
        explorer.updateFile(
          operation.payload.parentId,
          operation.payload.id,
          operation.payload.newName,
        );
      } else {
        explorer.updateFolder(
          operation.payload.parentId,
          operation.payload.id,
          operation.payload.newName,
        );
      }
      break;

    case "remove":
      if (operation.target === "file") {
        explorer.removeFile(operation.payload.parentId, operation.payload.id);
      } else {
        explorer.removeFolder(operation.payload.parentId, operation.payload.id);
      }
      break;
  }
};

export default function useFileEmitter({
  roomId,
  user,
}: {
  roomId: string;
  user: User | null;
}) {
  const applyCreate: UseExplorerSocket["applyCreate"] = useCallback(
    (parentId, item, target) => {
      if (!roomId || !user) return;
      socket.emit("explorer:operation", {
        roomId,
        user,
        type: "add",
        target,
        payload: {
          parentId,
          ...(target === "file" ? { file: item } : { folder: item }),
        },
      });
    },
    [roomId, user],
  );

  const applyUpdate: UseExplorerSocket["applyUpdate"] = useCallback(
    (parentId, id, newName, target) => {
      if (!roomId || !user) return;
      socket.emit("explorer:operation", {
        roomId,
        user,
        type: "update",
        target,
        payload: {
          parentId,
          id,
          newName,
        },
      });
    },
    [roomId, user],
  );

  const applyRemove: UseExplorerSocket["applyRemove"] = useCallback(
    (parentId, id, target, item) => {
      if (!roomId || !user) return;
      socket.emit("explorer:operation", {
        roomId,
        user,
        type: "remove",
        target,
        payload: {
          parentId,
          id,
          [target]: item,
        },
      });
    },
    [roomId, user],
  );

  return {
    applyCreate,
    applyUpdate,
    applyRemove,
  };
}
