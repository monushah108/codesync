import { create } from "zustand";
import { MemberStore } from "./types";
import { useRoomStore } from "./Roomstore";

export const useMemberStore = create<MemberStore>((set) => ({
  data: {},
  user: {},
  loading: false,
  error: null,
  // set User
  setUser: (user) => set({ user }),
  loadMembers: (members) =>
    set((state) => ({
      data: {
        ...state.data,
        ...members,
      },
    })),
  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),
  addMembers: (roomId, member) =>
    set((state) => {
      const members = state.data[roomId] ?? [];

      if (members.some((m) => m._id === member._id)) {
        return state;
      }

      return {
        data: {
          ...state.data,
          [roomId]: [...members, member],
        },
      };
    }),
  setMemberLive: (roomId, memberId, isLive) =>
    set((state) => ({
      data: {
        ...state.data,
        [roomId]: (state.data[roomId] ?? []).map((member) =>
          member._id === memberId ? { ...member, isLive } : member,
        ),
      },
    })),
  updateRole: (roomId, memberId, role) =>
    set((state) => ({
      data: {
        ...state.data,
        [roomId]:
          state.data[roomId]?.map((member) =>
            member._id === memberId ? { ...member, role } : member,
          ) ?? [],
      },
    })),
  restoreMember: (roomId, memberId) =>
    set((state) => ({
      data: {
        ...state.data,
        [roomId]:
          state.data[roomId]?.map((member) =>
            member._id === memberId
              ? {
                  ...member,
                  banned: false,
                }
              : member,
          ) ?? [],
      },
    })),
  banMember: (roomId, memberId) =>
    set((state) => ({
      data: {
        ...state.data,
        [roomId]:
          state.data[roomId]?.map((member) =>
            member._id === memberId ? { ...member, banned: true } : member,
          ) ?? [],
      },
    })),

  removeMember: (roomId, memberId) => {
    useRoomStore.getState().deleteRoom(roomId);
    set((state) => ({
      data: {
        ...state.data,
        [roomId]:
          state.data[roomId]?.filter((member) => member._id !== memberId) ?? [],
      },
    }));
  },
}));
