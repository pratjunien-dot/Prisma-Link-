import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FavoritePersona, PersonaWithColor } from "@/types/prisma";

interface FavoritesState {
  favorites: FavoritePersona[];
  addFavorite: (persona: PersonaWithColor, matrixTheme: string) => void;
  removeFavorite: (id: number) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: [],
      addFavorite: (persona, matrixTheme) => set((state) => {
        if (state.favorites.some(f => f.id === persona.id)) return state;
        return {
          favorites: [...state.favorites, {
            ...persona,
            matrixTheme,
            matrixColor: persona.color,
            savedAt: Date.now()
          }]
        };
      }),
      removeFavorite: (id) => set((state) => ({
        favorites: state.favorites.filter(f => f.id !== id)
      }))
    }),
    { name: "prisma-favorites" }
  )
);
