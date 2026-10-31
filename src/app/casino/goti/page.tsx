"use client";

import dynamic from "next/dynamic";
import React from "react";

const CosmicGotiGame = dynamic(() => import("@/components/casino/CosmicGotiGame"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[85vh] flex flex-col items-center justify-center space-y-4 bg-[#07040B] text-white">
      <div className="w-14 h-14 rounded-full border-4 border-[#FF7A00] border-t-transparent animate-spin" />
      <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#FFDE59]">
        Initializing 24 Goti: Cosmic Anti-Gravity Nexus...
      </div>
    </div>
  ),
});

export default function CosmicGotiPage() {
  return <CosmicGotiGame />;
}
