import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VECTORNETES — Kubernetes Attack Path Visualizer",
  description:
    "Understand how attackers move through your cluster — not just where vulnerabilities exist.",
  keywords: ["kubernetes", "security", "attack paths", "RBAC", "CVE"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <Toaster
          position="bottom-right"
          gutter={8}
          toastOptions={{
            duration: 3500,
            style: {
              background: "#18181B",
              color: "#FAFAFA",
              border: "1px solid #27272A",
              borderRadius: "8px",
              fontSize: "13px",
              padding: "10px 14px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
            },
            success: {
              iconTheme: { primary: "#16A34A", secondary: "#18181B" },
            },
            error: {
              iconTheme: { primary: "#DC2626", secondary: "#18181B" },
            },
          }}
        />
      </body>
    </html>
  );
}
