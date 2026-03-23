import { create } from "zustand";
import { api } from "../api/api";

// ── Guest cart helpers (localStorage) ──────────────────────────
const GUEST_KEY = "nx_guest_cart";

const loadGuest = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
  } catch {
    return [];
  }
};
const saveGuest = (items) =>
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
const clearGuest = () => localStorage.removeItem(GUEST_KEY);

export const useCartStore = create((set, get) => ({
  items: [],
  isLoading: false,

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  // ─── Backend se cart load ─────────────────────
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/cart");
      set({ items: res.data.cart.items || [] });
    } catch {
      set({ items: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── Add to cart ──────────────────────────────
  addToCart: async (product, isAuthenticated = true) => {
    const { items } = get();
    const existing = items.find((i) => i.productId === product.productId);

    if (existing) {
      set({
        items: items.map((i) =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        ),
      });
    } else {
      set({ items: [...items, { ...product, quantity: 1 }] });
    }

    if (!isAuthenticated) {
      saveGuest(get().items);
      return;
    }

    try {
      const res = await api.post("/cart", product);
      set({ items: res.data.cart.items || [] });
    } catch (err) {
      set({ items });
      throw err;
    }
  },

  // ─── Quantity update (authenticated) ─────────
  updateQuantity: async (productId, quantity) => {
    const prevItems = get().items;
    set({
      items: prevItems.map((i) =>
        i.productId === productId ? { ...i, quantity } : i,
      ),
    });
    try {
      const res = await api.put(`/cart/${productId}`, { quantity });
      set({ items: res.data.cart.items || [] });
    } catch (err) {
      set({ items: prevItems });
      throw err;
    }
  },

  // ─── Quantity update (guest) ──────────────────
  updateGuestQuantity: (productId, quantity) => {
    const updated = get().items.map((i) =>
      i.productId === productId ? { ...i, quantity } : i,
    );
    set({ items: updated });
    saveGuest(updated);
  },

  // ─── Remove item (authenticated) ──────────────
  removeFromCart: async (productId) => {
    const prevItems = get().items;
    set({ items: prevItems.filter((i) => i.productId !== productId) });
    try {
      const res = await api.delete(`/cart/${productId}`);
      set({ items: res.data.cart.items || [] });
    } catch (err) {
      set({ items: prevItems });
      throw err;
    }
  },

  // ─── Remove item (guest) ──────────────────────
  removeFromGuestCart: (productId) => {
    const updated = get().items.filter((i) => i.productId !== productId);
    set({ items: updated });
    saveGuest(updated);
  },

  // ─── Clear cart (authenticated) ───────────────
  clearCart: async () => {
    const prevItems = get().items;
    set({ items: [] });
    try {
      await api.delete("/cart");
    } catch (err) {
      set({ items: prevItems });
      throw err;
    }
  },

  // ─── Guest cart merge — LOGIN ke baad ─────────
  // IMPORTANT: yeh function tab call hona chahiye jab cookie already set ho chuki ho
  // useAuthStore.login() mein set({ isAuthenticated: true }) ke BAAD await karo
  mergeGuestCart: async () => {
    const guestItems = loadGuest();

    // localStorage mein kuch nahi → sirf backend cart fetch karo
    if (!guestItems || guestItems.length === 0) {
      await get().fetchCart();
      return;
    }

    // cartController ke validateItem ke mutabiq required fields bhejo
    const itemsToMerge = guestItems.map((item) => ({
      productId: item.productId, // Number
      title: item.title, // String required
      price: item.price, // Number required
      image: item.image, // String required
      brand: item.brand || "",
      category: item.category || "",
      rating: item.rating || 0,
      weight: item.weight || 0,
      quantity: item.quantity || 1,
    }));

    try {
      const res = await api.post("/cart/merge", { items: itemsToMerge });
      set({ items: res.data.cart.items || [] });
      clearGuest();
    } catch (err) {
      console.error(
        "[Cart] mergeGuestCart failed:",
        err?.response?.data || err.message,
      );
      // Merge fail → sirf backend cart load karo, localStorage clear karo
      await get().fetchCart();
      clearGuest();
    }
  },

  // ─── Load guest cart into state (login page pe badge ke liye) ─
  loadGuestCart: () => {
    set({ items: loadGuest() });
  },

  // ─── Local only reset (logout pe) ─────────────
  resetCart: () => {
    set({ items: [] });
    clearGuest();
  },
}));
