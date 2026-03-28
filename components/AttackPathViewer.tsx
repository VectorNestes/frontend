"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, ArrowRight, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { AttackPath, mockGraphNodes } from "@/lib/mockData";
import { useState } from "react";

/* ─── Node chip ─── */
function NodeChip({ id, highlighted }: { id: string; highlighted: boolean }) {
  const node = mockGraphNodes.find((n) => n.id === id);
  if (!node) return null;

  const styles: Record<string, string> = {
    internet:       "border-border-strong text-ink-tertiary",
    pod:            "border-border-strong text-ink-secondary",
    serviceaccount: "border-violet-border text-violet-text",
    role:           "border-amber-border text-amber-text",
    secret:         "border-danger-border text-danger-text",
    namespace:      "border-border text-ink-tertiary",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-2xs font-medium font-mono",
        "bg-canvas transition-all duration-200",
        highlighted ? "border-danger-border text-danger-text bg-danger-muted" : styles[node.type]
      )}
    >
      <span className="w-1 h-1 rounded-full bg-current opacity-60 shrink-0" />
      {node.label}
    </div>
  );
}

/* ─── Single path card ─── */
function PathCard({
  path,
  isSelected,
  onClick,
}: {
  path: AttackPath;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-150",
        isSelected
          ? path.severity === "critical"
            ? "border-danger-border bg-danger-muted"
            : path.severity === "high"
            ? "border-amber-border bg-amber-muted"
            : "border-violet-border bg-violet-muted"
          : "border-border bg-surface hover:border-border-strong"
      )}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={onClick}
      >
        <Crosshair
          className={cn(
            "w-3.5 h-3.5 shrink-0",
            path.severity === "critical" ? "text-danger-text" :
            path.severity === "high" ? "text-amber-text" : "text-violet-text"
          )}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink truncate">{path.name}</p>
        </div>
        <span
          className={cn(
            path.severity === "critical" ? "badge-critical" :
            path.severity === "high" ? "badge-high" : "badge-medium"
          )}
        >
          {path.severity}
        </span>
        <div className="flex items-center gap-1.5 ml-1">
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="btn-ghost h-6 w-6 p-0 justify-center"
          >
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Path visualization */}
      <div className="px-4 pb-3 flex items-center flex-wrap gap-1.5">
        {path.nodes.map((id, i) => (
          <div key={id} className="flex items-center gap-1.5">
            <NodeChip id={id} highlighted={isSelected} />
            {i < path.nodes.length - 1 && (
              <ArrowRight
                className={cn(
                  "w-3 h-3 shrink-0",
                  isSelected ? "text-danger-text/50" : "text-ink-disabled"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Expanded steps */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
              <p className="section-label mb-2">Attack steps</p>
              {path.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-2xs tabular text-ink-tertiary font-mono mt-0.5 w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-xs text-ink-secondary leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Graph highlight indicator */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <p className="text-xs text-ink-tertiary">
          {path.nodes.length} nodes · {path.steps.length} steps
        </p>
        <button
          onClick={onClick}
          className={cn(
            "text-xs flex items-center gap-1 transition-colors",
            isSelected ? "text-danger-text hover:text-danger" : "text-ink-tertiary hover:text-ink-secondary"
          )}
        >
          {isSelected ? (
            <><EyeOff className="w-3 h-3" /> Clear highlight</>
          ) : (
            <><Eye className="w-3 h-3" /> Highlight on graph</>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function AttackPathViewer() {
  const { attackPaths, selectedPath, setSelectedPath } = useAppStore();

  return (
    <div className="space-y-3">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: attackPaths.length },
          { label: "Critical", value: attackPaths.filter((p) => p.severity === "critical").length },
          { label: "High",     value: attackPaths.filter((p) => p.severity === "high").length },
        ].map(({ label, value }) => (
          <div key={label} className="card p-3 text-center">
            <p className="text-lg font-bold text-ink tabular">{value}</p>
            <p className="text-xs text-ink-tertiary mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Cards */}
      {attackPaths.map((path, i) => (
        <motion.div
          key={path.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.25, ease: "easeOut" }}
        >
          <PathCard
            path={path}
            isSelected={selectedPath?.id === path.id}
            onClick={() => setSelectedPath(selectedPath?.id === path.id ? null : path)}
          />
        </motion.div>
      ))}
    </div>
  );
}
