"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import toast from "react-hot-toast";

interface Fields {
  name: string;
  email: string;
  password: string;
  confirm: string;
}
interface Errs { name?: string; email?: string; password?: string; confirm?: string }

function pwStrength(pw: string): 0 | 1 | 2 | 3 {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s as 0 | 1 | 2 | 3;
}

const STRENGTH_LABEL = ["", "Weak", "Moderate", "Strong"];
const STRENGTH_COLOR = ["", "bg-danger", "bg-amber", "bg-success"];

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAppStore();

  const [f, setF] = useState<Fields>({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errs>({});

  const upd = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validate = (): Errs => {
    const e: Errs = {};
    if (!f.name.trim()) e.name = "Required";
    if (!f.email) e.email = "Required";
    else if (!/\S+@\S+/.test(f.email)) e.email = "Invalid email";
    if (!f.password) e.password = "Required";
    else if (f.password.length < 8) e.password = "Minimum 8 characters";
    if (!f.confirm) e.confirm = "Required";
    else if (f.confirm !== f.password) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));

    const user = { name: f.name, email: f.email };
    setUser(user);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("auth_token", "mock_token");
    }
    toast.success("Account created");
    router.push("/dashboard");
    setLoading(false);
  };

  const strength = pwStrength(f.password);

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-6 h-6 rounded-md bg-violet flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-ink">VECTORNETES</span>
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-ink mb-1"
          style={{ letterSpacing: "-0.02em" }}>
          Create account
        </h1>
        <p className="text-sm text-ink-secondary mb-8">
          Already have one?{" "}
          <Link href="/login" className="text-violet-text hover:text-violet transition-colors">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-ink-secondary mb-1.5 block">Name</label>
            <input
              type="text"
              value={f.name}
              onChange={upd("name")}
              placeholder="Jane Smith"
              autoComplete="name"
              className={`input-base ${errors.name ? "border-danger-border" : ""}`}
            />
            {errors.name && <p className="text-xs text-danger-text mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-ink-secondary mb-1.5 block">Work email</label>
            <input
              type="email"
              value={f.email}
              onChange={upd("email")}
              placeholder="you@company.com"
              autoComplete="email"
              className={`input-base ${errors.email ? "border-danger-border" : ""}`}
            />
            {errors.email && <p className="text-xs text-danger-text mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-medium text-ink-secondary mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={f.password}
                onChange={upd("password")}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                className={`input-base pr-10 ${errors.password ? "border-danger-border" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink-secondary"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Strength */}
            {f.password.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? STRENGTH_COLOR[strength] : "bg-border-strong"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-ink-tertiary w-14">{STRENGTH_LABEL[strength]}</span>
              </div>
            )}
            {errors.password && <p className="text-xs text-danger-text mt-1">{errors.password}</p>}
          </div>

          {/* Confirm */}
          <div>
            <label className="text-xs font-medium text-ink-secondary mb-1.5 block">Confirm password</label>
            <div className="relative">
              <input
                type="password"
                value={f.confirm}
                onChange={upd("confirm")}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`input-base pr-10 ${errors.confirm ? "border-danger-border" : ""}`}
              />
              {f.confirm.length > 0 && f.confirm === f.password && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-success" />
              )}
            </div>
            {errors.confirm && <p className="text-xs text-danger-text mt-1">{errors.confirm}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full h-10 justify-center mt-1">
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create account <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </form>

        <p className="text-xs text-ink-tertiary text-center mt-6 leading-relaxed">
          By continuing, you agree to our{" "}
          <a href="#" className="text-ink-secondary hover:text-ink transition-colors">Terms</a>
          {" "}and{" "}
          <a href="#" className="text-ink-secondary hover:text-ink transition-colors">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
}
