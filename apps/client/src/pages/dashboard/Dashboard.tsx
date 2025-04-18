import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchOrganizations } from "@/queries/organization";
import CreateOrgModal from "@/components/modal/CreateOrgModal";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building2, MapPin, Tag } from "lucide-react";
import { GET_ORGANIZATIONS_QUERY_KEY } from "@/constants";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const {
    data: organizationsRes,
    isLoading: orgLoading,
    isError: orgError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [GET_ORGANIZATIONS_QUERY_KEY],
    queryFn: fetchOrganizations,
  });

  useEffect(() => {
    if (!isFetching) {
      setIsRefetching(false);
    }
  }, [isFetching]);

  const handleRefetch = async () => {
    setIsRefetching(true);
    await refetch();
  };

  const organizations = organizationsRes?.allOrgs;
  const isLoadingData = orgLoading || isFetching || isRefetching;

  return (
    <div className="bg-background min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your organizations and view their status
            </p>
          </div>
          <Button onClick={() => setIsCreateOrgOpen(true)} size="lg" className="gap-2 shadow-sm">
            <PlusCircle className="h-5 w-5" />
            Create Organization
          </Button>
        </div>

        <div>
          <div className="flex justify-between items-center">
            {isLoadingData && (
              <div className="flex items-center text-sm text-primary">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading...
              </div>
            )}
          </div>

          {orgLoading && !isFetching ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : orgError ? (
            <div className="text-center py-12 bg-destructive/10 rounded-xl border border-destructive/20">
              <AlertCircle className="h-10 w-10 mx-auto text-destructive" />
              <div className="text-destructive font-medium mt-4">Error loading organizations.</div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleRefetch}
                disabled={isLoadingData}
              >
                {isLoadingData ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Trying Again...
                  </>
                ) : (
                  "Try Again"
                )}
              </Button>
            </div>
          ) : organizations && organizations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org: IOrganizations) => (
                <div
                  key={org?._id}
                  className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        {org.logoUrl ? (
                          <div className="h-14 w-14 rounded-lg overflow-hidden bg-secondary flex items-center justify-center shadow-sm">
                            <img
                              src={org.logoUrl}
                              alt={org.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center shadow-sm">
                            <Building2 className="h-7 w-7 text-primary" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold tracking-tight">{org.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {org.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                      <Badge variant={org.isActive ? "default" : "destructive"} className="ml-2">
                        {org.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="truncate">{org.location}</span>
                        </div>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <div className="flex items-center text-sm">
                          <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="truncate">{org.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link to={`/organization/${org?._id}`} className="block w-full">
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full group-hover:bg-primary transition-colors"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-xl border border-dashed border-border">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground opacity-70" />
              <h3 className="mt-6 text-xl font-medium">No organizations found</h3>
              <p className="mt-2 text-muted-foreground">
                Create your first organization to get started
              </p>
              <Button onClick={() => setIsCreateOrgOpen(true)} size="lg" className="mt-6 shadow-sm">
                Create Organization
              </Button>
            </div>
          )}
        </div>

        <CreateOrgModal isOpen={isCreateOrgOpen} onClose={() => setIsCreateOrgOpen(false)} />
      </div>
    </div>
  );
}
