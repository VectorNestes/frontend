"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Invalid email";
    if (!password) e.password = "Required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    await new Promise((r) => setTimeout(r, 900));

    const user = { name: email.split("@")[0], email };
    setUser(user);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("auth_token", "mock_token");
    }
    toast.success("Signed in");
    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex w-[420px] bg-surface border-r border-border flex-col justify-between p-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-violet flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-ink">VECTORNETES</span>
        </div>

        {/* Decorative mini graph */}
        <div className="space-y-3">
          {[
            { label: "Internet", kind: "border-border-strong text-ink-tertiary" },
            { label: "webapp-pod", kind: "border-border-strong text-ink-secondary", indent: 4 },
            { label: "default-sa", kind: "border-violet-border text-violet-text", indent: 8 },
            { label: "cluster-admin", kind: "border-amber-border text-amber-text", indent: 12 },
            { label: "db-credentials", kind: "border-danger-border text-danger-text", indent: 16 },
          ].map(({ label, kind, indent = 0 }) => (
            <div
              key={label}
              className={`flex items-center gap-2 text-xs font-mono border rounded px-2 py-1.5 bg-canvas ${kind}`}
              style={{ marginLeft: indent }}
            >
              <span className="w-1 h-1 rounded-full bg-current opacity-60 shrink-0" />
              {label}
            </div>
          ))}

          <div className="mt-4 px-2 py-1.5 rounded bg-danger-muted border border-danger-border">
            <p className="text-xs text-danger-text font-medium">
              Critical path detected — 5 hops
            </p>
          </div>
        </div>

        <p className="text-xs text-ink-tertiary leading-relaxed">
          "We found a critical path to our production database in 40 seconds."
          <br />
          <span className="text-ink-secondary mt-1 block">— Security lead, Series B startup</span>
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-6 h-6 rounded-md bg-violet flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-ink">VECTORNETES</span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-ink mb-1"
            style={{ letterSpacing: "-0.02em" }}>
            Sign in
          </h1>
          <p className="text-sm text-ink-secondary mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-violet-text hover:text-violet transition-colors">
              Sign up free
            </Link>
          </p>

          {errors.form && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-danger-muted border border-danger-border text-danger-text text-sm mb-4"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.form}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-medium text-ink-secondary mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="you@company.com"
                autoComplete="email"
                className={`input-base ${errors.email ? "border-danger-border focus:shadow-ring-danger" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-danger-text mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-ink-secondary">Password</label>
                <a href="#" className="text-xs text-ink-tertiary hover:text-ink-secondary transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input-base pr-10 ${errors.password ? "border-danger-border focus:shadow-ring-danger" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink-secondary transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-danger-text mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-10 justify-center"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </form>

          <div className="relative my-5">
            <div className="divider" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-canvas px-3 text-xs text-ink-tertiary">
              or
            </span>
          </div>

          <button
            type="button"
            onClick={() => toast("Google OAuth — coming soon")}
            className="btn-secondary w-full h-10 justify-center"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </motion.div>
      </div>
    </div>
  );
}
