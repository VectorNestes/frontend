"use client";

import { motion } from "framer-motion";
import { ReactFlowProvider } from "reactflow";
import GraphView from "@/components/GraphView";
import { useAppStore } from "@/store/useAppStore";
import { RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GraphPage() {
  const { highlightedPath, setHighlightedPath, refreshGraph, nodes, edges } = useAppStore();

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-11 shrink-0 flex items-center justify-between px-5 border-b border-border bg-surface">
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-tertiary font-mono">
            {nodes.length} nodes · {edges.length} edges
          </span>

          {highlightedPath && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-2xs px-2 py-1 rounded bg-danger-muted border border-danger-border text-danger-text">
                Attack path highlighted
              </span>
              <button
                onClick={() => setHighlightedPath(null)}
                className="btn-ghost h-6 w-6 p-0 justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </div>

        <button
          onClick={() => refreshGraph()}
          className="btn-ghost h-7 gap-1.5 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset view
        </button>
      </div>

      {/* Graph */}
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <GraphView />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
