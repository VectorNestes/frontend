"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const titles: Record<string, string> = {
  "/dashboard":              "Overview",
  "/dashboard/scan":         "Scan cluster",
  "/dashboard/graph":        "Graph view",
  "/dashboard/attack-paths": "Attack paths",
  "/dashboard/settings":     "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const { user } = useAppStore();

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-border bg-surface">
      <h1 className="text-sm font-semibold text-ink tracking-tight">
        {titles[pathname] ?? "Dashboard"}
      </h1>

      <div className="flex items-center gap-2">
        {/* Alert badge */}
        <div className="relative">
          <button className="btn-ghost h-8 w-8 p-0 justify-center">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-danger border border-surface" />
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-border mx-1" />

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-violet-muted border border-violet-border flex items-center justify-center text-2xs font-semibold text-violet-text">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-ink leading-none">{user?.name ?? "User"}</p>
            <p className="text-2xs text-ink-tertiary mt-0.5">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
