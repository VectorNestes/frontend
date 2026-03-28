"use client";

import { useAppStore } from "@/store/useAppStore";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorBar } from "@/components/ui/ErrorBar";
import { cn } from "@/lib/utils";

function riskBadgeClass(score: number) {
  if (score >= 80) return "badge-critical";
  if (score >= 60) return "badge-high";
  if (score >= 40) return "badge-medium";
  return "badge-low";
}

export default function VulnerabilitiesView() {
  const { vulnerabilities, loading, errors, setSelectedNodeId } = useAppStore();
  const isLoading = loading["vulnerabilities"];
  const error = errors["vulnerabilities"];

  return (
    <div className="shrink-0 h-64 overflow-y-auto border-t border-border bg-surface">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 bg-surface border-b border-border">
        <span className="text-xs font-medium text-ink">Vulnerabilities</span>
        {!isLoading && (
          <span className="text-2xs px-1.5 py-0.5 rounded bg-elevated border border-border text-ink-tertiary">
            {vulnerabilities.length}
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
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8" />
          ))}
        </div>
      ) : vulnerabilities.length === 0 && !error ? (
        <div className="py-8 text-center">
          <p className="text-xs text-ink-tertiary">No cluster data loaded.</p>
          <p className="text-xs text-ink-disabled mt-1">
            Run the CLI ingestion command to populate the graph.
          </p>
        </div>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2 text-ink-tertiary font-medium">
                Node ID
              </th>
              <th className="text-left px-4 py-2 text-ink-tertiary font-medium">
                Type
              </th>
              <th className="text-left px-4 py-2 text-ink-tertiary font-medium">
                Risk Score
              </th>
              <th className="text-left px-4 py-2 text-ink-tertiary font-medium">
                CVEs
              </th>
              <th className="text-left px-4 py-2 text-ink-tertiary font-medium">
                Reason
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vulnerabilities.map((vuln) => (
              <tr
                key={vuln.nodeId}
                className="group hover:bg-elevated transition-colors"
              >
                <td className="px-4 py-2.5">
                  <button
                    onClick={() => setSelectedNodeId(vuln.nodeId)}
                    className="font-mono text-violet-text hover:underline underline-offset-2"
                  >
                    {vuln.nodeId}
                  </button>
                </td>
                <td className="px-4 py-2.5 text-ink-secondary">{vuln.type}</td>
                <td className="px-4 py-2.5">
                  <span className={cn("text-2xs", riskBadgeClass(vuln.riskScore))}>
                    {vuln.riskScore}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {vuln.cves.map((cve) => (
                      <span
                        key={cve}
                        className="text-2xs px-1.5 py-0.5 rounded bg-elevated border border-border text-ink-secondary font-mono"
                      >
                        {cve}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-ink-tertiary max-w-xs">
                  <span className="block truncate group-hover:whitespace-normal">
                    {vuln.reason}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
