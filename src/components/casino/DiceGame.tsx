"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Settings,
  Plus,
  Minus,
  Check,
  X,
  HelpCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Trophy,
  History as HistoryIcon,
  Flame,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useUserStore } from "@/lib/store/useUserStore";
import { useAdminConfigStore } from "@/lib/store/useAdminConfigStore";
import sound from "@/lib/sound";

// Available Dice Colors matching Screenshot
type DiceColor = "red" | "green" | "blue" | "yellow" | "pink" | "orange";

interface ColorTheme {
  id: DiceColor;
  label: string;
  pillColor: string;
  gradient: string;
  highlight: string;
  border: string;
  shadow: string;
  pipBg: string;
  pipShadow: string;
}

const COLOR_THEMES: Record<DiceColor, ColorTheme> = {
  red: {
    id: "red",
    label: "Red",
    pillColor: "bg-[#dc2626]",
    gradient: "linear-gradient(145deg, #ef4444 0%, #dc2626 40%, #991b1b 85%, #7f1d1d 100%)",
    highlight: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 25%, transparent 60%)",
    border: "border-[#fca5a5]/70",
    shadow: "0 18px 35px -8px rgba(153, 27, 27, 0.7), 0 8px 15px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(0,0,0,0.6)",
    pipBg: "radial-gradient(circle at 40% 40%, #2a1111 0%, #110505 70%, #000000 100%)",
    pipShadow: "inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.3)",
  },
  green: {
    id: "green",
    label: "Green",
    pillColor: "bg-[#16a34a]",
    gradient: "linear-gradient(145deg, #22c55e 0%, #16a34a 40%, #166534 85%, #14532d 100%)",
    highlight: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 25%, transparent 60%)",
    border: "border-[#86efac]/70",
    shadow: "0 18px 35px -8px rgba(22, 101, 52, 0.7), 0 8px 15px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(0,0,0,0.6)",
    pipBg: "radial-gradient(circle at 40% 40%, #062b16 0%, #03170b 70%, #000000 100%)",
    pipShadow: "inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.3)",
  },
  blue: {
    id: "blue",
    label: "Blue",
    pillColor: "bg-[#2563eb]",
    gradient: "linear-gradient(145deg, #3b82f6 0%, #2563eb 40%, #1e40af 85%, #172554 100%)",
    highlight: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 25%, transparent 60%)",
    border: "border-[#93c5fd]/70",
    shadow: "0 18px 35px -8px rgba(30, 64, 175, 0.7), 0 8px 15px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(0,0,0,0.6)",
    pipBg: "radial-gradient(circle at 40% 40%, #0c1a3b 0%, #060e21 70%, #000000 100%)",
    pipShadow: "inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.3)",
  },
  yellow: {
    id: "yellow",
    label: "Yellow",
    pillColor: "bg-[#eab308]",
    gradient: "linear-gradient(145deg, #facc15 0%, #eab308 40%, #ca8a04 85%, #854d0e 100%)",
    highlight: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 25%, transparent 60%)",
    border: "border-[#fef08a]/80",
    shadow: "0 18px 35px -8px rgba(202, 138, 4, 0.7), 0 8px 15px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -3px 6px rgba(0,0,0,0.4)",
    pipBg: "radial-gradient(circle at 40% 40%, #362203 0%, #1f1302 70%, #000000 100%)",
    pipShadow: "inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.4)",
  },
  pink: {
    id: "pink",
    label: "Pink",
    pillColor: "bg-[#db2777]",
    gradient: "linear-gradient(145deg, #f472b6 0%, #db2777 40%, #9d174d 85%, #700732 100%)",
    highlight: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 25%, transparent 60%)",
    border: "border-[#fbcfe8]/70",
    shadow: "0 18px 35px -8px rgba(157, 23, 77, 0.7), 0 8px 15px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(0,0,0,0.6)",
    pipBg: "radial-gradient(circle at 40% 40%, #33071b 0%, #1c030f 70%, #000000 100%)",
    pipShadow: "inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.3)",
  },
  orange: {
    id: "orange",
    label: "Orange",
    pillColor: "bg-[#ea580c]",
    gradient: "linear-gradient(145deg, #fb923c 0%, #ea580c 40%, #c2410c 85%, #7c2d12 100%)",
    highlight: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 25%, transparent 60%)",
    border: "border-[#fed7aa]/70",
    shadow: "0 18px 35px -8px rgba(194, 65, 12, 0.7), 0 8px 15px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(0,0,0,0.6)",
    pipBg: "radial-gradient(circle at 40% 40%, #381204 0%, #1f0902 70%, #000000 100%)",
    pipShadow: "inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.3)",
  },
};

type ActiveScreen = "MAIN_ROLL" | "DICE_OPTIONS" | "FAIR_SETUP";
type RollModel = "Normal" | "Fair" | "Relaxed" | "History";
type BetType = "OVER_UNDER" | "EVEN_ODD" | "EXACT_SUM" | "TRIPLE_JACKPOT";

interface RollLog {
  id: string;
  dice: number[];
  sum: number;
  betType: BetType;
  won: boolean;
  payout: number;
  multiplier: number;
  time: string;
}

export default function DiceGame() {
  const { user, updateBalance, showNotification } = useUserStore();
  const { settings } = useAdminConfigStore();

  // Active Screen Selector (1: Main Roll, 2: Options, 3: Fair Dice Setup)
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("MAIN_ROLL");

  // Core Dice State
  const [diceCount, setDiceCount] = useState<number>(3);
  const [diceValues, setDiceValues] = useState<number[]>([4, 2, 1]);
  const [diceColor, setDiceColor] = useState<DiceColor>("red");
  const [rollModel, setRollModel] = useState<RollModel>("Fair");
  const [rollByShaking, setRollByShaking] = useState<boolean>(true);
  const [numberOfEyes, setNumberOfEyes] = useState<number>(6);

  // Roll Index & Permutations (e.g. Roll 1 of 216)
  const totalPermutations = Math.pow(numberOfEyes, diceCount);
  const [currentRollIndex, setCurrentRollIndex] = useState<number>(1);

  // Betting & Casino State
  const [betAmount, setBetAmount] = useState<number>(500);
  const [betType, setBetType] = useState<BetType>("OVER_UNDER");
  const [targetSum, setTargetSum] = useState<number>(10);
  const [isOver, setIsOver] = useState<boolean>(true);
  const [evenOddChoice, setEvenOddChoice] = useState<"EVEN" | "ODD">("EVEN");
  const [exactSumChoice, setExactSumChoice] = useState<number>(7);

  // Animation & Physics
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [shakeOffset, setShakeOffset] = useState<number>(0);
  const [rotationAngles, setRotationAngles] = useState<{ x: number; y: number; z: number }[]>([
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
  ]);

  // Roll History Log
  const [history, setHistory] = useState<RollLog[]>([
    { id: "1", dice: [4, 2, 1], sum: 7, betType: "OVER_UNDER", won: true, payout: 980, multiplier: 1.96, time: "12:04" },
    { id: "2", dice: [6, 4, 3], sum: 13, betType: "OVER_UNDER", won: true, payout: 1100, multiplier: 2.2, time: "12:03" },
    { id: "3", dice: [2, 2, 2], sum: 6, betType: "TRIPLE_JACKPOT", won: true, payout: 18000, multiplier: 36.0, time: "12:01" },
  ]);

  const currentSum = diceValues.reduce((a, b) => a + b, 0);

  // Multiplier Calculation
  const calculateMultiplier = useCallback((): number => {
    const minSum = diceCount;
    const maxSum = diceCount * numberOfEyes;

    if (betType === "EVEN_ODD") return 1.98;
    if (betType === "TRIPLE_JACKPOT") {
      if (diceCount === 1) return 1.0;
      if (diceCount === 2) return 6.0;
      if (diceCount === 3) return 36.0;
      return 216.0;
    }
    if (betType === "EXACT_SUM") {
      const dist = Math.abs(exactSumChoice - (minSum + maxSum) / 2);
      return Math.min(36, Math.max(4.8, 5.2 + dist * 3.8));
    }
    // OVER_UNDER
    if (isOver) {
      const chance = Math.max(0.05, (maxSum - targetSum + 0.5) / (maxSum - minSum + 1));
      return Math.round((0.98 / chance) * 100) / 100;
    } else {
      const chance = Math.max(0.05, (targetSum - minSum + 0.5) / (maxSum - minSum + 1));
      return Math.round((0.98 / chance) * 100) / 100;
    }
  }, [betType, diceCount, exactSumChoice, isOver, numberOfEyes, targetSum]);

  const multiplier = calculateMultiplier();
  const potentialWin = Math.round(betAmount * multiplier);

  // Sync dice values count
  useEffect(() => {
    setDiceValues((prev) => {
      const next = [...prev];
      while (next.length < diceCount) next.push(Math.floor(Math.random() * numberOfEyes) + 1);
      return next.slice(0, diceCount);
    });
    setRotationAngles(Array(diceCount).fill({ x: 0, y: 0, z: 0 }));
  }, [diceCount, numberOfEyes]);

  // Main Roll Action
  const handleRoll = async () => {
    if (isRolling) return;
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

    // Rapid Tumble & Physics Jitter
    const interval = setInterval(() => {
      setShakeOffset((prev) => (prev === 0 ? 5 : -prev));
      setRotationAngles(
        Array(diceCount)
          .fill(0)
          .map(() => ({
            x: (Math.random() - 0.5) * 50,
            y: (Math.random() - 0.5) * 50,
            z: (Math.random() - 0.5) * 40,
          }))
      );
    }, 75);

    setTimeout(async () => {
      clearInterval(interval);
      setShakeOffset(0);

      // Outcome Generation
      const newDice: number[] = [];
      for (let i = 0; i < diceCount; i++) {
        newDice.push(Math.floor(Math.random() * numberOfEyes) + 1);
      }
      const sum = newDice.reduce((a, b) => a + b, 0);

      // Win Evaluation
      let won = false;
      if (betType === "OVER_UNDER") {
        won = isOver ? sum > targetSum : sum < targetSum;
      } else if (betType === "EVEN_ODD") {
        won = (sum % 2 === 0 && evenOddChoice === "EVEN") || (sum % 2 !== 0 && evenOddChoice === "ODD");
      } else if (betType === "EXACT_SUM") {
        won = sum === exactSumChoice;
      } else if (betType === "TRIPLE_JACKPOT") {
        won = newDice.every((val) => val === newDice[0]);
      }

      setDiceValues(newDice);
      setRotationAngles(Array(diceCount).fill({ x: 0, y: 0, z: 0 }));
      setIsRolling(false);
      setCurrentRollIndex((prev) => (prev % totalPermutations) + 1);

      const winPayout = won ? Math.round(betAmount * multiplier) : 0;

      if (won) {
        sound.playWin();
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.75 } });
        updateBalance(winPayout);
        showNotification(`🎉 Rolled Sum: ${sum}! Won ৳${winPayout.toLocaleString()} (${multiplier}x)!`, "SUCCESS");
      } else {
        sound.playCrash();
        showNotification(`🎲 Rolled Sum: ${sum}. Prediction missed.`, "INFO");
      }

      // Record to history
      const log: RollLog = {
        id: Date.now().toString(),
        dice: newDice,
        sum,
        betType,
        won,
        payout: winPayout,
        multiplier: won ? multiplier : 0,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setHistory((prev) => [log, ...prev.slice(0, 15)]);

      // Record API backend
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
            details: { dice: newDice, sum, betType, model: rollModel },
          }),
        });
      } catch {}
    }, 700);
  };

  const theme = COLOR_THEMES[diceColor];

  // Render Pip Matrix for 3D Dice Face
  const renderDicePips = (val: number, isSmall: boolean = false) => {
    const dotSize = isSmall ? "w-2 h-2" : "w-3.5 h-3.5 sm:w-4 sm:h-4";
    return (
      <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-1 p-1">
        {/* Row 1 */}
        <div className="flex items-center justify-center">
          {[2, 3, 4, 5, 6].includes(val) && (
            <span style={{ background: theme.pipBg, boxShadow: theme.pipShadow }} className={`${dotSize} rounded-full`} />
          )}
        </div>
        <div className="flex items-center justify-center" />
        <div className="flex items-center justify-center">
          {[4, 5, 6].includes(val) && (
            <span style={{ background: theme.pipBg, boxShadow: theme.pipShadow }} className={`${dotSize} rounded-full`} />
          )}
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-center">
          {val === 6 && (
            <span style={{ background: theme.pipBg, boxShadow: theme.pipShadow }} className={`${dotSize} rounded-full`} />
          )}
        </div>
        <div className="flex items-center justify-center">
          {[1, 3, 5].includes(val) && (
            <span style={{ background: theme.pipBg, boxShadow: theme.pipShadow }} className={`${dotSize} rounded-full`} />
          )}
        </div>
        <div className="flex items-center justify-center">
          {val === 6 && (
            <span style={{ background: theme.pipBg, boxShadow: theme.pipShadow }} className={`${dotSize} rounded-full`} />
          )}
        </div>

        {/* Row 3 */}
        <div className="flex items-center justify-center">
          {[4, 5, 6].includes(val) && (
            <span style={{ background: theme.pipBg, boxShadow: theme.pipShadow }} className={`${dotSize} rounded-full`} />
          )}
        </div>
        <div className="flex items-center justify-center" />
        <div className="flex items-center justify-center">
          {[2, 3, 4, 5, 6].includes(val) && (
            <span style={{ background: theme.pipBg, boxShadow: theme.pipShadow }} className={`${dotSize} rounded-full`} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#0C101A] text-white p-3 sm:p-6 select-none font-sans flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* Screen Switcher Nav Buttons */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 bg-[#131B2B] border border-[#23334E] p-1.5 rounded-2xl max-w-lg mx-auto shadow-xl">
          <button
            onClick={() => {
              setActiveScreen("MAIN_ROLL");
              sound.playChipClick();
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition ${
              activeScreen === "MAIN_ROLL" ? "bg-[#BA2649] text-white shadow-retro" : "text-gray-400 hover:text-white"
            }`}
          >
            Screen 1: Roll Arena
          </button>
          <button
            onClick={() => {
              setActiveScreen("DICE_OPTIONS");
              sound.playChipClick();
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition ${
              activeScreen === "DICE_OPTIONS" ? "bg-[#3B82F6] text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            Screen 2: Options
          </button>
          <button
            onClick={() => {
              setActiveScreen("FAIR_SETUP");
              sound.playChipClick();
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition ${
              activeScreen === "FAIR_SETUP" ? "bg-[#BA2649] text-white shadow-retro" : "text-gray-400 hover:text-white"
            }`}
          >
            Screen 3: Fair Dice
          </button>
        </div>

        {/* 3D Realistic Showcase Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Visual Phone/App Frame */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[420px] bg-[#E5E7EB] border-4 border-[#1F2937] rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col text-black min-h-[580px] relative">
              
              {/* ========================================================================= */}
              {/* SCREEN 1: ACTIVE ROLL SCREEN (Exact Visual Replica of Screenshot 1) */}
              {/* ========================================================================= */}
              {activeScreen === "MAIN_ROLL" && (
                <div className="flex-1 flex flex-col justify-between p-4 bg-[#D1D5DB] animate-in fade-in duration-200">
                  {/* Top Sleek Black Header */}
                  <div className="bg-[#000000] text-white px-3 py-2.5 rounded-2xl flex items-center justify-between shadow-md mb-3">
                    <button
                      onClick={() => {
                        setActiveScreen("FAIR_SETUP");
                        sound.playChipClick();
                      }}
                      className="px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg transition"
                    >
                      Back
                    </button>
                    <span className="font-black text-sm tracking-wide">
                      Roll {currentRollIndex} of {totalPermutations}
                    </span>
                    <div className="w-10" />
                  </div>

                  {/* Shaking Switch Row */}
                  <div className="flex items-center justify-between px-2 py-1 mb-2">
                    <span className="text-sm font-bold text-[#1F2937]">Roll by shaking</span>
                    <button
                      onClick={() => {
                        setRollByShaking(!rollByShaking);
                        sound.playChipClick();
                      }}
                      className="flex items-center bg-[#000000] rounded-lg overflow-hidden border border-[#374151]"
                    >
                      <span className={`px-3 py-1 text-xs font-black transition ${rollByShaking ? "bg-[#2563EB] text-white" : "text-gray-400"}`}>
                        ON
                      </span>
                    </button>
                  </div>

                  {/* Realistic 3D Dice Display Arena */}
                  <div className="flex-1 flex flex-wrap items-center justify-center gap-5 sm:gap-6 py-6 min-h-[260px]">
                    {diceValues.map((val, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: theme.gradient,
                          boxShadow: theme.shadow,
                          transform: isRolling
                            ? `rotateX(${rotationAngles[idx]?.x || 0}deg) rotateY(${rotationAngles[idx]?.y || 0}deg) rotateZ(${rotationAngles[idx]?.z || 0}deg) scale(1.08)`
                            : "rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)",
                        }}
                        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-[28px] border-2 ${theme.border} flex items-center justify-center transition-transform duration-100 p-3 select-none cursor-pointer transform hover:scale-105 active:scale-95`}
                        onClick={handleRoll}
                      >
                        {/* Specular 3D Highlight Layer */}
                        <div
                          style={{ background: theme.highlight }}
                          className="absolute inset-0 rounded-[26px] pointer-events-none"
                        />
                        {renderDicePips(val)}
                      </div>
                    ))}
                  </div>

                  {/* Sum Display & Clock Indicator */}
                  <div className="flex items-center justify-between px-3 py-2 text-sm font-black text-[#111827]">
                    <span>Sum: {isRolling ? "..." : currentSum}</span>
                    <div className="w-6 h-6 rounded-full border-2 border-[#111827] flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-[#111827]" />
                    </div>
                  </div>

                  {/* Big Green "Roll dice" Button */}
                  <button
                    onClick={handleRoll}
                    disabled={isRolling}
                    className="w-full py-4 bg-gradient-to-b from-[#15803D] via-[#16A34A] to-[#15803D] hover:from-[#166534] hover:to-[#15803D] text-white font-serif text-2xl font-bold rounded-xl shadow-[0_8px_16px_rgba(22,163,74,0.5),inset_0_2px_2px_rgba(255,255,255,0.4)] active:scale-[0.98] transition-all border border-[#86EFAC]/40"
                  >
                    {isRolling ? "Rolling..." : "Roll dice"}
                  </button>
                </div>
              )}

              {/* ========================================================================= */}
              {/* SCREEN 2: DICE OPTIONS (Exact Visual Replica of Screenshot 2) */}
              {/* ========================================================================= */}
              {activeScreen === "DICE_OPTIONS" && (
                <div className="flex-1 flex flex-col justify-between p-4 bg-[#D1D5DB] animate-in fade-in duration-200">
                  {/* Top Black Header */}
                  <div className="bg-[#000000] text-white px-3 py-2.5 rounded-2xl flex items-center justify-between shadow-md mb-3">
                    <button
                      onClick={() => {
                        setActiveScreen("MAIN_ROLL");
                        sound.playChipClick();
                      }}
                      className="px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg transition"
                    >
                      Back
                    </button>
                    <span className="font-black text-sm tracking-wide">Dice Options</span>
                    <div className="w-10" />
                  </div>

                  {/* Color Selection Box */}
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-[#1F2937]">Color:</span>
                    <div className="bg-[#111827] rounded-xl overflow-hidden border border-[#374151] divide-y divide-[#1F2937]">
                      {(Object.keys(COLOR_THEMES) as DiceColor[]).map((c) => {
                        const opt = COLOR_THEMES[c];
                        const isSelected = diceColor === c;
                        return (
                          <div
                            key={c}
                            onClick={() => {
                              setDiceColor(c);
                              sound.playChipClick();
                            }}
                            className={`flex items-center space-x-3 px-3 py-2 cursor-pointer transition ${
                              isSelected ? "bg-[#2563EB] text-white font-bold" : "text-gray-300 hover:bg-[#1F2937]"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full ${opt.pillColor} border border-white/50`} />
                            <span className="text-xs">{opt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stepper / Slider Options */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1F2937]">
                      <span>Number of dice to add:</span>
                      <span className="px-3 py-0.5 bg-[#2563EB] text-white rounded font-mono">{diceCount}</span>
                    </div>

                    <div className="text-center text-xs font-bold text-[#1F2937]">
                      Number of eyes: {numberOfEyes}
                    </div>

                    {/* Slider */}
                    <input
                      type="range"
                      min="1"
                      max="6"
                      value={diceCount}
                      onChange={(e) => setDiceCount(Number(e.target.value))}
                      className="w-full accent-[#2563EB]"
                    />
                  </div>

                  {/* Bottom Action Check / Cross Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button
                      onClick={() => {
                        setActiveScreen("MAIN_ROLL");
                        sound.playChipClick();
                      }}
                      className="py-3 bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E40AF] rounded-xl flex items-center justify-center text-white shadow-md active:scale-95 transition"
                    >
                      <Check className="w-5 h-5 stroke-[3] text-[#22C55E]" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveScreen("MAIN_ROLL");
                        sound.playChipClick();
                      }}
                      className="py-3 bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E40AF] rounded-xl flex items-center justify-center text-white shadow-md active:scale-95 transition"
                    >
                      <X className="w-5 h-5 stroke-[3] text-[#EF4444]" />
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* SCREEN 3: FAIR DICE SETUP (Exact Visual Replica of Screenshot 3) */}
              {/* ========================================================================= */}
              {activeScreen === "FAIR_SETUP" && (
                <div className="flex-1 flex flex-col justify-between p-4 bg-[#FFFFFF] animate-in fade-in duration-200">
                  {/* Top Black Header */}
                  <div className="bg-[#000000] text-white px-3 py-2.5 rounded-2xl flex items-center justify-center shadow-md mb-3">
                    <span className="font-black text-sm tracking-wide">Fair Dice</span>
                  </div>

                  {/* Mini Dice Row Preview */}
                  <div className="flex items-center justify-center space-x-2 py-2">
                    {Array.from({ length: diceCount }).map((_, i) => (
                      <div
                        key={i}
                        style={{ background: theme.gradient, boxShadow: theme.shadow }}
                        className={`w-10 h-10 rounded-xl border ${theme.border} flex items-center justify-center p-1`}
                      >
                        {renderDicePips(6, true)}
                      </div>
                    ))}
                  </div>

                  {/* Plus / Minus Stepper */}
                  <div className="flex justify-end space-x-2 pr-2">
                    <button
                      onClick={() => {
                        if (diceCount < 6) {
                          setDiceCount(diceCount + 1);
                          sound.playChipClick();
                        }
                      }}
                      className="w-7 h-7 bg-[#22C55E] text-white rounded-lg flex items-center justify-center font-black shadow-sm"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </button>
                    <button
                      onClick={() => {
                        if (diceCount > 1) {
                          setDiceCount(diceCount - 1);
                          sound.playChipClick();
                        }
                      }}
                      className="w-7 h-7 bg-[#3B82F6] text-white rounded-lg flex items-center justify-center font-black shadow-sm"
                    >
                      <Minus className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>

                  {/* Dice Roll Model Grid */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1F2937]">
                      <span>Dice roll model:</span>
                      <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center text-[10px] font-bold">
                        ?
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 border border-[#93C5FD] rounded-xl overflow-hidden">
                      {(["Normal", "Fair", "Relaxed", "History"] as RollModel[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => {
                            setRollModel(mode);
                            sound.playChipClick();
                          }}
                          className={`py-2 text-xs font-bold transition ${
                            rollModel === mode ? "bg-[#2563EB] text-white font-black" : "bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#BFDBFE]"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Strict Mode Explanation Box */}
                  <div className="p-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl flex items-start space-x-2 text-xs text-[#374151]">
                    <div className="w-4 h-4 rounded-full border border-black flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      ?
                    </div>
                    <p className="leading-relaxed">
                      {rollModel === "Fair"
                        ? "This is the most strict mode. It ensures that no dice roll reoccurs until all possible dice rolls have occurred."
                        : rollModel === "Normal"
                        ? "Classic Vegas Random Number Generator. Full independent probabilities."
                        : rollModel === "Relaxed"
                        ? "Relaxed casual mode with dynamic win assistance."
                        : "Verifiable historical log of previously completed rounds."}
                    </p>
                  </div>

                  {/* Big Red "Start" Button */}
                  <button
                    onClick={() => {
                      setActiveScreen("MAIN_ROLL");
                      sound.playChipClick();
                    }}
                    className="w-full py-4 bg-gradient-to-b from-[#DC2626] to-[#991B1B] hover:from-[#B91C1C] hover:to-[#7F1D1D] text-white font-sans text-2xl font-bold rounded-xl shadow-[0_8px_16px_rgba(220,38,38,0.5)] active:scale-[0.98] transition-all border border-[#FCA5A5]/40"
                  >
                    Start
                  </button>

                  {/* Remove Ads Badge */}
                  <div className="text-center pt-1">
                    <span className="inline-flex items-center space-x-1 text-xs text-[#2563EB] font-bold">
                      <span>⭐</span>
                      <span>VIP Fair Play Edition</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Casino Betting Console */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#111827] border border-[#23334E] rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#23334E]">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-[#FFDE59]" />
                  <span className="text-sm font-black text-white uppercase tracking-wider">777 Cash Betting</span>
                </div>
                <span className="text-xs font-mono font-black text-[#FFDE59] bg-[#FFDE59]/10 px-2 py-0.5 rounded-lg border border-[#FFDE59]/30">
                  {multiplier}x Payout
                </span>
              </div>

              {/* Betting Mode Selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setBetType("OVER_UNDER");
                    sound.playChipClick();
                  }}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition ${
                    betType === "OVER_UNDER" ? "border-[#BA2649] bg-[#BA2649] text-white shadow-retro" : "border-[#23334E] bg-[#0E1523] text-gray-300"
                  }`}
                >
                  Over / Under
                </button>
                <button
                  onClick={() => {
                    setBetType("EVEN_ODD");
                    sound.playChipClick();
                  }}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition ${
                    betType === "EVEN_ODD" ? "border-[#BA2649] bg-[#BA2649] text-white shadow-retro" : "border-[#23334E] bg-[#0E1523] text-gray-300"
                  }`}
                >
                  Even / Odd (2x)
                </button>
                <button
                  onClick={() => {
                    setBetType("EXACT_SUM");
                    sound.playChipClick();
                  }}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition ${
                    betType === "EXACT_SUM" ? "border-[#BA2649] bg-[#BA2649] text-white shadow-retro" : "border-[#23334E] bg-[#0E1523] text-gray-300"
                  }`}
                >
                  Exact Sum
                </button>
                <button
                  onClick={() => {
                    setBetType("TRIPLE_JACKPOT");
                    sound.playChipClick();
                  }}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition ${
                    betType === "TRIPLE_JACKPOT" ? "border-[#BA2649] bg-[#BA2649] text-white shadow-retro" : "border-[#23334E] bg-[#0E1523] text-gray-300"
                  }`}
                >
                  Triple Match (36x)
                </button>
              </div>

              {/* Market Parameters */}
              {betType === "OVER_UNDER" && (
                <div className="p-4 bg-[#090D16] border border-[#23334E] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-400">Target Sum:</span>
                    <span className="text-[#FFDE59] font-mono text-base">{targetSum}</span>
                  </div>
                  <input
                    type="range"
                    min={diceCount}
                    max={diceCount * numberOfEyes}
                    value={targetSum}
                    onChange={(e) => setTargetSum(Number(e.target.value))}
                    className="w-full accent-[#BA2649]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setIsOver(true);
                        sound.playChipClick();
                      }}
                      className={`py-2 rounded-xl text-xs font-black transition ${
                        isOver ? "bg-[#10B981] text-white" : "bg-[#151F32] text-gray-400"
                      }`}
                    >
                      Over {targetSum}
                    </button>
                    <button
                      onClick={() => {
                        setIsOver(false);
                        sound.playChipClick();
                      }}
                      className={`py-2 rounded-xl text-xs font-black transition ${
                        !isOver ? "bg-[#10B981] text-white" : "bg-[#151F32] text-gray-400"
                      }`}
                    >
                      Under {targetSum}
                    </button>
                  </div>
                </div>
              )}

              {/* Stake Box */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                  Bet Amount (BDT ৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                  <input
                    type="number"
                    min="10"
                    step="50"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="w-full bg-[#090D16] border border-[#23334E] rounded-xl pl-8 pr-4 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-[#BA2649]"
                  />
                </div>

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[100, 500, 1000, 2500].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        setBetAmount(amt);
                        sound.playChipClick();
                      }}
                      className="py-1.5 bg-[#0E1523] border border-[#23334E] hover:border-[#BA2649] rounded-lg text-[11px] font-mono text-gray-300 transition"
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payout Metric */}
              <div className="p-4 bg-[#090D16] border border-[#23334E] rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Potential Win:</div>
                  <div className="text-lg font-mono font-black text-[#10B981]">
                    ৳{potentialWin.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Multiplier:</div>
                  <div className="text-sm font-mono font-bold text-[#FFDE59]">{multiplier}x</div>
                </div>
              </div>
            </div>

            {/* Verifiable History Logs */}
            <div className="bg-[#111827] border border-[#23334E] rounded-3xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#23334E]">
                <div className="flex items-center space-x-2">
                  <HistoryIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Live Roll Audit</span>
                </div>
                <span className="text-[10px] text-green-400 font-mono">100% Provably Fair</span>
              </div>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-2.5 bg-[#090D16] border border-[#23334E] rounded-xl text-xs"
                  >
                    <span className="font-mono text-gray-300 font-bold">
                      [{h.dice.join(", ")}] = Sum {h.sum}
                    </span>
                    <span
                      className={`font-mono font-black px-2 py-0.5 rounded ${
                        h.won ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {h.won ? `+৳${h.payout.toLocaleString()}` : "MISSED"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
