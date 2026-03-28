"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-xs font-mono px-2 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
        copied 
          ? "bg-green-500/20 text-green-400 border border-green-500/30" 
          : "bg-surface text-ink-tertiary hover:text-ink hover:bg-surface-hover border border-transparent hover:border-border"
      }`}
      aria-label="Copy code"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
