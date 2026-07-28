import { api } from "./client";
/* -------------------------------------------------------------------------- */
/*                                    Room                                    */
/* -------------------------------------------------------------------------- */

export async function GetRooms<T>(): Promise<T> {
  const { data } = await api.get("/api/playground", {
    withCredentials: true,
  });

  return data;
}

export async function CreateRoom<T>(payload): Promise<T> {
  const { data } = await api.post(
    "/api/playground",
    { ...payload },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function UpdateRoom<T>({ id, newName }): Promise<T> {
  const { data } = await api.patch(
    `/api/playground/${id}`,
    {
      newName,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}
