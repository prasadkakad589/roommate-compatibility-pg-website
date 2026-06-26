import { io } from "socket.io-client";

const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(baseUrl, {
      transports: ["websocket", "polling"],
    });
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

