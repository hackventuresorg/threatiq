import { apiClient } from "@/axios";

export async function fetchOrganizations() {
  // const { data } = await apiClient.get("/get-organization");
  return [];
}

export async function createOrganization(org: IOrganizations) {
  const { data } = await apiClient.post("/create-organization", org);
  return data;
}
