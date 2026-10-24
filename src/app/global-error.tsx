"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  const handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    reset();
  };

  return (
    <html lang="en">
      <body className="bg-[#120B10] text-[#F8F4EE] min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#1A0C14] border border-[#BA2649] rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#BA2649]/20 text-[#FFDE59] border border-[#FFDE59]/40 flex items-center justify-center mx-auto text-xl font-black">
            777
          </div>
          <h2 className="text-xl font-bold text-[#FFDE59]">
            777 Casino & Sportsbook
          </h2>
          <p className="text-xs text-gray-300">
            A temporary display issue occurred. Click below to continue playing.
          </p>
          {error?.message && (
            <p className="text-[11px] font-mono text-red-400 bg-black/40 p-2 rounded break-all">
              {error.message}
            </p>
          )}
          <button
            onClick={handleReset}
            className="w-full py-3 bg-[#BA2649] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-retro hover:bg-[#D12053] transition"
          >
            Reload Casino
          </button>
        </div>
      </body>
    </html>
  );
}
