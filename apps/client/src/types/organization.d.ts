interface IOrganizations {
  name: string;
  description: string;
  location: string;
  type: string;
  logoUrl: string;
  users?: string[];
  cctvs?: string[];
  isActive?: boolean;
  slug?: string;
}
