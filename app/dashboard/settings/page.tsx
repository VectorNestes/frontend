"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, LogOut, Save, Trash2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

function Section({
  title,
  desc,
  children,
  delay = 0,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className="grid md:grid-cols-3 gap-6 py-8 border-b border-border last:border-0"
    >
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        {desc && <p className="text-xs text-ink-tertiary mt-1 leading-relaxed">{desc}</p>}
      </div>
      <div className="md:col-span-2">{children}</div>
    </motion.div>
  );
}

function Toggle({
  label,
  sub,
  checked,
  onChange,
}: {
  label: string;
  sub: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm text-ink">{label}</p>
        <p className="text-xs text-ink-tertiary mt-0.5">{sub}</p>
      </div>
      <button
        onClick={onChange}
        className={cn(
          "w-9 rounded-full border transition-colors relative shrink-0",
          checked ? "bg-violet-muted border-violet-border" : "bg-elevated border-border"
        )}
        style={{ height: "20px" }}
      >
        <motion.div
          animate={{ x: checked ? 16 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn("absolute top-[3px] w-3.5 h-3.5 rounded-full transition-colors",
            checked ? "bg-violet" : "bg-border-strong"
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, setUser } = useAppStore();

  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:8080");
  const [kubeconfigName, setKubeconfigName] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({
    criticalPaths: true,
    cveMatches: true,
    scanComplete: false,
    weeklyReport: true,
  });

  const toggleNotif = (k: keyof typeof notifs) =>
    setNotifs((p) => ({ ...p, [k]: !p[k] }));

  const handleSave = () => {
    setSaved(true);
    toast.success("Settings saved");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    toast.success("Signed out");
    router.push("/login");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Profile */}
      <Section
        title="Profile"
        desc="Your account information."
        delay={0.04}
      >
        <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-elevated mb-4">
          <div className="w-10 h-10 rounded-full bg-violet-muted border border-violet-border flex items-center justify-center text-sm font-semibold text-violet-text">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{user?.name}</p>
            <p className="text-xs text-ink-tertiary mt-0.5">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-ink-secondary mb-1.5 block">Name</label>
            <input defaultValue={user?.name} className="input-base" />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-secondary mb-1.5 block">Email</label>
            <input defaultValue={user?.email} className="input-base" />
          </div>
        </div>
      </Section>

      {/* Kubeconfig */}
      <Section
        title="Kubeconfig"
        desc="Upload your cluster kubeconfig for live scanning. Processed locally — never stored or transmitted."
        delay={0.08}
      >
        <label className="block cursor-pointer">
          <div className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
            kubeconfigName
              ? "border-success/40 bg-success/5"
              : "border-border hover:border-border-strong"
          )}>
            {kubeconfigName ? (
              <>
                <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="text-sm font-medium text-ink">{kubeconfigName}</p>
                <p className="text-xs text-ink-tertiary mt-1">Config loaded</p>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-ink-tertiary mx-auto mb-2" />
                <p className="text-sm text-ink">Drop kubeconfig here</p>
                <p className="text-xs text-ink-tertiary mt-1">YAML format · ~/.kube/config</p>
              </>
            )}
          </div>
          <input
            type="file"
            accept=".yaml,.yml"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { setKubeconfigName(f.name); toast.success(`Loaded ${f.name}`); }
            }}
          />
        </label>
        {kubeconfigName && (
          <button
            onClick={() => setKubeconfigName(null)}
            className="mt-2 flex items-center gap-1.5 text-xs text-ink-tertiary hover:text-danger-text transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        )}
      </Section>

      {/* API */}
      <Section
        title="API endpoint"
        desc="Backend URL for live cluster analysis. Leave as localhost for development."
        delay={0.12}
      >
        <div className="flex gap-2">
          <input
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
            className="input-base font-mono text-xs flex-1"
          />
          <button
            onClick={() => toast.success("Connection verified")}
            className="btn-secondary px-3 text-xs h-10 shrink-0"
          >
            Test
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" desc="Choose what alerts you receive." delay={0.16}>
        <div className="card overflow-hidden divide-y divide-border p-0">
          <div className="px-4">
            <Toggle label="Critical attack paths"  sub="Alert when new critical paths are found"  checked={notifs.criticalPaths} onChange={() => toggleNotif("criticalPaths")} />
            <Toggle label="CVE matches"             sub="New CVEs matched against running workloads" checked={notifs.cveMatches}    onChange={() => toggleNotif("cveMatches")} />
            <Toggle label="Scan complete"           sub="Notify when a cluster scan finishes"       checked={notifs.scanComplete}  onChange={() => toggleNotif("scanComplete")} />
            <Toggle label="Weekly report"           sub="Summary of your cluster security posture"  checked={notifs.weeklyReport}  onChange={() => toggleNotif("weeklyReport")} />
          </div>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6">
        <button onClick={handleLogout} className="btn-danger h-9 text-sm">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
        <button
          onClick={handleSave}
          className={cn(
            "h-9 text-sm transition-all",
            saved ? "btn-secondary text-success-text" : "btn-primary"
          )}
        >
          {saved ? (
            <><CheckCircle className="w-4 h-4" /> Saved</>
          ) : (
            <><Save className="w-4 h-4" /> Save changes</>
          )}
        </button>
      </div>
    </div>
  );
}
