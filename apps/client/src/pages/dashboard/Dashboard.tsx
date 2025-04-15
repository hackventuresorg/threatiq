import { login, UserDetails } from "@/queries/auth";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LOGIN_MUTATION_KEY } from "../../constants";
import { toast } from "sonner";
import { getErrorMessage } from "@/helpers/errorHandler";
import { fetchOrganizations } from "@/queries/organization";
import CreateOrgModal from "@/components/modal/CreateOrgModal";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building2, MapPin, Tag } from "lucide-react";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const hasLoggedIn = useRef(false);

  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);

  const { mutate: loginUser } = useMutation({
    mutationKey: [LOGIN_MUTATION_KEY],
    mutationFn: (userDetails: UserDetails) => login(userDetails),
    onSuccess: () => {},
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const {
    data: organizations,
    isLoading: orgLoading,
    isError: orgError,
  } = useQuery({
    queryKey: ["get-org"],
    queryFn: fetchOrganizations,
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !hasLoggedIn.current) {
      hasLoggedIn.current = true;
      loginUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        fullName: `${user.firstName} ${user.lastName}`,
      });
    }
  }, [isLoaded, isSignedIn, user, loginUser]);

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
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      {org.logoUrl && (
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
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
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {org.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 line-clamp-2">
                          {org.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
                        org.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {org.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
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
