import { apiClient } from "@/axios";

export async function fetchCctvs(orgId: string) {
  const { data } = await apiClient.get(`/cctv/getall?organization=${orgId}`);
  return data.cctvs;
}

export async function createCctv(cctvData: ICctv) {
  const { data } = await apiClient.post("/cctv", cctvData);
  return data;
}

export async function updateCctvStatus(cctvData: ICctv) {
  const { data } = await apiClient.put(`/cctv`, cctvData);
  return data;
}
