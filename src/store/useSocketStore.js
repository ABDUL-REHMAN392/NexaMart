import { create } from "zustand";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

// Module level — sirf ek instance poori app mein
let socketInstance = null;
let disconnectTimer = null; // Strict Mode ke liye — turant disconnect mat karo

export const useSocketStore = create((set, get) => ({
  socket: null,
  connected: false,

  connect: () => {
    // Agar disconnect timer chal raha hai — cancel karo (Strict Mode remount)
    if (disconnectTimer) {
      clearTimeout(disconnectTimer);
      disconnectTimer = null;
    }

    // Already connected instance hai — reuse karo
    if (socketInstance?.connected) {
      set({ socket: socketInstance, connected: true });
      return;
    }

    // Instance hai but disconnected — reconnect karo
    if (socketInstance) {
      socketInstance.connect();
      set({ socket: socketInstance });
      return;
    }

    // Naya instance banao
    socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socketInstance.on("connect", () => {
      set({ connected: true });
    });

    socketInstance.on("disconnect", () => {
      set({ connected: false });
    });

    socketInstance.on("connect_error", (err) => {
      console.warn("Socket error:", err.message);
    });

    set({ socket: socketInstance });
  },

  disconnect: () => {
    // Strict Mode mein turant disconnect mat karo
    // 200ms wait karo — agar connect() dobara aaye toh cancel ho jaye
    disconnectTimer = setTimeout(() => {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
      }
      set({ socket: null, connected: false });
      disconnectTimer = null;
    }, 200);
  },
}));
