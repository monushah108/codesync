import { create } from "zustand";
import { RoomStore } from "./types";

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],

  activeRoom: null,

  inviteRoomId: null,

  loading: false,

  error: null,

  setRooms: (rooms) =>
    set({
      rooms,
    }),

  // Open Room
  openRoom: (room) =>
    set({
      activeRoom: room,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  // Rename
  renameRoom: (roomId, newName) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room._id === roomId
          ? {
              ...room,
              newName,
            }
          : room,
      ),
    })),

  // Duplicate
  duplicateRoom: (roomId) =>
    set((state) => {
      const room = state.rooms.find((r) => r._id === roomId);

      if (!room) return state;

      const duplicate: Room = {
        ...room,
        _id: crypto.randomUUID(),
        name: `${room.name} Copy`,
        createdAt: new Date().toISOString(),
      };

      return {
        rooms: [duplicate, ...state.rooms],
      };
    }),

  // Delete
  deleteRoom: (roomId) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room._id !== roomId),
    })),

  // Invite Members
  setInviteRoom: (roomId) =>
    set({
      inviteRoomId: roomId,
    }),

  // Share Link
  generateShareLink: (roomId, token) => {
    const link = `${window.location.origin}/room/${token}`;

    set((state) => ({
      rooms: state.rooms.map((room) =>
        room._id === roomId
          ? {
              ...room,
              shareLink: link,
            }
          : room,
      ),
    }));

    return link;
  },

  clearActiveRoom: () =>
    set({
      activeRoom: null,
    }),
}));
