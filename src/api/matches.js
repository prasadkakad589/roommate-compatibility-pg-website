import { apiClient } from "./client.js";
import { normalizeMatch } from "../utils/normalizers.js";

export const getMatches = async () => {
  const { data } = await apiClient.get("/api/matches");
  return data.map(normalizeMatch);
};
