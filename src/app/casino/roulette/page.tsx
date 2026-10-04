"use client";

import dynamic from "next/dynamic";
import React from "react";

const RouletteGame = dynamic(() => import("@/components/casino/RouletteGame"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#0B0F1A] text-white">
      <div className="w-12 h-12 rounded-full border-4 border-[#10B981] border-t-transparent animate-spin" />
      <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#FFDE59]">
        Loading European Roulette 3D...
      </div>
    </div>
  ),
});

export default function RoulettePage() {
  return <RouletteGame />;
}
