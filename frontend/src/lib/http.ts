import axios from "axios";
import { authStore } from "./auth-store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      const refreshed = await authStore.getState().refresh();

      if (refreshed) {
        originalRequest.headers.Authorization = `Bearer ${authStore.getState().accessToken}`;

        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
