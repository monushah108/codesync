import { api } from "./client";

export async function getFavorites() {
  const { data } = await api.get("/api/member/favorite", {
    withCredentials: true,
  });

  return data;
}

export async function addFavorite({ userId }: { userId: string }) {
  const { data } = await api.patch(
    `/api/member/favorite/${userId}`,
    {},
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function removeFavorite({ userId }: { userId: string }) {
  const { data } = await api.delete(`/api/member/favorite/${userId}`, {
    withCredentials: true,
  });

  return data;
}
