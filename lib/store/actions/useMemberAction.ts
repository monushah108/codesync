// lib/store/actions/useMemberAction.ts

import * as MemberApi from "@/lib/api/memberApi";
import { socket } from "@/lib/socket";
import { useMemberStore } from "../Memberstore";
import { useCodestore } from "../Codestore";
import { useNotificationActions } from "./useNotificationAction";
import type { MemberActionsMethods, Member } from "./types";
import type { MemberData } from "@/lib/api/memberApi";

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
    return (err as any).message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}

export const useMemberActions: MemberActionsMethods = {
  async loadMembers(roomId: string): Promise<void> {
    if (!roomId) return;

    const store = useMemberStore.getState();
    store.setLoading(true);

    try {
      const data = await MemberApi.GetRoomMembers(roomId);
      if (data) {
        store.setMembers(data.members || []);
        if (data.currentRole) {
          store.setCurrentRole(data.currentRole);
          useCodestore.getState().setRole(data.currentRole);
        }
      }
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, "Failed to load members");
      store.setError(msg);
      useNotificationActions.error("Member Error", msg, "Room Access");
    } finally {
      store.setLoading(false);
    }
  },

  async LoadMembers(roomId?: string): Promise<void> {
    if (roomId) {
      return this.loadMembers(roomId);
    }
  },

  async changeRole(
    roomId: string,
    member: MemberData | Member,
    newRole: "editor" | "viewer",
  ): Promise<boolean> {
    const store = useMemberStore.getState();
    store.setActionLoadingId(member._id);

    try {
      await MemberApi.UpdateMember(member._id, { role: newRole });

      store.updateMemberRole(member._id, newRole);

      useNotificationActions.success(
        "Role Updated",
        `Updated ${member.name}'s role to ${newRole}`,
        "Room Access",
      );

      // Real-time broadcast to room participants via socket
      socket.emit("member:role-update", {
        roomId,
        targetUserId: member.userId,
        newRole,
        memberName: member.name,
      });

      return true;
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, "Failed to update member role");
      useNotificationActions.error("Role Update Failed", msg, "Room Access");
      return false;
    } finally {
      store.setActionLoadingId(null);
    }
  },

  async toggleBan(
    roomId: string,
    member: MemberData | Member,
  ): Promise<boolean> {
    const store = useMemberStore.getState();
    const nextBanStatus = !member.banned;
    store.setActionLoadingId(member._id);

    try {
      await MemberApi.UpdateMember(member._id, { banned: nextBanStatus });

      store.updateMemberBanned(member._id, nextBanStatus);

      if (nextBanStatus) {
        useNotificationActions.warning(
          "Member Banned",
          `Banned ${member.name} from the room.`,
          "Room Access",
        );

        socket.emit("member:kick", {
          roomId,
          targetUserId: member.userId,
          reason: "banned",
          memberName: member.name,
        });
      } else {
        useNotificationActions.success(
          "Member Unbanned",
          `Unbanned ${member.name}.`,
          "Room Access",
        );
      }

      return true;
    } catch (err: unknown) {
      const msg = extractErrorMessage(
        err,
        `Failed to ${nextBanStatus ? "ban" : "unban"} member`,
      );
      useNotificationActions.error("Ban Action Failed", msg, "Room Access");
      return false;
    } finally {
      store.setActionLoadingId(null);
    }
  },

  async ban(roomId: string, memberId: string): Promise<void> {
    const store = useMemberStore.getState();
    const member = store.members.find((m) => m._id === memberId);
    if (member) {
      await this.toggleBan(roomId, member);
    }
  },

  async removeMember(
    roomId: string,
    member: MemberData | Member,
  ): Promise<boolean> {
    const store = useMemberStore.getState();
    store.setActionLoadingId(member._id);

    try {
      await MemberApi.DeleteMember(member._id);

      store.removeMember(member._id);

      useNotificationActions.warning(
        "Member Removed",
        `Removed ${member.name} from the room.`,
        "Room Access",
      );

      socket.emit("member:kick", {
        roomId,
        targetUserId: member.userId,
        reason: "removed",
        memberName: member.name,
      });

      return true;
    } catch (err: unknown) {
      const msg = extractErrorMessage(err, "Failed to remove member");
      useNotificationActions.error("Remove Member Failed", msg, "Room Access");
      return false;
    } finally {
      store.setActionLoadingId(null);
    }
  },

  async remove(roomId: string, memberId: string): Promise<void> {
    const store = useMemberStore.getState();
    const member = store.members.find((m) => m._id === memberId);
    if (member) {
      await this.removeMember(roomId, member);
    }
  },
};

export const MemberActions = useMemberActions;
