import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // ─── Mobile menu ──────────────────────────────
  menuOpen: false,
  showMenu: () => set({ menuOpen: true }),
  hideMenu: () => set({ menuOpen: false }),
}));