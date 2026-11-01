"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { TableProperties, Activity } from "lucide-react";
import sound from "@/lib/sound";

const FlashscoreSportsView = dynamic(
  () => import("@/components/sports/FlashscoreSportsView"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 flex items-center justify-center bg-[#0B0F15] text-[#95D600] font-mono text-xs">
        <span className="w-2.5 h-2.5 rounded-full bg-[#95D600] animate-ping mr-2.5" />
        Loading Live Sports & Probabilities...
      </div>
    ),
  }
);

const SportsBettingLayout = dynamic(
  () => import("@/components/sports/SportsBettingLayout"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 flex items-center justify-center bg-[#0B0F15] text-gray-400 font-mono text-xs">
        Loading Sports Matrix...
      </div>
    ),
  }
);

export default function SportsbookPage() {
  const [viewMode, setViewMode] = useState<"FLASHSCORE" | "MATRIX">("FLASHSCORE");

  return (
    <div className="w-full flex flex-col bg-[#070A0E]">
      {/* Top Experience Switcher Bar */}
      <div className="w-full bg-[#0B0F16] border-b border-[#16202D] px-4 sm:px-8 py-2.5">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 hidden sm:inline">
              Sports Experience:
            </span>
            <div className="flex items-center bg-[#131A24] p-1 rounded-xl border border-[#1E2938]">
              {/* Flashscore Mode */}
              <button
                onClick={() => {
                  sound.playChipClick();
                  setViewMode("FLASHSCORE");
                }}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition whitespace-nowrap ${
                  viewMode === "FLASHSCORE"
                    ? "bg-[#95D600] text-black shadow-[0_0_12px_rgba(149,214,0,0.35)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${viewMode === "FLASHSCORE" ? "text-black" : "text-[#95D600]"}`} />
                <span>Flashscore Scores & Trading</span>
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-bold">
                  LIVE
                </span>
              </button>

              {/* bet777 Matrix Mode */}
              <button
                onClick={() => {
                  sound.playChipClick();
                  setViewMode("MATRIX");
                }}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition whitespace-nowrap ${
                  viewMode === "MATRIX"
                    ? "bg-[#95D600] text-black shadow-[0_0_12px_rgba(149,214,0,0.35)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>bet777 Matrix</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#95D600] animate-ping" />
            <span className="hidden md:inline text-gray-300">Flashscore Live Data:</span>
            <span className="text-[#95D600] font-bold">Cricket • Football • Tennis</span>
          </div>
        </div>
      </div>

      {/* Render Selected View */}
      {viewMode === "FLASHSCORE" ? <FlashscoreSportsView /> : <SportsBettingLayout />}
    </div>
  );
}
