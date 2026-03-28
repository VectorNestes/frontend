"use client";

import { motion } from "framer-motion";
import {
  ScanLine, CheckCircle, AlertTriangle, GitBranch, ArrowRight, Info
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import ScanConsole from "@/components/ScanConsole";
import { scanLogs } from "@/lib/mockData";
import toast from "react-hot-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SCAN_TYPES = [
  { id: "full",  label: "Full scan",   desc: "RBAC + CVE + attack path analysis" },
  { id: "rbac",  label: "RBAC only",   desc: "Role and binding relationships" },
  { id: "cve",   label: "CVE scan",    desc: "Vulnerability matching only" },
] as const;

export default function ScanPage() {
  const {
    isScanning, scanComplete, useMockMode,
    setScanning, setScanComplete, addScanLog, clearScanLogs, setMockMode,
  } = useAppStore();

  const run = async () => {
    if (isScanning) return;
    clearScanLogs();
    setScanning(true);
    setScanComplete(false);

    let prev = 0;
    for (const log of scanLogs) {
      const delay = log.delay - prev;
      await new Promise((r) => setTimeout(r, Math.max(delay, 100)));
      prev = log.delay;
      addScanLog({ text: log.text, type: log.type });
    }

    setScanning(false);
    setScanComplete(true);
    toast.success("Scan complete — 3 attack paths found");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-ink tracking-tight">Scan cluster</h2>
        <p className="text-sm text-ink-tertiary mt-0.5">
          Analyse RBAC relationships, CVEs, and attack paths
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-5">
        {/* Config panel */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-2 space-y-4"
        >
          {/* Mode */}
          <div className="card p-4">
            <p className="text-xs font-medium text-ink-secondary mb-3">Scan mode</p>
            <div
              onClick={() => setMockMode(!useMockMode)}
              className="flex items-center justify-between p-3 rounded-lg bg-elevated border border-border cursor-pointer hover:border-border-strong transition-colors"
            >
              <div>
                <p className="text-xs font-medium text-ink">
                  {useMockMode ? "Mock data" : "Live cluster"}
                </p>
                <p className="text-2xs text-ink-tertiary mt-0.5">
                  {useMockMode ? "No cluster required" : "Uses kubeconfig"}
                </p>
              </div>
              {/* Toggle */}
              <div className={cn(
                "w-8 h-4.5 rounded-full border transition-colors relative",
                useMockMode ? "bg-violet-muted border-violet-border" : "bg-elevated border-border"
              )} style={{ height: "18px" }}>
                <motion.div
                  animate={{ x: useMockMode ? 14 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={cn("absolute top-[3px] w-3 h-3 rounded-full transition-colors",
                    useMockMode ? "bg-violet" : "bg-border-strong"
                  )}
                />
              </div>
            </div>
          </div>

          {/* Scan type */}
          <div className="card p-4">
            <p className="text-xs font-medium text-ink-secondary mb-3">Scan type</p>
            <div className="space-y-1.5">
              {SCAN_TYPES.map(({ id, label, desc }) => {
                const active = id === "full";
                return (
                  <div
                    key={id}
                    className={cn(
                      "flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors",
                      active
                        ? "border-violet-border bg-violet-muted"
                        : "border-border bg-elevated hover:border-border-strong"
                    )}
                  >
                    <div
                      className={cn(
                        "w-3.5 h-3.5 rounded-full border mt-0.5 shrink-0 flex items-center justify-center",
                        active ? "border-violet bg-violet" : "border-border-strong"
                      )}
                    >
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-ink">{label}</p>
                      <p className="text-2xs text-ink-tertiary mt-0.5">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kubeconfig notice */}
          {!useMockMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="card p-4"
            >
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-muted border border-amber-border">
                <Info className="w-3.5 h-3.5 text-amber-text shrink-0 mt-0.5" />
                <p className="text-2xs text-amber-text leading-relaxed">
                  Configure your kubeconfig in Settings to enable live scanning.
                </p>
              </div>
            </motion.div>
          )}

          <button
            onClick={run}
            disabled={isScanning}
            className={cn(
              "btn-primary w-full justify-center h-10",
              isScanning && "opacity-60 cursor-not-allowed"
            )}
          >
            {isScanning ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ScanLine className="w-4 h-4" />
                {scanComplete ? "Re-scan" : "Start scan"}
              </>
            )}
          </button>
        </motion.div>

        {/* Console + results */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="md:col-span-3 space-y-4"
        >
          <ScanConsole />

          {/* Results card */}
          {scanComplete && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="card p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-success" />
                <p className="text-sm font-medium text-ink">Scan complete</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Nodes", value: "11" },
                  { label: "Edges", value: "13" },
                  { label: "CVEs", value: "4", variant: "danger" },
                  { label: "Attack paths", value: "3", variant: "danger" },
                ].map(({ label, value, variant }) => (
                  <div key={label} className="p-3 rounded-lg bg-elevated border border-border">
                    <p className={cn(
                      "text-xl font-bold tabular",
                      variant === "danger" ? "text-danger-text" : "text-ink"
                    )}>
                      {value}
                    </p>
                    <p className="text-xs text-ink-tertiary mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Link href="/dashboard/graph" className="flex-1">
                  <button className="btn-secondary w-full h-9 justify-center text-xs">
                    <GitBranch className="w-3.5 h-3.5" />
                    View graph
                  </button>
                </Link>
                <Link href="/dashboard/attack-paths" className="flex-1">
                  <button className="btn-danger w-full h-9 justify-center text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Attack paths
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {!isScanning && !scanComplete && (
            <div className="card p-5">
              <p className="text-xs font-medium text-ink-secondary mb-3">What gets scanned</p>
              <div className="space-y-2">
                {[
                  "All pods, deployments, and DaemonSets across namespaces",
                  "ServiceAccount bindings and RBAC ClusterRoleBindings",
                  "Secrets, ConfigMaps, and mounted volumes",
                  "Running image SHAs matched against CVE databases",
                  "Network policies and exposed service endpoints",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                    <p className="text-xs text-ink-secondary leading-snug">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
