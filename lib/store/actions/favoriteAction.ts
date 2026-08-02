// actions/favoriteAction.ts

import {
  addFavorite as addFavoriteApi,
  getFavorites,
  removeFavorite as removeFavoriteApi,
} from "@/lib/api/favoriteApi";
import { useFavoriteStore } from "../Favoritestore";

export async function loadFavorites() {
  const store = useFavoriteStore.getState();

  try {
    store.setLoading(true);
    store.setError(null);

    const favorites = await getFavorites();

    store.setFavorites(favorites);
  } catch (error) {
    console.error(error);
    store.setError("Failed to load favorites");
  } finally {
    store.setLoading(false);
  }
}

export async function addFavorite(userId: string) {
  const store = useFavoriteStore.getState();

  try {
    store.setLoading(true);
    store.setError(null);

    const favorite = await addFavoriteApi({ userId });

    store.addFavorite(favorite);

    return favorite;
  } catch (error) {
    console.error(error);
    store.setError("Failed to add favorite");
    throw error;
  } finally {
    store.setLoading(false);
  }
}

export async function removeFavorite(userId: string) {
  const store = useFavoriteStore.getState();

  try {
    store.setLoading(true);
    store.setError(null);

    await removeFavoriteApi({ userId });

    store.removeFavorite(userId);
  } catch (error) {
    console.error(error);
    store.setError("Failed to remove favorite");
    throw error;
  } finally {
    store.setLoading(false);
  }
}

export async function toggleFavorite(userId: string, isFavorite: boolean) {
  if (isFavorite) {
    await removeFavorite(userId);
  } else {
    await addFavorite(userId);
  }
}
