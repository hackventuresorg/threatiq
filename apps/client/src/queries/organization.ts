import { apiClient } from "@/axios";
import { IOrganizations } from "@/pages/dashboard/Dashboard";

export async function fetchOrganizations() {
    const {data} = await apiClient.get('/get-organization');
    return data;
}

export async function createOrganization(org: IOrganizations) {
    const {data} = await apiClient.post('/create-organization', org);
    return data;
}