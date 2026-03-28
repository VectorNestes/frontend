"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { simulate } from "@/lib/api";
import { cn } from "@/lib/utils";

function riskBadgeClass(score: number) {
  if (score >= 80) return "badge-critical";
  if (score >= 60) return "badge-high";
  if (score >= 40) return "badge-medium";
  return "badge-low";
}

export default function NodeDetails() {
  const {
    selectedNodeId,
    setSelectedNodeId,
    graphData,
    vulnerabilities,
    simulationResult,
    setSimulationResult,
  } = useAppStore();

  const [simulating, setSimulating] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);

  const node = selectedNodeId
    ? graphData.nodes.find((n) => n.id === selectedNodeId)
    : null;

  const vuln = selectedNodeId
    ? vulnerabilities.find((v) => v.nodeId === selectedNodeId)
    : null;

  const handleClose = () => {
    setSelectedNodeId(null);
    setSimulationResult(null);
    setSimError(null);
  };

  const handleSimulate = async () => {
    if (!selectedNodeId) return;
    setSimulating(true);
    setSimError(null);
    try {
      const result = await simulate(selectedNodeId);
      setSimulationResult(result);
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: string } }; message?: string })
          ?.response?.data?.error ??
        (e as { message?: string })?.message ??
        "Simulation failed";
      setSimError(msg);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-0 right-0 h-full w-80 bg-surface border-l border-border flex flex-col overflow-hidden z-20"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-xs font-semibold text-ink">Node Details</span>
            <button
              onClick={handleClose}
              className="btn-ghost h-7 w-7 p-0 justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Node ID */}
            <div>
              <p className="text-2xs text-ink-tertiary mb-1">Node ID</p>
              <p className="text-sm font-mono font-semibold text-ink break-all">
                {node.id}
              </p>
            </div>

            {/* Type */}
            <div>
              <p className="text-2xs text-ink-tertiary mb-1">Type</p>
              <p className="text-sm text-ink-secondary">
                {node.data?.apiNode?.type ?? "—"}
              </p>
            </div>

            {/* Vulnerability section */}
            {vuln && (
              <div className="rounded-lg border border-border bg-elevated p-3 space-y-2.5">
                <p className="text-2xs font-semibold text-ink-tertiary uppercase tracking-wider">
                  Vulnerability
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-secondary">{vuln.type}</span>
                  <span className={cn("text-2xs", riskBadgeClass(vuln.riskScore))}>
                    {vuln.riskScore}
                  </span>
                </div>
                {vuln.cves.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {vuln.cves.map((cve) => (
                      <span
                        key={cve}
                        className="text-2xs px-1.5 py-0.5 rounded bg-surface border border-border text-ink-secondary font-mono"
                      >
                        {cve}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-ink-tertiary leading-relaxed">
                  {vuln.reason}
                </p>
              </div>
            )}

            {/* Simulate removal */}
            <div className="pt-2 border-t border-border space-y-3">
              <button
                onClick={handleSimulate}
                className="w-full btn-secondary h-8 text-xs justify-center"
              >
                {simulating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Simulating…
                  </>
                ) : (
                  "Simulate Removal"
                )}
              </button>

              {simError && (
                <p className="text-2xs text-danger-text">{simError}</p>
              )}

              {simulationResult && (
                <div className="p-3 rounded-lg bg-elevated border border-border text-xs space-y-1.5">
                  <p className="text-2xs font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
                    Simulation Result
                  </p>
                  <div className="flex justify-between">
                    <span className="text-ink-tertiary">Before</span>
                    <span className="text-ink tabular">
                      {simulationResult.before} paths
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-tertiary">After</span>
                    <span className="text-ink tabular">
                      {simulationResult.after} paths
                    </span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-border">
                    <span className="text-ink-tertiary">Impact</span>
                    <span className="text-success-text tabular font-medium">
                      -{simulationResult.impact} paths
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
