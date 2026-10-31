"use client";

import dynamic from "next/dynamic";
import React from "react";

const GotiGame = dynamic(() => import("@/components/casino/CosmicGotiGame"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#D8A368] text-amber-950">
      <div className="w-12 h-12 rounded-full border-4 border-[#6E3C0F] border-t-transparent animate-spin" />
      <div className="text-xs font-bold tracking-wider uppercase text-[#6E3C0F] font-sans">
        Loading 24 Goti Board...
      </div>
    </div>
  ),
});

export default function GotiPage() {
  return <GotiGame />;
}
