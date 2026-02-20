import { api } from "./http";

export const AuthAPI = {
  login(data: { email: string; password: string }) {
    return api.post("/auth/login", data);
  },

  register(data: { email: string; password: string }) {
    return api.post("/auth/register", data);
  },

  refresh(refreshToken: string) {
    return api.post("/auth/refresh", { refreshToken });
  },

  logout(refreshToken: string) {
    return api.post("/auth/logout", { refreshToken });
  },
};

export const TaskAPI = {
  list(params?: {
    page?: number;
    limit?: number;
    status?: "completed" | "pending";
    search?: string;
  }) {
    return api.get("/tasks", { params });
  },

  create(data: { title: string }) {
    return api.post("/tasks", data);
  },

  update(id: string, data: { title?: string; completed?: boolean }) {
    return api.patch(`/tasks/${id}`, data);
  },

  toggle(id: string) {
    return api.patch(`/tasks/${id}/toggle`);
  },

  remove(id: string) {
    return api.delete(`/tasks/${id}`);
  },
};
