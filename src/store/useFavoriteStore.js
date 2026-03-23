import { create } from "zustand";
import { api } from "../api/api";

export const useFavoriteStore = create((set, get) => ({
  // ─── State ────────────────────────────────────────────────────────────────
  items: [],
  isLoading: false,
  isClearing: false,

  // ─── Backend se favorites load ────────────────────────────────────────────
  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/favorites");
      set({ items: res.data.favorites || [] });
    } catch (err) {
      console.error("fetchFavorites error:", err);
      set({ items: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── Toggle — add ya remove ───────────────────────────────────────────────
  toggleFavorite: async (product) => {
    const { items } = get();
    const isAlready = items.some((i) => i.productId === product.productId);

    // Optimistic update
    set({
      items: isAlready
        ? items.filter((i) => i.productId !== product.productId)
        : [...items, product],
    });

    try {
      const res = await api.post("/favorites/toggle", product);

      // Backend se exact aur fresh state sync karo
      set({
        items: res.data.isFavorited
          ? [
              ...items.filter((i) => i.productId !== product.productId),
              res.data.favorite,
            ]
          : items.filter((i) => i.productId !== product.productId),
      });
    } catch (err) {
      // Rollback on failure
      set({ items });
      throw err;
    }
  },

  // ─── Saare favorites ek baar mein clear karo ──────────────────────────────
  clearFavorites: async () => {
    const { items } = get();
    set({ isClearing: true });

    // Optimistic clear
    set({ items: [] });

    try {
      await api.delete("/favorites");
    } catch (err) {
      // Rollback
      set({ items });
      throw err;
    } finally {
      set({ isClearing: false });
    }
  },

  // ─── Ek product favorited hai ya nahi ────────────────────────────────────
  isFavorited: (productId) =>
    get().items.some((i) => i.productId === productId),

  // ─── Logout pe reset ─────────────────────────────────────────────────────
  resetFavorites: () => set({ items: [], isLoading: false, isClearing: false }),
}));
