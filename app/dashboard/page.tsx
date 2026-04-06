"use client";

// eslint-disable-next-line react-hooks/exhaustive-deps
import { useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import { useAppStore } from "@/store/useAppStore";
import * as api from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import GraphView from "@/components/GraphView";
import NodeDetails from "@/components/NodeDetails";
import OverviewCards from "@/components/views/OverviewCards";
import AttackPathsView from "@/components/views/AttackPathsView";
import VulnerabilitiesView from "@/components/views/VulnerabilitiesView";
import CriticalNodeView from "@/components/views/CriticalNodeView";
import ReportView from "@/components/views/ReportView";

export default function DashboardPage() {
  const {
    activeView,
    loadGraph,
    setVulnerabilities,
    setActivePaths,
    setCriticalNode,
    setReport,
    setLoading,
    setError,
    clearError,
    highlightCritical,
  } = useAppStore();

  // Initial load: graph + vulnerabilities (always needed)
  useEffect(() => {
    setLoading("graph", true);
    setLoading("vulnerabilities", true);
    Promise.all([api.getGraph(), api.getVulnerabilities()])
      .then(([graphData, vulns]) => {
        loadGraph(graphData.nodes, graphData.edges);
        setVulnerabilities(vulns);
        clearError("graph");
        clearError("vulnerabilities");
      })
      .catch((e: Error) => {
        const msg = e?.message ?? "Failed to load graph data";
        const hint = msg.includes("abort") || msg.includes("Timeout")
          ? "Request timed out — is the backend running at http://localhost:3001?"
          : msg;
        setError("graph", hint);
      })
      .finally(() => {
        setLoading("graph", false);
        setLoading("vulnerabilities", false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // View-specific data fetching
  useEffect(() => {
    if (activeView === "paths") {
      setLoading("paths", true);
      api
        .getPaths()
        .then((p) => {
          setActivePaths(p);
          clearError("paths");
        })
        .catch((e: Error) =>
          setError("paths", e?.message ?? "Failed to load attack paths")
        )
        .finally(() => setLoading("paths", false));
    }

    if (activeView === "critical") {
      setLoading("critical", true);
      api
        .getCriticalNode()
        .then((n) => {
          setCriticalNode(n);
          highlightCritical(n.nodeId);
          clearError("critical");
        })
        .catch((e: Error) =>
          setError("critical", e?.message ?? "Failed to load critical node")
        )
        .finally(() => setLoading("critical", false));
    }

    if (activeView === "report") {
      setLoading("report", true);
      api
        .getReport()
        .then((r) => {
          setReport(r);
          clearError("report");
        })
        .catch((e: Error) =>
          setError("report", e?.message ?? "Failed to load report")
        )
        .finally(() => setLoading("report", false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView]);

  const showGraph = activeView !== "report";

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Above-graph slots */}
        {activeView === "overview" && <OverviewCards />}
        {activeView === "paths" && <AttackPathsView />}

        {/* Graph — always visible except report */}
        {showGraph && (
          <div className="flex-1 relative overflow-hidden">
            <ReactFlowProvider>
              <GraphView />
            </ReactFlowProvider>
            <NodeDetails />
          </div>
        )}

        {/* Below-graph / full-page slots */}
        {activeView === "vulnerabilities" && <VulnerabilitiesView />}
        {activeView === "critical" && <CriticalNodeView />}
        {activeView === "report" && <ReportView />}
      </div>
    </div>
  );
}
