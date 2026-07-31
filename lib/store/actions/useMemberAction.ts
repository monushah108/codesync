import * as MemberApi from "@/lib/api/memberApi";
import { MemberRole } from "../types";
import { useMemberStore } from "../Memberstore";

export const MemberActions = {
  async LoadMembers() {
    const { loadMembers, setError, setLoading } = useMemberStore.getState();

    setLoading(true);
    try {
      const data = await MemberApi.getManyMembers();

      loadMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  },

  async getMembers(roomId) {
    const { loadMembers, setError, setLoading } = useMemberStore.getState();

    setLoading(true);
    try {
      const data = await MemberApi.getMembers(roomId);

      loadMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  },

  async inviteMember(roomId: string, memberId: string) {
    const { addMember, setError, restoreMember } = useMemberStore.getState();

    try {
      const data = await MemberApi.addMember({ roomId, userId: memberId });

      addMember(roomId, data);

      return data.member;
    } catch (err) {
      setError(err.message);
      restoreMember(roomId, memberId);
    }
  },

  async changeRole(roomId: string, memberId: string, role: MemberRole) {
    const { updateRole, setError, restoreMember } = useMemberStore.getState();

    try {
      const payload = { memberId, role };
      await MemberApi.updateRole({ roomId, payload });
      updateRole(roomId, memberId, role);
    } catch (err) {
      setError(err.message);
      restoreMember(roomId, memberId);
    }
  },

  async ban(roomId: string, memberId: string) {
    const { banMember, setError, restoreMember } = useMemberStore.getState();
    try {
      const payload = { userId: memberId, banned: true };
      await MemberApi.updateRole({ roomId, payload });
      banMember(roomId, memberId);
    } catch (err) {
      setError(err.message);
      restoreMember(roomId, memberId);
    }
  },

  async remove(roomId: string, memberId: string) {
    const { removeMember, setError, restoreMember } = useMemberStore.getState();

    try {
      await MemberApi.removeMember({ roomId, userId: memberId });
      removeMember(roomId, memberId);
    } catch (err) {
      setError(err.message);
      restoreMember(roomId, memberId);
    }
  },
};
