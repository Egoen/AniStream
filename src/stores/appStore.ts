import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FavoriteItem, HistoryItem } from "@/types/anime";

interface AppState {
  favorites: FavoriteItem[];
  history: HistoryItem[];
  recentSearches: string[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  addHistory: (item: Omit<HistoryItem, "watchedAt">) => void;
  clearHistory: () => void;
  addRecentSearch: (keyword: string) => void;
  clearRecentSearches: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      history: [],
      recentSearches: [],

      addFavorite: (item) =>
        set((s) => {
          const exists = s.favorites.find((f) => f.slug === item.slug);
          if (exists) return s;
          return { favorites: [{ ...item, addedAt: Date.now() }, ...s.favorites] };
        }),

      removeFavorite: (slug) =>
        set((s) => ({ favorites: s.favorites.filter((f) => f.slug !== slug) })),

      isFavorite: (slug) => get().favorites.some((f) => f.slug === slug),

      addHistory: (item) =>
        set((s) => {
          const filtered = s.history.filter((h) => h.episodeSlug !== item.episodeSlug);
          return {
            history: [{ ...item, watchedAt: Date.now() }, ...filtered].slice(0, 100),
          };
        }),

      clearHistory: () => set({ history: [] }),

      addRecentSearch: (keyword) =>
        set((s) => {
          const filtered = s.recentSearches.filter((k) => k !== keyword);
          return { recentSearches: [keyword, ...filtered].slice(0, 8) };
        }),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: "anistream-store" }
  )
);
