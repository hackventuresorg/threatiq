import { apiClient } from "@/axios";

export async function fetchOrganizations() {
  const { data } = await apiClient.get("/api/organization/getall");
  return data;
}

export async function createOrganization(org: IOrganizations) {
  const { data } = await apiClient.post("api/organization", org);
  return data;
}
