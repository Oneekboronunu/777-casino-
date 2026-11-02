"use client";

import React, { useState } from "react";
import { X, Sparkles, Volume2, RotateCcw, Trophy, Play } from "lucide-react";
import confetti from "canvas-confetti";
import { ArcadeGame } from "@/data/arcadeGames";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

interface GameDemoModalProps {
  game: ArcadeGame | null;
  onClose: () => void;
}

const SYMBOLS = ["🍒", "🍋", "💎", "7️⃣", "🔔", "🍇", "⭐", "🤠"];

export default function GameDemoModal({ game, onClose }: GameDemoModalProps) {
  const { user, addCoins, showNotification } = useUserStore();

  const [reel1, setReel1] = useState("7️⃣");
  const [reel2, setReel2] = useState("💎");
  const [reel3, setReel3] = useState("7️⃣");
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<number>(100);

  if (!game) return null;

  const handleSpin = () => {
    if (isSpinning) return;

    const currentPoints = user?.coins ?? 15000;
    if (currentPoints < betAmount) {
      showNotification("Not enough FreePlay points! Resetting points for you...", "INFO");
      addCoins(5000, "Free refill");
    }

    setIsSpinning(true);
    setLastWin(null);
    sound.playChipClick();
    addCoins(-betAmount, "Arcade Spin");

    let count = 0;
    const interval = setInterval(() => {
      setReel1(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      setReel2(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      setReel3(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      count++;

      if (count > 12) {
        clearInterval(interval);

        // Calculate outcome
        const winChance = Math.random();
        let s1 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        let s2 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        let s3 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        let winPoints = 0;

        if (winChance > 0.8) {
          // Jackpot 3 of a kind!
          s1 = s2 = s3 = "7️⃣";
          winPoints = betAmount * 15;
        } else if (winChance > 0.5) {
          // 2 of a kind win
          s1 = s2 = "💎";
          winPoints = betAmount * 3;
        } else if (winChance > 0.3) {
          s1 = s2 = "🍒";
          winPoints = betAmount * 1.5;
        }

        setReel1(s1);
        setReel2(s2);
        setReel3(s3);
        setIsSpinning(false);

        if (winPoints > 0) {
          setLastWin(winPoints);
          addCoins(winPoints, "Demo Win");
          sound.playWin();
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
            });
          } catch {}
          showNotification(`Awesome! You won +${winPoints.toLocaleString()} FreePlay Points!`, "SUCCESS");
        }
      }
    }, 90);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in select-none">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#251A22] border-2 border-[#FFE58B] rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1C1219] border-b border-[#3D2536]">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{game.iconEmoji}</span>
            <div>
              <h3 className="text-sm font-black text-[#FFE58B]">{game.title}</h3>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                Free-to-Play Arcade Demonstration
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playChipClick();
              onClose();
            }}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Stage */}
        <div className="p-6 space-y-6 flex flex-col items-center justify-center">
          {/* Virtual Slots Reels Box */}
          <div className="w-full max-w-xs bg-gradient-to-b from-[#150B12] to-[#251320] border-3 border-[#C33355] rounded-3xl p-5 shadow-inner">
            <div className="grid grid-cols-3 gap-3">
              {[reel1, reel2, reel3].map((symbol, idx) => (
                <div
                  key={idx}
                  className={`h-24 bg-white/10 border-2 border-white/20 rounded-2xl flex items-center justify-center text-4xl shadow-md transition-all ${
                    isSpinning ? "animate-pulse scale-95" : ""
                  }`}
                >
                  {symbol}
                </div>
              ))}
            </div>
          </div>

          {/* Win Announcement */}
          {lastWin && (
            <div className="text-center animate-bounce">
              <span className="text-sm font-black text-[#FFE58B] uppercase tracking-wider bg-[#C33355] px-4 py-1.5 rounded-full shadow-lg">
                🎉 Won +{lastWin.toLocaleString()} FreePlay Points!
              </span>
            </div>
          )}

          {/* Bet Size Buttons */}
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-300 font-mono">
              <span>Bet Size (Free Points):</span>
              <span className="text-[#FFE58B] font-bold">
                Balance: {(user?.coins ?? 15000).toLocaleString()} PTS
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 250, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    sound.playChipClick();
                    setBetAmount(amt);
                  }}
                  className={`py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                    betAmount === amt
                      ? "bg-[#FFE58B] text-[#40243B] shadow-md font-black"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          {/* SPIN ACTION BUTTON */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C33355] via-[#D83A61] to-[#C33355] hover:brightness-110 text-white font-black text-sm uppercase tracking-widest shadow-xl transition active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{isSpinning ? "SPINNING..." : "SPIN REELS (FREE)"}</span>
          </button>
        </div>

        {/* Disclaimer Footer */}
        <div className="px-5 py-2.5 bg-[#170E14] border-t border-[#3D2536] text-center text-[10px] text-gray-400">
          ⚠️ Purely simulated entertainment demo. Virtual points have zero monetary value.
        </div>
      </div>
    </div>
  );
}
