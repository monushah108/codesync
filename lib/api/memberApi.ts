// lib/api/memberApi.ts

import { api } from "./client";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type MemberRole = "owner" | "editor" | "viewer";

export interface MemberData {
  _id: string;
  userId: string;
  name: string;
  email: string;
  image: string;
  role: MemberRole;
  banned: boolean;
  joinedAt?: string | Date;
  lastActiveAt?: string | Date;
  isOwner: boolean;
}

export interface RoomMembersResponse {
  members: MemberData[];
  isOwner: boolean;
  currentRole: MemberRole;
}

export interface UpdateMemberPayload {
  role?: "editor" | "viewer";
  banned?: boolean;
}

export interface UpdateMemberResponse {
  success: boolean;
  member: MemberData;
}

export interface DeleteMemberResponse {
  success: boolean;
  message: string;
}

/* -------------------------------------------------------------------------- */
/*                                 Member API                                 */
/* -------------------------------------------------------------------------- */

export async function GetRoomMembers<T = RoomMembersResponse>(
  roomId: string,
): Promise<T> {
  const { data } = await api.get<T>("/api/member", {
    params: { roomId },
    withCredentials: true,
  });

  return data;
}

export async function UpdateMember<T = UpdateMemberResponse>(
  memberId: string,
  payload: UpdateMemberPayload,
): Promise<T> {
  const { data } = await api.patch<T>(
    `/api/member/${memberId}`,
    payload,
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function DeleteMember<T = DeleteMemberResponse>(
  memberId: string,
): Promise<T> {
  const { data } = await api.delete<T>(`/api/member/${memberId}`, {
    withCredentials: true,
  });

  return data;
}

export async function GetMember<T = MemberData>(
  memberId: string,
): Promise<T> {
  const { data } = await api.get<T>(`/api/member/${memberId}`, {
    withCredentials: true,
  });

  return data;
}

/* -------------------------------------------------------------------------- */
/*                              CamelCase Aliases                             */
/* -------------------------------------------------------------------------- */

export const getRoomMembers = GetRoomMembers;
export const updateMember = UpdateMember;
export const deleteMember = DeleteMember;
export const getMember = GetMember;