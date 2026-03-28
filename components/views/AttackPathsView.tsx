"use client";

import { useAppStore } from "@/store/useAppStore";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorBar } from "@/components/ui/ErrorBar";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

function riskBadgeClass(score: number) {
  if (score >= 80) return "badge-critical";
  if (score >= 60) return "badge-high";
  return "badge-medium";
}

export default function AttackPathsView() {
  const { activePaths, selectedPathIndex, highlightPath, loading, errors } =
    useAppStore();
  const isLoading = loading["paths"];
  const error = errors["paths"];

  return (
    <div className="shrink-0 h-52 overflow-y-auto border-b border-border bg-surface">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 bg-surface border-b border-border">
        <span className="text-xs font-medium text-ink">Attack Paths</span>
        {!isLoading && (
          <span className="text-2xs px-1.5 py-0.5 rounded bg-elevated border border-border text-ink-tertiary">
            {activePaths.length}
          </span>
        )}
      </div>

      {error && (
        <div className="p-4">
          <ErrorBar message={error} />
        </div>
      )}

      {isLoading ? (
        <div className="p-4 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : activePaths.length === 0 && !error ? (
        <div className="py-8 text-center">
          <p className="text-xs text-ink-tertiary">No cluster data loaded.</p>
          <p className="text-xs text-ink-disabled mt-1">
            Run the CLI ingestion command to populate the graph.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {activePaths.map((path, i) => {
            const isSelected = selectedPathIndex === i;
            return (
              <button
                key={path.id}
                onClick={() => highlightPath(isSelected ? null : i)}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-elevated transition-colors",
                  isSelected && "bg-elevated"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Node chain */}
                    <div className="flex items-center gap-1 flex-wrap mb-1">
                      {path.nodes.map((nodeId, j) => (
                        <span key={j} className="flex items-center gap-1">
                          <span className="text-2xs font-mono text-ink-secondary">
                            {nodeId}
                          </span>
                          {j < path.nodes.length - 1 && (
                            <ChevronRight className="w-3 h-3 text-ink-disabled shrink-0" />
                          )}
                        </span>
                      ))}
                    </div>
                    {/* Description */}
                    <p className="text-xs text-ink-tertiary line-clamp-2">
                      {path.description}
                    </p>
                  </div>
                  <span
                    className={cn("shrink-0 text-2xs", riskBadgeClass(path.riskScore))}
                  >
                    {path.riskScore}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
