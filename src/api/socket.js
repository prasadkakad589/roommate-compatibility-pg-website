import { io } from "socket.io-client";

const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;

export const createSocket = () =>
  io(baseUrl, {
    transports: ["websocket", "polling"],
  });
