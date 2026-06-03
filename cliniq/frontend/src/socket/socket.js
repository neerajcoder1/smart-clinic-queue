import { io } from "socket.io-client";

const rawBackend =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "";
const BACKEND_URL = rawBackend.replace(/\/+$/, "");

const socket = io(BACKEND_URL || undefined, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("🔌 Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.warn("🔌 Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("🔌 Socket connection error:", err.message);
});

export default socket;
