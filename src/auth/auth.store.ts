import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/usuer.type";

interface AuthState {
  token: string | null;
  perfil: User | null;
  isAuthenticated: boolean;

  login: (token: string) => void;
  logout: () => void;
  savePerfil: (perfil: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      perfil: null,
      isAuthenticated: false,

      login: (token) =>
        set({
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          perfil: null,
          isAuthenticated: false,
        }),

      savePerfil: (perfil) => set({ perfil }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
