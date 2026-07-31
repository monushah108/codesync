import { create } from "zustand";
import { RoomStore } from "./types";
import { useCodestore } from "./Codestore";

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  deletedRooms: [],
  loading: false,

  error: null,

  LoadRooms: (data) => {
    set((state) => ({
      rooms: data,
    }));
  },

  addRoom: (data) => {
    const user = useCodestore.getState().user;
    set((state) => ({
      ...state.rooms,
      rooms: [
        ...state.rooms,
        { ...data, members: [user || null], lastOpened: null },
      ],
    }));
  },

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

  // Delete
  deleteRoom: (roomId) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room._id !== roomId),
    })),

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

  restoreRoom: (roomId) =>
    set((state) => {
      const room = state.deletedRooms.find((r) => r._id === roomId);

      return room
        ? {
            rooms: [room, ...state.rooms],
            deletedRooms: state.deletedRooms.filter((r) => r._id !== roomId),
          }
        : state;
    }),
}));
