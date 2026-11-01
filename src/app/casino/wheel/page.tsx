"use client";

import dynamic from "next/dynamic";
import React from "react";

const SpinWheelGame = dynamic(
  () => import("@/components/casino/wheel/SpinWheelGame"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#120624] text-amber-300">
        <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
        <div className="text-xs font-black tracking-widest uppercase font-mono">
          Loading Spin to Win...
        </div>
      </div>
    ),
  }
);

export default function SpinWheelPage() {
  return <SpinWheelGame />;
}
