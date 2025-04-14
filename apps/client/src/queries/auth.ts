import { apiClient } from "@/axios";

export interface UserDetails {
  clerkId: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  fullName?: string | null;
}

export async function login(userDetails: UserDetails) {
  const { data } = await apiClient.post("/auth/login", userDetails);
  return data;
}
