"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ReactFlowProvider } from "reactflow";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import AttackPathViewer from "@/components/AttackPathViewer";
import GraphView from "@/components/GraphView";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AttackPathsPage() {
  const { highlightedPath } = useAppStore();
  const [showGraph, setShowGraph] = useState(false);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-11 shrink-0 flex items-center justify-between px-5 border-b border-border bg-surface">
        <p className="text-xs text-ink-tertiary">
          Click a path to highlight it on the graph
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className={cn(
              "btn-ghost h-7 text-xs gap-1.5",
              showGraph && "text-ink border border-border"
            )}
          >
            {showGraph ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showGraph ? "Hide graph" : "Show graph"}
          </button>
          <Link href="/dashboard/graph">
            <button className="btn-ghost h-7 text-xs gap-1">
              Full graph <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Paths list */}
        <div className={cn(
          "overflow-y-auto p-5 transition-all duration-300",
          showGraph ? "w-1/2 border-r border-border" : "w-full max-w-3xl mx-auto"
        )}>
          <AttackPathViewer />
        </div>

        {/* Inline graph */}
        {showGraph && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex-1 relative"
          >
            {highlightedPath && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="text-2xs px-2.5 py-1.5 rounded-full bg-danger-muted border border-danger-border text-danger-text">
                  Path highlighted
                </span>
              </div>
            )}
            <ReactFlowProvider>
              <GraphView />
            </ReactFlowProvider>
          </motion.div>
        )}
      </div>
    </div>
  );
}
