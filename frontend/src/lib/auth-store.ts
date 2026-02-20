import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "./http";

type State = {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (a: string, r: string) => void;
  refresh: () => Promise<boolean>;
};

export const authStore = create<State>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,

      setTokens: (a, r) => set({ accessToken: a, refreshToken: r }),

      refresh: async () => {
        const refreshToken = get().refreshToken;

        if (!refreshToken) return false;

        try {
          const r = await api.post("/auth/refresh", {
            refreshToken,
          });

          set({ accessToken: r.data.accessToken });
          return true;
        } catch {
          set({ accessToken: null, refreshToken: null });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
