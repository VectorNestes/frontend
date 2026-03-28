import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core surfaces
        canvas:   "#0B0B0C",
        surface:  "#121214",
        elevated: "#18181B",
        overlay:  "#1C1C1F",
        // Borders
        border: {
          DEFAULT: "#1C1C1F",
          subtle:  "#161618",
          strong:  "#27272A",
        },
        // Text
        ink: {
          DEFAULT: "#FAFAFA",
          secondary: "#A1A1AA",
          tertiary:  "#71717A",
          disabled:  "#3F3F46",
        },
        // Accents
        violet: {
          DEFAULT: "#7C3AED",
          dim:     "#4C1D95",
          muted:   "rgba(124,58,237,0.12)",
          border:  "rgba(124,58,237,0.25)",
          text:    "#A78BFA",
        },
        amber: {
          DEFAULT: "#D97706",
          dim:     "#451A03",
          muted:   "rgba(217,119,6,0.12)",
          border:  "rgba(217,119,6,0.25)",
          text:    "#FCD34D",
        },
        danger: {
          DEFAULT: "#DC2626",
          dim:     "#450A0A",
          muted:   "rgba(220,38,38,0.10)",
          border:  "rgba(220,38,38,0.25)",
          text:    "#FCA5A5",
        },
        success: {
          DEFAULT: "#16A34A",
          muted:   "rgba(22,163,74,0.10)",
          border:  "rgba(22,163,74,0.25)",
          text:    "#86EFAC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "Fira Code", "Consolas", "monospace"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight:   "-0.02em",
      },
      borderRadius: {
        sm:  "4px",
        md:  "6px",
        lg:  "8px",
        xl:  "12px",
        "2xl": "16px",
      },
      boxShadow: {
        // Subtle elevation shadows (not glow)
        "sm":    "0 1px 2px rgba(0,0,0,0.4)",
        "md":    "0 4px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)",
        "lg":    "0 12px 24px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)",
        "xl":    "0 24px 48px rgba(0,0,0,0.7), 0 8px 16px rgba(0,0,0,0.5)",
        "inner": "inset 0 1px 0 rgba(255,255,255,0.04)",
        "ring-violet": "0 0 0 2px rgba(124,58,237,0.4)",
        "ring-danger": "0 0 0 2px rgba(220,38,38,0.3)",
        "node-selected": "0 0 0 2px rgba(124,58,237,0.5), 0 4px 12px rgba(0,0,0,0.6)",
        "panel": "4px 0 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
      },
      animation: {
        "fade-in":       "fadeIn 0.2s ease-out",
        "slide-up":      "slideUp 0.25s ease-out",
        "slide-right":   "slideRight 0.3s ease-out",
        "path-draw":     "pathDraw 1.2s ease-in-out forwards",
        "pulse-danger":  "pulseDanger 2s ease-in-out infinite",
        "spin-slow":     "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          "0%":   { opacity: "0", transform: "translateX(12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pathDraw: {
          "0%":   { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        pulseDanger: {
          "0%, 100%": { opacity: "0.8" },
          "50%":      { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
