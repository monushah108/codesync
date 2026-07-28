import { api } from "./client";

export async function getAnalytics() {
  const { data } = api.get("/api/analytics", {
    withCredentials: true,
  });

  return data;
}
