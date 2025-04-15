import { apiClient } from "@/axios";

export async function fetchOrganizations() {
  const { data } = await apiClient.get("/organization/getall");
  return data;
}

export async function createOrganization(org: IOrganizations) {
  const { data } = await apiClient.post("/organization", org);
  return data;
}
