import { api } from "./client";

export const GetsharedRoom = async ({ token }: { token: string }) => {
  const { data } = await api.get(`/api/share/${token}`, {
    withCredentials: true,
  });

  return data;
};

export const getLink = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  const { data } = await api.post(
    "/api/share",
    {
      roomId,
      userId,
    },
    {
      withCredentials: true,
    },
  );

  return data;
};
