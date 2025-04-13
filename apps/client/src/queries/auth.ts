import { apiClient } from "@/axios";

export async function login(clerkId: string) {
    const {data} = await apiClient.post('/auth/login', clerkId);
    return data;
}