export interface MemberData {
  _id: string;
  userId: string;
  name: string;
  email: string;
  image: string;
  role: "owner" | "editor" | "viewer";
  banned: boolean;
  joinedAt?: string | Date;
  lastActiveAt?: string | Date;
  isOwner: boolean;
}

export interface RoomMembersResponse {
  members: MemberData[];
  isOwner: boolean;
  currentRole: "owner" | "editor" | "viewer";
}

export const GetRoomMembers = async (
  roomId: string,
): Promise<RoomMembersResponse> => {
  const res = await fetch(`/api/member?roomId=${roomId}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to get room members");
  }
  return json;
};

export const UpdateMember = async (
  memberId: string,
  data: { role?: string; banned?: boolean },
) => {
  const res = await fetch(`/api/member/${memberId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to update member");
  }
  return json;
};

export const DeleteMember = async (memberId: string) => {
  const res = await fetch(`/api/member/${memberId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to delete member");
  }
  return json;
};

export const GetMember = async (memberId: string) => {
  const res = await fetch(`/api/member/${memberId}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Failed to get member");
  }
  return json;
};