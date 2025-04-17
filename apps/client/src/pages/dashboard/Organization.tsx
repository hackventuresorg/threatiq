import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCctvs } from "@/queries/cctv";
import CctvModal from "@/components/modal/CctvModal";
import { Button } from "@/components/ui/button";
import { PlusCircle, Video, MapPin, Hash } from "lucide-react";
import { useParams } from "react-router-dom";

export default function Organization() {
  const [isCreateCctvOpen, setIsCreateCctvOpen] = useState(false);
  const { orgId } = useParams();

  const {
    data: cctvs,
    isLoading,
    isError,
  } = useQuery<ICctv[]>({
    queryKey: ["get-cctvs", orgId],
    queryFn: () => fetchCctvs(orgId || ""),
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CCTV Dashboard</h1>
          <Button onClick={() => setIsCreateCctvOpen(true)} size="lg" className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Connect CCTV
          </Button>
        </div>

        <div>
          <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6">
            Connected Cameras
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-red-600 dark:text-red-400 font-medium">
                Error loading CCTV list.
              </div>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : cctvs && cctvs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cctvs.map((cam: ICctv, i: number) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                        <Video className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {cam.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 font-mono break-all">
                          {cam.fullUrl}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
                        cam.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {cam.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {cam.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Hash className="h-4 w-4 mr-2" />
                      {cam.camCode}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" size="sm" className="w-full">
                      View Stream
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <Video className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No CCTVs connected
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Connect your first CCTV camera to get started.
              </p>
              <Button onClick={() => setIsCreateCctvOpen(true)} size="lg" className="mt-6">
                Connect CCTV
              </Button>
            </div>
          )}
        </div>

        <CctvModal isOpen={isCreateCctvOpen} onClose={() => setIsCreateCctvOpen(false)} />
      </div>
    </div>
  );
}
