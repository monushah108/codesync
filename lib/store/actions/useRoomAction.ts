import { getLink } from "@/lib/api/shareApi";
import { useRoomStore } from "../Roomstore";
import * as RoomApi from "@/lib/api/roomApi";
import { RoomActionsMethods } from "./types";

export const RoomActions: RoomActionsMethods = {
  async loadRooms(): Promise<void> {
    const store = useRoomStore.getState();

    if (store.loading) return;

    store.setLoading(true);

    try {
      const rooms = await RoomApi.GetRooms();

      store.LoadRooms(rooms);
      store.setError(null);
    } catch (err: unknown) {
      store.setError(
        err instanceof Error ? err.message : "Failed to load rooms",
      );
    } finally {
      store.setLoading(false);
    }
  },

  async createRoom(payload: CreateRoomPayload): Promise<void> {
    const store = useRoomStore.getState();

    try {
      const room = await RoomApi.CreateRoom(payload);

      store.addRoom(room);
    } catch (err: unknown) {
      store.setError(
        err instanceof Error ? err.message : "Failed to create room",
      );
    }
  },

  async renameRoom(id: string, newName: string): Promise<void> {
    const store = useRoomStore.getState();

    try {
      await RoomApi.RenameRoom({
        id,
        newName,
      });

      store.updateRoom(id, {
        newName,
      });
    } catch (err: unknown) {
      store.setError(
        err instanceof Error ? err.message : "Failed to rename room",
      );

      store.restoreRoom(id);
    }
  },

  async getRoomLink(roomId: string): Promise<string> {
    const store = useRoomStore.getState();

    try {
      const { token } = await getLink({
        roomId,
      });

      console.log("room link", token);

      store.generateShareLink(roomId, token);

      return token;
    } catch (err: unknown) {
      store.setError(
        err instanceof Error ? err.message : "Failed to generate room link",
      );

      throw err;
    }
  },
};
