import { apiClient } from "./client.js";

export const saveProfile = async (payload) => {
  const { data } = await apiClient.put("/api/profile/save", payload);
  return data;
};
