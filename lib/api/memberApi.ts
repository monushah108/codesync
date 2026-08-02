import { api } from "./client";

export async function getMembers({ roomId }: { roomId: string }) {
  const { data } = await api.get(
    `api/member/${roomId}`,
    {
      params: roomId,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}
export async function getManyMembers() {
  const { data } = await api.get(`api/member`, {
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

export async function updateRole({ payload }: { payload: any }) {
  const { userId } = payload;
  const { data } = api.patch(
    `api/member/${userId}`,
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
