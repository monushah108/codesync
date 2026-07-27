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
  id,
  payload,
}: {
  role: string;
  id: string;
}) {
  const { data } = api.patch(
    `api/member/${id}`,
    {
      ...payload,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function removeMember({ id }: { id: string }) {
  const { data } = await api.delete(`api/member/${id}`, {
    withCredentials: true,
  });

  return data;
}
