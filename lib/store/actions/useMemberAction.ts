import * as MemberApi from "@/lib/api/memberApi";
import { useMemberStore } from "../Memberstore";
import { MemberActions } from "./types";



export const MemberActions: MemberActions = {
  async LoadMembers(): Promise<void> {
    const { loadMembers, setError, setLoading } = useMemberStore.getState();

    setLoading(true);

    try {
      const data = await MemberApi.getManyMembers();

      loadMembers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load members");
    } finally {
      setLoading(false);
    }
  },

  async invite(roomId: string, memberId: string): Promise<Member | undefined> {
    const { addMember, setError, restoreMember } = useMemberStore.getState();

    try {
      const data = await MemberApi.addMember({
        roomId,
        userId: memberId,
      });

      addMember(roomId, data);

      return data.member;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to invite member");

      restoreMember(roomId, memberId);

      return undefined;
    }
  },

  async changeRole(
    roomId: string,
    memberId: string,
    role: MemberRole,
  ): Promise<void> {
    const { updateRole, setError, restoreMember } = useMemberStore.getState();

    try {
      const payload: UpdateRolePayload = {
        memberId,
        role,
      };

      await MemberApi.updateRole({
        roomId,
        payload,
      });

      updateRole(roomId, memberId, role);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to change member role",
      );

      restoreMember(roomId, memberId);
    }
  },

  async ban(roomId: string, memberId: string): Promise<void> {
    const { banMember, setError, restoreMember } = useMemberStore.getState();

    try {
      const payload: BanMemberPayload = {
        userId: memberId,
        banned: true,
      };

      console.log(roomId, memberId, payload);

      await MemberApi.updateRole({
        roomId,
        payload,
      });

      banMember(roomId, memberId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to ban member");

      restoreMember(roomId, memberId);
    }
  },

  async remove(roomId: string, memberId: string): Promise<void> {
    const { removeMember, setError, restoreMember } = useMemberStore.getState();

    try {
      await MemberApi.removeMember({
        roomId,
        userId: memberId,
      });

      removeMember(roomId, memberId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to remove member");

      restoreMember(roomId, memberId);
    }
  },
};
