import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCctvs } from "@/queries/cctv";
import CctvModal from "@/components/modal/CctvModal";
import { Button } from "@/components/ui/button";
import { PlusCircle, Video, MapPin, RefreshCcw, Search, AlertTriangle, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { GET_CCTV_QUERY_KEY } from "@/constants";
export default function Organization() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCctv, setSelectedCctv] = useState<ICctv | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const { orgId } = useParams();
  const navigate = useNavigate();

  const {
    data: cctvs,
    isLoading,
    isError,
    refetch,
  } = useQuery<ICctv[]>({
    queryKey: [GET_CCTV_QUERY_KEY, orgId],
    queryFn: () => fetchCctvs(orgId || ""),
  });

  const filteredCctvs = cctvs?.filter(
    (cam) =>
      cam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cam.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCctv = () => {
    setSelectedCctv(undefined);
    setIsModalOpen(true);
  };

  const handleEditCctv = (cctv: ICctv) => {
    setSelectedCctv(cctv);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCctv(undefined);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CCTV Dashboard</h1>
          <Button onClick={handleAddCctv} size="lg" className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Connect CCTV
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
              Connected Cameras
            </h2>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-9 h-10"
                  placeholder="Search cameras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                className="h-10 w-10 flex-shrink-0"
                title="Refresh cameras"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-12 w-12 mx-auto text-red-600 dark:text-red-400" />
              <div className="text-red-600 dark:text-red-400 font-medium mt-4">
                Error loading CCTV list.
              </div>
              <Button variant="outline" className="mt-4" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : filteredCctvs && filteredCctvs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCctvs.map((cam: ICctv, i: number) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                          <Video className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {cam.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-mono break-all">
                            {cam.fullUrl}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditCctv(cam)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{cam.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 p-5">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/cctv/${cam._id}`)}
                    >
                      View Stream
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <Search className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No matches found
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Try a different search term or clear the search
              </p>
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
                size="lg"
                className="mt-6"
              >
                Clear Search
              </Button>
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
              <Button onClick={handleAddCctv} size="lg" className="mt-6">
                Connect CCTV
              </Button>
            </div>
          )}
        </div>

        <CctvModal isOpen={isModalOpen} onClose={handleCloseModal} cctv={selectedCctv} />
      </div>
    </div>
  );
}
