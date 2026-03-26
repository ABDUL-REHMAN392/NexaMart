import { create } from 'zustand';
import { api } from '../api/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  getMe: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.get('/auth/me');
      set({ user: res.data.user, isAuthenticated: true });
      return res.data.user; // ← OAuthSuccess guard ke liye zaroori
    } catch {
      set({ user: null, isAuthenticated: false });
      throw new Error('Not authenticated'); // ← catch propagate ho
    } finally {
      set({ isLoading: false });
    }
  },

  register: async ({ name, email, password, phone }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password, phone });
      set({ user: res.data.user, isAuthenticated: true });

      // Guest cart merge
      const { useCartStore } = await import('./useCartStore');
      await useCartStore.getState().mergeGuestCart();

      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      set({ user: res.data.user, isAuthenticated: true });

      // Guest cart merge — login ke BAAD, cookie set hone ke baad
      const { useCartStore } = await import('./useCartStore');
      await useCartStore.getState().mergeGuestCart();

      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    finally {
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  updateUser: (updatedUser) => set({ user: updatedUser }),
  clearError: () => set({ error: null }),
}));