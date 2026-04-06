const fs = require('fs');
let code = fs.readFileSync('/Users/thusharkumarrai/Desktop/untitled folder 2/frontend/app/page.tsx', 'utf8');

// Replace the AttackGraphSection completely up to Section 3.
let startIdx = code.indexOf(`/* ─── SECTION 2: ATTACK GRAPH BUILD (sticky 300vh) ─── */`);
let endIdx = code.indexOf(`/* ─── SECTION 3: CAPABILITIES (vertical stacked, scroll-reveal) ─── */`);

let newCode = `/* ─── SECTION 2: ATTACK GRAPH BUILD (sticky 300vh) ─── */
function AttackGraphSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState(0);
  const [scrollProg, setScrollProg] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (!outerRef.current) return;
      const rect = outerRef.current.getBoundingClientRect();
      const sH = outerRef.current.offsetHeight;
      const wH = window.innerHeight;
      
      // Calculate progress (0 to 1) based purely on viewport position
      // It starts (prog=0) when the top of the wrapper hits the top of the viewport
      // It ends (prog=1) when bottom of the wrapper aligns with the bottom of the viewport
      const totalScroll = Math.max(1, sH - wH);
      let p = -rect.top / totalScroll;
      p = Math.max(0, Math.min(1, p));

      if (progressRef.current !== p) {
        progressRef.current = p;
        setScrollProg(p);
        const ph = p < 0.25 ? 0 : p < 0.55 ? 1 : 2;
        setPhase(ph);
      }
    };
    window.addEventListener("scroll", onScroll);
    setTimeout(onScroll, 50);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent && parent.offsetWidth > 0) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();

    const gNodes = [
      { x: 0.15, y: 0.25, label: "nginx-pod", color: "#00f5ff" },
      { x: 0.35, y: 0.15, label: "sa-svc", color: "#00f5ff" },
      { x: 0.45, y: 0.35, label: "role-bnd", color: "#22c55e" },
      { x: 0.55, y: 0.25, label: "sec-cred", color: "#ff3131" },
      { x: 0.25, y: 0.45, label: "job-run", color: "#a78bfa" },
      { x: 0.4, y: 0.6, label: "sys-ns", color: "#a78bfa" },
      { x: 0.6, y: 0.5, label: "admin-sa", color: "#ff3131" },
      { x: 0.8, y: 0.65, label: "db-prod", color: "#ffd700" },
      { x: 0.85, y: 0.4, label: "db-staging", color: "#ffd700" },
      { x: 0.7, y: 0.2, label: "gw-api", color: "#38bdf8" },
      { x: 0.2, y: 0.65, label: "kubelet", color: "#a78bfa" },
      { x: 0.35, y: 0.8, label: "proxy", color: "#00f5ff" }
    ];
    const gEdges = [[0, 2], [1, 2], [2, 3], [4, 5], [5, 7], [3, 6], [6, 8], [0, 10], [10, 7], [9, 6], [1, 4], [4, 11], [11, 8]];
    const attackPath = [0, 2, 3, 6, 8];
    let traceT = 0; let t = 0; let af;

    const draw = () => {
      t++;
      const W = canvas.width; const H = canvas.height;
      if (W === 0 || H === 0) { af = requestAnimationFrame(draw); return; }

      const prog = progressRef.current;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1;

      const nx = (n) => n.x * W;
      const ny = (n) => n.y * H;

      // Dim skeleton edges
      ctx.save(); ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
      gEdges.forEach(([a, b]) => {
        ctx.beginPath(); ctx.moveTo(nx(gNodes[a]), ny(gNodes[a])); ctx.lineTo(nx(gNodes[b]), ny(gNodes[b])); ctx.stroke();
      });
      ctx.setLineDash([]); ctx.restore();

      // Bright edges
      if (prog > 0.5) {
        const ep = Math.max(0, Math.min(1, (prog - 0.5) / 0.15));
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

      // Nodes
      const N = gNodes.length;
      gNodes.forEach((n, i) => {
        const appearProg = (prog * 2) - (i * 0.05);
        if (appearProg > 0) {
          const fadeAlpha = Math.min(1, appearProg * 2);
          const pulse = 1 + Math.sin(t * 0.05 + i) * 0.15;
          const r = 7 * pulse;
          
          ctx.save();
          ctx.globalAlpha = fadeAlpha * 0.95;
          ctx.fillStyle = n.color; ctx.shadowColor = n.color; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(nx(n), ny(n), r, 0, Math.PI * 2); ctx.fill();
          
          ctx.shadowBlur = 0;
          ctx.globalAlpha = fadeAlpha * 0.85;
          ctx.fillStyle = "rgba(230,230,230,0.9)"; ctx.font = "bold 11px monospace"; ctx.textAlign = "left";
          ctx.fillText(n.label, nx(n) + r + 5, ny(n) + 4);
          ctx.restore();
        }
      });

      // Halos
      if (prog > 0.65) {
        const haloAlpha = Math.min((prog - 0.65) / 0.1, 1);
        attackPath.forEach(idx => {
          const n = gNodes[idx];
          const ringR = 12 + Math.sin(t * 0.08 + idx) * 3;
          ctx.save(); ctx.strokeStyle = "#ff3131"; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6 * haloAlpha;
          ctx.beginPath(); ctx.arc(nx(n), ny(n), ringR, 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
          
          ctx.save(); ctx.fillStyle = "#ff3131"; ctx.shadowColor = "#ff3131"; ctx.shadowBlur = 16; ctx.globalAlpha = 0.85 * haloAlpha;
          ctx.beginPath(); ctx.arc(nx(n), ny(n), 8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        });
      }

      // Tracer
      if (prog > 0.75) {
        traceT += 0.015;
        const speed = traceT;
        const currentIdx = Math.floor(speed % (attackPath.length - 1));
        const frac = speed % 1;
        const na = gNodes[attackPath[currentIdx]];
        const nb = gNodes[attackPath[currentIdx + 1]];
        if (na && nb) {
          const tx = nx(na) + (nx(nb) - nx(na)) * frac;
          const ty = ny(na) + (ny(nb) - ny(na)) * frac;
          ctx.save(); ctx.fillStyle = "#F97316"; ctx.shadowColor = "#F97316"; ctx.shadowBlur = 20;
          ctx.beginPath(); ctx.arc(tx, ty, 6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
      } else {
        traceT = 0;
      }

      af = requestAnimationFrame(draw);
    };
    af = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(af); ro.disconnect(); };
  }, []);

  const texts = [
    { title: "MAPPING YOUR CLUSTER", body: "VECTORNETES ingests your kubeconfig and indexes every resource in real time.", icon: "01" },
    { title: "BUILDING THE GRAPH", body: "Every pod, service account, role, and secret becomes a connected node — edges reveal hidden trust paths.", icon: "02" },
    { title: "ATTACK PATH DETECTED", body: "Graph traversal pinpoints the shortest exploitation chain from entry point to crown jewel.", icon: "03" },
  ];

  return (
    <div ref={outerRef} className="AttackGraphSection-wrapper" style={{ height: "300vh", position: "relative" }}>
      <div className="ag-layout" style={{ position: "sticky", top: 0, height: "100vh", display: "flex", overflow: "hidden", background: "var(--bg)" }}>
        <div className="ag-left" style={{ width: "42%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 48px 80px 160px", position: "relative", zIndex: 2 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--cyan)", letterSpacing: 4, marginBottom: 48 }}>ATTACK GRAPH BUILD</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {texts.map((txt, i) => {
              const isVisible = phase >= i;
              return (
                <div key={i} style={{ transition: "opacity 0.6s ease, transform 0.6s ease", opacity: isVisible ? 1 : 0.15, transform: isVisible ? "none" : "translateY(12px)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: \`2px solid \${isVisible ? "var(--cyan)" : "rgba(0,245,255,0.3)"}\`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 10, color: isVisible ? "var(--cyan)" : "rgba(0,245,255,0.3)", background: isVisible ? "rgba(0,245,255,0.08)" : "transparent", transition: "all 0.4s" }}>{txt.icon}</div>
                    <div style={{ flex: 1, height: 1, background: isVisible ? "rgba(0,245,255,0.4)" : "rgba(0,245,255,0.1)", transition: "background 0.4s" }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>{txt.title}</h2>
                    <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.75 }}>{txt.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="ag-progress" style={{ position: "absolute", bottom: 20, left: 160, right: 48 }}>
            <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: \`\${scrollProg * 100}%\`, background: "linear-gradient(90deg, var(--cyan), var(--primary))", borderRadius: 2, transition: "width 0.1s" }} />
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>SCROLL TO ADVANCE</div>
          </div>
        </div>
        
        <div className="ag-right" style={{ flex: 1, height: "100%", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 40%, rgba(0,245,255,0.04) 0%, transparent 65%)", pointerEvents: "none", zIndex: 1 }} />
          <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        </div>
      </div>
    </div>
  );
}
`;

code = code.substring(0, startIdx) + newCode + code.substring(endIdx);
fs.writeFileSync('/Users/thusharkumarrai/Desktop/untitled folder 2/frontend/app/page.tsx', code);
