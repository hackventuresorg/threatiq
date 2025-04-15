import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchOrganizations } from "@/queries/organization";
import CreateOrgModal from "@/components/modal/CreateOrgModal";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building2, MapPin, Tag } from "lucide-react";

export default function Dashboard() {
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);

  const {
    data: organizations,
    isLoading: orgLoading,
    isError: orgError,
  } = useQuery({
    queryKey: ["get-org"],
    queryFn: fetchOrganizations,
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <Button onClick={() => setIsCreateOrgOpen(true)} size="lg" className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Create Organization
          </Button>
        </div>

        <div>
          <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6">
            Your Organizations
          </h2>
          {orgLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : orgError ? (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-red-600 dark:text-red-400 font-medium">
                Error loading organizations.
              </div>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : organizations && organizations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org: IOrganizations) => (
                <div
                  key={org.slug}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                    {org.logoUrl && (
                      <div className="absolute -bottom-10 left-6">
                        <div className="rounded-full h-20 w-20 border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700 shadow-md">
                          <img
                            src={org.logoUrl || "https://via.placeholder.com/80"}
                            alt={org.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/80?text=Logo";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`pt-${org.logoUrl ? "12" : "6"} px-6 pb-6`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                          {org.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                          {org.description || "No description provided"}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          org.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {org.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        {org.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Tag className="h-4 w-4 mr-2" />
                        {org.type}
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <Building2 className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No organizations found
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Create your first organization to get started
              </p>
              <Button onClick={() => setIsCreateOrgOpen(true)} size="lg" className="mt-6">
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
