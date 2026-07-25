import { api } from "./client";

/* ------------ Load notification -------------- */

export async function fetchNotify() {
  const { data } = await api.get("api/notify", {
    withCredentials: true,
  });
  return data;
}

/* ------------ send notification -------------- */

export async function sendNotify({ payload }) {
  const { data } = await api.post("api/notify", {
    body: { payload },
    withCredentials: true,
  });

  return data;
}
