import { useQuery } from "@tanstack/react-query";
import { fetchThreats } from "@/queries/threat";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ShieldAlert,
  CalendarClock,
  Flame,
  RotateCw,
  Users,
  Search,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ThreatDetails {
  reason: string;
  people_count: number;
  possible_actions: string[];
  faces_visible: number;
}

interface IThreat {
  _id: string;
  type: string;
  confidence: number;
  risk_score: number;
  details: ThreatDetails;
  createdAt: string;
  cctv: string;
}

export default function ThreatDashboard() {
  const { cctvId } = useParams();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedThreat, setSelectedThreat] = useState<IThreat | null>(null);

  const {
    data: threats,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["get-threats", cctvId],
    queryFn: () => fetchThreats(cctvId || ""),
    enabled: !!cctvId,
    retry: 3,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const filteredThreats = threats?.filter(
    (threat: IThreat) =>
      threat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.details?.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskBadge = (score: number) => {
    if (score >= 8) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" /> High
        </Badge>
      );
    } else if (score >= 5) {
      return (
        <Badge variant="secondary" className="gap-1 bg-yellow-500">
          <AlertCircle className="h-3 w-3" /> Medium
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3" /> Low
        </Badge>
      );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Threat Detection</h1>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading || isRefreshing}
            className="flex items-center gap-2"
          >
            <RotateCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 items-center mb-4">
            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
              Recent Threats
            </h2>
            {threats && threats.length > 0 && (
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  placeholder="Search threats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading threat data...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-red-600 dark:text-red-400 font-medium">
                Error loading threats.
              </div>
              <Button variant="outline" className="mt-4" onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          ) : threats && threats.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                        Risk Level
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                        Reason
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                        People
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                        Detection Time
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-300 w-24">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredThreats?.map((threat: IThreat, i: number) => (
                      <tr
                        key={i}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-750 ${
                          threat.risk_score >= 8 ? "bg-red-50/30 dark:bg-red-900/10" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-8 w-8 rounded-md flex items-center justify-center ${
                                threat.risk_score >= 8
                                  ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300"
                                  : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300"
                              }`}
                            >
                              <ShieldAlert className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white capitalize">
                              {threat.type.replace(/_/g, " ")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{getRiskBadge(threat.risk_score)}</td>
                        <td className="px-6 py-4 max-w-xs truncate">
                          {threat.details?.reason || "No reason provided"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            {threat.details?.people_count || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Flame className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            {(threat.confidence * 100).toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <CalendarClock className="h-4 w-4" />
                            <span>{new Date(threat.createdAt).toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedThreat(threat)}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 shadow-sm">
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

      {/* Threat Details Dialog */}
      {selectedThreat && (
        <Dialog open={!!selectedThreat} onOpenChange={(open) => !open && setSelectedThreat(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div
                  className={`h-6 w-6 rounded-md flex items-center justify-center ${
                    selectedThreat.risk_score >= 8
                      ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300"
                      : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300"
                  }`}
                >
                  <ShieldAlert className="h-3 w-3" />
                </div>
                <span className="capitalize">{selectedThreat.type.replace(/_/g, " ")} Threat</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Risk Score
                </span>
                <span className="font-semibold">
                  {selectedThreat.risk_score}/10 {getRiskBadge(selectedThreat.risk_score)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Detection Confidence
                </span>
                <span className="font-semibold">
                  {(selectedThreat.confidence * 100).toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  People Involved
                </span>
                <span className="font-semibold">{selectedThreat.details?.people_count || 0}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Faces Visible
                </span>
                <span className="font-semibold">{selectedThreat.details?.faces_visible || 0}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CCTV</span>
                <span className="font-semibold">{selectedThreat.cctv}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Detected On
                </span>
                <span className="font-semibold">
                  {new Date(selectedThreat.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  {selectedThreat.details?.reason || "No reason provided"}
                </p>
              </div>

              {selectedThreat.details?.possible_actions &&
                selectedThreat.details.possible_actions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Recommended Actions
                    </span>
                    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedThreat.details.possible_actions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedThreat(null)}>
                Close
              </Button>
              <Button>Report Issue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
