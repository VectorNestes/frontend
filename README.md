# KubeView — Frontend Codebase

KubeView is an advanced Kubernetes attack path visualizer. The frontend repository is a robust, high-performance web application constructed with **Next.js 14**, **React 18**, and **TypeScript**. 

It features two main visual halves:
1. **The application interface** (Dashboard, login, signup) using standard App Router pages and libraries like React Flow.
2. **The cinematic landing page** (`app/page.tsx`), built to act as a visually addictive, scroll-linked product showcase featuring bespoke 60fps HTML5 Canvas animations.

---

## 🏗️ Architecture & Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Core language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & State**: [React 18](https://react.dev/)
- **Node/Graph Dashboards**: [React Flow](https://reactflow.dev/) (used in the core `dashboard` routes)
- **Animations**: 
  - Custom `requestAnimationFrame` hooks for `<canvas>` features.
  - Native CSS Animations & Keyframes (`@keyframes`, `transition`).
  - [Framer Motion](https://www.framer.com/motion/) (if used in modular components).
- **Styling Strategy**: 
  - Custom inline CSS Variables scoped to `:root` to enforce the Design System tokens.
  - Granular `style={{}}` injections for high-performance animation updates (bypassing the React virtual DOM layer when tied to scroll events).

---

## 🌐 Application Routing Setup

The application leverages the Next.js `app` directory structure to maintain secure, nested routing.

| Route | Path | Description |
|---|---|---|
| **Landing Page** | `app/page.tsx` | The root index. A 1000+ line cinematic marquee file showcasing the core product visualizations via scroll-linked storytelling. |
| **Authentication** | `app/(auth)/*` | Standard user authentication pages including `/login` and `/signup`. |
| **Dashboard** | `app/dashboard/*` | The interactive, authenticated application interface where users connect clusters and view actual attack graphs. |
| **API Layer** | `lib/api.ts` | Data-fetching utilities and backend communication wrappers. |

---

## 🎨 Design System: The Ops Center Aesthetic

The visual language follows a strict "Dark Cybersecurity / Matrix Ops" theme. We absolutely avoid lime greens or neon magentas in favor of precise, stark accents: **Deep Navy black**, **Cold Data Blue**, **Warn/Hero Orange**, and **Crown Jewel Amber**.

### Core Tokens (defined in `app/page.tsx`)
*   **Base Background (`--bg`)**: `#0A0E1A` — A midnight navy/black that anchors the UI.
*   **Hero / CTA Action (`--primary`)**: `#F97316` (Warm Orange) — Used for primary buttons, the pulsing attack path tracer, cursor, and key hover states.
*   **Data Structure (`--secondary`)**: `#38BDF8` (Sky Blue) — Represents benign data flow: baseline pod nodes, matrix rain, standard terminal outputs.
*   **Crown Jewels (`--amber`)**: `#F59E0B` — Used for database nodes, value targets, and golden badges.
*   **Threat / Attack (`--red`)**: `#EF4444` — Secrets, detected threat paths, flashing alert borders.
*   **Safe / Verifications (`--green`)**: `#22C55E` — Role nodes and trust indicators.
*   **RBAC / Configuration (`--purple`)**: `#A78BFA` — ServiceAccounts, ConfigMaps, and RoleBindings.
*   **Typography**: Inter (sans-serif) for body text; JetBrains Mono for system UI and terminal text.

---

## 🎞️ The Cinematic Landing Page (`app/page.tsx`)

The root `page.tsx` is broken down into 8 high-performance sections, driven by `framer-motion` and native Canvas logic.

### 1. Hero Canvas (`HeroCanvas`)
A full-bleed viewport canvas mapping out a mock cluster. Features floating nodes, pulsing dashed edges, and a moving Orange "Attack Tracer" traversing the graph. A minimal matrix rain effect falls in the background.

### 2. Attack Graph Build (`AttackGraphSection`)
A *sticky* (`position: sticky`, `height: 100vh`) section acting as a scroll-jacking 2-column layout. The left column lists scroll phases, while the right column's canvas dynamically builds an attack graph node-by-node based on the `window.scrollY` depth.

### 3. Capabilities Map (`CapabilitiesSection`)
A multi-panel horizontal visualizer that renders 4 separate canvas widgets simultaneously:
- **BFS Traversal**: Demonstrates spanning tree algorithms finding the shortest path to a crown jewel.
- **RBAC Over-privilege**: Orbital physics showing identities orbiting highly-privileged roles.
- **CVE Feeds**: Scrolling severity alerts mapping to targeted containers.
- **Crown Jewels**: Golden hexagonal databases pulsing to depict isolation rings.

### 4. Interactive Terminal (`TerminalSection`)
A mock command-line interface highlighting the speed of pathfinding with "typing" text arrays simulating real-time graph database queries (e.g., `MATCH (n:Pod) RETURN n`).

### 5. Statistics, How It Works & Footer
Counter-based ticker animations highlighting indexed nodes and zero-trust verification badges.

---

## ⚡ Performance Optimizations

To render 6+ concurrent canvases at 60fps within a React tree without devastating device CPU, several techniques are employed:

1. **`ResizeObserver` Canvas Scaling**: Canvas components don't rely purely on CSS or window resize events. Every canvas initializes via `new ResizeObserver()` tied securely to its parent `.offsetWidth/.offsetHeight`. A per-frame bail-out (`if (!W || !H) return;`) prevents hydration mismatches and guarantees zero "blank black box" renders.
2. **Fractional Coordinates (`0.0` - `1.0`)**: Canvas node matrices are defined in percentages, dynamically converted to pixels `(d.rx * W)` inside the `requestAnimationFrame` loop. This permits flawless continuous responsive resizing without expensive recalculations.
3. **`IntersectionObserver` Culling**: Heavy `requestAnimationFrame` draws are paused when standard sections scroll out of the browser viewport.
4. **CSS Overlays**: Intensive background effects like pixel noise or scan lines are rendered using pure CSS properties (`repeating-linear-gradient`, data-uri SVG turbulence) paired with `mix-blend-mode` rather than drawing thousands of pixels manually on canvas frames.
5. **No Hydration Errors**: The heavy inline CSS injection string (`<style suppressHydrationWarning>{CSS}</style>`) prevents Next.js from panicking when server HTML vs client styles differ dynamically at runtime.

---

## 🚀 Getting Started Locally

Install dependencies for the frontend application:
\`\`\`bash
# Standard installation
npm install
\`\`\`

Run the Next.js development server:
\`\`\`bash
npm run dev
\`\`\`

The console will indicate that the application has booted on `http://localhost:3000`. 
If you encounter port conflicts (e.g., `localhost not starting`), guarantee any hanging node instances are terminated (e.g., `taskkill /F /IM node.exe` on Windows or `killall node` on macOS) before launching.

*(Note: Any integrations handling login requests or querying live clusters via `lib/api.ts` require the complimentary Go/Node backend to be configured and running locally on its designated port).*
