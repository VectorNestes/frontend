import React from "react";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

export default function DocumentationPage() {
  const sections = [
    { id: "get-the-package", title: "Get the Package" },
    { id: "project-overview", title: "1. Project Overview" },
    { id: "architecture", title: "2. Architecture" },
    { id: "installation", title: "3. Installation" },
    { id: "cli-reference", title: "4. CLI Reference" },
    { id: "workflows", title: "5. Workflows" },
    { id: "use-cases", title: "6. Use Cases" },
    { id: "configuration", title: "7. Configuration" },
    { id: "troubleshooting", title: "8. Troubleshooting" },
    { id: "security-contributing", title: "Security & Contributing" },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans p-6 sm:p-12 lg:p-16 selection:bg-primary-dim">
      <div className="max-w-7xl mx-auto">
        {/* Navbar / Home Link */}
        <div className="mb-10 border-b border-border pb-6">
          <Link href="/" className="inline-flex items-center text-violet hover:text-violet-text transition-colors font-mono text-sm group">
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Table of Contents - Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 space-y-6">
              <h3 className="font-mono text-xs text-ink-tertiary tracking-widest uppercase mb-4">On this page</h3>
              <nav className="flex flex-col space-y-2">
                {sections.map((sec) => (
                  <a 
                    key={sec.id} 
                    href={`#${sec.id}`}
                    className="text-sm text-ink-secondary hover:text-violet-text transition-colors py-1 border-l-2 border-transparent hover:border-violet-text pl-3"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Areas */}
          <div className="flex-1 space-y-16">
            
            {/* Header */}
            <header className="space-y-6" id="header">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink">
                K8s-AV — Kubernetes Attack Path Visualizer
              </h1>
              <p className="text-xl text-ink-secondary font-medium">Technical Documentation | v1.0.0</p>
              <blockquote className="border-l-4 border-violet pl-6 py-2 pb-2 text-lg text-ink-secondary italic bg-surface/30 rounded-r-lg">
                K8s-AV transforms Kubernetes misconfigurations into real, actionable attack paths — so you can understand and fix them effectively.
              </blockquote>
              <div className="flex flex-wrap gap-3 font-mono text-xs text-ink-tertiary">
                <span className="px-3 py-1 rounded-full bg-surface border border-border">Local-first</span>
                <span className="px-3 py-1 rounded-full bg-surface border border-border">MIT Licensed</span>
                <span className="px-3 py-1 rounded-full bg-surface border border-border">Node.js v18+</span>
                <span className="px-3 py-1 rounded-full bg-surface border border-border">Docker Required</span>
              </div>
            </header>

            <hr className="border-border" />

            {/* Get the Package */}
            <section id="get-the-package" className="space-y-4 pt-4 scroll-mt-24">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                🚀 Get the Package
              </h2>
              <p className="text-ink-secondary">
                👉 <a href="https://www.npmjs.com/package/k8s-av" target="_blank" rel="noopener noreferrer" className="text-violet-text hover:underline transition-colors">https://www.npmjs.com/package/k8s-av</a>
              </p>
              <CodeBlock code="npx k8s-av start" language="bash" />
            </section>

            <hr className="border-border" />

            {/* 1. Project Overview */}
            <section id="project-overview" className="space-y-10 pt-4 scroll-mt-24">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">1. Project Overview</h2>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-violet">1.1 What is K8s-AV?</h3>
                  <p className="text-ink-secondary leading-relaxed">
                    K8s-AV (Kubernetes Attack Path Visualizer) is an open-source, local-first security analysis tool that maps, visualizes, and explains the complete attack surface of a Kubernetes cluster.
                  </p>
                  <p className="text-ink-secondary leading-relaxed">
                    Instead of producing isolated vulnerability lists, K8s-AV models your cluster as a <strong className="text-ink font-semibold">property graph</strong> and computes <strong className="text-ink font-semibold">real exploitable attack paths</strong> — from entry points to critical resources (crown jewels).
                  </p>
                  <div className="bg-surface/50 border border-border p-4 rounded-lg flex items-center gap-3">
                    <span className="text-xl">🔒</span>
                    <p className="text-sm text-ink-secondary"><strong>Privacy-first:</strong> All processing happens locally. No cluster data is transmitted externally.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-violet">1.2 Problem Statement</h3>
                  <p className="text-ink-secondary">Traditional tools answer: <br/><em>“What is vulnerable?”</em></p>
                  <p className="text-ink-secondary">But they fail to answer: <br/><em>“How can an attacker actually exploit this?”</em></p>
                  <p className="text-ink-secondary">This leads to:</p>
                  <ul className="list-disc list-inside text-ink-secondary space-y-1 pl-4">
                    <li>Alert fatigue</li>
                    <li>Poor prioritization</li>
                    <li>Lack of actionable insight</li>
                  </ul>
                  <div className="bg-violet/10 border border-violet/20 p-4 rounded-lg">
                    <p className="text-violet-text font-medium">
                      👉 K8s-AV shifts the focus to: <br/>
                      <span className="text-lg font-bold text-ink">“How can an attacker move through my system?”</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-violet">1.3 Core Questions Answered</h3>
                  <ul className="list-disc list-inside text-ink-secondary space-y-2 pl-4">
                    <li>Where can an attacker enter the cluster?</li>
                    <li>How can they move laterally?</li>
                    <li>Which assets are most critical?</li>
                    <li>What are the complete attack chains?</li>
                    <li>What should be fixed first?</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-violet">1.4 Key Capabilities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CapabilityCard icon="🔍" title="Cluster Scanning" desc="Extracts Kubernetes resources via kubectl (live or mock)" />
                    <CapabilityCard icon="🔗" title="Attack Path Detection" desc="Uses BFS + Dijkstra algorithms" />
                    <CapabilityCard icon="⚠️" title="Vulnerability Analysis" desc="CVE enrichment with NVD + CVSS scoring" />
                    <CapabilityCard icon="📊" title="Graph Visualization" desc="Interactive local UI" />
                    <CapabilityCard icon="🧾" title="Kill-Chain Reports" desc="Readable attack narratives" />
                    <CapabilityCard icon="🔒" title="Local-First Security" desc="No telemetry or external data sharing" />
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* 2. Architecture */}
            <section id="architecture" className="space-y-8 pt-4 scroll-mt-24">
              <h2 className="text-3xl font-bold">2. Architecture</h2>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-violet">2.1 System Layers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border text-ink-secondary">
                        <th className="py-3 px-4 font-mono font-medium">Layer</th>
                        <th className="py-3 px-4 font-mono font-medium">Responsibility</th>
                      </tr>
                    </thead>
                    <tbody className="text-ink-secondary">
                      <tr className="border-b border-border/50 bg-surface/20">
                        <td className="py-3 px-4 font-medium">CLI</td>
                        <td className="py-3 px-4">Command execution + orchestration</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 font-medium">Scanner</td>
                        <td className="py-3 px-4">Extracts cluster resources</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-surface/20">
                        <td className="py-3 px-4 font-medium">Graph Builder</td>
                        <td className="py-3 px-4">Converts data into nodes + edges</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 font-medium">Neo4j + GDS</td>
                        <td className="py-3 px-4">Graph storage + algorithms</td>
                      </tr>
                      <tr className="bg-surface/20">
                        <td className="py-3 px-4 font-medium">Backend + UI</td>
                        <td className="py-3 px-4">API + visualization</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-violet">2.2 Data Flow</h3>
                <CodeBlock 
                  code={`Kubernetes Cluster
            ↓
    CLI (kubectl scan)
            ↓
    CVE Enrichment (NVD)
            ↓
    Graph Transformation
            ↓
    Neo4j (Graph DB)
            ↓
    GDS Algorithms (BFS, Dijkstra, PageRank)
            ↓
    Backend APIs
            ↓
    React UI`} 
                  language="text" 
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-violet">2.3 Graph Model</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-2">Node Types</h4>
                    <ul className="list-disc list-inside text-ink-secondary space-y-1 text-sm">
                      <li>Pod</li>
                      <li>ServiceAccount</li>
                      <li>Secret</li>
                      <li>ConfigMap</li>
                      <li>Role / ClusterRole</li>
                      <li>RoleBinding / ClusterRoleBinding</li>
                      <li>Deployment</li>
                      <li>Service</li>
                      <li>Namespace</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Edge Types</h4>
                    <ul className="space-y-2 text-sm text-ink-secondary">
                      <li className="flex justify-between border-b border-border/50 pb-1">
                        <span className="font-mono text-xs text-violet">BOUND_TO</span>
                        <span>Pod → ServiceAccount</span>
                      </li>
                      <li className="flex justify-between border-b border-border/50 pb-1">
                        <span className="font-mono text-xs text-violet">HAS_ROLE</span>
                        <span>ServiceAccount → Role</span>
                      </li>
                      <li className="flex justify-between border-b border-border/50 pb-1">
                        <span className="font-mono text-xs text-violet">CAN_READ_SECRET</span>
                        <span>Role → Secret</span>
                      </li>
                      <li className="flex justify-between border-b border-border/50 pb-1">
                        <span className="font-mono text-xs text-violet">CAN_EXEC</span>
                        <span>Role → Pod</span>
                      </li>
                      <li className="flex justify-between border-b border-border/50 pb-1">
                        <span className="font-mono text-xs text-violet">MOUNT...</span>
                        <span>(and more...)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-violet">2.4 Tech Stack</h3>
                <div className="flex flex-wrap gap-2 text-sm font-mono tracking-tight">
                  {['Node.js', 'Neo4j', 'Neo4j GDS', 'kubectl', 'NVD API', 'Express.js', 'React', 'Docker'].map((tech) => (
                    <span key={tech} className="px-3 py-1.5 bg-surface border border-border rounded-md text-violet-text">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* 3. Installation */}
            <section id="installation" className="space-y-8 pt-4 scroll-mt-24">
              <h2 className="text-3xl font-bold">3. Installation</h2>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-violet">3.1 Prerequisites</h3>
                <ul className="list-disc list-inside text-ink-secondary space-y-1">
                  <li>Node.js ≥ 18</li>
                  <li>npm ≥ 9</li>
                  <li>Docker</li>
                  <li>kubectl</li>
                  <li>kubeconfig</li>
                </ul>
                <p className="text-amber-500 bg-amber-500/10 inline-block px-3 py-1 rounded text-sm mt-2 border border-amber-500/20">
                  ⚠️ Only read access required
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-violet">3.2 Install Options</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-ink-secondary">Zero Install (Recommended)</h4>
                    <CodeBlock code="npx k8s-av start" language="bash" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-ink-secondary">Global Install</h4>
                    <CodeBlock code={`npm install -g k8s-av\nk8s-av start`} language="bash" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-violet">3.3 First Run</h3>
                <p className="text-ink-secondary">Automatically:</p>
                <ul className="list-disc list-inside text-ink-secondary space-y-1 pl-4">
                  <li>Starts Docker</li>
                  <li>Launches Neo4j</li>
                  <li>Starts backend (3001)</li>
                  <li>Starts UI (3000)</li>
                  <li>Opens browser</li>
                </ul>
              </div>
            </section>

            <hr className="border-border" />

            {/* 4. CLI Reference */}
            <section id="cli-reference" className="space-y-8 pt-4 scroll-mt-24">
              <h2 className="text-3xl font-bold">4. CLI Reference</h2>
              <CodeBlock code="k8s-av <command> [options]" language="bash" />
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Start</h4>
                  <CodeBlock code="k8s-av start --source live" language="bash" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Scan</h4>
                  <CodeBlock code="k8s-av scan --output data.json" language="bash" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ingest</h4>
                  <CodeBlock code="k8s-av ingest --source live --wipe" language="bash" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Report</h4>
                  <CodeBlock code="k8s-av report --format json --output report.json" language="bash" />
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* 5. Workflows */}
            <section id="workflows" className="space-y-8 pt-4 scroll-mt-24">
              <h2 className="text-3xl font-bold">5. Workflows</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface border border-border p-5 rounded-xl">
                  <h4 className="font-semibold mb-3 text-violet">Quick Start</h4>
                  <CodeBlock code="npx k8s-av start" language="bash" />
                </div>
                <div className="bg-surface border border-border p-5 rounded-xl">
                  <h4 className="font-semibold mb-3 text-violet">Offline Mode</h4>
                  <CodeBlock code="k8s-av scan --mock" language="bash" />
                </div>
                <div className="bg-surface border border-border p-5 rounded-xl md:col-span-2">
                  <h4 className="font-semibold mb-3 text-violet">Live Cluster</h4>
                  <CodeBlock code={`k8s-av start --source live\nk8s-av ingest --source live --wipe\nk8s-av report --crown-jewels`} language="bash" />
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* Use Cases, Config, Troubleshooting */}
            <div className="space-y-12">
              <section id="use-cases" className="space-y-4 pt-4 scroll-mt-24">
                <h2 className="text-2xl font-bold">6. Use Cases</h2>
                <div className="flex flex-wrap gap-2 text-sm text-ink-secondary">
                  {['Privilege escalation detection', 'RBAC misconfigurations', 'Entry point discovery', 'Crown jewel analysis', 'Security audits', 'Developer testing'].map((uc) => (
                    <span key={uc} className="bg-surface/50 border border-border px-3 py-1 rounded-full">{uc}</span>
                  ))}
                </div>
              </section>

              <section id="configuration" className="space-y-4 pt-4 scroll-mt-24">
                <h2 className="text-2xl font-bold">7. Configuration</h2>
                <CodeBlock 
                  code={`NEO4J_URI=bolt://localhost:7687\nNEO4J_PASSWORD=yourpassword\nAPI_PORT=3001\nUI_PORT=3000\nNVD_API_KEY=optional`} 
                  language="env" 
                />
              </section>

              <section id="troubleshooting" className="space-y-4 pt-4 scroll-mt-24">
                <h2 className="text-2xl font-bold">8. Troubleshooting</h2>
                <CodeBlock 
                  code={`docker ps\nkubectl config get-contexts\ndocker restart k8sav-neo4j`} 
                  language="bash" 
                />
              </section>

              <section id="security-contributing" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-border scroll-mt-24">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold flex items-center gap-2">🛡️ Security & Privacy</h2>
                  <ul className="list-disc list-inside text-ink-secondary space-y-1 text-sm">
                    <li>No telemetry</li>
                    <li>No external data transfer</li>
                    <li>Uses kubeconfig</li>
                    <li>Read-only access</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-bold flex items-center gap-2">🤝 Contributing</h2>
                  <CodeBlock 
                    code={`git clone <repo>\nnpm install\nnpm run dev`} 
                    language="bash" 
                  />
                </div>
              </section>

              <div className="text-center pt-16 pb-8 text-ink-tertiary text-sm">
                <p>MIT License © 2025 K8s-AV Contributors</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function CapabilityCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="font-semibold text-ink mb-1">{title}</h4>
      <p className="text-sm text-ink-secondary">{desc}</p>
    </div>
  );
}

function CodeBlock({ code, language }: { code: string, language: string }) {
  return (
    <div className="relative group rounded-lg overflow-hidden bg-[#0A0E1A] border border-border/50">
      <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/5">
        <span className="text-xs font-mono text-ink-tertiary uppercase">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-ink-secondary">
        <code>{code}</code>
      </pre>
    </div>
  );
}
