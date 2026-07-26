import { api } from "./client";

/* ------------ Load notification -------------- */

export async function fetchNotify() {
  const { data } = await api.get("/api/notify", {
    withCredentials: true,
  });
  return data;
}

/* ------------ send notification -------------- */

export async function sendNotify(payload) {
  const { data } = await api.post(
    "/api/notify",
    { ...payload },
    {
      withCredentials: true,
    },
  );

  return data;
}

/* ------------------ update ------------------- */

export async function updateNotify(payload) {
  const { id, action, message, isRead } = payload;
  const { data } = await api.patch(
    `/api/notify/${id}`,
    {
      action,
      message,
      isRead,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}

/* ------------------ delete ------------------- */

export async function removeNotify({ id }) {
  const { data } = await api.delete(`/api/notify/${id}`, {
    withCredentials: true,
  });

  return data;
}
