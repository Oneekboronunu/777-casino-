"use client";

import React from "react";
import { X, HelpCircle, Gamepad2, Coins, ShieldCheck, HeartHandshake } from "lucide-react";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import sound from "@/lib/sound";

export default function HelpModal() {
  const { isHelpModalOpen, setIsHelpModalOpen } = useArcadeStore();

  if (!isHelpModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FFF6D4] border-2 border-[#EADBBE] rounded-3xl p-6 shadow-2xl text-[#40243B] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E0D0A5]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#FFE58B] border border-[#DECF9E] text-[#40243B] flex items-center justify-center font-black text-sm">
              ?
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight leading-tight">
                About 777 Retro Arcade
              </h3>
              <p className="text-[10px] text-gray-600 font-medium">
                Frequently asked questions & gameplay rules
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playChipClick();
              setIsHelpModalOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-[#F2E5C0] text-[#40243B] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Q&A */}
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-white/70 rounded-2xl border border-[#DECF9E] space-y-1">
            <h4 className="font-black text-[#40243B] flex items-center space-x-1.5">
              <Gamepad2 className="w-4 h-4 text-[#C33355]" />
              <span>Is this real-money gambling?</span>
            </h4>
            <p className="text-[11px] text-gray-700 leading-relaxed">
              No. 777 Retro Arcade is strictly a free-to-play social entertainment arcade platform. All bets, spins, and payouts use simulated FreePlay virtual points. You cannot deposit, bet, or win real money or prizes.
            </p>
          </div>

          <div className="p-3 bg-white/70 rounded-2xl border border-[#DECF9E] space-y-1">
            <h4 className="font-black text-[#40243B] flex items-center space-x-1.5">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>What happens if I run out of points?</span>
            </h4>
            <p className="text-[11px] text-gray-700 leading-relaxed">
              You can click the <strong>FreePlay</strong> button in the left sidebar or the <strong>Reset Free Points</strong> button at any time to instantly refill your balance back to 10,000 FreePlay points for free!
            </p>
          </div>

          <div className="p-3 bg-white/70 rounded-2xl border border-[#DECF9E] space-y-1">
            <h4 className="font-black text-[#40243B] flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
              <span>How are game outcomes decided?</span>
            </h4>
            <p className="text-[11px] text-gray-700 leading-relaxed">
              Our simulated arcade reels, roulette wheel, and crash engines use cryptographic pseudorandom number generators (PRNG) with weighted statistical distributions calibrated to authentic arcade payout curves.
            </p>
          </div>
        </div>

        {/* Bottom Close */}
        <div className="pt-2 border-t border-[#E0D0A5] flex justify-end">
          <button
            onClick={() => {
              sound.playChipClick();
              setIsHelpModalOpen(false);
            }}
            className="px-6 py-2 rounded-full bg-[#C33355] hover:bg-[#AA2443] text-white font-black text-xs uppercase tracking-wider transition shadow-sm"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
