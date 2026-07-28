import { api } from "./client";

export const GetsharedRoom = async ({ token }: { token: string }) => {
  const { data } = await api.get(`/api/share/${token}`, {
    withCredentials: true,
  });

  return data;
};

export const getLink = async ({ roomId }: { roomId: string }) => {
  const { data } = await api.post(
    "/api/share",
    {
      roomId,
    },
    {
      withCredentials: true,
    },
  );

  return data;
};
