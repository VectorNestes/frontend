"use client";

import { useAppStore } from "@/store/useAppStore";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorBar } from "@/components/ui/ErrorBar";

function StatCard({
  label,
  value,
  variant = "default",
  suffix = "",
}: {
  label: string;
  value: number | string;
  variant?: "default" | "danger" | "amber";
  suffix?: string;
}) {
  const valColor = {
    default: "text-ink",
    danger: "text-danger-text",
    amber: "text-amber-text",
  }[variant];

  return (
    <div className="px-4 py-3 rounded-lg bg-elevated border border-border">
      <p className="text-2xs text-ink-tertiary mb-1">{label}</p>
      <p className={`text-xl font-bold tabular tracking-tight ${valColor}`}>
        {value}
        {suffix}
      </p>
    </div>
  );
}

export default function OverviewCards() {
  const { graphData, vulnerabilities, loading, errors } = useAppStore();
  const isLoading = loading["graph"] || loading["vulnerabilities"];
  const error = errors["graph"];

  return (
    <div className="shrink-0 border-b border-border bg-surface px-4 py-3">
      {error ? (
        <ErrorBar message={error} />
      ) : isLoading ? (
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total Nodes" value={graphData.nodes.length} />
          <StatCard label="Total Edges" value={graphData.edges.length} />
          <StatCard
            label="Vulnerabilities Found"
            value={vulnerabilities.length}
            variant="danger"
          />
          <StatCard
            label="Highest Risk Score"
            value={
              vulnerabilities.length > 0
                ? Math.max(...vulnerabilities.map((v) => v.riskScore))
                : 0
            }
            variant="amber"
            suffix="/100"
          />
        </div>
      )}
    </div>
  );
}
