"use client";

import React, { useState } from "react";
import { X, Gift, Coins, Sparkles, CheckCircle2, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

export default function FreePlayModal() {
  const { isFreePlayModalOpen, setIsFreePlayModalOpen, freePlayPoints, addFreePlayPoints, resetFreePlayPoints } = useArcadeStore();
  const { addCoins, showNotification } = useUserStore();
  const [claimed, setClaimed] = useState(false);

  if (!isFreePlayModalOpen) return null;

  const handleClaimDailyDrop = () => {
    sound.playWin();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#91D2BC", "#FFE58B", "#C33355", "#0D9488"],
      });
    } catch {}

    addFreePlayPoints(2500);
    addCoins(2500, "Daily Arcade Drop");
    setClaimed(true);
    showNotification("Claimed +2,500 Daily FreePlay Points!", "SUCCESS");
  };

  const handleReset = () => {
    sound.playWin();
    resetFreePlayPoints();
    addCoins(10000, "Reset Virtual Points");
    showNotification("Points successfully reset to 10,000!", "INFO");
    setIsFreePlayModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FFF6D4] border-2 border-[#EADBBE] rounded-3xl p-6 shadow-2xl text-[#40243B] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E0D0A5]">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-[#C33355] text-white flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight leading-tight">
                FreePlay Hub
              </h3>
              <p className="text-[10px] text-gray-600 font-medium">
                100% Free Virtual Points • No Real Money
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playChipClick();
              setIsFreePlayModalOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-[#F2E5C0] text-[#40243B] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Display */}
        <div className="bg-[#91D2BC]/40 border-2 border-[#7EBEA9] rounded-2xl p-4 text-center space-y-1">
          <span className="text-[10px] uppercase font-black tracking-wider text-gray-700">
            Available Virtual FreePlay Balance
          </span>
          <div className="flex items-center justify-center space-x-2">
            <Coins className="w-6 h-6 text-[#C33355]" />
            <span className="text-3xl font-black font-mono text-[#C33355]">
              {freePlayPoints.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-gray-600">PTS</span>
          </div>
        </div>

        {/* Daily Bonus Card */}
        <div className="p-4 rounded-2xl bg-white/70 border border-[#DECF9E] space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <h4 className="text-xs font-black text-[#40243B]">
                  Daily Arcade Drop (+2,500 PTS)
                </h4>
                <p className="text-[10px] text-gray-600">
                  Refill bonus available every 24 hours
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleClaimDailyDrop}
            disabled={claimed}
            className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center space-x-1.5 ${
              claimed
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-[#0D9488] hover:bg-[#0F766E] text-white active:scale-95"
            }`}
          >
            {claimed ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Claimed! (+2,500 PTS)</span>
              </>
            ) : (
              <>
                <Gift className="w-4 h-4" />
                <span>Claim Daily Bonus</span>
              </>
            )}
          </button>
        </div>

        {/* Reset Points Option */}
        <div className="pt-2 flex items-center justify-between text-xs">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 text-gray-600 hover:text-[#C33355] font-bold text-[11px] transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Balance to 10,000</span>
          </button>

          <button
            onClick={() => {
              sound.playChipClick();
              setIsFreePlayModalOpen(false);
            }}
            className="px-6 py-2 rounded-full bg-[#C33355] hover:bg-[#AA2443] text-white font-black text-xs uppercase tracking-wider transition shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
