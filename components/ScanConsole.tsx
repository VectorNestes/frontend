"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

interface LogEntry { text: string; type: string; timestamp: string }

const typeStyle: Record<string, { prefix: string; color: string }> = {
  success:  { prefix: "✓",  color: "text-success-text" },
  warning:  { prefix: "⚠",  color: "text-amber-text" },
  info:     { prefix: "·",  color: "text-ink-tertiary" },
  critical: { prefix: "✗",  color: "text-danger-text" },
  error:    { prefix: "✗",  color: "text-danger-text" },
};

function LogLine({ log, index }: { log: LogEntry; index: number }) {
  const s = typeStyle[log.type] ?? typeStyle.info;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="flex items-baseline gap-3 py-0.5 font-mono text-xs"
    >
      <span className="text-ink-disabled shrink-0 tabular w-16">{log.timestamp}</span>
      <span className={cn("shrink-0 w-3", s.color)}>{s.prefix}</span>
      <span
        className={cn(
          "leading-relaxed",
          log.type === "critical" ? "text-danger-text font-medium" :
          log.type === "success"  ? "text-success-text" :
          log.type === "warning"  ? "text-amber-text" :
          "text-ink-secondary"
        )}
      >
        {log.text}
      </span>
    </motion.div>
  );
}

export default function ScanConsole() {
  const { scanLogs, isScanning } = useAppStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [scanLogs]);

  return (
    <div className="card overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-elevated">
        <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
        <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
        <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
        <span className="text-xs text-ink-tertiary ml-3 font-mono">kubeview — scanner</span>
        {isScanning && (
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-spin-slow" />
            <span className="text-2xs text-success-text font-mono">running</span>
          </div>
        )}
      </div>

      {/* Output */}
      <div className="h-60 overflow-y-auto p-4 space-y-0.5 bg-canvas">
        {scanLogs.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-mono">
            <span className="text-success-text">$</span>
            <span>Waiting for scan to start…</span>
            <span className="animate-pulse">▊</span>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {scanLogs.map((log, i) => (
              <LogLine key={i} log={log} index={i} />
            ))}
          </AnimatePresence>
        )}

        {isScanning && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-success-text font-mono text-xs">$</span>
            <span className="text-xs text-ink-tertiary font-mono">processing</span>
            <span className="inline-block w-2 h-3.5 bg-ink-disabled animate-pulse" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
