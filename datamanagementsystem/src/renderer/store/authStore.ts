import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthRole = "staff" | "pos" | "manager" | "admin";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: AuthRole;
  fullName?: string | null;
  isActive: boolean;
};

type AuthState = {
  token?: string;
  user?: AuthUser;
  setAuth: (auth: { token: string; user: AuthUser }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,
      setAuth: ({ token, user }) => set({ token, user }),
      clearAuth: () => set({ token: undefined, user: undefined }),
    }),
    { name: "auth" },
  ),
);

