import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Persona, Theme } from './types';

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  favoritePersonas: Persona[];
  addFavoritePersona: (persona: Persona) => void;
  removeFavoritePersona: (id: string) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isRadioPlaying: boolean;
  toggleRadio: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      favoritePersonas: [],
      addFavoritePersona: (persona) => set((state) => ({ 
        favoritePersonas: state.favoritePersonas.find(p => p.id === persona.id) 
          ? state.favoritePersonas 
          : [...state.favoritePersonas, persona] 
      })),
      removeFavoritePersona: (id) => set((state) => ({
        favoritePersonas: state.favoritePersonas.filter(p => p.id !== id)
      })),
      isFullscreen: false,
      toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
      isRadioPlaying: false,
      toggleRadio: () => set((state) => ({ isRadioPlaying: !state.isRadioPlaying })),
    }),
    {
      name: 'prisma-link-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        favoritePersonas: state.favoritePersonas 
      }),
    }
  )
);
