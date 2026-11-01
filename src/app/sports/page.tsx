"use client";

import React, { useState } from "react";
import ToffeeSportsView from "@/components/sports/ToffeeSportsView";
import SportsBettingLayout from "@/components/sports/SportsBettingLayout";
import { Radio, TableProperties } from "lucide-react";
import sound from "@/lib/sound";

export default function SportsbookPage() {
  const [viewMode, setViewMode] = useState<"TOFFEE" | "MATRIX">("TOFFEE");

  return (
    <div className="w-full flex flex-col bg-[#070A0E]">
      {/* Top Experience Switcher Bar */}
      <div className="w-full bg-[#0B0F16] border-b border-[#16202D] px-4 sm:px-8 py-2.5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 hidden sm:inline">
              Sports Display Mode:
            </span>
            <div className="flex items-center bg-[#131A24] p-1 rounded-xl border border-[#1E2938]">
              <button
                onClick={() => {
                  sound.playChipClick();
                  setViewMode("TOFFEE");
                }}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition ${
                  viewMode === "TOFFEE"
                    ? "bg-[#95D600] text-black shadow-[0_0_12px_rgba(149,214,0,0.35)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${viewMode === "TOFFEE" ? "text-black animate-pulse" : "text-red-500"}`} />
                <span>Toffee Live Sports</span>
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-bold">
                  HD
                </span>
              </button>

              <button
                onClick={() => {
                  sound.playChipClick();
                  setViewMode("MATRIX");
                }}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition ${
                  viewMode === "MATRIX"
                    ? "bg-[#95D600] text-black shadow-[0_0_12px_rgba(149,214,0,0.35)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>bet777 Odds Matrix</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#95D600] animate-ping" />
            <span className="hidden md:inline text-gray-300">Live In-Play Coverage:</span>
            <span className="text-[#95D600] font-bold">106 Live Events</span>
          </div>
        </div>
      </div>

      {/* Render Selected View */}
      {viewMode === "TOFFEE" ? <ToffeeSportsView /> : <SportsBettingLayout />}
    </div>
  );
}
