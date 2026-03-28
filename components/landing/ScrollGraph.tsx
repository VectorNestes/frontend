"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring, MotionValue, useTransform } from "framer-motion";

function ScrollDots({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => setActive(Math.floor(v * 5)));
  }, [scrollYProgress]);

  return (
    <div className="flex items-center gap-2 mt-8">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-0.5 w-6 rounded-full transition-colors duration-300"
          style={{ background: active >= i ? "#7C3AED" : "#27272A" }}
        />
      ))}
    </div>
  );
}

/* ─── graph data ─── */

interface SNode {
  id: string;
  x: number;    // 0–1 (relative to canvas)
  y: number;
  label: string;
  kind: "internet" | "pod" | "sa" | "role" | "secret";
  crown?: boolean;
}

interface SEdge {
  from: string;
  to: string;
  attack?: boolean; // part of the highlighted attack path
}

const NODES: SNode[] = [
  { id: "internet", x: 0.08, y: 0.50, label: "Internet", kind: "internet" },
  { id: "webapp", x: 0.26, y: 0.28, label: "webapp-pod", kind: "pod" },
  { id: "api", x: 0.26, y: 0.72, label: "api-pod", kind: "pod" },
  { id: "sa-def", x: 0.46, y: 0.35, label: "default-sa", kind: "sa" },
  { id: "sa-adm", x: 0.46, y: 0.65, label: "cluster-admin-sa", kind: "sa" },
  { id: "role-ca", x: 0.64, y: 0.50, label: "cluster-admin", kind: "role" },
  { id: "secret-db", x: 0.82, y: 0.30, label: "db-credentials", kind: "secret", crown: true },
  { id: "secret-key", x: 0.82, y: 0.70, label: "api-keys", kind: "secret", crown: true },
];

const EDGES: SEdge[] = [
  { from: "internet", to: "webapp", attack: true },
  { from: "internet", to: "api" },
  { from: "webapp", to: "sa-def", attack: true },
  { from: "api", to: "sa-adm" },
  { from: "sa-def", to: "role-ca", attack: true },
  { from: "sa-adm", to: "role-ca" },
  { from: "role-ca", to: "secret-db", attack: true },
  { from: "role-ca", to: "secret-key" },
];

const ATTACK_PATH = ["internet", "webapp", "sa-def", "role-ca", "secret-db"];

/* ─── scroll states ─── */
// progress: 0–1 through the sticky scroll range

function getVisibleNodes(progress: number): string[] {
  if (progress < 0.15) return ["internet", "webapp", "api"];
  if (progress < 0.40) return NODES.filter((n) => n.kind !== "secret").map((n) => n.id);
  return NODES.map((n) => n.id);
}

function getVisibleEdges(progress: number): SEdge[] {
  if (progress < 0.15) return [];
  if (progress < 0.40) return EDGES.filter((e) => !e.attack);
  return EDGES;
}

function isAttackActive(progress: number): boolean {
  return progress >= 0.60;
}

function getCrownActive(progress: number): boolean {
  return progress >= 0.82;
}

function getScrollLabel(
  progress: number
): { heading: string; body: string } {
  if (progress < 0.15) return { heading: "Clusters are complex.", body: "Hundreds of pods, accounts, and bindings — interconnected." };
  if (progress < 0.40) return { heading: "Permissions create hidden paths.", body: "Every RBAC binding is a potential lateral movement opportunity." };
  if (progress < 0.65) return { heading: "Attackers don't guess. They traverse.", body: "A single compromised pod can reach your most sensitive secrets." };
  if (progress < 0.88) return { heading: "Find the path before they do.", body: "VECTORNETES maps every possible route from exposure to crown jewel." };
  return { heading: "You're in control.", body: "Detect, prioritise, and remediate — with full context." };
}

/* ─── node styling ─── */
const kindStyle: Record<SNode["kind"], { fill: string; stroke: string; labelColor: string; radius: number }> = {
  internet: { fill: "#18181B", stroke: "#3F3F46", labelColor: "#A1A1AA", radius: 22 },
  pod: { fill: "#18181B", stroke: "#3F3F46", labelColor: "#A1A1AA", radius: 18 },
  sa: { fill: "#1C1425", stroke: "#4C1D95", labelColor: "#A78BFA", radius: 18 },
  role: { fill: "#1C1608", stroke: "#78350F", labelColor: "#FCD34D", radius: 18 },
  secret: { fill: "#1C0A0A", stroke: "#7F1D1D", labelColor: "#FCA5A5", radius: 20 },
};

/* ─── canvas renderer ─── */
interface RendererProps {
  progress: number;
  width: number;
  height: number;
}

function renderFrame(
  ctx: CanvasRenderingContext2D,
  props: RendererProps
) {
  const { progress, width, height } = props;
  ctx.clearRect(0, 0, width, height);

  const visibleNodes = getVisibleNodes(progress);
  const visibleEdges = getVisibleEdges(progress);
  const attackActive = isAttackActive(progress);
  const crownActive = getCrownActive(progress);

  const nodeMap = new Map<string, SNode>();
  NODES.forEach((n) => nodeMap.set(n.id, n));

  const getPos = (n: SNode) => ({ x: n.x * width, y: n.y * height });

  // Determine attack progress along path
  let attackProgressNodes = 0;
  if (attackActive) {
    attackProgressNodes = Math.min(
      ATTACK_PATH.length - 1,
      ((progress - 0.60) / 0.28) * (ATTACK_PATH.length - 1)
    );
  }

  /* ── edges ── */
  visibleEdges.forEach((edge) => {
    const from = nodeMap.get(edge.from);
    const to = nodeMap.get(edge.to);
    if (!from || !to) return;

    const fp = getPos(from);
    const tp = getPos(to);

    const fromVisible = visibleNodes.includes(edge.from);
    const toVisible = visibleNodes.includes(edge.to);
    if (!fromVisible || !toVisible) return;

    // Check if this edge is on the attack path
    const fromIdx = ATTACK_PATH.indexOf(edge.from);
    const toIdx = ATTACK_PATH.indexOf(edge.to);
    const isAttackEdge = edge.attack && fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    const edgeProgress = isAttackEdge
      ? Math.max(0, Math.min(1, attackProgressNodes - fromIdx))
      : 1;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(fp.x, fp.y);
    ctx.lineTo(tp.x, tp.y);

    if (isAttackEdge && attackActive) {
      const grad = ctx.createLinearGradient(fp.x, fp.y, tp.x, tp.y);
      grad.addColorStop(0, "rgba(220,38,38,0.8)");
      grad.addColorStop(1, `rgba(220,38,38,${edgeProgress * 0.7})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.globalAlpha = edgeProgress;
      // dashed for attack
      ctx.setLineDash([5, 6]);
    } else {
      ctx.strokeStyle = "#27272A";
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.7;
    }

    ctx.stroke();
    ctx.restore();
  });

  /* ── nodes ── */
  NODES.forEach((node) => {
    if (!visibleNodes.includes(node.id)) return;

    const pos = getPos(node);
    const st = kindStyle[node.kind];
    const isOnAttackPath = ATTACK_PATH.includes(node.id);
    const attackIdx = ATTACK_PATH.indexOf(node.id);
    const nodeActivated = attackActive && attackProgressNodes >= attackIdx;
    const isCrownActivated = node.crown && crownActive;

    ctx.save();
    ctx.globalAlpha = 1;

    // Subtle crown jewel glow — not neon, just a soft warm ring
    if (isCrownActivated) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, st.radius + 8, 0, Math.PI * 2);
      const glowGrad = ctx.createRadialGradient(pos.x, pos.y, st.radius, pos.x, pos.y, st.radius + 12);
      glowGrad.addColorStop(0, "rgba(220,38,38,0.15)");
      glowGrad.addColorStop(1, "rgba(220,38,38,0)");
      ctx.fillStyle = glowGrad;
      ctx.fill();
    }

    // Attack path activated ring
    if (nodeActivated && !isCrownActivated) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, st.radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(220,38,38,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Node fill
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, st.radius, 0, Math.PI * 2);
    ctx.fillStyle = nodeActivated
      ? node.crown
        ? "#2D0808"
        : "#1A0C0C"
      : st.fill;
    ctx.fill();

    // Node stroke
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, st.radius, 0, Math.PI * 2);
    ctx.strokeStyle = nodeActivated
      ? node.crown ? "#DC2626" : "rgba(220,38,38,0.5)"
      : st.stroke;
    ctx.lineWidth = nodeActivated ? 1.5 : 1;
    ctx.stroke();

    // Label
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = nodeActivated ? (node.crown ? "#FCA5A5" : "#F87171") : st.labelColor;
    ctx.fillText(node.label, pos.x, pos.y + st.radius + 14);

    // Crown badge
    if (node.crown) {
      ctx.font = "9px Inter, sans-serif";
      ctx.fillStyle = isCrownActivated ? "#DC2626" : "#7F1D1D";
      ctx.fillText("crown jewel", pos.x, pos.y + st.radius + 24);
    }

    ctx.restore();
  });
}

/* ─── component ─── */
export default function ScrollGraph() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 400 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the spring
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // Label transitions
  const [label, setLabel] = useState(getScrollLabel(0));

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const unsubscribe = smooth.on("change", (v) => {
      setLabel(getScrollLabel(v));
      renderFrame(ctx, { progress: v, width: dims.w, height: dims.h });
    });

    // Initial render
    renderFrame(ctx, { progress: 0, width: dims.w, height: dims.h });

    return () => unsubscribe();
  }, [smooth, dims]);

  // Resize
  useEffect(() => {
    const update = () => {
      const w = Math.min(window.innerWidth * 0.55, 780);
      const h = Math.max(w * 0.52, 300);
      setDims({ w, h });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section
      ref={sectionRef}
      /* tall enough for comfortable scrolling through states */
      className="relative"
      style={{ height: "420vh" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Left: text */}
        <div className="w-full md:w-2/5 pl-8 md:pl-16 pr-8 z-10">
          <motion.div
            key={label.heading}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <p className="section-label mb-3">Attack surface</p>
            <h2
              className="text-3xl font-bold tracking-tight text-ink mb-3"
              style={{ letterSpacing: "-0.025em" }}
            >
              {label.heading}
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed max-w-xs">
              {label.body}
            </p>
          </motion.div>

          {/* Scroll progress indicator */}
          <ScrollDots scrollYProgress={scrollYProgress} />
        </div>

        {/* Right: canvas graph */}
        <div className="hidden md:flex flex-1 items-center justify-center pr-12 relative">
          <div className="relative rounded-2xl border border-border bg-surface overflow-hidden shadow-xl">
            {/* Fake window chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-elevated">
              <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
              <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
              <div className="w-2.5 h-2.5 rounded-full bg-border-strong" />
              <span className="text-xs text-ink-tertiary ml-3 font-mono">
                VECTORNETES — graph view
              </span>
            </div>

            <canvas
              ref={canvasRef}
              width={dims.w}
              height={dims.h}
              className="block"
              style={{ background: "#0B0B0C" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
