import { apiClient } from "@/axios";

export async function fetchCctvs(orgId: string) {
    const {data} = await apiClient.get(`/cctv/get/${orgId}`);
    return data;
}