import { apiClient } from "@/axios";

export async function fetchThreats(cctvId: string) {
  const { data } = await apiClient.get(`/threat/getall?cctvs=${cctvId}`);
  return data.allThreats;
}