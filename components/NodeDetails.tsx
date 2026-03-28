"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Shield, Key, ChevronRight, Info, Bug } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { CVE, GraphNode } from "@/lib/mockData";

const riskLabel: Record<string, string> = {
  critical: "badge-critical",
  high:     "badge-high",
  medium:   "badge-medium",
  low:      "badge-low",
};

const cveBadge: Record<CVE["severity"], string> = {
  critical: "badge-critical",
  high:     "badge-high",
  medium:   "badge-medium",
  low:      "badge-low",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border last:border-0">
      <span className="text-xs text-ink-tertiary shrink-0">{label}</span>
      <span className="text-xs text-ink-secondary text-right">{value}</span>
    </div>
  );
}

function whyRisky(node: GraphNode): string {
  if (node.isCrownJewel)
    return "Crown jewel asset. Any access here represents full compromise of this resource — often leading to data breach or lateral movement.";
  if (node.permissions?.some((p) => p.includes("*")))
    return "Wildcard permissions grant unrestricted access to cluster resources. This is functionally equivalent to root access.";
  if (node.isEntryPoint)
    return "Internet-accessible entry point. Exploitation of this node requires only network reachability, not prior cluster access.";
  if ((node.cves?.length ?? 0) > 0)
    return `${node.cves!.length} known CVE(s) present. Successful exploitation may allow code execution or privilege escalation.`;
  return "Participates in one or more attack paths. Compromise enables lateral movement toward crown jewel assets.";
}

export default function NodeDetails() {
  const { selectedNode, isNodePanelOpen, setNodePanelOpen } = useAppStore();

  return (
    <AnimatePresence>
      {isNodePanelOpen && selectedNode && (
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-0 right-0 h-full w-72 bg-surface border-l border-border flex flex-col overflow-hidden z-20"
          style={{ boxShadow: "panel" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-2xs font-semibold text-ink-tertiary uppercase tracking-wider">
                {selectedNode.type}
              </span>
              <span className={cn("text-2xs", riskLabel[selectedNode.riskLevel])}>
                {selectedNode.riskLevel}
              </span>
            </div>
            <button
              onClick={() => setNodePanelOpen(false)}
              className="btn-ghost h-7 w-7 p-0 justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Scroll body */}
          <div className="flex-1 overflow-y-auto">
            {/* Name + tags */}
            <div className="px-4 py-4 border-b border-border">
              <p className="text-sm font-semibold text-ink mb-2">{selectedNode.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.isCrownJewel && (
                  <span className="badge-critical">Crown jewel</span>
                )}
                {selectedNode.isEntryPoint && (
                  <span className="badge-medium">Entry point</span>
                )}
                {selectedNode.namespace && (
                  <span className="text-2xs px-2 py-0.5 rounded bg-elevated border border-border text-ink-tertiary font-mono">
                    ns/{selectedNode.namespace}
                  </span>
                )}
              </div>
            </div>

            {/* Risk score */}
            <div className="px-4 py-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-ink-tertiary">Risk score</span>
                <span className="text-sm font-semibold text-ink tabular">
                  {selectedNode.riskScore}
                  <span className="text-ink-tertiary font-normal">/100</span>
                </span>
              </div>
              <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedNode.riskScore}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    selectedNode.riskScore >= 80 ? "bg-danger" :
                    selectedNode.riskScore >= 60 ? "bg-amber" : "bg-violet"
                  )}
                />
              </div>
            </div>

            {/* Why risky */}
            <div className="px-4 py-4 border-b border-border">
              <div className="flex items-center gap-1.5 mb-2">
                <Info className="w-3.5 h-3.5 text-ink-tertiary" />
                <span className="text-xs font-medium text-ink-secondary">Why is this risky?</span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {whyRisky(selectedNode)}
              </p>
            </div>

            {/* Details rows */}
            <div className="px-4 py-2 border-b border-border">
              <span className="text-xs font-medium text-ink-secondary block mb-1">Details</span>
              <Row label="Type"       value={selectedNode.type} />
              {selectedNode.namespace && <Row label="Namespace" value={selectedNode.namespace} />}
              <Row label="Risk level" value={
                <span className={cn(riskLabel[selectedNode.riskLevel])}>{selectedNode.riskLevel}</span>
              } />
            </div>

            {/* Permissions */}
            {(selectedNode.permissions?.length ?? 0) > 0 && (
              <div className="px-4 py-4 border-b border-border">
                <div className="flex items-center gap-1.5 mb-2">
                  <Shield className="w-3.5 h-3.5 text-ink-tertiary" />
                  <span className="text-xs font-medium text-ink-secondary">
                    Permissions ({selectedNode.permissions!.length})
                  </span>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {selectedNode.permissions!.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-elevated border border-border"
                    >
                      <ChevronRight className="w-3 h-3 text-ink-tertiary shrink-0" />
                      <span className="text-2xs font-mono text-ink-secondary truncate">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CVEs */}
            {(selectedNode.cves?.length ?? 0) > 0 && (
              <div className="px-4 py-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Bug className="w-3.5 h-3.5 text-danger-text" />
                  <span className="text-xs font-medium text-ink-secondary">
                    CVEs ({selectedNode.cves!.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedNode.cves!.map((cve) => (
                    <div key={cve.id} className="rounded-lg bg-elevated border border-border p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-2xs font-mono font-semibold text-ink">
                          {cve.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={cn("text-2xs", cveBadge[cve.severity])}>
                            {cve.severity}
                          </span>
                          <span className="text-2xs tabular text-ink-tertiary">
                            {cve.cvss}
                          </span>
                        </div>
                      </div>
                      <p className="text-2xs text-ink-tertiary leading-snug">
                        {cve.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
