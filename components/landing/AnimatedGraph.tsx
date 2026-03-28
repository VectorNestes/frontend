"use client";

import { useEffect, useRef } from "react";

interface GraphNode {
  x: number;
  y: number;
  label: string;
  type: "entry" | "crown" | "high" | "normal";
  pulsePhase: number;
}

interface GraphEdge {
  from: number;
  to: number;
  progress: number;
  speed: number;
  isAttack: boolean;
}

export default function AnimatedGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: GraphNode[] = [
      { x: 0.1, y: 0.5, label: "Internet", type: "entry", pulsePhase: 0 },
      { x: 0.3, y: 0.25, label: "webapp-pod", type: "high", pulsePhase: 1 },
      { x: 0.3, y: 0.75, label: "api-pod", type: "high", pulsePhase: 2 },
      { x: 0.55, y: 0.4, label: "default-sa", type: "normal", pulsePhase: 0.5 },
      { x: 0.55, y: 0.7, label: "admin-sa", type: "high", pulsePhase: 1.5 },
      { x: 0.75, y: 0.5, label: "cluster-admin", type: "high", pulsePhase: 0.8 },
      { x: 0.9, y: 0.3, label: "db-secret", type: "crown", pulsePhase: 0 },
      { x: 0.9, y: 0.7, label: "api-keys", type: "crown", pulsePhase: 1 },
    ];

    const edges: GraphEdge[] = [
      { from: 0, to: 1, progress: 0, speed: 0.004, isAttack: true },
      { from: 0, to: 2, progress: 0.5, speed: 0.003, isAttack: false },
      { from: 1, to: 3, progress: 0.2, speed: 0.005, isAttack: true },
      { from: 2, to: 4, progress: 0.7, speed: 0.004, isAttack: false },
      { from: 3, to: 5, progress: 0.4, speed: 0.003, isAttack: true },
      { from: 4, to: 5, progress: 0.1, speed: 0.004, isAttack: false },
      { from: 5, to: 6, progress: 0.6, speed: 0.005, isAttack: true },
      { from: 5, to: 7, progress: 0.3, speed: 0.004, isAttack: false },
    ];

    let time = 0;

    const getNodePos = (node: GraphNode) => ({
      x: node.x * canvas.width,
      y: node.y * canvas.height,
    });

    const nodeColor = (type: GraphNode["type"]) => {
      switch (type) {
        case "entry": return "#00d4ff";
        case "crown": return "#ef4444";
        case "high": return "#f97316";
        default: return "#8b5cf6";
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      // Draw edges
      edges.forEach((edge) => {
        const from = getNodePos(nodes[edge.from]);
        const to = getNodePos(nodes[edge.to]);

        // Base edge
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = edge.isAttack ? "#ef4444" : "#8b5cf6";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.restore();

        // Animated dot
        edge.progress += edge.speed;
        if (edge.progress > 1) edge.progress = 0;

        const dotX = from.x + (to.x - from.x) * edge.progress;
        const dotY = from.y + (to.y - from.y) * edge.progress;

        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = edge.isAttack ? "#ef4444" : "#00d4ff";
        ctx.shadowBlur = 8;
        ctx.shadowColor = edge.isAttack ? "#ef4444" : "#00d4ff";
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw nodes
      nodes.forEach((node) => {
        const { x, y } = getNodePos(node);
        const color = nodeColor(node.type);
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.3 + 0.7;
        const radius = node.type === "crown" || node.type === "entry" ? 18 : 14;

        // Glow ring
        ctx.save();
        ctx.globalAlpha = pulse * 0.3;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Main circle
        ctx.save();
        ctx.globalAlpha = 0.9;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, color + "40");
        grad.addColorStop(1, color + "10");
        ctx.fillStyle = grad;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Label
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px JetBrains Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.label, x, y + radius + 14);
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
