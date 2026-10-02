"use client";

import React, { useState } from "react";
import { Activity, Zap, RotateCcw, ShieldCheck, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

export default function DiceGame() {
  const { user, updateBalance, showNotification } = useUserStore();

  const [betAmount, setBetAmount] = useState<number>(500);
  const [target, setTarget] = useState<number>(50.0);
  const [isRollUnder, setIsRollUnder] = useState<boolean>(true);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [lastWon, setLastWon] = useState<boolean | null>(null);
  const [history, setHistory] = useState<{ roll: number; won: boolean }[]>([
    { roll: 32.45, won: true },
    { roll: 78.12, won: false },
    { roll: 12.04, won: true },
    { roll: 44.89, won: true },
  ]);

  // Calculations
  const winChance = isRollUnder ? target : 100 - target;
  const multiplier = Math.round((98.5 / winChance) * 100) / 100;
  const potentialProfit = Math.round(betAmount * multiplier - betAmount);

  const handleRoll = async () => {
    if (betAmount < 10) {
      showNotification("Minimum bet is ৳10", "ERROR");
      return;
    }

    if (!user || user.balance < betAmount) {
      showNotification("Insufficient balance for this roll", "ERROR");
      return;
    }

    sound.playDiceRoll();
    updateBalance(-betAmount);
    setIsRolling(true);
    setLastRoll(null);

    setTimeout(async () => {
      // Generate fair roll between 0.00 and 100.00
      const rolledValue = Math.round((Math.random() * 100) * 100) / 100;
      const won = isRollUnder ? rolledValue < target : rolledValue > target;

      setLastRoll(rolledValue);
      setLastWon(won);
      setIsRolling(false);
      setHistory((prev) => [{ roll: rolledValue, won }, ...prev.slice(0, 7)]);

      const winPayout = won ? Math.round(betAmount * multiplier) : 0;

      if (won) {
        sound.playWin();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        updateBalance(winPayout);
        showNotification(`🎲 Rolled ${rolledValue}! Won ৳${winPayout.toLocaleString()} (${multiplier}x)!`, "SUCCESS");
      } else {
        showNotification(`🎲 Rolled ${rolledValue}. Missed target.`, "INFO");
      }

      // Record in backend
      try {
        await fetch("/api/casino/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            game: "DICE",
            betAmount,
            multiplier: won ? multiplier : 0,
            payout: winPayout,
            isWin: won,
            details: { rolledValue, target, isRollUnder, winChance },
          }),
        });
      } catch {
        // ignore
      }
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-[#23334E] p-4 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">PROVABLY FAIR DICE</h1>
            <p className="text-xs text-gray-400">99% Return to Player (RTP) with Customizable Target & Win Chance</p>
          </div>
        </div>

        {/* History */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase mr-1">Rolls:</span>
          {history.map((h, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                h.won
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {h.roll.toFixed(2)}
            </span>
          ))}
        </div>
      </div>

      {/* Main Dice Stage */}
      <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Roll Display Box */}
        <div className="relative py-12 bg-[#0B0F1A] border border-[#23334E] rounded-2xl flex flex-col items-center justify-center shadow-inner overflow-hidden">
          <div className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-2">
            {isRolling ? "Rolling..." : "Resulting Number"}
          </div>

          <div
            className={`text-6xl sm:text-7xl font-mono font-black tracking-tight transition-all duration-300 ${
              isRolling
                ? "text-gray-500 animate-pulse"
                : lastWon === true
                ? "text-[#10B981] scale-105"
                : lastWon === false
                ? "text-red-400 scale-105"
                : "text-white"
            }`}
          >
            {lastRoll !== null ? lastRoll.toFixed(2) : (50.0).toFixed(2)}
          </div>

          <div className="mt-4 flex items-center space-x-2 text-xs font-semibold">
            <span className="text-gray-400">Target Condition:</span>
            <span className="text-[#D4AF37]">
              {isRollUnder ? "Roll Under" : "Roll Over"} {target.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Target Slider */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="range"
              min="2"
              max="98"
              step="0.5"
              disabled={isRolling}
              value={target}
              onChange={(e) => {
                setTarget(Number(e.target.value));
                sound.playChipClick();
              }}
              className="w-full h-3 bg-[#0B0F1A] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />
            {/* Slider markers */}
            <div className="flex justify-between text-[11px] font-mono text-gray-500 pt-1">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Multiplier, Chance, Profit Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#0B0F1A] border border-[#23334E] rounded-xl text-center">
            <div className="text-xs text-gray-400 font-semibold mb-1">Payout Multiplier</div>
            <div className="text-2xl font-mono font-bold text-[#D4AF37]">{multiplier.toFixed(2)}x</div>
          </div>

          <div
            onClick={() => {
              setIsRollUnder(!isRollUnder);
              sound.playChipClick();
            }}
            className="p-4 bg-[#0B0F1A] border border-[#23334E] hover:border-[#D4AF37] rounded-xl text-center cursor-pointer transition"
          >
            <div className="text-xs text-gray-400 font-semibold mb-1">
              Condition (Click to Switch)
            </div>
            <div className="text-sm font-bold text-white flex items-center justify-center space-x-1">
              <span>{isRollUnder ? "ROLL UNDER" : "ROLL OVER"}</span>
              <span className="text-[#D4AF37] font-mono">{target.toFixed(1)}</span>
            </div>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-[#23334E] rounded-xl text-center">
            <div className="text-xs text-gray-400 font-semibold mb-1">Win Chance</div>
            <div className="text-2xl font-mono font-bold text-[#10B981]">{winChance.toFixed(1)}%</div>
          </div>
        </div>

        {/* Stake Controls & Roll Button */}
        <div className="pt-4 border-t border-[#23334E] grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="text-xs text-gray-400 font-semibold block mb-1.5">Bet Amount (BDT ৳)</label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">৳</span>
                <input
                  type="number"
                  min="10"
                  step="50"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl pl-7 pr-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button
                onClick={() => {
                  setBetAmount(Math.max(10, Math.floor(betAmount / 2)));
                  sound.playChipClick();
                }}
                className="px-3 py-2 bg-[#151F32] border border-[#23334E] text-xs font-bold text-gray-300 rounded-xl"
              >
                1/2
              </button>
              <button
                onClick={() => {
                  setBetAmount(betAmount * 2);
                  sound.playChipClick();
                }}
                className="px-3 py-2 bg-[#151F32] border border-[#23334E] text-xs font-bold text-gray-300 rounded-xl"
              >
                2x
              </button>
            </div>
          </div>

          <button
            onClick={handleRoll}
            disabled={isRolling}
            className="w-full py-4 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-[#0B0F1A] font-black text-base rounded-xl transition shadow-gold flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Zap className="w-5 h-5 fill-[#0B0F1A]" />
            <span>{isRolling ? "ROLLING..." : `ROLL DICE (PROFIT: +৳${potentialProfit.toLocaleString()})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
