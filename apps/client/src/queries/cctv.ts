import { apiClient } from "@/axios";

export async function fetchCctvs(orgId: string) {
  const { data } = await apiClient.get(`/cctv/getall?organization=${orgId}`);
  console.log("data", data)
  return data.cctvs;
}

export async function createCctv(cctvData: ICctv) {
  const { data } = await apiClient.post("/cctv", cctvData);
  return data;
}
