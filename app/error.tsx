"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("VYBEON runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6 text-center">
      <div className="rounded-full bg-red-500/10 border border-red-500/30 p-4 mb-4 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h2 className="text-2xl font-black text-white">Audio Stream Interrupted</h2>
      <p className="text-xs text-[#8B8B9A] max-w-sm mt-2">
        A temporary glitch occurred in the streaming buffer. Our audio engineers have
        been alerted.
      </p>

      <button
        onClick={() => reset()}
        className="mt-6 flex items-center gap-2 rounded-full bg-[#B8FF00] px-6 py-2.5 text-xs font-bold text-black shadow-[0_0_15px_rgba(184,255,0,0.3)] hover:brightness-110 transition"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Reconnect Frequency</span>
      </button>
    </div>
  );
}
