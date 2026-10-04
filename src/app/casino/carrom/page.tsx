"use client";

import dynamic from "next/dynamic";
import React from "react";

const CarromGame = dynamic(() => import("@/components/casino/CarromGame"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#2B0830] text-white">
      <div className="w-12 h-12 rounded-full border-4 border-[#FFDE59] border-t-transparent animate-spin" />
      <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#FFDE59]">
        Loading Carrom Board Arena...
      </div>
    </div>
  ),
});

export default function CarromPage() {
  return <CarromGame />;
}
