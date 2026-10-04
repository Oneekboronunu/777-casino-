"use client";

import dynamic from "next/dynamic";
import React from "react";

const AviatorGame = dynamic(() => import("@/components/casino/AviatorGame"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#0C070D] text-white">
      <div className="w-12 h-12 rounded-full border-4 border-[#BA2649] border-t-transparent animate-spin" />
      <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#FFDE59]">
        Loading Aviator Flight Engine...
      </div>
    </div>
  ),
});

export default function AviatorPage() {
  return <AviatorGame />;
}
