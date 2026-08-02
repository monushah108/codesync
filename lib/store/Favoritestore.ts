import { create } from "zustand";
import { Member } from "./types";

interface FavoriteStore {
  favorites: Member[];
  loading: boolean;
  error: string | null;

  setFavorites: (favorites: Member[]) => void;
  addFavorite: (member: Member) => void;
  removeFavorite: (memberId: string) => void;
  toggleFavorite: (member: Member) => void;

  isFavorite: (memberId: string) => boolean;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  loading: false,
  error: null,

  setFavorites: (favorites) =>
    set({
      favorites,
    }),

  addFavorite: (member) =>
    set((state) => {
      if (state.favorites.some((m) => m._id === member._id)) {
        return state;
      }

      return {
        favorites: [...state.favorites, member],
      };
    }),

  removeFavorite: (memberId) =>
    set((state) => ({
      favorites: state.favorites.filter(
        (member) => member._id !== memberId
      ),
    })),

  toggleFavorite: (member) =>
    set((state) => {
      const exists = state.favorites.some(
        (m) => m._id === member._id
      );

      if (exists) {
        return {
          favorites: state.favorites.filter(
            (m) => m._id !== member._id
          ),
        };
      }

      return {
        favorites: [...state.favorites, member],
      };
    }),

  isFavorite: (memberId) =>
    get().favorites.some(
      (member) => member._id === memberId
    ),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  clearFavorites: () =>
    set({
      favorites: [],
      error: null,
    }),
}));