import { Room } from "../store/types/roomTypes";
import { api } from "./client";
/* -------------------------------------------------------------------------- */
/*                                    Room                                    */
/* -------------------------------------------------------------------------- */

export async function GetRoomDetails({ roomId }: { roomId: string }) {
  const { data } = await api.get(`/api/playground/${roomId}`, {
    withCredentials: true,
  });

  return data;
}

export async function GetRooms<T>(): Promise<T> {
  const { data } = await api.get("/api/playground", {
    withCredentials: true,
  });

  return data;
}

export async function CreateRoom<T>(payload: Room): Promise<T> {
  const { data } = await api.post(
    "/api/playground",
    { ...payload },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function RenameRoom<T>({
  id,
  newName,
}: {
  id: string;
  newName: string;
}): Promise<T> {
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

export async function DeleteRoom(id: string) {
  const response = await api.delete(`/api/playground/${id}`, {
    withCredentials: true,
  });

  return response;
}
