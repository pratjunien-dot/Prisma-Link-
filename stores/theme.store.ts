import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeKey } from "@/types/prisma";

interface ThemeState {
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "obsidian",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "prisma-theme" }
  )
);
