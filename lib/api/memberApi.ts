import { api } from "./client";

export async function fetchMember({ roomId }: { roomId: string }) {
  const { data } = await api.get(`api/member`, {
    params: {
      roomId,
    },
    withCredentials: true,
  });

  return data;
}

export async function addMember({
  roomId,
  userId,
}: {
  userId: string;
  roomId: string;
}) {
  const { data } = await api.post(
    `api/member`,
    {
      roomId,
      userId,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function updateRole({
  roomId,
  payload,
}: {
  payload: any;
  roomId: string;
}) {
  const { data } = api.patch(
    `api/member/${roomId}`,
    {
      ...payload,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function removeMember({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  const { data } = await api.delete(`/api/member/${roomId}`, {
    data: {
      userId,
    },
    withCredentials: true,
  });

  return data;
}
