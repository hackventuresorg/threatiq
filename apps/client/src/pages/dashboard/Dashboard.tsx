import CreateOrgModal from "@/components/modal/CreateOrgModal";
import { login, UserDetails, userExists } from "@/queries/auth";
import { fetchOrganizations } from "@/queries/organization";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export interface IOrganizations {
  name: string;
  slug: string;
  description: string;
  location: string;
  type: string;
  logoUrl: string;
  users?: string[];
  cctvs?: string[];
  isActive: boolean;
}

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);

  const {
    data: organizations,
    isLoading: orgLoading,
    isError: orgError,
  } = useQuery({
    queryKey: ["get-org"],
    queryFn: fetchOrganizations,
  });
  useEffect(() => {
    const checkAndSaveUser = async () => {
      if (isLoaded && isSignedIn && user) {
        const exists = await userExists(user.id);
        if (exists) {
          return;
        } else {
          const userInfo: UserDetails = {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            fullName: `${user.firstName} ${user.lastName}`,
          };
          login(userInfo);
        }
      }
    };

    checkAndSaveUser();
  }, [isLoaded, isSignedIn]);

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Create Organization Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsCreateOrgOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Create Organization
          </button>
        </div>

        {/* Organization List Section */}
        <div>
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Your Organizations</h2>
          {orgLoading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : orgError ? (
            <div className="text-center text-red-500">Error loading organizations.</div>
          ) : organizations && organizations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org: IOrganizations) => (
                <div
                  key={org.slug}
                  className="bg-white p-6 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={org.logoUrl}
                      alt={org.name}
                      className="h-16 w-16 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{org.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">{org.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Location: {org.location}</p>
                      <p className="text-xs text-gray-500 mt-1">Type: {org.type}</p>
                    </div>
                  </div>
                  <div
                    className={`mt-4 px-3 py-1 text-xs font-semibold rounded-full inline-block ${
                      org.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {org.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No organizations found.</div>
          )}
        </div>

        {/* Create Organization Modal */}
        <CreateOrgModal isOpen={isCreateOrgOpen} onClose={() => setIsCreateOrgOpen(false)} />
      </div>
    </div>
  );
}
