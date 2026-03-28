"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUser } = useAppStore();

  useEffect(() => {
    // Restore session from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      const token = localStorage.getItem("auth_token");
      if (stored && token) {
        setUser(JSON.parse(stored));
      } else {
        // Auto-login for demo purposes
        const demoUser = { name: "Demo User", email: "demo@k8s-viz.io" };
        setUser(demoUser);
        localStorage.setItem("user", JSON.stringify(demoUser));
        localStorage.setItem("auth_token", "demo_token");
      }
    }
  }, [setUser]);

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto cyber-grid-bg">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
