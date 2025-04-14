import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createOrganization } from "@/queries/organization";
import { queryClient } from "@/axios";
import { Building2, X } from "lucide-react";
import { IOrganizations } from "@/pages/dashboard/Dashboard";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = Omit<IOrganizations, "users" | "cctvs">;

export default function CreateOrgModal({ isOpen, onClose }: CreateOrgModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      location: "",
      type: "Business",
      logoUrl: "",
      isActive: true,
    },
  });

  const orgMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-org"] });
      reset();
      onClose();
    },
    onError: (error) => {
      console.error("Error creating organization:", error);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    orgMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Create New Organization</h3>
          </div>
          <Button
            variant="ghost" 
            onClick={() => {
              reset();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Organization Name *
              </label>
              <Input
                id="name"
                placeholder="Enter organization name"
                {...register("name", {
                  required: "Organization name is required",
                })}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug *
              </label>
              <Input
                id="slug"
                placeholder="organization-name"
                {...register("slug", {
                  required: "Slug is required",
                })}
              />
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Brief description of your organization"
                {...register("description")}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <Input
                id="location"
                placeholder="City, Country"
                {...register("location", {
                  required: "Location is required",
                })}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Organization Type *
              </label>
              <select
                id="type"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                {...register("type", { required: "Organization type is required" })}
              >
                <option value="Business">Business</option>
                <option value="Residential">Residential</option>
                <option value="Education">Education</option>
                <option value="Government">Government</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <Input
                id="logoUrl"
                type="url"
                placeholder="https://example.com/logo.png"
                {...register("logoUrl", {
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
                    message: "Please enter a valid URL",
                  },
                })}
              />
              {errors.logoUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.logoUrl.message}</p>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
            <Button
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={orgMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
            >
              {orgMutation.isPending ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
