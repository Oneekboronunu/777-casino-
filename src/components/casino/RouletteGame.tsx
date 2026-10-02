"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dices, RotateCcw, Trash2, Zap, ShieldCheck, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const CHIPS = [50, 100, 500, 1000, 5000];

export default function RouletteGame() {
  const { user, updateBalance, showNotification } = useUserStore();

  const [selectedChip, setSelectedChip] = useState<number>(500);
  const [bets, setBets] = useState<Record<string, number>>({});
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [landedNumber, setLandedNumber] = useState<number | null>(null);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([14, 32, 0, 7, 21, 9, 28]);

  const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);

  const isRed = (num: number) => RED_NUMBERS.includes(num);
  const isGreen = (num: number) => num === 0;

  const placeBet = (spot: string) => {
    if (isSpinning) return;
    sound.playChipClick();
    setBets((prev) => ({
      ...prev,
      [spot]: (prev[spot] || 0) + selectedChip,
    }));
  };

  const clearBets = () => {
    if (isSpinning) return;
    sound.playChipClick();
    setBets({});
  };

  const spinWheel = async () => {
    if (totalBet <= 0) {
      showNotification("Please place your chips on the betting table", "ERROR");
      return;
    }

    if (!user || user.balance < totalBet) {
      showNotification("Insufficient balance for this spin", "ERROR");
      return;
    }

    sound.playBetPlaced();
    updateBalance(-totalBet);
    setIsSpinning(true);
    setLandedNumber(null);

    // Pick winning random number (0-36)
    const winningNumber = Math.floor(Math.random() * 37);
    const winningIndex = WHEEL_NUMBERS.indexOf(winningNumber);
    const degreesPerSlice = 360 / WHEEL_NUMBERS.length;
    
    // Add multiple spins (e.g. 5 full rotations + landing slice)
    const targetDeg = 360 * 6 + (360 - winningIndex * degreesPerSlice);
    setWheelRotation((prev) => prev + targetDeg);

    // Play ticking sounds
    const tickInterval = setInterval(() => {
      sound.playWheelTick();
    }, 120);

    setTimeout(async () => {
      clearInterval(tickInterval);
      setLandedNumber(winningNumber);
      setIsSpinning(false);
      setHistory((prev) => [winningNumber, ...prev.slice(0, 11)]);

      // Calculate Winnings
      let winPayout = 0;
      const isWinRed = isRed(winningNumber);
      const isWinEven = winningNumber !== 0 && winningNumber % 2 === 0;

      // Straight up
      if (bets[`NUM_${winningNumber}`]) {
        winPayout += bets[`NUM_${winningNumber}`] * 36;
      }
      // Red / Black
      if (isWinRed && bets["COLOR_RED"]) {
        winPayout += bets["COLOR_RED"] * 2;
      }
      if (!isWinRed && winningNumber !== 0 && bets["COLOR_BLACK"]) {
        winPayout += bets["COLOR_BLACK"] * 2;
      }
      // Even / Odd
      if (isWinEven && bets["EVEN"]) {
        winPayout += bets["EVEN"] * 2;
      }
      if (!isWinEven && winningNumber !== 0 && bets["ODD"]) {
        winPayout += bets["ODD"] * 2;
      }
      // 1-18 / 19-36
      if (winningNumber >= 1 && winningNumber <= 18 && bets["LOW"]) {
        winPayout += bets["LOW"] * 2;
      }
      if (winningNumber >= 19 && winningNumber <= 36 && bets["HIGH"]) {
        winPayout += bets["HIGH"] * 2;
      }
      // 1st / 2nd / 3rd 12
      if (winningNumber >= 1 && winningNumber <= 12 && bets["1ST12"]) {
        winPayout += bets["1ST12"] * 3;
      }
      if (winningNumber >= 13 && winningNumber <= 24 && bets["2ND12"]) {
        winPayout += bets["2ND12"] * 3;
      }
      if (winningNumber >= 25 && winningNumber <= 36 && bets["3RD12"]) {
        winPayout += bets["3RD12"] * 3;
      }

      if (winPayout > 0) {
        sound.playWin();
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
        updateBalance(winPayout);
        showNotification(`🎉 Number ${winningNumber} (${isWinRed ? "Red" : winningNumber === 0 ? "Green" : "Black"})! Won ৳${winPayout.toLocaleString()}!`, "SUCCESS");
      } else {
        showNotification(`Number ${winningNumber} landed. Spin settled.`, "INFO");
      }

      // Record in backend
      try {
        await fetch("/api/casino/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            game: "ROULETTE",
            betAmount: totalBet,
            multiplier: totalBet > 0 ? winPayout / totalBet : 0,
            payout: winPayout,
            isWin: winPayout > 0,
            details: { landedNumber: winningNumber, color: isWinRed ? "red" : winningNumber === 0 ? "green" : "black" },
          }),
        });
      } catch {
        // ignore
      }
    }, 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-[#23334E] p-4 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center">
            <Dices className="w-6 h-6 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">EUROPEAN ROULETTE 3D</h1>
            <p className="text-xs text-gray-400">Single Zero 37-Slot Luxury European Wheel (97.3% RTP)</p>
          </div>
        </div>

        {/* History Badges */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase mr-1">Last Numbers:</span>
          {history.map((num, i) => (
            <span
              key={i}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white shadow-sm ${
                isGreen(num) ? "bg-[#10B981]" : isRed(num) ? "bg-[#EF4444]" : "bg-[#1E293B] border border-gray-600"
              }`}
            >
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* Wheel Stage & Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left: Animated Roulette Wheel */}
        <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Wheel Outer Brass Rim */}
            <div className="absolute inset-0 rounded-full border-8 border-[#D4AF37]/80 shadow-2xl bg-gradient-to-br from-[#2A1805] to-[#120B03]" />

            {/* Rotating Wheel Disk */}
            <div
              className="w-56 h-56 sm:w-60 sm:h-60 rounded-full border-4 border-[#D4AF37] relative flex items-center justify-center transition-transform duration-[4000ms] ease-out shadow-inner"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#1F2937,#0F172A)]" />
              {/* Inner Center Hub */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#FFF3B0] to-[#997A1E] border-2 border-[#D4AF37] z-10 flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 rounded-full bg-[#0B0F1A]" />
              </div>
            </div>

            {/* Pointer / Result Marker */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-6 bg-[#D4AF37] [clip-path:polygon(50%_100%,0_0,100%_0)] z-20 drop-shadow-md" />
          </div>

          {/* Landed Outcome Display */}
          <div className="mt-4 text-center">
            {landedNumber !== null ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-bold text-gray-400">Winning Result:</span>
                <span
                  className={`px-3 py-1 rounded-lg text-base font-black font-mono text-white ${
                    isGreen(landedNumber)
                      ? "bg-[#10B981]"
                      : isRed(landedNumber)
                      ? "bg-[#EF4444]"
                      : "bg-[#1E293B]"
                  }`}
                >
                  {landedNumber} ({isGreen(landedNumber) ? "ZERO" : isRed(landedNumber) ? "RED" : "BLACK"})
                </span>
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                {isSpinning ? "Ball in motion..." : "Place chips & spin"}
              </div>
            )}
          </div>
        </div>

        {/* Right: Betting Table Grid */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#23334E] rounded-2xl p-5 space-y-4">
          {/* Numbers Grid (0 to 36) */}
          <div className="space-y-1.5 overflow-x-auto">
            {/* Zero Spot */}
            <button
              onClick={() => placeBet("NUM_0")}
              className={`w-full py-2.5 rounded-xl text-sm font-bold text-white bg-[#10B981] hover:bg-[#059669] border border-[#10B981]/50 transition relative flex items-center justify-center ${
                bets["NUM_0"] ? "ring-2 ring-[#D4AF37]" : ""
              }`}
            >
              <span>0 (Green)</span>
              {bets["NUM_0"] && (
                <span className="absolute right-3 px-1.5 py-0.5 bg-[#D4AF37] text-[#0B0F1A] rounded text-[10px] font-mono font-black">
                  ৳{bets["NUM_0"]}
                </span>
              )}
            </button>

            {/* 1-36 Numbers in 3 rows */}
            <div className="grid grid-cols-12 gap-1.5 text-xs font-bold text-white">
              {Array.from({ length: 36 }, (_, i) => i + 1).map((n) => {
                const red = isRed(n);
                const hasBet = bets[`NUM_${n}`];
                return (
                  <button
                    key={n}
                    onClick={() => placeBet(`NUM_${n}`)}
                    className={`py-3 rounded-lg flex flex-col items-center justify-center transition relative ${
                      red
                        ? "bg-[#EF4444] hover:bg-[#DC2626]"
                        : "bg-[#1E293B] hover:bg-[#334155] border border-gray-700"
                    } ${hasBet ? "ring-2 ring-[#D4AF37]" : ""}`}
                  >
                    <span>{n}</span>
                    {hasBet && (
                      <span className="text-[9px] font-mono text-[#D4AF37] font-black">
                        ৳{hasBet}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Outside Bets: Red, Black, Even, Odd, Low, High */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => placeBet("1ST12")}
                className={`py-2 rounded-lg text-xs font-bold bg-[#151F32] border border-[#23334E] hover:border-[#D4AF37] text-gray-200 ${
                  bets["1ST12"] ? "border-[#D4AF37] text-[#D4AF37]" : ""
                }`}
              >
                1st 12 (3x) {bets["1ST12"] ? `(৳${bets["1ST12"]})` : ""}
              </button>
              <button
                onClick={() => placeBet("2ND12")}
                className={`py-2 rounded-lg text-xs font-bold bg-[#151F32] border border-[#23334E] hover:border-[#D4AF37] text-gray-200 ${
                  bets["2ND12"] ? "border-[#D4AF37] text-[#D4AF37]" : ""
                }`}
              >
                2nd 12 (3x) {bets["2ND12"] ? `(৳${bets["2ND12"]})` : ""}
              </button>
              <button
                onClick={() => placeBet("3RD12")}
                className={`py-2 rounded-lg text-xs font-bold bg-[#151F32] border border-[#23334E] hover:border-[#D4AF37] text-gray-200 ${
                  bets["3RD12"] ? "border-[#D4AF37] text-[#D4AF37]" : ""
                }`}
              >
                3rd 12 (3x) {bets["3RD12"] ? `(৳${bets["3RD12"]})` : ""}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => placeBet("COLOR_RED")}
                className={`py-2.5 rounded-lg text-xs font-bold bg-[#EF4444] text-white hover:bg-[#DC2626] ${
                  bets["COLOR_RED"] ? "ring-2 ring-[#D4AF37]" : ""
                }`}
              >
                RED (2x) {bets["COLOR_RED"] ? `(৳${bets["COLOR_RED"]})` : ""}
              </button>
              <button
                onClick={() => placeBet("COLOR_BLACK")}
                className={`py-2.5 rounded-lg text-xs font-bold bg-[#1E293B] text-white border border-gray-700 hover:bg-[#334155] ${
                  bets["COLOR_BLACK"] ? "ring-2 ring-[#D4AF37]" : ""
                }`}
              >
                BLACK (2x) {bets["COLOR_BLACK"] ? `(৳${bets["COLOR_BLACK"]})` : ""}
              </button>
              <button
                onClick={() => placeBet("EVEN")}
                className={`py-2.5 rounded-lg text-xs font-bold bg-[#151F32] border border-[#23334E] hover:border-[#D4AF37] text-gray-200 ${
                  bets["EVEN"] ? "border-[#D4AF37] text-[#D4AF37]" : ""
                }`}
              >
                EVEN (2x) {bets["EVEN"] ? `(৳${bets["EVEN"]})` : ""}
              </button>
              <button
                onClick={() => placeBet("ODD")}
                className={`py-2.5 rounded-lg text-xs font-bold bg-[#151F32] border border-[#23334E] hover:border-[#D4AF37] text-gray-200 ${
                  bets["ODD"] ? "border-[#D4AF37] text-[#D4AF37]" : ""
                }`}
              >
                ODD (2x) {bets["ODD"] ? `(৳${bets["ODD"]})` : ""}
              </button>
            </div>
          </div>

          {/* Chips & Action Controls */}
          <div className="pt-3 border-t border-[#23334E] flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Chip Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 font-semibold mr-1">Chip:</span>
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setSelectedChip(chip);
                    sound.playChipClick();
                  }}
                  className={`w-9 h-9 rounded-full text-[11px] font-bold font-mono transition shadow-md flex items-center justify-center ${
                    selectedChip === chip
                      ? "bg-[#D4AF37] text-[#0B0F1A] ring-2 ring-white scale-110"
                      : "bg-[#151F32] text-gray-300 border border-[#23334E] hover:border-gray-500"
                  }`}
                >
                  {chip >= 1000 ? `${chip / 1000}k` : chip}
                </button>
              ))}
            </div>

            {/* Total Bet & Actions */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={clearBets}
                disabled={isSpinning || totalBet === 0}
                className="p-3 bg-[#151F32] border border-[#23334E] hover:border-red-400 text-gray-400 hover:text-red-400 rounded-xl transition disabled:opacity-40"
                title="Clear All Bets"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={spinWheel}
                disabled={isSpinning || totalBet === 0}
                className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-[#0B0F1A] font-extrabold text-sm rounded-xl transition shadow-gold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSpinning ? (
                  <span>SPINNING...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-[#0B0F1A]" />
                    <span>SPIN (৳{totalBet.toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
