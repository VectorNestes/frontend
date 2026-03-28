"use client";

import {
  LayoutDashboard,
  GitBranch,
  Bug,
  Target,
  FileText,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore, ActiveView } from "@/store/useAppStore";

const nav: Array<{
  view: ActiveView;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = [
  { view: "overview",        icon: LayoutDashboard, label: "Overview" },
  { view: "paths",           icon: GitBranch,       label: "Attack Paths" },
  { view: "vulnerabilities", icon: Bug,             label: "Vulnerabilities" },
  { view: "critical",        icon: Target,          label: "Critical Node" },
  { view: "report",          icon: FileText,        label: "Report" },
];

export default function Sidebar() {
  const { activeView, setActiveView } = useAppStore();

  return (
    <aside className="w-40 shrink-0 flex flex-col h-screen bg-surface border-r border-border">
      {/* Logo */}
      <div className="h-12 flex items-center gap-2 px-4 border-b border-border">
        <div className="w-5 h-5 rounded bg-violet flex items-center justify-center shrink-0">
          <Shield className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-ink">
          Kubeview
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {nav.map(({ view, icon: Icon, label }) => {
          const active = activeView === view;
          return (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150 border-l-2",
                active
                  ? "text-ink bg-elevated border-l-violet font-medium"
                  : "text-ink-tertiary hover:text-ink hover:bg-elevated border-l-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  active ? "text-ink" : "text-ink-tertiary"
                )}
              />
              <span className="text-left text-xs leading-snug">{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
