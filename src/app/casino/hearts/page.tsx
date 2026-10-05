"use client";

import dynamic from "next/dynamic";
import React from "react";

const HeartsGame = dynamic(() => import("@/components/casino/HeartsGame"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#0C150E] text-white">
      <div className="w-12 h-12 rounded-full border-4 border-[#D92638] border-t-transparent animate-spin" />
      <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#D92638]">
        Loading 24/7 Hearts Table...
      </div>
    </div>
  ),
});

export default function HeartsPage() {
  return <HeartsGame />;
}
