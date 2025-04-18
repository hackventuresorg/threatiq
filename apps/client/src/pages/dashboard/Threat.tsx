import { useQuery } from "@tanstack/react-query";
import { fetchThreats } from "@/queries/threat";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShieldAlert, CalendarClock, Flame } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function ThreatDashboard() {
  const { cctvId } = useParams();

  const {
    data: threats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-threats", cctvId],
    queryFn: () => fetchThreats(cctvId || ""),
    enabled: !!cctvId,
  });

  useEffect(() => {
    console.log("data", threats);
  }, [threats]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Threat Detection</h1>
        </div>

        <div>
          <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-6">
            Recent Threats
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-red-600 dark:text-red-400 font-medium">
                Error loading threats.
              </div>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : threats && threats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {threats.map((threat: IThreat, i: number) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-300">
                        <ShieldAlert className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                          {threat.type.replace("_", " ")}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                          Detected on: {new Date(threat.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        threat.risk_score >= 8
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }`}
                    >
                      Risk: {threat.risk_score}/10
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {threat.details?.reason || "No reason provided"}
                    </div>
                    <div className="flex items-center">
                      <Flame className="h-4 w-4 mr-2" />
                      Confidence: {(threat.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="flex items-center">
                      <CalendarClock className="h-4 w-4 mr-2" />
                      CCTV: {threat.cctv}
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
              <ShieldAlert className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                No threats detected
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Your environment is currently secure.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
