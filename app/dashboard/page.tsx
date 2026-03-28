"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, Crosshair, Bug, Shield, ArrowRight, Clock, ChevronRight } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { mockGraphNodes, mockAttackPaths } from "@/lib/mockData";
import { cn } from "@/lib/utils";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  variant = "default",
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub: string;
  variant?: "default" | "danger" | "amber" | "violet";
  delay?: number;
}) {
  const iconStyle = {
    default: "text-ink-tertiary",
    danger:  "text-danger-text",
    amber:   "text-amber-text",
    violet:  "text-violet-text",
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-ink-tertiary font-medium">{label}</span>
        <Icon className={cn("w-4 h-4", iconStyle)} />
      </div>
      <p className="text-2xl font-bold tracking-tight text-ink tabular" style={{ letterSpacing: "-0.02em" }}>
        {value}
      </p>
      <p className="text-xs text-ink-tertiary mt-1">{sub}</p>
    </motion.div>
  );
}

function PathRow({ path, delay = 0 }: { path: (typeof mockAttackPaths)[0]; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className="flex items-center gap-3 py-3 border-b border-border last:border-0"
    >
      <div
        className={cn(
          "w-1 h-8 rounded-full shrink-0",
          path.severity === "critical" ? "bg-danger" : path.severity === "high" ? "bg-amber" : "bg-violet"
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink font-medium truncate">{path.name}</p>
        <p className="text-xs text-ink-tertiary mt-0.5">
          {path.nodes.length} nodes · {path.steps.length} steps
        </p>
      </div>
      <span
        className={cn(
          path.severity === "critical" ? "badge-critical" : path.severity === "high" ? "badge-high" : "badge-medium"
        )}
      >
        {path.severity}
      </span>
    </motion.div>
  );
}

const activity = [
  { text: "Scan completed — prod-cluster",                     time: "2m ago",   dot: "bg-success" },
  { text: "CVE-2024-21626 matched on webapp-pod",              time: "18m ago",  dot: "bg-danger" },
  { text: "Critical attack path detected (Internet → secret)", time: "1h ago",   dot: "bg-danger" },
  { text: "RBAC policy change — default-sa binding updated",   time: "3h ago",   dot: "bg-amber" },
  { text: "Weekly report generated",                           time: "Yesterday", dot: "bg-border-strong" },
];

export default function DashboardPage() {
  const critical = mockGraphNodes.filter((n) => n.riskLevel === "critical").length;
  const cves     = mockGraphNodes.reduce((s, n) => s + (n.cves?.length ?? 0), 0);
  const crowns   = mockGraphNodes.filter((n) => n.isCrownJewel).length;
  const paths    = mockAttackPaths.length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* Critical banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between p-4 rounded-xl bg-danger-muted border border-danger-border"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-danger-text shrink-0" />
          <div>
            <p className="text-sm font-medium text-danger-text">
              2 critical attack paths require attention
            </p>
            <p className="text-xs text-danger-text/70 mt-0.5">
              Last scanned 2 minutes ago · prod-cluster
            </p>
          </div>
        </div>
        <Link href="/dashboard/attack-paths">
          <button className="text-xs font-medium text-danger-text hover:text-danger transition-colors flex items-center gap-1">
            View paths <ArrowRight className="w-3 h-3" />
          </button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={AlertTriangle} label="Critical nodes"  value={critical} sub="Require remediation"     variant="danger" delay={0.05} />
        <StatCard icon={Crosshair}     label="Attack paths"    value={paths}    sub={`${paths - 1} critical, 1 high`} variant="danger" delay={0.1} />
        <StatCard icon={Bug}           label="CVEs matched"    value={cves}     sub="2 critical severity"     variant="amber"  delay={0.15} />
        <StatCard icon={Shield}        label="Crown jewels"    value={crowns}   sub="High-value targets"      variant="violet" delay={0.2} />
      </div>

      {/* Main two-column */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Attack paths */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.22 }}
          className="lg:col-span-2 card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink">Attack paths</h2>
            <Link href="/dashboard/attack-paths">
              <span className="text-xs text-ink-tertiary hover:text-ink-secondary transition-colors flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          {mockAttackPaths.map((p, i) => (
            <PathRow key={p.id} path={p} delay={0.25 + i * 0.06} />
          ))}
        </motion.div>

        {/* Risk distribution */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.28 }}
          className="card p-5"
        >
          <h2 className="text-sm font-semibold text-ink mb-4">Risk distribution</h2>
          <div className="space-y-3">
            {(["critical", "high", "medium", "low"] as const).map((level) => {
              const count = mockGraphNodes.filter((n) => n.riskLevel === level).length;
              const pct   = (count / mockGraphNodes.length) * 100;
              const color = {
                critical: "bg-danger",
                high:     "bg-amber",
                medium:   "bg-violet",
                low:      "bg-border-strong",
              }[level];
              return (
                <div key={level}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-ink-secondary capitalize">{level}</span>
                    <span className="text-ink-tertiary tabular">{count}</span>
                  </div>
                  <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
                      className={cn("h-full rounded-full", color)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-xs">
              <span className="text-ink-tertiary">Total nodes</span>
              <span className="text-ink tabular font-medium">{mockGraphNodes.length}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Activity */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.35 }}
        className="card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-ink-tertiary" />
          <h2 className="text-sm font-semibold text-ink">Activity</h2>
        </div>
        <div className="space-y-0">
          {activity.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.38 + i * 0.05 }}
              className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
            >
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.dot)} />
              <p className="text-sm text-ink-secondary flex-1">{item.text}</p>
              <span className="text-xs text-ink-tertiary tabular shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
