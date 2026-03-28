"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import { GraphNode } from "@/lib/mockData";

/* ─── Type styles ─── */
const typeConfig: Record<
  GraphNode["type"],
  { bg: string; border: string; label: string; dot: string }
> = {
  internet:      { bg: "bg-canvas",   border: "border-border-strong", label: "INTERNET", dot: "bg-ink-tertiary" },
  pod:           { bg: "bg-canvas",   border: "border-border-strong", label: "POD",      dot: "bg-ink-tertiary" },
  serviceaccount:{ bg: "bg-surface",  border: "border-violet-border", label: "SA",       dot: "bg-violet" },
  role:          { bg: "bg-surface",  border: "border-amber-border",  label: "ROLE",     dot: "bg-amber" },
  secret:        { bg: "bg-surface",  border: "border-danger-border", label: "SECRET",   dot: "bg-danger" },
  namespace:     { bg: "bg-canvas",   border: "border-border",        label: "NS",       dot: "bg-ink-disabled" },
};

const riskBadge: Record<GraphNode["riskLevel"], string> = {
  critical: "badge-critical",
  high:     "badge-high",
  medium:   "badge-medium",
  low:      "badge-low",
};

export default memo(function CustomNode({
  data,
  selected,
}: NodeProps<GraphNode & { highlighted?: boolean }>) {
  const cfg        = typeConfig[data.type] ?? typeConfig.pod;
  const isHighlight = data.highlighted;
  const isCrown    = data.isCrownJewel;
  const isEntry    = data.isEntryPoint;

  return (
    <div
      className={cn(
        "relative min-w-[130px] rounded-lg border px-3 py-2.5 cursor-pointer select-none",
        "transition-all duration-150",
        cfg.bg,
        // Normal border
        !isHighlight && !selected && cfg.border,
        // Highlighted (attack path)
        isHighlight && "border-danger bg-danger-muted shadow-md",
        // Selected
        selected && !isHighlight && "border-violet shadow-node-selected",
        // Crown jewel subtle pulse
        isCrown && !isHighlight && "animate-pulse-danger",
      )}
      style={{
        // Subtle shadow for elevated nodes
        boxShadow: selected
          ? "0 0 0 2px rgba(124,58,237,0.4), 0 4px 12px rgba(0,0,0,0.5)"
          : isHighlight
          ? "0 0 0 1.5px rgba(220,38,38,0.5), 0 4px 12px rgba(0,0,0,0.4)"
          : "0 1px 3px rgba(0,0,0,0.4)",
      }}
    >
      {/* Type badge */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
          <span className="text-2xs font-semibold text-ink-tertiary tracking-wider">
            {cfg.label}
          </span>
        </div>
        {data.riskLevel !== "low" && (
          <span className={cn("text-2xs", riskBadge[data.riskLevel])}>
            {data.riskScore}
          </span>
        )}
      </div>

      {/* Label */}
      <p
        className={cn(
          "text-xs font-medium truncate max-w-[110px]",
          isHighlight ? "text-danger-text" : "text-ink"
        )}
      >
        {data.label}
      </p>

      {/* Crown jewel indicator */}
      {isCrown && (
        <div className="mt-1.5">
          <span className="badge-critical">crown jewel</span>
        </div>
      )}

      {/* CVE count */}
      {(data.cves?.length ?? 0) > 0 && (
        <div className="mt-1">
          <span className="text-2xs text-danger-text font-medium">
            {data.cves!.length} CVE{data.cves!.length > 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Entry point indicator */}
      {isEntry && !isCrown && (
        <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-surface border border-border flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
        </div>
      )}

      <Handle type="target" position={Position.Left}  style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
});
