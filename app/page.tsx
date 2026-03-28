"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ─── GLOBAL STYLES ─── */
const CSS = `
:root{--bg:#0A0E1A;--bg2:#0F172A;--bg3:#131C2E;--surface:rgba(255,255,255,0.04);--surface-hover:rgba(249,115,22,0.08);--primary:#F97316;--primary-glow:rgba(249,115,22,0.35);--primary-dim:rgba(249,115,22,0.12);--primary-dark:#C2570A;--primary-bright:#FB923C;--secondary:#38BDF8;--secondary-glow:rgba(56,189,248,0.3);--secondary-dim:rgba(56,189,248,0.1);--amber:#F59E0B;--red:#EF4444;--green:#22C55E;--purple:#A78BFA;--cyan:#00f5ff;--gold:#FFD700;--text:#F8FAFC;--muted:rgba(248,250,252,0.45);--muted-strong:rgba(248,250,252,0.65);--border:rgba(249,115,22,0.15);--border-blue:rgba(56,189,248,0.12);--border-subtle:rgba(255,255,255,0.06);--glow:0 0 30px rgba(249,115,22,0.4);--glow-strong:0 0 60px rgba(249,115,22,0.25),0 0 120px rgba(249,115,22,0.1);--glow-blue:0 0 30px rgba(56,189,248,0.35);--glow-red:0 0 30px rgba(239,68,68,0.35);--mono:'JetBrains Mono','Fira Code','Courier New',monospace;--sans:'Inter',system-ui,sans-serif;}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{background:var(--bg);color:var(--text);font-family:var(--sans);overflow-x:hidden;cursor:none!important;}
a,button{cursor:none!important;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes pulseOp{0%,100%{opacity:.3}50%{opacity:1}}
@keyframes floatY{0%,100%{transform:translateY(-8px)}50%{transform:translateY(8px)}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes radar{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes pdot{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)}50%{box-shadow:0 0 0 8px rgba(34,197,94,0)}}
@keyframes blob1{0%,100%{transform:translate(0,0)scale(1)}50%{transform:translate(40px,-30px)scale(1.1)}}
@keyframes blob2{0%,100%{transform:translate(0,0)scale(1)}50%{transform:translate(-35px,40px)scale(.9)}}
@keyframes blob3{0%,100%{transform:translate(0,0)scale(1.05)}50%{transform:translate(25px,20px)scale(.95)}}
@keyframes blob4{0%,100%{transform:translate(0,0)scale(.95)}50%{transform:translate(-20px,-30px)scale(1.05)}}
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes shieldPulse{0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,.4)}50%{box-shadow:0 0 0 14px rgba(249,115,22,0)}}
@keyframes footerDot{0%{left:0}100%{left:calc(100% - 8px)}}
@keyframes dotTravel{0%{left:0}100%{left:calc(100% - 10px)}}
.kvs>*{opacity:0;transform:translateY(60px);transition:opacity 800ms cubic-bezier(.16,1,.3,1),transform 800ms cubic-bezier(.16,1,.3,1);}
.kvs.vis>*:nth-child(1){opacity:1;transform:none;transition-delay:0ms}
.kvs.vis>*:nth-child(2){opacity:1;transform:none;transition-delay:100ms}
.kvs.vis>*:nth-child(3){opacity:1;transform:none;transition-delay:200ms}
.kvs.vis>*:nth-child(4){opacity:1;transform:none;transition-delay:300ms}
.kvs.vis>*:nth-child(5){opacity:1;transform:none;transition-delay:400ms}
.kvs.vis>*:nth-child(6){opacity:1;transform:none;transition-delay:500ms}
.fl{position:relative;text-decoration:none;color:var(--muted);font-size:13px;transition:color .2s;}
.fl::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:var(--primary);transition:width .25s;}
.fl:hover{color:var(--text);}.fl:hover::after{width:100%;}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}.cursor,.trail{display:none!important;}.kvs>*{opacity:1!important;transform:none!important;}}
`;


/* ─── LOADING OVERLAY ─── */
function LoadingOverlay({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const full = "INITIALIZING VECTORNETES...";
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setText(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, 60);
    const prog = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 24);
    setTimeout(() => {
      clearInterval(prog);
      setFading(true);
      setTimeout(onDone, 400);
    }, 1600);
    return () => { clearInterval(t); clearInterval(prog); };
  }, [onDone]);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0A0E1A", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "opacity .4s", opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "all" }}>
      <div style={{ fontFamily: "var(--mono)", color: "var(--text)", fontSize: 18, letterSpacing: 2, marginBottom: 24 }}>{text}<span style={{ animation: "blink 1s infinite", color: "var(--primary)" }}>_</span></div>
      <div style={{ width: 280, height: 2, background: "rgba(249,115,22,.15)", borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #F97316, #38BDF8)", borderRadius: 2, boxShadow: "0 0 8px rgba(249,115,22,.5)", transition: "width .1s" }} />
      </div>
    </div>
  );
}

/* ─── CUSTOM CURSOR ─── */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trail = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const pos = useRef({ x: 0, y: 0 });
  const trailPos = useRef([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);
  const big = useRef(false);
  useEffect(() => {
    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      big.current = !!(t.closest("a") || t.closest("button"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    const delays = [40, 80, 120, 160];
    const timers = delays.map((d, i) => setTimeout(function tick() {
      const trail0 = i === 0 ? pos.current : trailPos.current[i - 1];
      trailPos.current[i].x += (trail0.x - trailPos.current[i].x) * 0.3;
      trailPos.current[i].y += (trail0.y - trailPos.current[i].y) * 0.3;
      const el = trail[i].current;
      if (el) { el.style.left = trailPos.current[i].x - 3 + "px"; el.style.top = trailPos.current[i].y - 3 + "px"; el.style.opacity = String(0.5 - i * 0.12); }
      setTimeout(tick, d);
    }, d));
    let af: number;
    const render = () => {
      const c = cursorRef.current;
      if (c) {
        const s = big.current ? 40 : 8;
        c.style.width = s + "px"; c.style.height = s + "px";
        c.style.left = pos.current.x - s / 2 + "px"; c.style.top = pos.current.y - s / 2 + "px";
      }
      af = requestAnimationFrame(render);
    };
    af = requestAnimationFrame(render);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); cancelAnimationFrame(af); timers.forEach(clearTimeout); };
  }, []);
  const sizes = [4, 3, 2, 1];
  return (<>
    <div ref={cursorRef} className="cursor" style={{ position: "fixed", borderRadius: "50%", background: "var(--primary)", zIndex: 9998, pointerEvents: "none", transition: "width .15s,height .15s", willChange: "transform" }} />
    {sizes.map((s, i) => <div key={i} ref={trail[i]} className="trail" style={{ position: "fixed", width: s * 2 + "px", height: s * 2 + "px", borderRadius: "50%", background: "var(--primary)", zIndex: 9997, pointerEvents: "none" }} />)}
  </>);
}

/* ─── NOISE OVERLAY ─── */
function NoiseOverlay() {
  return (<>
    <div style={{ position: "fixed", inset: 0, zIndex: 9990, pointerEvents: "none", opacity: .04, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "256px" }} />
    <div style={{ position: "fixed", inset: 0, zIndex: 9989, pointerEvents: "none", background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(56,189,248,0.015) 2px,rgba(56,189,248,0.015) 4px)" }} />
  </>);
}

/* ─── FIXED HUD ─── */
const CHAPTERS = ["HERO", "ATTACK GRAPH", "CAPABILITIES", "DEMO", "STATS", "TERMINAL", "HOW IT WORKS"];
function FixedHUD({ ready }: { ready: boolean }) {
  const [depth, setDepth] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [easter, setEaster] = useState("");
  const [showEaster, setShowEaster] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [flash, setFlash] = useState(false);
  const lastChapter = useRef(0);

  useEffect(() => {
    if (!ready) return;
    const onScroll = () => {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      setDepth(Math.min(pct, 100));
      const ch = Math.min(Math.floor(pct / (100 / CHAPTERS.length)), CHAPTERS.length - 1);
      if (ch !== lastChapter.current) { lastChapter.current = ch; setChapter(ch); setFlash(true); setTimeout(() => setFlash(false), 80); }
    };
    const resetIdle = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        const msg = "> anomalous session detected...";
        setShowEaster(true);
        let i = 0;
        const t = setInterval(() => { i++; setEaster(msg.slice(0, i)); if (i >= msg.length) { clearInterval(t); setTimeout(() => { setShowEaster(false); setEaster(""); }, 3000); } }, 50);
      }, 30000);
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    resetIdle();
    const onClick = (e: MouseEvent) => {
      const id = Date.now();
      setRipples(r => [...r, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples(r => r.filter(x => x.id !== id)), 400);
    };
    window.addEventListener("click", onClick);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", resetIdle); window.removeEventListener("keydown", resetIdle); window.removeEventListener("click", onClick); clearTimeout(idleTimer.current); };
  }, [ready]);

  if (!ready) return null;
  return (<>
    {flash && <div style={{ position: "fixed", inset: 0, zIndex: 9985, background: "rgba(255,255,255,.03)", pointerEvents: "none" }} />}
    <div style={{ position: "fixed", bottom: 20, left: 20, zIndex: 9994, fontFamily: "var(--mono)", fontSize: 10, color: "var(--primary)", letterSpacing: 2 }}>DEPTH: {String(depth).padStart(3, "0")}%</div>
    <div style={{ position: "fixed", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 9994, display: "flex", flexDirection: "column", gap: 8 }}>
      {CHAPTERS.map((c, i) => (<div key={c} style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 1, color: i === chapter ? "var(--primary)" : "rgba(248,250,252,.2)", transition: "color .3s", whiteSpace: "nowrap" }}>{i === chapter ? "▶ " : "  "}{c}</div>))}
    </div>
    {showEaster && <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9994, fontFamily: "var(--mono)", fontSize: 11, color: "var(--primary)", animation: "pulseOp 1s infinite" }}>{easter}</div>}
    {ripples.map(r => (<div key={r.id} style={{ position: "fixed", left: r.x, top: r.y, zIndex: 9993, pointerEvents: "none", width: 0, height: 0 }}><div style={{ position: "absolute", transform: "translate(-50%,-50%)", border: "2px solid var(--primary)", borderRadius: "50%", animation: "none", width: 0, height: 0 }} className="ripple-anim" /></div>))}
  </>);
}

/* ─── HERO CANVAS ─── */
function HeroCanvas({ ready }: { ready: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use a callback ref so we get called the instant the element mounts
  // with real DOM dimensions — no polling needed
  const startedRef = useRef(false);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current!;
    if (!canvas) return;

    let af: number;

    const initAndDraw = () => {
      // Force correct canvas buffer size from actual rendered size
      const parent = canvas.parentElement;
      const w = parent?.offsetWidth || window.innerWidth * 0.5;
      const h = parent?.offsetHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      type NodeDef = { rx: number; ry: number; type: string; color: string; };
      const nodeDefs: NodeDef[] = [
        ...Array.from({ length: 4 }, (_, i) => ({ rx: 0.15 + i * 0.18, ry: 0.25, type: "pod", color: "#38BDF8" })),
        ...Array.from({ length: 3 }, (_, i) => ({ rx: 0.2 + i * 0.2, ry: 0.45, type: "sa", color: "#A78BFA" })),
        ...Array.from({ length: 3 }, (_, i) => ({ rx: 0.25 + i * 0.2, ry: 0.65, type: "secret", color: "#EF4444" })),
        ...Array.from({ length: 2 }, (_, i) => ({ rx: 0.3 + i * 0.35, ry: 0.8, type: "db", color: "#F59E0B" })),
        ...Array.from({ length: 3 }, (_, i) => ({ rx: 0.1 + i * 0.4, ry: 0.55, type: "role", color: "#22C55E" })),
        ...Array.from({ length: 3 }, (_, i) => ({ rx: 0.6 + i * 0.1, ry: 0.35, type: "cm", color: "#A78BFA" })),
      ];
      const edges = [[0, 4], [1, 5], [2, 6], [3, 7], [4, 8], [5, 9], [6, 10], [7, 11], [8, 12], [9, 13], [10, 14], [0, 12], [1, 13]];
      const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01234ABCDEF".split("");
      const path = [0, 4, 8, 10, 13];
      let pathT = 0, pulseNode = -1, pulseTime = 0, dashOffset = 0, t = 0;
      const nx: number[] = new Array(nodeDefs.length).fill(0);
      const ny: number[] = new Array(nodeDefs.length).fill(0);
      const rainState = Array.from({ length: 15 }, () => ({ y: Math.random() * 600, speed: 0.8 + Math.random() * 1.5 }));

      // Handle resize properly
      const ro = new ResizeObserver(() => {
        const pp = canvas.parentElement;
        if (pp && pp.offsetWidth > 0) {
          canvas.width = pp.offsetWidth;
          canvas.height = pp.offsetHeight;
        }
      });
      ro.observe(canvas.parentElement!);

      const ctx = canvas.getContext("2d")!;

      const draw = () => {
        t++;
        const W = canvas.width, H = canvas.height;
        if (!W || !H) { af = requestAnimationFrame(draw); return; }

        const scrollY = window.scrollY;
        const fade = Math.max(0, 1 - (scrollY / window.innerHeight) * 1.5);
        ctx.clearRect(0, 0, W, H);
        ctx.globalAlpha = fade;

        nodeDefs.forEach((d, i) => {
          nx[i] = d.rx * W + Math.sin(t * 0.3 + i) * 12;
          ny[i] = d.ry * H + Math.cos(t * 0.3 + i * 1.3) * 12;
        });

        // Matrix rain
        ctx.save(); ctx.globalAlpha = fade * 0.04; ctx.fillStyle = "#38BDF8"; ctx.font = "12px monospace";
        const colW = W / 15;
        rainState.forEach((r, i) => {
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * colW, r.y);
          r.y = (r.y + r.speed) % H;
        });
        ctx.restore();

        // Edges
        dashOffset -= 0.5;
        ctx.save(); ctx.strokeStyle = "rgba(56,189,248,0.2)"; ctx.lineWidth = 1;
        ctx.setLineDash([6, 4]); ctx.lineDashOffset = dashOffset; ctx.globalAlpha = fade;
        edges.forEach(([a, b]) => {
          if (a >= nx.length || b >= nx.length) return;
          ctx.beginPath(); ctx.moveTo(nx[a], ny[a]); ctx.lineTo(nx[b], ny[b]); ctx.stroke();
        });
        ctx.setLineDash([]); ctx.restore();

        // Nodes
        nodeDefs.forEach((d, i) => {
          const isPulse = i === pulseNode;
          const pS = isPulse ? 1 + Math.sin((Date.now() - pulseTime) / 400 * Math.PI) * 0.8 : 1;
          ctx.save(); ctx.globalAlpha = fade; ctx.fillStyle = isPulse ? "#EF4444" : d.color;
          ctx.shadowColor = d.color; ctx.shadowBlur = 8;
          ctx.translate(nx[i], ny[i]); ctx.scale(pS, pS);
          if (d.type === "pod" || d.type === "cm") {
            ctx.beginPath(); ctx.arc(0, 0, d.type === "pod" ? 8 : 6, 0, Math.PI * 2); ctx.fill();
          } else if (d.type === "sa") {
            ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(8, 0); ctx.lineTo(0, 8); ctx.lineTo(-8, 0); ctx.closePath(); ctx.fill();
          } else if (d.type === "secret") {
            ctx.fillRect(-7, -7, 14, 14);
          } else if (d.type === "db") {
            ctx.beginPath();
            for (let h = 0; h < 6; h++) { const a = (h / 6) * Math.PI * 2 - Math.PI / 2; ctx[h === 0 ? "moveTo" : "lineTo"](Math.cos(a) * 10, Math.sin(a) * 10); }
            ctx.closePath(); ctx.fill();
          } else if (d.type === "role") {
            ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(8, 6); ctx.lineTo(-8, 6); ctx.closePath(); ctx.fill();
          }
          ctx.restore();
        });

        // Attack path tracer
        const segCount = path.length - 1;
        const seg = Math.floor(pathT * segCount);
        const segFrac = (pathT * segCount) % 1;
        if (seg < segCount && path[seg] < nx.length && path[seg + 1] < nx.length) {
          const tx = nx[path[seg]] + (nx[path[seg + 1]] - nx[path[seg]]) * segFrac;
          const ty = ny[path[seg]] + (ny[path[seg + 1]] - ny[path[seg]]) * segFrac;
          ctx.save(); ctx.globalAlpha = fade; ctx.fillStyle = "#F97316"; ctx.shadowColor = "#F97316"; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(tx, ty, 4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
        pathT += 0.002;
        if (pathT > 1) {
          pulseNode = path[path.length - 1]; pulseTime = Date.now();
          setTimeout(() => { pulseNode = -1; }, 400);
          pathT = 0;
        }
        ctx.globalAlpha = 1;
        af = requestAnimationFrame(draw);
      };

      af = requestAnimationFrame(draw);
      return () => { cancelAnimationFrame(af); ro.disconnect(); };
    };

    // Delay slightly to let the DOM fully paint after loading overlay fades
    const cleanup = { fn: () => { } };
    const timer = setTimeout(() => {
      cleanup.fn = initAndDraw() || (() => { });
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanup.fn();
      cancelAnimationFrame(af!);
    };
  }, [ready]);

  return (
    <canvas
      ref={canvasRef}
      id="hero-canvas"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

/* ─── HERO HUD BOX ─── */

function HeroHUD() {
  const [vals, setVals] = useState({ nodes: 847, paths: 23, jewels: 3 });
  const [flash, setFlash] = useState<string[]>([]);
  useEffect(() => {
    const t = setInterval(() => {
      const keys = ["nodes", "paths", "jewels"] as const;
      const k = keys[Math.floor(Math.random() * keys.length)];
      setVals(v => ({ ...v, [k]: v[k] + (Math.random() > 0.5 ? 1 : -1) }));
      setFlash([k]);
      setTimeout(() => setFlash([]), 300);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const bars = [0.4, 0.7, 0.9, 0.6, 0.8];
  return (
    <div style={{ position: "absolute", top: 80, right: 40, fontFamily: "var(--mono)", fontSize: 11, background: "rgba(10,14,26,.7)", backdropFilter: "blur(16px)", border: "1px solid var(--border-blue)", borderRadius: 6, padding: "14px 18px", minWidth: 200, zIndex: 10 }}>
      <div style={{ color: "var(--secondary)", fontSize: 10, letterSpacing: 3, marginBottom: 10 }}>LIVE THREAT SCAN</div>
      {[["Nodes indexed", vals.nodes, "nodes"], ["Attack paths", vals.paths, "paths"], ["Crown jewels", vals.jewels, "jewels"]].map(([label, val, key]) => (
        <div key={key as string} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
          <span style={{ color: "var(--muted)" }}>{label as string}</span>
          <span style={{ color: (flash.includes(key as string)) ? "var(--secondary)" : "var(--text)", transition: "color .2s" }}>{val as number}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ color: "var(--muted)" }}>Status</span>
        <span style={{ color: "var(--green)" }}>MONITORING <span style={{ color: "var(--red)", animation: "blink 1s infinite" }}>●</span></span>
      </div>
      <div style={{ display: "flex", gap: 3, marginTop: 10, alignItems: "flex-end", height: 20 }}>
        {bars.map((h, i) => <div key={i} style={{ width: 3, height: h * 20, background: "var(--secondary)", opacity: .6, animation: `blink ${0.8 + i * 0.2}s infinite`, animationDelay: `${i * 0.15}s` }} />)}
      </div>
    </div>
  );
}

/* ─── NAVLINK ─── */
function NavBar() {
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", borderBottom: "1px solid var(--border)", background: "rgba(10,14,26,.85)", backdropFilter: "blur(16px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, background: "var(--primary)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff" }}>⬡</div>
        <span style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>VECTORNETES</span>
      </div>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>

        <Link href="/documentation" style={{ background: "linear-gradient(135deg, #F97316, #C2570A)", color: "#fff", fontWeight: 700, padding: "8px 18px", borderRadius: 6, textDecoration: "none", fontSize: 13, fontFamily: "var(--sans)" }}>Documentation</Link>
      </div>
    </nav>
  );
}

/* ─── SECTION 1: HERO ─── */
function HeroSection({ ready }: { ready: boolean }) {
  const [wordsIn, setWordsIn] = useState(false);
  useEffect(() => { if (ready) setTimeout(() => setWordsIn(true), 300); }, [ready]);
  const words = ["Kubernetes", "Security."];
  return (
    <section style={{ position: "relative", height: "100vh", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      {/* ── LEFT: Text Content ── */}
      <div style={{
        position: "relative", zIndex: 10, width: "55%", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "80px 56px 80px 160px",
        background: "linear-gradient(105deg, rgba(10,14,26,1) 0%, rgba(10,14,26,0.96) 60%, rgba(10,14,26,0.7) 100%)",
      }}>
        {/* Subtle left-side ambient glow */}
        <div style={{ position: "absolute", top: "30%", left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(44px,5.5vw,80px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 8, overflow: "hidden", textAlign: "left" }}>
          {words.map((w, i) => (
            <span key={w} style={{ display: "block", transform: wordsIn ? "translateY(0)" : "translateY(110%)", opacity: wordsIn ? 1 : 0, transition: `transform 700ms cubic-bezier(.16,1,.3,1) ${i * 150}ms, opacity 700ms ${i * 150}ms` }}>{w}</span>
          ))}
          <span style={{ background: "linear-gradient(135deg, #F97316, #FB923C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block", transform: wordsIn ? "translateY(0)" : "translateY(110%)", opacity: wordsIn ? 1 : 0, transition: "transform 700ms cubic-bezier(.16,1,.3,1) 300ms, opacity 700ms 300ms" }}>Visualized.</span>
        </h1>

        {/* Subheading */}
        <p style={{ fontSize: 18, color: "var(--muted)", maxWidth: 480, marginTop: 28, marginBottom: 40, lineHeight: 1.7, opacity: wordsIn ? 1 : 0, transform: wordsIn ? "none" : "translateY(20px)", transition: "all 600ms 400ms", textAlign: "left" }}>
          Understand how attackers move through your cluster —{" "}
          <em style={{ fontStyle: "normal", color: "var(--text)" }}>not just where vulnerabilities exist</em>.
        </p>

        {/* Trust badges */}
        <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap", opacity: wordsIn ? 1 : 0, transition: "opacity 600ms 700ms" }}>
          {["✓ No data leaves your cluster", "✓ Works with any K8s provider", "✓ Free to start"].map(t => (
            <span key={t} style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}><span style={{ color: "var(--green)" }}>✓</span> {t.slice(2)}</span>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Animated Canvas ── */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        {/* Radial background glow on the right */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(249,115,22,0.05) 0%, rgba(56,189,248,0.03) 40%, transparent 75%)", pointerEvents: "none", zIndex: 1 }} />
        {/* Vertical fade-edge connecting left to right */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 100, height: "100%", background: "linear-gradient(90deg, var(--bg) 0%, transparent 100%)", zIndex: 5, pointerEvents: "none" }} />
        <HeroCanvas ready={ready} />
        {ready && <HeroHUD />}
        {/* Scroll hint */}
        <div style={{ position: "absolute", right: 32, bottom: 40, writingMode: "vertical-rl", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 3, color: "rgba(249,115,22,.5)", animation: "pulseOp 2s infinite", zIndex: 10 }}>SCROLL TO EXPLORE ↓</div>
      </div>
    </section>
  );
}

/* ─── SECTION 2: ATTACK GRAPH BUILD (sticky 300vh) ─── */
function AttackGraphSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  const [termText, setTermText] = useState("");
  const [hasEntered, setHasEntered] = useState(false);
  const progressRef = useRef(0);
  const hasEnteredRef = useRef(false); // ← KEY: ref so canvas loop reads it without stale closure
  const termPhaseRef = useRef(-1);
  const queries = [
    "MATCH (n:Pod) RETURN n",
    "MATCH (a)-[r:CAN_READ]->(b) RETURN a,r,b",
    "MATCH path = shortestPath((e:EntryPoint)-[*]->(c:CrownJewel)) RETURN path"
  ];

  useEffect(() => {
    const onScroll = () => {
      if (!outerRef.current) return;
      const rect = outerRef.current.getBoundingClientRect();

      // Mark entered once top of section hits viewport
      if (rect.top < window.innerHeight && !hasEnteredRef.current) {
        hasEnteredRef.current = true;
        setHasEntered(true);
      }

      // ← KEY FIX: corrected scroll progress math
      const sH = outerRef.current.offsetHeight;
      const scrolled = -rect.top;
      const scrollable = sH - window.innerHeight;
      const prog = Math.max(0, Math.min(1, scrolled / scrollable));

      progressRef.current = prog;

      const ph = prog < 0.33 ? 0 : prog < 0.66 ? 1 : 2;
      setPhase(ph);
      if (ph !== termPhaseRef.current) {
        termPhaseRef.current = ph;
        let i = 0; setTermText("");
        const q = queries[ph];
        const iv = setInterval(() => { i++; setTermText(q.slice(0, i)); if (i >= q.length) clearInterval(iv); }, 40);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    const gNodes = [
      { x: 0.15, y: 0.25, label: "nginx-pod", color: "#00f5ff" },
      { x: 0.38, y: 0.18, label: "api-pod", color: "#00f5ff" },
      { x: 0.58, y: 0.28, label: "sa-admin", color: "#ffffff" },
      { x: 0.78, y: 0.18, label: "role-read", color: "#39ff14" },
      { x: 0.22, y: 0.50, label: "sa-default", color: "#ffffff" },
      { x: 0.48, y: 0.55, label: "secret-db", color: "#ff3131" },
      { x: 0.68, y: 0.48, label: "config-env", color: "#9b5de5" },
      { x: 0.32, y: 0.75, label: "db-prod", color: "#ffd700" },
      { x: 0.62, y: 0.75, label: "db-staging", color: "#ffd700" },
      { x: 0.85, y: 0.40, label: "sa-Mon", color: "#ffffff" },
      { x: 0.10, y: 0.68, label: "role-admin", color: "#39ff14" },
      { x: 0.52, y: 0.88, label: "sec-cred", color: "#ff3131" },
    ];
    const gEdges = [[0, 2], [1, 2], [2, 3], [4, 5], [5, 7], [3, 6], [6, 8], [0, 10], [10, 7], [9, 6], [1, 4], [4, 11], [11, 8]];
    const attackPath = [0, 2, 3, 6, 8];
    let traceT = 0; let af: number; let t = 0;

    const draw = () => {
      t++;
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { af = requestAnimationFrame(draw); return; }

      const prog = progressRef.current;
      const entered = hasEnteredRef.current;

      ctx.clearRect(0, 0, W, H);

      // ← KEY FIX: render nothing until user scrolls into section
      if (!entered) { af = requestAnimationFrame(draw); return; }

      const nx = (n: typeof gNodes[0]) => n.x * W;
      const ny = (n: typeof gNodes[0]) => n.y * H;

      // Dim skeleton edges
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
      gEdges.forEach(([a, b]) => {
        ctx.beginPath(); ctx.moveTo(nx(gNodes[a]), ny(gNodes[a])); ctx.lineTo(nx(gNodes[b]), ny(gNodes[b])); ctx.stroke();
      });
      ctx.setLineDash([]); ctx.restore();

      // Bright edges appear at phase 2 (prog > 0.33)
      if (prog > 0.33) {
        const ep = Math.min((prog - 0.33) / 0.33, 1);
        gEdges.forEach(([a, b]) => {
          const na = gNodes[a], nb = gNodes[b];
          const len = Math.hypot(nx(nb) - nx(na), ny(nb) - ny(na));
          const drawn = ep * len;
          const ang = Math.atan2(ny(nb) - ny(na), nx(nb) - nx(na));
          ctx.save(); ctx.strokeStyle = "rgba(0,245,255,0.5)"; ctx.lineWidth = 1.5; ctx.globalAlpha = ep;
          ctx.beginPath(); ctx.moveTo(nx(na), ny(na)); ctx.lineTo(nx(na) + Math.cos(ang) * drawn, ny(na) + Math.sin(ang) * drawn); ctx.stroke();
          ctx.restore();
        });
      }

      // ← KEY FIX: nodes stagger in based on scroll progress, starting at prog=0.02
      const N = gNodes.length;
      gNodes.forEach((n, i) => {
        const nodeStart = 0.02 + (i / N) * 0.22;
        const nodeEnd = nodeStart + 0.06;
        const fadeAlpha = Math.max(0, Math.min(1, (prog - nodeStart) / (nodeEnd - nodeStart)));
        if (fadeAlpha <= 0) return;

        const pulse = 1 + Math.sin(t * 0.05 + i * 0.7) * 0.18;
        const r = 7 * pulse;
        ctx.save();
        ctx.globalAlpha = fadeAlpha * 0.95;
        ctx.fillStyle = n.color; ctx.shadowColor = n.color; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(nx(n), ny(n), r, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = fadeAlpha * 0.85;
        ctx.fillStyle = "rgba(230,230,230,0.9)"; ctx.font = "bold 11px monospace"; ctx.textAlign = "left";
        ctx.fillText(n.label, nx(n) + r + 5, ny(n) + 4);
        ctx.restore();
      });

      // Halo rings on attack path nodes at phase 3 (prog > 0.66)
      if (prog > 0.66) {
        attackPath.forEach(idx => {
          const n = gNodes[idx];
          const ringR = 12 + Math.sin(t * 0.08 + idx) * 3;
          ctx.save(); ctx.strokeStyle = "#ff3131"; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
          ctx.beginPath(); ctx.arc(nx(n), ny(n), ringR, 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
          ctx.save(); ctx.fillStyle = "#ff3131"; ctx.shadowColor = "#ff3131"; ctx.shadowBlur = 16; ctx.globalAlpha = 0.85;
          ctx.beginPath(); ctx.arc(nx(n), ny(n), 8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        });
      }

      // Moving tracer dot along attack path
      if (prog > 0.66) {
        traceT = Math.min(traceT + 0.006, 1);
        const seg = Math.floor(traceT * (attackPath.length - 1));
        const frac = (traceT * (attackPath.length - 1)) % 1;
        if (seg < attackPath.length - 1) {
          const na = gNodes[attackPath[seg]], nb = gNodes[attackPath[seg + 1]];
          const tx = nx(na) + (nx(nb) - nx(na)) * frac;
          const ty = ny(na) + (ny(nb) - ny(na)) * frac;
          ctx.save(); ctx.fillStyle = "#F97316"; ctx.shadowColor = "#F97316"; ctx.shadowBlur = 20;
          ctx.beginPath(); ctx.arc(tx, ty, 6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
      } else { traceT = 0; }

      af = requestAnimationFrame(draw);
    };
    af = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(af); ro.disconnect(); };
  }, []);

  const texts = [
    { title: "MAPPING YOUR CLUSTER", body: "VECTORNETES ingests your kubeconfig and indexes every resource in real time.", icon: "01" },
  ];

  return (
    <div ref={outerRef} style={{ height: "300vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
        <div style={{ width: "42%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 48px 80px 160px", position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--cyan)", letterSpacing: 4, marginBottom: 48 }}>ATTACK GRAPH BUILD</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {texts.map((txt, i) => (
              <div key={i} style={{ transition: "all 0.4s", opacity: 1, transform: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid var(--cyan)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 10, color: "var(--cyan)", background: "rgba(0,245,255,0.08)" }}>{txt.icon}</div>
                  <div style={{ flex: 1, height: 1, background: "rgba(0,245,255,0.4)" }} />
                </div>
                <div>
                  <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>{txt.title}</h2>
                  <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.75 }}>{txt.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", bottom: 40, left: 160, right: 48 }}>
            <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${(phase / 2) * 100}%`, background: "linear-gradient(90deg, var(--cyan), var(--primary))", borderRadius: 2, transition: "width 0.4s" }} />
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>SCROLL TO ADVANCE</div>
          </div>
        </div>
        <div style={{ flex: 1, height: "100%", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 40%, rgba(0,245,255,0.04) 0%, transparent 65%)", pointerEvents: "none", zIndex: 1 }} />
          <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          <div style={{ position: "absolute", bottom: 32, right: 32, background: "rgba(5,5,8,0.9)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 8, padding: "12px 18px", fontFamily: "var(--mono)", fontSize: 12, color: "var(--cyan)", maxWidth: 400, zIndex: 10, backdropFilter: "blur(8px)" }}>
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>GRAPH QUERY</div>
            <span style={{ color: "var(--muted)" }}>{"> "}</span>{termText}<span style={{ animation: "blink .8s infinite" }}>_</span>
          </div>
          {phase === 2 && (
            <div style={{ position: "absolute", top: 32, right: 32, background: "rgba(255,49,49,0.08)", border: "2px solid var(--red)", borderRadius: 8, padding: "12px 20px", fontFamily: "var(--mono)", fontSize: 12, color: "var(--red)", animation: "blink 2s infinite", textAlign: "center", boxShadow: "0 0 30px rgba(255,49,49,0.3)", zIndex: 10, whiteSpace: "nowrap" }}>
              ⚠ CROWN JEWEL REACHABLE — Database-prod
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── SECTION 3: CAPABILITIES (vertical stacked, scroll-reveal) ─── */
function CapabilitiesSection() {
  const c1 = useRef<HTMLCanvasElement>(null);
  const c2 = useRef<HTMLCanvasElement>(null);
  const c3 = useRef<HTMLCanvasElement>(null);
  const c4 = useRef<HTMLCanvasElement>(null);

  // BFS canvas — always show full graph, animate attack-path tracer
  useEffect(() => {
    const cv = c1.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const ro1 = new ResizeObserver(() => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }); ro1.observe(cv);
    if (cv.offsetWidth > 0) { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }
    let af: number; let t = 0;
    const nodes = [{ x: .5, y: .1, l: "ENTRY", c: "#ff3131" }, { x: .28, y: .28, l: "api", c: "#00f5ff" }, { x: .72, y: .28, l: "nginx", c: "#00f5ff" }, { x: .13, y: .50, l: "sa-adm", c: "#fff" }, { x: .5, y: .50, l: "role", c: "#39ff14" }, { x: .78, y: .50, l: "secret", c: "#ff3131" }, { x: .5, y: .78, l: "DB-PROD", c: "#ffd700" }];
    const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [4, 6], [5, 6]];
    const apNodes = new Set([0, 1, 4, 6]);
    const apPath = [0, 1, 4, 6];
    const draw = () => {
      t++;
      const W = cv.width, H = cv.height;
      if (!W || !H) { af = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);
      // Draw all edges
      edges.forEach(([a, b]) => {
        const on = apNodes.has(a) && apNodes.has(b);
        ctx.save(); ctx.strokeStyle = on ? "rgba(0,245,255,0.6)" : "rgba(255,255,255,0.1)"; ctx.lineWidth = on ? 2 : 1;
        if (!on) ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(nodes[a].x * W, nodes[a].y * H); ctx.lineTo(nodes[b].x * W, nodes[b].y * H); ctx.stroke(); ctx.restore();
      });
      // Draw all nodes with pulsing glow
      nodes.forEach((n, i) => {
        const pulse = 1 + Math.sin(t * 0.05 + i * 1.1) * 0.2;
        ctx.save(); ctx.fillStyle = n.c; ctx.shadowColor = n.c; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(n.x * W, n.y * H, 13 * pulse, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#000"; ctx.font = "bold 8px monospace"; ctx.textAlign = "center"; ctx.shadowBlur = 0;
        ctx.fillText(n.l, n.x * W, n.y * H + 3); ctx.restore();
      });
      // Moving attack-path tracer dot
      const tracerT = (t % 140) / 140;
      const seg = Math.floor(tracerT * (apPath.length - 1));
      const frac = (tracerT * (apPath.length - 1)) % 1;
      if (seg < apPath.length - 1) {
        const na = nodes[apPath[seg]], nb = nodes[apPath[seg + 1]];
        const tx = na.x * W + (nb.x * W - na.x * W) * frac;
        const ty = na.y * H + (nb.y * H - na.y * H) * frac;
        ctx.save(); ctx.fillStyle = "#F97316"; ctx.shadowColor = "#F97316"; ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.arc(tx, ty, 6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      af = requestAnimationFrame(draw);
    };
    af = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(af); ro1.disconnect(); };
  }, []);

  // RBAC orbit
  useEffect(() => {
    const cv = c2.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const ro2 = new ResizeObserver(() => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }); ro2.observe(cv);
    if (cv.offsetWidth > 0) { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }
    let af: number; let angle = 0;
    const orbs = ["sa-admin", "role-r", "secret", "CRole", "Binding", "Pod", "SA-2", "Conf"].map((l, i) => ({ l, a: (i / 8) * Math.PI * 2 }));
    const draw = () => {
      const W = cv.width, H = cv.height;
      if (!W || !H) { af = requestAnimationFrame(draw); return; }
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * .35;
      ctx.clearRect(0, 0, W, H); angle += 0.001;
      ctx.save(); ctx.fillStyle = "#00f5ff"; ctx.shadowColor = "#00f5ff"; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#000"; ctx.font = "8px monospace"; ctx.textAlign = "center"; ctx.shadowBlur = 0;
      ctx.fillText("CLUSTER", cx, cy + 3); ctx.restore();
      orbs.forEach(n => {
        const a = n.a + angle, nx = cx + Math.cos(a) * R, ny = cy + Math.sin(a) * R;
        ctx.save(); ctx.strokeStyle = "rgba(0,245,255,.15)"; ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.fillStyle = "#fff"; ctx.shadowColor = "#fff"; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(nx, ny, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#050508"; ctx.font = "7px monospace"; ctx.textAlign = "center"; ctx.shadowBlur = 0;
        ctx.fillText(n.l.slice(0, 5), nx, ny + 2); ctx.restore();
      });
      af = requestAnimationFrame(draw);
    };
    af = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(af); ro2.disconnect(); };
  }, []);

  // CVE feed
  useEffect(() => {
    const cv = c3.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const ro3 = new ResizeObserver(() => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }); ro3.observe(cv);
    if (cv.offsetWidth > 0) { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }
    let af: number; let sy = 0;
    const cves = ["CVE-2024-3094", "CVE-2024-21626", "CVE-2023-44487", "CVE-2024-6387", "CVE-2023-2728", "CVE-2024-27919", "CVE-2023-3955", "CVE-2024-25620", "CVE-2023-5528", "CVE-2024-8443", "CVE-2023-39325", "CVE-2024-45321"];
    const sevs = ["CRIT", "HIGH", "HIGH", "CRIT", "MED", "HIGH", "HIGH", "MED", "HIGH", "CRIT", "HIGH", "MED"];
    const cols = ["#ff3131", "#ff8c00", "#ff8c00", "#ff3131", "#ffd700", "#ff8c00", "#ff8c00", "#ffd700", "#ff8c00", "#ff3131", "#ff8c00", "#ffd700"];
    const ROW = 34;
    const draw = () => {
      const W = cv.width, H = cv.height;
      if (!W || !H) { af = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H); sy = (sy + 0.5) % (cves.length * ROW);
      cves.forEach((id, i) => {
        const y = (i * ROW - sy + cves.length * ROW) % (cves.length * ROW);
        if (y < 0 || y > H + ROW) return;
        ctx.save(); if (y < ROW) { ctx.fillStyle = "rgba(255,49,49,.06)"; ctx.fillRect(0, y, W, ROW - 2); }
        ctx.fillStyle = cols[i]; ctx.font = "bold 11px monospace"; ctx.fillText(id, 8, y + 20);
        ctx.fillStyle = cols[i]; ctx.fillRect(W * .55, y + 7, 38, 16); ctx.fillStyle = "#000"; ctx.font = "8px monospace"; ctx.fillText(sevs[i], W * .55 + 3, y + 18);
        ctx.restore();
      });
      af = requestAnimationFrame(draw);
    };
    af = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(af); ro3.disconnect() };
  }, []);

  // Crown jewels
  useEffect(() => {
    const cv = c4.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const ro4 = new ResizeObserver(() => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }); ro4.observe(cv);
    if (cv.offsetWidth > 0) { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }
    let af: number; let t = 0;
    const hex = (cx: number, cy: number, r: number) => { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 - Math.PI / 6; ctx[i === 0 ? "moveTo" : "lineTo"](cx + Math.cos(a) * r, cy + Math.sin(a) * r); } ctx.closePath(); };
    const draw = () => {
      const W = cv.width, H = cv.height;
      if (!W || !H) { af = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H); t++;
      const jewels = [{ x: W * .25, y: H * .35, l: "Secret-db-creds" }, { x: W * .75, y: H * .35, l: "ConfigMap-admin" }, { x: W * .5, y: H * .72, l: "Database-prod" }];
      jewels.forEach((j, ji) => {
        for (let ring = 0; ring < 3; ring++) {
          const phase = ((t + ji * 40 + ring * 25) % 120) / 120;
          ctx.save(); ctx.globalAlpha = (1 - phase) * .4; ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 1.5;
          hex(j.x, j.y, 20 * (1 + phase * 1.5)); ctx.stroke(); ctx.restore();
        }
        const sx = j.x - 70 + Math.sin(t * .03 + ji) * 8, sy = j.y - 55;
        ctx.save(); ctx.strokeStyle = "rgba(255,49,49,.4)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(j.x, j.y - 24); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.fillStyle = "#ffd700"; ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 16;
        hex(j.x, j.y, 20); ctx.fill(); ctx.restore();
        ctx.save(); ctx.fillStyle = "#000"; ctx.font = "8px monospace"; ctx.textAlign = "center";
        ctx.fillText(j.l.slice(0, 12), j.x, j.y + 3); ctx.restore();
      });
      af = requestAnimationFrame(draw);
    };
    af = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(af); ro4.disconnect(); };
  }, []);

  const panels = [
    { tag: "CAPABILITY 01", title: "Attack Path Discovery", body: "BFS graph traversal from every entry point to every crown jewel — ranked by exploitability.", stat: "23 paths found in 240ms", ref: c1, accent: "#00f5ff" },
    { tag: "CAPABILITY 02", title: "RBAC Relationship Mapping", body: "Every ServiceAccount, Role, and binding as navigable edges. Find wildcard permissions instantly.", stat: "100% of bindings mapped", ref: c2, accent: "#A78BFA" },
    { tag: "CAPABILITY 03", title: "CVE Enrichment", body: "Running image SHAs matched against NVD and OSV databases. Vulnerabilities anchored to nodes.", stat: "99.7% NVD match rate", ref: c3, accent: "#ff8c00" },
    { tag: "CAPABILITY 04", title: "Crown Jewel Detection", body: "Automatically identify Secrets, ConfigMaps, and database pods representing the highest-value targets.", stat: "3 crown jewels auto-detected", ref: c4, accent: "#FFD700" },
  ];
  return (
    <section style={{ background: "var(--bg)", padding: "100px 0 80px", position: "relative" }}>
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 80, padding: "0 24px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--secondary)", letterSpacing: 4, marginBottom: 14 }}>WHAT WE DO</div>
        <h2 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 800, letterSpacing: -1, lineHeight: 1.1 }}>
          Four capabilities.<br />
          <span style={{ background: "linear-gradient(135deg,#F97316,#FB923C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>One unified graph.</span>
        </h2>
      </div>
      {/* Stacked panels — each one is a self-contained scroll-reveal row */}
      {panels.map((p, pi) => (
        <CapabilityPanel key={pi} p={p} pi={pi} />
      ))}
    </section>
  );
}

/* ─── CAPABILITY PANEL COMPONENT (IntersectionObserver reveal) ─── */
function CapabilityPanel({ p, pi }: { p: { tag: string; title: string; body: string; stat: string; ref: React.RefObject<HTMLCanvasElement>; accent: string }; pi: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = rowRef.current; if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const flip = pi % 2 === 1;
  return (
    <div
      ref={rowRef}
      style={{
        display: "flex", alignItems: "center",
        flexDirection: flip ? "row-reverse" : "row",
        gap: "clamp(32px,5vw,80px)",
        padding: "clamp(48px,7vh,90px) clamp(24px,6vw,90px)",
        background: pi % 2 === 0 ? "var(--bg)" : "var(--bg2)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        position: "relative", overflow: "hidden",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(56px)",
        transition: "opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {/* Ambient glow blob */}
      <div style={{ position: "absolute", [flip ? "left" : "right"]: "5%", top: "50%", transform: "translateY(-50%)", width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle,${p.accent}18 0%,transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      {/* Canvas box */}
      <div style={{ flex: "0 0 46%", height: "clamp(260px,36vh,440px)", position: "relative", zIndex: 1 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 12, border: `1px solid ${p.accent}40`, background: "rgba(3,4,10,0.7)", backdropFilter: "blur(6px)", overflow: "hidden" }}>
          <canvas ref={p.ref} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
        {/* Corner brackets */}
        {([[[0, 0], [{ top: 0, left: 0 }]], [[0, 1], [{ top: 0, right: 0 }]], [[1, 0], [{ bottom: 0, left: 0 }]], [[1, 1], [{ bottom: 0, right: 0 }]]] as [number[], object[]][]).map(([[tb, lr], posObj], ci) => (
          <div key={ci} style={{
            position: "absolute", ...posObj[0], width: 16, height: 16, zIndex: 2,
            borderTop: tb === 0 ? `2px solid ${p.accent}` : undefined,
            borderBottom: tb === 1 ? `2px solid ${p.accent}` : undefined,
            borderLeft: lr === 0 ? `2px solid ${p.accent}` : undefined,
            borderRight: lr === 1 ? `2px solid ${p.accent}` : undefined,
          }} />
        ))}
      </div>
      {/* Text content */}
      <div style={{
        flex: 1, position: "relative", zIndex: 1,
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : flip ? "translateX(-32px)" : "translateX(32px)",
        transition: "opacity 0.7s 0.2s cubic-bezier(.16,1,.3,1), transform 0.7s 0.2s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: p.accent, letterSpacing: 4, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 24, height: 1, background: p.accent, display: "inline-block" }} />
          {p.tag}
        </div>
        <h2 style={{ fontSize: "clamp(24px,2.8vw,40px)", fontWeight: 800, letterSpacing: -1, lineHeight: 1.1, marginBottom: 18 }}>{p.title}</h2>
        <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.8, marginBottom: 28, maxWidth: 460 }}>{p.body}</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: `${p.accent}14`, border: `1px solid ${p.accent}35`, borderRadius: 8, padding: "11px 18px" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.accent, boxShadow: `0 0 10px ${p.accent}`, display: "inline-block", animation: "pulseOp 1.5s infinite" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 17, color: p.accent, fontWeight: 700 }}>{p.stat}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── SECTION 4: PRODUCT DEMO ─── */
function ProductDemoSection() {
  const [demoLine, setDemoLine] = useState("> scanning pods...");
  const lines = ["> scanning pods...", "> mapping bindings...", "> computing paths...", "> 23 threats found"];
  useEffect(() => { let i = 0; const t = setInterval(() => { i = (i + 1) % lines.length; setDemoLine(lines[i]); }, 2000); return () => clearInterval(t); }, []);
  const badges = [
    { txt: "⚠ 23 attack paths detected", col: "var(--red)", style: { top: -20, right: -20 } },
    { txt: "✓ 847 nodes indexed", col: "var(--green)", style: { bottom: -20, left: -20 } },
    { txt: "◆ 3 crown jewels", col: "var(--gold)", style: { top: -20, left: -20 } },
    { txt: "↯ 240ms scan time", col: "var(--cyan)", style: { bottom: -20, right: -20 } },
  ];
  return (
    <section className="kvs" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 40px", position: "relative", overflow: "hidden" }}>
      {[["var(--cyan)", "blob1", "20s", "10%", "10%"], ["var(--purple)", "blob2", "25s", "50%", "60%"], ["var(--red)", "blob3", "18s", "20%", "70%"], ["var(--gold)", "blob4", "22s", "60%", "5%"]].map(([col, anim, dur, top, left], i) => (
        <div key={i} style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: col as string, opacity: .04, filter: "blur(100px)", animation: `${anim} ${dur} infinite`, pointerEvents: "none", top, left }} />
      ))}
      <div style={{ position: "relative", width: "min(1100px,90vw)" }}>
        {badges.map((b, i) => (
          <div key={i} style={{ position: "absolute", ...b.style, background: "rgba(5,5,8,.85)", backdropFilter: "blur(12px)", border: `1px solid ${b.col}`, borderRadius: 8, padding: "10px 16px", fontFamily: "var(--mono)", fontSize: 12, color: b.col, zIndex: 10, animation: "floatY 3s infinite", animationDelay: `${i * 100}ms`, whiteSpace: "nowrap" }}>{b.txt}</div>
        ))}
        <div style={{ background: "#0d0d0d", borderRadius: 12, overflow: "hidden", boxShadow: "0 0 80px rgba(0,245,255,.12),0 60px 120px rgba(0,0,0,.9)", animation: "floatY 4s ease-in-out infinite", border: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ height: 44, background: "#1a1a1a", display: "flex", alignItems: "center", padding: "0 16px", gap: 8 }}>
            {["#ff5f56", "#ffbd2e", "#27c93f"].map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
            <div style={{ flex: 1, textAlign: "center", background: "#2a2a2a", borderRadius: 4, padding: "4px 16px", fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", margin: "0 60px" }}>VECTORNETES.app/dashboard</div>
          </div>
          <div style={{ height: 480, background: "#050508", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: "linear-gradient(rgba(0,245,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,.03) 1px,transparent 1px)", backgroundSize: "40px 40px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "clamp(20px,3vw,32px)", fontWeight: 800, color: "var(--cyan)", letterSpacing: 4, marginBottom: 16, opacity: .3 }}>VECTORNETES DASHBOARD</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--cyan)" }}>{demoLine}<span style={{ animation: "blink .8s infinite" }}>_</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION 5: STATS ─── */
function useCountUp(target: number, duration = 2000) {
  const [val, setVal] = useState(0);
  const elRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = elRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const t = setInterval(() => {
          const p = Math.min((Date.now() - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setVal(Math.round(eased * target));
          if (p >= 1) clearInterval(t);
        }, 16);
      }
    }, { threshold: .5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, elRef };
}

function StatBox({ number, suffix, label }: { number: number; suffix: string; label: string }) {
  const { val, elRef } = useCountUp(number);
  const [hov, setHov] = useState(false);
  const [glitch, setGlitch] = useState(false);
  return (
    <div ref={elRef} onMouseEnter={() => { setHov(true); setGlitch(true); setTimeout(() => setGlitch(false), 200); }} onMouseLeave={() => setHov(false)}
      style={{ border: `1px solid ${hov ? "var(--cyan)" : "var(--border)"}`, borderRadius: 8, padding: "48px 32px", textAlign: "center", position: "relative", transition: "border-color .3s,box-shadow .3s", boxShadow: hov ? "0 0 30px rgba(0,245,255,.2)" : "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,245,255,.01) 2px,rgba(0,245,255,.01) 4px)", borderRadius: 8, pointerEvents: "none" }} />
      {[[{ top: 0, left: 0 }, { borderTop: "2px solid var(--cyan)", borderLeft: "2px solid var(--cyan)" }], [{ top: 0, right: 0 }, { borderTop: "2px solid var(--cyan)", borderRight: "2px solid var(--cyan)" }], [{ bottom: 0, left: 0 }, { borderBottom: "2px solid var(--cyan)", borderLeft: "2px solid var(--cyan)" }], [{ bottom: 0, right: 0 }, { borderBottom: "2px solid var(--cyan)", borderRight: "2px solid var(--cyan)" }]].map(([pos, brd], i) => (
        <div key={i} style={{ position: "absolute", ...pos as object, ...brd as object, width: 12, height: 12 }} />
      ))}
      <div style={{ fontFamily: "var(--mono)", fontSize: 72, fontWeight: 800, color: "var(--cyan)", lineHeight: 1, marginBottom: 8, textShadow: "0 0 30px rgba(0,245,255,.5)", filter: glitch ? "blur(3px)" : "none", transition: "filter .1s" }}>
        {glitch ? "??" : val + suffix}
      </div>
      <div style={{ color: "var(--muted)", fontSize: 14, letterSpacing: 2 }}>{label}</div>
    </div>
  );
}

function StatsSection() {
  const ticker = "● prod-cluster-eu secured  ● 847 nodes indexed  ● 3 threats mitigated  ● gke-prod-us-east1 scanned  ● 23 attack paths mapped  ● secret-db-creds identified  ● aks-staging-westus2 analyzed  ";
  return (
    <section className="kvs" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 40px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "conic-gradient(from 0deg at 50% 50%,transparent 0deg,rgba(0,245,255,.025) 60deg,transparent 120deg)", animation: "radar 4s linear infinite", pointerEvents: "none" }} />
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--cyan)", letterSpacing: 4, marginBottom: 20 }}>BY THE NUMBERS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, width: "100%", maxWidth: 900, marginBottom: 60 }}>
        <StatBox number={11000} suffix="+" label="Clusters Analysed" />
        <StatBox number={240} suffix="ms" label="Median Latency" />
        <StatBox number={997} suffix="‰" label="CVE Accuracy" />
      </div>
      <div style={{ width: "100%", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "12px 0", overflow: "hidden", maxWidth: 1100 }}>
        <div style={{ display: "flex", gap: 80, width: "max-content", animation: "ticker 30s linear infinite", fontFamily: "var(--mono)", fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap" }}>
          {[ticker, ticker].map((t, i) => <span key={i}>{t.replace(/●/g, "‼️").split("‼️").map((seg, j, arr) => <span key={j}>{seg}{j < arr.length - 1 && <span style={{ color: "var(--cyan)" }}>●</span>}</span>)}</span>)}
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION 6: TERMINAL CTA ─── */
const TERM_LINES = [
  { t: "$ VECTORNETES scan --cluster production --output graph", c: "#f0f0f0", b: false },
  { t: "", c: "", b: false },
  { t: "✓ Connecting to cluster... done", c: "#00ff88", b: false },
  { t: "✓ Fetching pods (284 found)", c: "#00ff88", b: false },
  { t: "✓ Fetching service accounts (47 found)", c: "#00ff88", b: false },
  { t: "✓ Fetching RBAC bindings (193 found)", c: "#00ff88", b: false },
  { t: "✓ Fetching secrets (89 found)", c: "#00ff88", b: false },
  { t: "● Building attack graph...", c: "#00f5ff", b: false },
  { t: "[████████████████████] 847 nodes", c: "#00f5ff", b: false },
  { t: "● Running BFS traversal...", c: "#00f5ff", b: false },
  { t: "● Computing centrality scores...", c: "#00f5ff", b: false },
  { t: "", c: "", b: false },
  { t: "⚠  WARNING: 23 attack paths discovered", c: "#ffd700", b: false },
  { t: "⚠  WARNING: 3 crown jewels reachable", c: "#ffd700", b: false },
  { t: "⚠  CRITICAL: privilege escalation detected", c: "#ff3131", b: true },
  { t: "", c: "", b: false },
  { t: "✓ Kill Chain Report generated", c: "#00ff88", b: false },
  { t: "→ VECTORNETES.app/report/production-2025", c: "rgba(240,240,240,.5)", b: false },
  { t: "", c: "", b: false },
  { t: "$ _", c: "#f0f0f0", b: false },
];

function TerminalSection() {
  const [shown, setShown] = useState<{ t: string; c: string; b: boolean }[]>([]);
  const inViewRef = useRef<HTMLDivElement>(null);
  const ran = useRef(false);
  const run = useCallback(() => {
    setShown([]);
    let li = 0;
    const next = () => {
      if (li >= TERM_LINES.length) { setTimeout(() => { ran.current = false; run(); }, 8000); return; }
      const line = TERM_LINES[li++];
      setShown(p => [...p, { ...line, t: "" }]);
      if (!line.t) { setTimeout(next, 300); return; }
      let ci = 0;
      const type = () => {
        ci++; setShown(p => { const c = [...p]; if (c.length) c[c.length - 1] = { ...c[c.length - 1], t: line.t.slice(0, ci) }; return c; });
        if (ci < line.t.length) setTimeout(type, 60); else setTimeout(next, 300);
      };
      setTimeout(type, 60);
    };
    next();
  }, []);
  useEffect(() => {
    const el = inViewRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !ran.current) { ran.current = true; run(); } }, { threshold: .3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [run]);
  return (
    <section ref={inViewRef} className="kvs" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", padding: "80px 60px", maxWidth: 1280, margin: "0 auto" }}>
      <div>
        <h2 style={{ fontSize: "clamp(32px,4vw,56px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
          Map your attack surface.<br /><span style={{ color: "var(--cyan)" }}>Before they do.</span>
        </h2>
        <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.7, marginBottom: 36 }}>Connect your kubeconfig. Get a full attack graph in under 60 seconds. No agent. No data exfiltration. Free forever.</p>
        <Link href="/signup" style={{ display: "inline-block", border: "2px solid var(--cyan)", color: "var(--cyan)", padding: "14px 32px", borderRadius: 6, textDecoration: "none", fontWeight: 700, fontSize: 16, marginBottom: 24, transition: "background .3s,color .3s" }}
          onMouseEnter={e => { const el = e.currentTarget; el.style.background = "var(--cyan)"; el.style.color = "#000"; }}
          onMouseLeave={e => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "var(--cyan)"; }}>
          Start Free Scan →
        </Link>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["No agent required", "Under 60 seconds", "Free forever"].map(t => (
            <span key={t} style={{ fontFamily: "var(--mono)", fontSize: 11, border: "1px solid var(--cyan)", borderRadius: 99, padding: "4px 12px", color: "var(--cyan)" }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ background: "#0a0a0a", borderRadius: 10, border: "1px solid rgba(255,255,255,.08)", overflow: "hidden" }}>
        <div style={{ background: "#141414", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          {["#ff5f56", "#ffbd2e", "#27c93f"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
          <span style={{ flex: 1, textAlign: "center", fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>VECTORNETES — zsh</span>
        </div>
        <div style={{ padding: "20px 24px", fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.8, minHeight: 420, maxHeight: 420, overflowY: "auto", background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,245,255,.01) 2px,rgba(0,245,255,.01) 4px)" }}>
          {shown.map((l, i) => (
            <div key={i} style={{ color: l.c || "transparent", fontWeight: l.b ? 700 : 400, minHeight: "1.8em" }}>
              {l.t}{i === shown.length - 1 && l.t && <span style={{ animation: "blink .8s infinite" }}>_</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION 7: HOW IT WORKS ─── */
function HowCard({ num, icon, title, body, tag, delay, spin, pulse }: { num: string; icon: string; title: string; body: string; tag: string; delay: string; spin: boolean; pulse: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "var(--surface)", border: `1px solid ${hov ? "var(--cyan)" : "var(--border)"}`, borderRadius: 8, padding: "40px 32px", position: "relative", overflow: "hidden", transition: "border-color .3s,box-shadow .3s", boxShadow: hov ? "0 0 30px rgba(0,245,255,.15)" : "none", transitionDelay: delay }}>
      <div style={{ position: "absolute", top: 0, left: 0, fontSize: 120, fontWeight: 800, color: `rgba(0,245,255,${hov ? .1 : .04})`, lineHeight: 1, userSelect: "none", fontFamily: "var(--mono)", transition: "color .3s", pointerEvents: "none", zIndex: 0 }}>{num}</div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 40, marginBottom: 20, color: "var(--cyan)", animation: spin ? "spin 3s linear infinite" : pulse ? "shieldPulse 2s infinite" : "none", display: "inline-block" }}>{icon}</div>
        <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{title}</h3>
        <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: 20 }}>{body}</p>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--cyan)", border: "1px solid var(--cyan)", borderRadius: 99, padding: "4px 10px" }}>{tag}</span>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  return (
    <section className="kvs" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 60px" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--cyan)", letterSpacing: 4, marginBottom: 16 }}>HOW IT WORKS</div>
      <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, textAlign: "center", marginBottom: 80, letterSpacing: -1 }}>From cluster to attack graph in three steps.</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, maxWidth: 1100, width: "100%", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "16.67%", right: "16.67%", borderTop: "2px dashed rgba(0,245,255,.2)", zIndex: 0, pointerEvents: "none" }} />
        <HowCard num="01" icon="⬡" title="Connect" body="Point VECTORNETES at your kubeconfig. Read-only. No data leaves your cluster." tag="< 30 seconds" delay="0ms" spin={false} pulse={false} />
        <HowCard num="02" icon="◎" title="Scan" body="BFS + Dijkstra find all attack paths in under 60 seconds." tag="< 60 seconds" delay="200ms" spin={true} pulse={false} />
        <HowCard num="03" icon="⬟" title="Secure" body="Kill Chain reports. Know exactly what to patch first." tag="Instant" delay="400ms" spin={false} pulse={true} />
      </div>
    </section>
  );
}

/* ─── SECTION 8: FOOTER ─── */
function FooterSection() {
  const miniRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = miniRef.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    cv.width = 140; cv.height = 90;
    const fN = [{ x: 20, y: 20 }, { x: 70, y: 12 }, { x: 120, y: 22 }, { x: 30, y: 65 }, { x: 100, y: 70 }, { x: 70, y: 48 }];
    let fE = [[0, 1], [1, 2], [0, 3], [2, 4], [5, 3], [1, 5]];
    let af: number;
    const draw = () => {
      ctx.clearRect(0, 0, 140, 90);
      ctx.strokeStyle = "rgba(0,245,255,.3)"; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
      fE.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(fN[a].x, fN[a].y); ctx.lineTo(fN[b].x, fN[b].y); ctx.stroke(); });
      fN.forEach((n, i) => {
        ctx.save(); ctx.fillStyle = i === 3 ? "#ff3131" : "#00f5ff"; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 6;
        if (i === 3) { ctx.fillRect(n.x - 5, n.y - 5, 10, 10); } else { ctx.beginPath(); ctx.arc(n.x, n.y, 4, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      });
      af = requestAnimationFrame(draw);
    };
    af = requestAnimationFrame(draw);
    const t = setInterval(() => {
      if (fE.length) fE = fE.filter((_, i) => i !== Math.floor(Math.random() * fE.length));
      const a = Math.floor(Math.random() * fN.length), b = Math.floor(Math.random() * fN.length);
      if (a !== b) fE.push([a, b]);
    }, 2000);
    return () => { cancelAnimationFrame(af); clearInterval(t); };
  }, []);
  return (
    <footer style={{ borderTop: "1px solid var(--border)", position: "relative" }}>
      <div style={{ position: "absolute", top: -4, left: 0, right: 0, height: 8, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)", animation: "footerDot 4s linear infinite" }} />
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px 40px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40 }}>
        <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 20, fontWeight: 700, color: "var(--cyan)", letterSpacing: 2, marginBottom: 8 }}>VECTORNETES</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 4 }}>Kubernetes attack path visualizer</div>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Hackathon Build 2025</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {[["Docs", "#"], ["GitHub", "#"], ["Status", "#"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
            <a key={label as string} href={href as string} className="fl">{label}</a>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <canvas ref={miniRef} style={{ width: 140, height: 90, border: "1px solid var(--border)", borderRadius: 4 }} />
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>© 2025 VECTORNETES</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--green)", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pdot 2s infinite", display: "inline-block" }} /> All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT LAYOUT OBSERVER ─── */
function useSectionObserver() {
  useEffect(() => {
    const els = document.querySelectorAll(".kvs");
    const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); }); }, { threshold: .15 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── MAIN PAGE ─── */
export default function LandingPage() {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);
  useSectionObserver();
  return (
    <>
      {/* suppressHydrationWarning prevents the style tag hydration mismatch warning */}
      <style suppressHydrationWarning>{CSS}</style>

      <CustomCursor />
      <NoiseOverlay />
      {!ready && <LoadingOverlay onDone={onDone} />}
      <FixedHUD ready={ready} />
      <NavBar />
      <main>
        <HeroSection ready={ready} />
        <AttackGraphSection />
        <CapabilitiesSection />
        <ProductDemoSection />
        <StatsSection />
        <TerminalSection />
        <HowItWorksSection />
        <FooterSection />
      </main>
    </>
  );
}
