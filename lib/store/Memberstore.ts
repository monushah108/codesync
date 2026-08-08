import { create } from "zustand";
import type { MemberStore, MemberRole } from "../store/types/memberTypes";

export const useMemberStore = create<MemberStore>((set) => ({
  data: {},

  user: null,

  loading: false,

  error: null,

  /* ---------------- USER ---------------- */

  setUser: (user) =>
    set({
      user,
    }),

  /* ---------------- MEMBERS ---------------- */

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

  /* ---------------- ADD MEMBER ---------------- */

  addMembers: (roomId, member) =>
    set((state) => {
      const members = state.data[roomId] ?? [];

      // Prevent duplicate member
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

  /* ---------------- LIVE ---------------- */

  setMemberLive: (roomId, memberId, isLive) =>
    set((state) => ({
      data: {
        ...state.data,

        [roomId]:
          state.data[roomId]?.map((member) =>
            member._id === memberId
              ? {
                  ...member,
                  isLive,
                }
              : member,
          ) ?? [],
      },
    })),

  /* ---------------- ROLE ---------------- */

  updateRole: (roomId, memberId, role) =>
    set((state) => ({
      data: {
        ...state.data,

        [roomId]:
          state.data[roomId]?.map((member) =>
            member._id === memberId
              ? {
                  ...member,
                  role,
                }
              : member,
          ) ?? [],
      },
    })),

  /* ---------------- RESTORE ---------------- */

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

  /* ---------------- BAN ---------------- */

  banMember: (roomId, memberId) =>
    set((state) => ({
      data: {
        ...state.data,

        [roomId]:
          state.data[roomId]?.map((member) =>
            member._id === memberId
              ? {
                  ...member,
                  banned: true,
                }
              : member,
          ) ?? [],
      },
    })),

  /* ---------------- REMOVE ---------------- */

  removeMember: (roomId, memberId) =>
    set((state) => ({
      data: {
        ...state.data,

        [roomId]:
          state.data[roomId]?.filter((member) => member._id !== memberId) ?? [],
      },
    })),
}));
