import { apiClient } from "./client.js";

export const getMessages = async (receiverId) => {
  const { data } = await apiClient.get(`/api/messages/${receiverId}`);
  return data;
};
