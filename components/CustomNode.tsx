"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import type { ApiNode } from "@/lib/types";

interface NodeData {
  apiNode: ApiNode;
  highlighted: boolean;
  dimmed: boolean;
  isCritical: boolean;
  hasVulnerability?: boolean;
  riskScore?: number;
}

const typeConfig: Record<
  string,
  { border: string; label: string; dot: string }
> = {
  internet:       { border: "border-border-strong", label: "INTERNET", dot: "bg-ink-tertiary" },
  pod:            { border: "border-border-strong", label: "POD",      dot: "bg-ink-tertiary" },
  serviceaccount: { border: "border-violet-border", label: "SA",       dot: "bg-violet" },
  role:           { border: "border-amber-border",  label: "ROLE",     dot: "bg-amber" },
  secret:         { border: "border-danger-border", label: "SECRET",   dot: "bg-danger" },
};

function riskBadgeClass(score: number) {
  if (score >= 80) return "badge-critical";
  if (score >= 60) return "badge-high";
  return "badge-medium";
}

function riskBorderClass(score: number) {
  if (score >= 80) return "border-danger";
  if (score >= 60) return "border-amber";
  return "border-violet-border";
}

export default memo(function CustomNode({
  data,
  selected,
}: NodeProps<NodeData>) {
  const nodeType = data.apiNode?.type ?? "pod";
  const cfg = typeConfig[nodeType] ?? {
    border: "border-border",
    label: nodeType.toUpperCase().slice(0, 8),
    dot: "bg-ink-disabled",
  };
  const hasRisk = data.riskScore !== undefined;

  return (
    <div
      className={cn(
        "relative rounded-lg border bg-surface px-3 py-2.5 cursor-pointer select-none transition-all duration-150 min-w-[140px]",
        // Border priority: highlighted > selected > riskScore > type default
        data.highlighted
          ? "border-danger bg-danger-muted"
          : selected
          ? "border-violet"
          : hasRisk
          ? riskBorderClass(data.riskScore!)
          : cfg.border,
        // Dim non-path nodes
        data.dimmed && "opacity-25",
      )}
      style={{
        boxShadow: data.isCritical
          ? "0 0 0 3px rgba(124,58,237,0.5), 0 0 0 8px rgba(124,58,237,0.1)"
          : selected
          ? "0 0 0 2px rgba(124,58,237,0.35)"
          : "0 1px 3px rgba(0,0,0,0.4)",
      }}
    >
      {/* Critical Node label */}
      {data.isCritical && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
          <span className="text-2xs px-2 py-0.5 rounded bg-violet-muted border border-violet-border text-violet-text">
            Critical Node
          </span>
        </div>
      )}

      {/* Vulnerability indicator — top-right corner */}
      {data.hasVulnerability && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-danger border-2 border-canvas" />
      )}

      {/* Type badge row */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            data.highlighted ? "bg-danger" : cfg.dot
          )}
        />
        <span className="text-2xs font-semibold text-ink-tertiary tracking-wider">
          {cfg.label}
        </span>
      </div>

      {/* Node ID */}
      <p
        className={cn(
          "text-xs font-mono font-medium truncate max-w-[130px]",
          data.highlighted ? "text-danger-text" : "text-ink"
        )}
      >
        {data.apiNode?.id ?? "—"}
      </p>

      {/* Risk score badge (vulnerabilities view) */}
      {hasRisk && (
        <div className="mt-1.5">
          <span className={cn("text-2xs", riskBadgeClass(data.riskScore!))}>
            {data.riskScore}
          </span>
        </div>
      )}

      <Handle type="target" position={Position.Left}  style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
});
