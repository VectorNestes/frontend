"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { simulate } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorBar } from "@/components/ui/ErrorBar";
import { Loader2 } from "lucide-react";

export default function CriticalNodeView() {
  const { criticalNode, simulationResult, setSimulationResult, loading, errors } =
    useAppStore();

  const [simulating, setSimulating] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);

  const isLoading = loading["critical"];
  const error = errors["critical"];

  const handleSimulate = async () => {
    if (!criticalNode) return;
    setSimulating(true);
    setSimError(null);
    try {
      const result = await simulate(criticalNode.nodeId);
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
    <div className="shrink-0 border-t border-border bg-surface px-6 py-4">
      {error && <ErrorBar message={error} />}

      {isLoading ? (
        <div className="flex gap-4">
          <Skeleton className="h-14 flex-1" />
          <Skeleton className="h-14 w-36" />
        </div>
      ) : criticalNode ? (
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-2xs text-ink-tertiary mb-0.5">Critical Node</p>
            <p className="text-sm font-mono font-semibold text-ink">
              {criticalNode.nodeId}
            </p>
          </div>

          <div>
            <p className="text-2xs text-ink-tertiary mb-0.5">Centrality Score</p>
            <p className="text-sm font-semibold text-ink tabular">
              {criticalNode.score.toFixed(4)}
            </p>
          </div>

          <div>
            <p className="text-2xs text-ink-tertiary mb-0.5">
              Paths Eliminated if Removed
            </p>
            <p className="text-sm font-semibold text-amber-text tabular">
              {criticalNode.pathsEliminated}
            </p>
          </div>

          {simulationResult && (
            <div className="px-3 py-2 rounded-lg bg-elevated border border-border text-xs flex items-center gap-2">
              <span className="text-ink-tertiary">Attack Surface:</span>
              <span className="text-ink">
                Before: <strong>{simulationResult.before}</strong>
              </span>
              <span className="text-ink-tertiary">→</span>
              <span className="text-ink">
                After: <strong>{simulationResult.after}</strong>
              </span>
              <span className="text-ink-tertiary">·</span>
              <span className="text-success-text font-medium">
                Impact: -{simulationResult.impact}
              </span>
            </div>
          )}

          {simError && <ErrorBar message={simError} />}

          <button
            onClick={handleSimulate}
            className="ml-auto btn-secondary h-8 text-xs"
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
        </div>
      ) : !error ? (
        <div className="text-center py-2">
          <p className="text-xs text-ink-tertiary">No cluster data loaded.</p>
          <p className="text-xs text-ink-disabled mt-1">
            Run the CLI ingestion command to populate the graph.
          </p>
        </div>
      ) : null}
    </div>
  );
}
