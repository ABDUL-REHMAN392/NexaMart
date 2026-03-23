import { create } from "zustand";
import { api } from "../api/api";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/notifications");
      set({
        notifications: res.data.notifications,
        unreadCount: res.data.unreadCount,
      });
    } catch (err) {
      console.error("fetchNotifications error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // Socket se real-time aaye — duplicate check karo
  addNotification: (notification) => {
    set((state) => {
      const alreadyExists = state.notifications.some(
        (n) => n._id === notification._id,
      );
      if (alreadyExists) return state;

      return {
        notifications: [notification, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + 1,
      };
    });
  },

  // Ek read mark karo — optimistic
  markAsRead: async (id) => {
    const prev = get().notifications;
    const prevCount = get().unreadCount;

    // Pehle check karo ke yeh notification unread hai ya nahi
    const notification = prev.find((n) => n._id === id);
    if (!notification || notification.read) return; // already read hai — kuch mat karo

    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));

    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error("markAsRead error:", err);
      set({ notifications: prev, unreadCount: prevCount });
    }
  },

  // Sab read mark karo — optimistic
  markAllAsRead: async () => {
    const prev = get().notifications;
    const prevCount = get().unreadCount;

    // Agar pehle se sab read hain toh API call mat karo
    if (prevCount === 0) return;

    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));

    try {
      await api.patch("/notifications/read-all");
      // API succeed — optimistic update sahi tha, kuch aur karne ki zaroorat nahi
    } catch (err) {
      console.error("markAllAsRead error:", err);
      // Rollback only on failure
      set({ notifications: prev, unreadCount: prevCount });
    }
  },

  // Ek delete — optimistic
  deleteNotification: async (id) => {
    const prev = get().notifications;
    const target = prev.find((n) => n._id === id);
    const wasUnread = target?.read === false;

    set((state) => ({
      notifications: state.notifications.filter((n) => n._id !== id),
      unreadCount: wasUnread
        ? Math.max(0, state.unreadCount - 1)
        : state.unreadCount,
    }));

    try {
      await api.delete(`/notifications/${id}`);
    } catch (err) {
      console.error("deleteNotification error:", err);
      set({ notifications: prev });
    }
  },

  // Sab delete — optimistic
  deleteAllNotifications: async () => {
    const prev = get().notifications;
    set({ notifications: [], unreadCount: 0 });
    try {
      await api.delete("/notifications");
    } catch (err) {
      console.error("deleteAllNotifications error:", err);
      set({ notifications: prev });
    }
  },

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));
