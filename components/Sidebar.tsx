"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ScanLine,
  GitBranch,
  Crosshair,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import toast from "react-hot-toast";

const nav = [
  { href: "/dashboard",              icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/scan",         icon: ScanLine,        label: "Scan",        badge: null },
  { href: "/dashboard/graph",        icon: GitBranch,       label: "Graph view" },
  { href: "/dashboard/attack-paths", icon: Crosshair,       label: "Attack paths", count: 3 },
  { href: "/dashboard/settings",     icon: Settings,        label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, setUser } = useAppStore();

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    toast.success("Signed out");
    router.push("/login");
  };

  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen bg-surface border-r border-border">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
        <div className="w-6 h-6 rounded-md bg-violet flex items-center justify-center shrink-0">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-ink">Kubeview</span>
      </div>

      {/* Cluster pill */}
      <div className="mx-3 mt-3 mb-1">
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-elevated border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
          <span className="text-xs text-ink-secondary truncate font-mono flex-1">
            prod-cluster
          </span>
          <ChevronRight className="w-3 h-3 text-ink-tertiary shrink-0" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        <p className="section-label px-3 py-2">Navigation</p>
        {nav.map(({ href, icon: Icon, label, count }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}>
              <div className={active ? "nav-item-active" : "nav-item"}>
                <Icon className={cn("w-4 h-4 shrink-0", active ? "text-ink" : "text-ink-tertiary")} />
                <span className="flex-1">{label}</span>
                {count != null && (
                  <span
                    className={cn(
                      "text-2xs font-semibold px-1.5 py-0.5 rounded-sm",
                      active
                        ? "bg-danger-muted text-danger-text border border-danger-border"
                        : "bg-elevated text-ink-tertiary border border-border"
                    )}
                  >
                    {count}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border space-y-0.5">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-md">
          <div className="w-6 h-6 rounded-full bg-violet-muted border border-violet-border flex items-center justify-center text-2xs font-semibold text-violet-text shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-ink truncate">{user?.name ?? "User"}</p>
            <p className="text-2xs text-ink-tertiary truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="nav-item w-full text-ink-tertiary hover:text-danger-text">
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
