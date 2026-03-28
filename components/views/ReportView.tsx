"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorBar } from "@/components/ui/ErrorBar";
import { Copy, Check } from "lucide-react";

export default function ReportView() {
  const { report, loading, errors } = useAppStore();
  const [copied, setCopied] = useState(false);
  const isLoading = loading["report"];
  const error = errors["report"];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-border bg-surface">
        <span className="text-xs font-medium text-ink">Cluster Report</span>
        {!isLoading && report && (
          <button onClick={handleCopy} className="btn-ghost h-7 text-xs gap-1.5">
            {copied ? (
              <Check className="w-3.5 h-3.5 text-success-text" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-canvas">
        {error && (
          <div className="mb-4">
            <ErrorBar message={error} />
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2 max-w-2xl">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton
                key={i}
                className={`h-4 ${i % 4 === 0 ? "w-1/3" : i % 3 === 0 ? "w-2/3" : "w-full"}`}
              />
            ))}
          </div>
        ) : !report ? (
          <div className="py-16 text-center">
            <p className="text-sm text-ink-tertiary">No cluster data loaded.</p>
            <p className="text-xs text-ink-disabled mt-1">
              Run the CLI ingestion command to populate the graph.
            </p>
          </div>
        ) : (
          <pre className="text-xs font-mono text-ink-secondary leading-relaxed whitespace-pre-wrap break-words max-w-4xl">
            {report}
          </pre>
        )}
      </div>
    </div>
  );
}
