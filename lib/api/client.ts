// lib/api/client.ts

import axios from "axios";
import { ApiError } from "./codeApi";

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject({
      status: error.response?.status ?? 500,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message,
      data: error.response?.data,
    } satisfies ApiError);
  },
);
