import { create } from "zustand";
import { UserStore } from "@/types/user";
import { persist } from "zustand/middleware";

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: "user-store" }
  )
);
