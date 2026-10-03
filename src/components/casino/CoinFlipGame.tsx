"use client";

import React, { useState } from "react";
import { Coins, Zap, ShieldCheck, Flame, Trophy, Award, Crown } from "lucide-react";
import confetti from "canvas-confetti";
import { useUserStore } from "@/lib/store/useUserStore";
import { useAdminConfigStore } from "@/lib/store/useAdminConfigStore";
import sound from "@/lib/sound";

export default function CoinFlipGame() {
  const { user, updateBalance, showNotification } = useUserStore();

  const [choice, setChoice] = useState<"HEADS" | "TAILS">("HEADS");
  const [betAmount, setBetAmount] = useState<number>(500);
  const [streak, setStreak] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [resultCoin, setResultCoin] = useState<"HEADS" | "TAILS" | null>(null);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [history, setHistory] = useState<("HEADS" | "TAILS")[]>(["HEADS", "TAILS", "HEADS", "HEADS"]);

  // Multiplier scales with streak
  const currentMultiplier = Math.round(Math.pow(1.96, streak + 1) * 100) / 100;
  const potentialWin = Math.round(betAmount * currentMultiplier);

  const { settings } = useAdminConfigStore();

  const handleFlip = async () => {
    if (betAmount < 10) {
      showNotification("Minimum bet is ৳10", "ERROR");
      return;
    }

    if (streak === 0 && (!user || user.balance < betAmount)) {
      showNotification("Insufficient balance for this flip", "ERROR");
      return;
    }

    // Deduct only on first flip of streak
    if (streak === 0) {
      updateBalance(-betAmount);
    }

    sound.playCoinFlip();
    setIsFlipping(true);
    setResultCoin(null);

    // Calculate outcome with Admin Rig
    let outcome: "HEADS" | "TAILS" = Math.random() > 0.5 ? "HEADS" : "TAILS";

    if (settings.coinFlipForceOutcome === "FORCE_WIN") {
      outcome = choice;
    } else if (settings.coinFlipForceOutcome === "FORCE_LOSS") {
      outcome = choice === "HEADS" ? "TAILS" : "HEADS";
    } else {
      // Respect Max Streak Limit
      const maxStreak = settings.coinFlipMaxStreak || 3;
      if (streak >= maxStreak) {
        outcome = choice === "HEADS" ? "TAILS" : "HEADS"; // Force loss
      } else if (Math.random() < (settings.coinFlipHouseEdge || 8) / 100) {
        outcome = choice === "HEADS" ? "TAILS" : "HEADS"; // House edge bias
      }
    }

    // Add 10+ flips in degrees
    const extraRotations = 1800 + Math.floor(Math.random() * 4) * 360;
    const finalRot = outcome === "HEADS" ? extraRotations : extraRotations + 180;

    setRotationDeg((prev) => prev + finalRot);

    setTimeout(async () => {
      setResultCoin(outcome);
      setIsFlipping(false);
      setHistory((prev) => [outcome, ...prev.slice(0, 7)]);

      const won = choice === outcome;

      if (won) {
        sound.playWin();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        showNotification(`🔥 CORRECT! Streak ${nextStreak}x! Multiplier now ${(Math.pow(1.96, nextStreak)).toFixed(2)}x!`, "SUCCESS");
      } else {
        sound.playCrash();
        setStreak(0);
        showNotification(`Landed ${outcome}. Streak lost.`, "INFO");

        // Record loss in backend
        try {
          await fetch("/api/casino/record", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              game: "COINFLIP",
              betAmount,
              multiplier: 0,
              payout: 0,
              isWin: false,
              details: { choice, outcome, finalStreak: streak },
            }),
          });
        } catch {
          // ignore
        }
      }
    }, 1500);
  };

  const handleCashoutStreak = async () => {
    if (streak === 0) return;
    const winAmt = Math.round(betAmount * Math.pow(1.96, streak));
    sound.playWin();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    updateBalance(winAmt);
    showNotification(`🏆 Cashed out streak! Won ৳${winAmt.toLocaleString()} (${Math.pow(1.96, streak).toFixed(2)}x)!`, "SUCCESS");

    try {
      await fetch("/api/casino/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: "COINFLIP",
          betAmount,
          multiplier: Math.pow(1.96, streak),
          payout: winAmt,
          isWin: true,
          details: { streakCashedOut: streak },
        }),
      });
    } catch {
      // ignore
    }

    setStreak(0);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-[#23334E] p-4 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
            <Coins className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">COIN FLIP STREAK</h1>
            <p className="text-xs text-gray-400">Streak Multipliers up to 100x with Instant Cash Out</p>
          </div>
        </div>

        {/* History */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase mr-1">Flips:</span>
          {history.map((h, i) => (
            <span
              key={i}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                h === "HEADS" ? "bg-[#D4AF37] text-[#0B0F1A]" : "bg-[#1E293B] text-gray-300 border border-gray-600"
              }`}
            >
              {h === "HEADS" ? "H" : "T"}
            </span>
          ))}
        </div>
      </div>

      {/* Main Flip Stage */}
      <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-6 sm:p-8 space-y-8 text-center">
        {/* Streak Counter */}
        {streak > 0 && (
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full text-[#D4AF37] font-bold text-xs animate-pulse">
            <Flame className="w-4 h-4" />
            <span>CURRENT WIN STREAK: {streak} FLIPS ({(Math.pow(1.96, streak)).toFixed(2)}x)</span>
          </div>
        )}

        {/* 3D Coin Graphic */}
        <div className="py-8 flex justify-center [perspective:1000px]">
          <div
            className="w-40 h-40 rounded-full relative transition-transform duration-[1500ms] ease-out [transform-style:preserve-3d] shadow-2xl"
            style={{ transform: `rotateY(${rotationDeg}deg)` }}
          >
            {/* Front: Heads (Gold) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#FFF5C0] to-[#997A1E] border-4 border-[#D4AF37] flex flex-col items-center justify-center [backface-visibility:hidden] shadow-gold">
              <Crown className="w-12 h-12 text-[#0B0F1A]" />
              <span className="text-xs font-black text-[#0B0F1A] mt-1 tracking-wider">HEADS</span>
            </div>

            {/* Back: Tails (Silver / Dark) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#64748B] via-[#E2E8F0] to-[#334155] border-4 border-gray-400 flex flex-col items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <Trophy className="w-12 h-12 text-[#0B0F1A]" />
              <span className="text-xs font-black text-[#0B0F1A] mt-1 tracking-wider">TAILS</span>
            </div>
          </div>
        </div>

        {/* Choice Selector */}
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          <button
            disabled={isFlipping}
            onClick={() => {
              setChoice("HEADS");
              sound.playChipClick();
            }}
            className={`py-3.5 rounded-xl text-xs font-extrabold border transition ${
              choice === "HEADS"
                ? "bg-[#D4AF37] text-[#0B0F1A] border-[#D4AF37] shadow-gold"
                : "bg-[#151F32] text-gray-300 border-[#23334E] hover:border-gray-500"
            }`}
          >
            SELECT HEADS (1.96x)
          </button>
          <button
            disabled={isFlipping}
            onClick={() => {
              setChoice("TAILS");
              sound.playChipClick();
            }}
            className={`py-3.5 rounded-xl text-xs font-extrabold border transition ${
              choice === "TAILS"
                ? "bg-[#D4AF37] text-[#0B0F1A] border-[#D4AF37] shadow-gold"
                : "bg-[#151F32] text-gray-300 border-[#23334E] hover:border-gray-500"
            }`}
          >
            SELECT TAILS (1.96x)
          </button>
        </div>

        {/* Stake and Flip Action */}
        <div className="max-w-md mx-auto space-y-3 pt-4 border-t border-[#23334E]">
          {streak === 0 && (
            <div>
              <label className="text-xs text-gray-400 font-semibold block mb-1">Bet Stake (BDT ৳)</label>
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {[100, 500, 1000, 2500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setBetAmount(amt);
                      sound.playChipClick();
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      betAmount === amt
                        ? "border-[#D4AF37] bg-[#D4AF37] text-[#0B0F1A]"
                        : "border-[#23334E] bg-[#0B0F1A] text-gray-300"
                    }`}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            {streak > 0 && (
              <button
                onClick={handleCashoutStreak}
                disabled={isFlipping}
                className="flex-1 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs rounded-xl transition shadow-emerald"
              >
                CASH OUT ৳{Math.round(betAmount * Math.pow(1.96, streak)).toLocaleString()}
              </button>
            )}

            <button
              onClick={handleFlip}
              disabled={isFlipping}
              className="flex-1 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-[#0B0F1A] font-extrabold text-sm rounded-xl transition shadow-gold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-[#0B0F1A]" />
              <span>{isFlipping ? "FLIPPING COIN..." : `FLIP ${choice} (POTENTIAL: ৳${potentialWin.toLocaleString()})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
