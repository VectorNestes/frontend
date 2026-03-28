"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, ChevronRight, Check } from "lucide-react";
import ScrollGraph from "@/components/landing/ScrollGraph";

/* ─── micro-components ─── */

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-8 border-b border-border bg-canvas/90 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-violet flex items-center justify-center">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-ink">Kubeview</span>
        <span className="text-2xs font-medium px-1.5 py-0.5 rounded bg-violet-muted border border-violet-border text-violet-text ml-1">
          beta
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
        <Link href="/signup" className="btn-primary text-sm">
          Get started <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </nav>
  );
}

function FadeSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FeatureRow({
  title,
  description,
  tag,
  delay = 0,
}: {
  title: string;
  description: string;
  tag: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="flex items-start gap-4 py-5 border-b border-border last:border-0"
    >
      <span className="shrink-0 text-2xs font-semibold text-ink-tertiary tabular mt-0.5 w-6">
        {tag}
      </span>
      <div>
        <p className="text-sm font-medium text-ink mb-1">{title}</p>
        <p className="text-sm text-ink-secondary leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

/* ─── main page ─── */
export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="bg-canvas text-ink">
      <NavBar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-14 px-6">
        {/* Subtle background gradient — no neon */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeSection delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-elevated text-xs text-ink-secondary mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Now in public beta — free for individual clusters
            </div>
          </FadeSection>

          <FadeSection delay={0.06}>
            <h1
              className="text-5xl md:text-6xl font-bold tracking-tighter text-ink mb-5 leading-none"
              style={{ letterSpacing: "-0.035em" }}
            >
              Kubernetes Security.
              <br />
              <span className="text-ink-secondary">Visualized.</span>
            </h1>
          </FadeSection>

          <FadeSection delay={0.12}>
            <p className="text-lg text-ink-secondary max-w-xl mx-auto mb-10 leading-relaxed">
              Understand how attackers move through your cluster —{" "}
              <em className="not-italic text-ink">
                not just where vulnerabilities exist
              </em>
              .
            </p>
          </FadeSection>

          <FadeSection delay={0.18}>
            <div className="flex items-center justify-center gap-3">
              <Link href="/signup" className="btn-primary text-sm h-10 px-5">
                Start scan <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/dashboard" className="btn-secondary text-sm h-10 px-5">
                View demo
              </Link>
            </div>
          </FadeSection>

          <FadeSection delay={0.24}>
            <div className="flex items-center justify-center gap-6 mt-8 text-xs text-ink-tertiary">
              {[
                "No data leaves your cluster",
                "Works with any K8s provider",
                "Free to start",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-success-text" />
                  {item}
                </span>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── SCROLL GRAPH SECTION ── */}
      <ScrollGraph />

      {/* ── FEATURES ── */}
      <section className="max-w-5xl mx-auto px-6 py-32">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left column */}
          <div>
            <FadeSection>
              <p className="section-label mb-4">Capabilities</p>
              <h2
                className="text-3xl font-bold tracking-tight text-ink mb-4"
                style={{ letterSpacing: "-0.025em" }}
              >
                Built for security teams who think in graphs
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Traditional scanners output lists. Kubeview outputs a navigable
                attack surface model — every permission, every relationship,
                every blast radius.
              </p>
            </FadeSection>
          </div>

          {/* Right column — feature rows */}
          <div className="border-t border-border">
            <FeatureRow
              tag="01"
              title="Attack path discovery"
              description="Graph traversal from every entry point to every crown jewel. Ranked by exploitability."
              delay={0}
            />
            <FeatureRow
              tag="02"
              title="RBAC relationship mapping"
              description="Every ServiceAccount, Role, and binding rendered as navigable edges. Find wildcard permissions instantly."
              delay={0.05}
            />
            <FeatureRow
              tag="03"
              title="CVE enrichment"
              description="Running image SHAs matched against NVD and OSV databases. Vulnerabilities anchored to real nodes."
              delay={0.1}
            />
            <FeatureRow
              tag="04"
              title="Crown jewel detection"
              description="Automatically identify Secrets, config maps, and database pods that represent highest-value targets."
              delay={0.15}
            />
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF / STATS ── */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: "11K+",  label: "Clusters analysed" },
              { value: "240ms", label: "Median scan latency" },
              { value: "99.7%", label: "CVE match accuracy" },
            ].map(({ value, label }) => (
              <FadeSection key={label} className="text-center">
                <p
                  className="text-4xl font-bold tracking-tighter text-ink mb-1"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  {value}
                </p>
                <p className="text-sm text-ink-secondary">{label}</p>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <FadeSection>
            <h2
              className="text-4xl font-bold tracking-tight text-ink mb-4"
              style={{ letterSpacing: "-0.025em" }}
            >
              Map your attack surface.
              <br />
              Before they do.
            </h2>
            <p className="text-sm text-ink-secondary mb-8 max-w-md mx-auto leading-relaxed">
              Connect your kubeconfig and get a full attack graph in under a minute.
              No agent required.
            </p>
            <Link href="/signup" className="btn-primary text-sm h-11 px-7">
              Start free scan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-violet flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-ink-secondary">Kubeview</span>
          </div>
          <p className="text-xs text-ink-tertiary">
            © 2025 Kubeview. Hackathon build.
          </p>
          <div className="flex items-center gap-5 text-xs text-ink-tertiary">
            <a href="#" className="hover:text-ink-secondary transition-colors">Docs</a>
            <a href="#" className="hover:text-ink-secondary transition-colors">GitHub</a>
            <a href="#" className="hover:text-ink-secondary transition-colors">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
