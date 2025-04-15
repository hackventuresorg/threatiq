import { apiClient } from "@/axios";

export async function fetchCctvs(orgId: string) {
    const {data} = await apiClient.get(`/cctv/get/${orgId}`);
    return data;
}

export async function createCctv(cctvData: ICctv) {
    const {data} = await apiClient.post('/cctv/create', cctvData)
    return data;
}