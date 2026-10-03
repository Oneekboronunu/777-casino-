"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Flame,
  Zap,
  RotateCcw,
  Volume2,
  VolumeX,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useUserStore } from "@/lib/store/useUserStore";
import { useAdminConfigStore } from "@/lib/store/useAdminConfigStore";
import sound from "@/lib/sound";

interface LivePlayerBet {
  username: string;
  amount: number;
  cashedOutMultiplier?: number;
  winAmount?: number;
}

const MOCK_NAMES = [
  "Rafi_Dhaka",
  "Tanvir99",
  "Saimon_VIP",
  "Shakib_Pro",
  "Karim_King",
  "AuraMaster",
  "LuckyStriker",
  "Tiger_CTG",
  "Mahmudul_H",
  "Farhan_77",
];

export default function AviatorGame() {
  const { user, updateBalance, showNotification } = useUserStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game Lifecycle State
  const [gameState, setGameState] = useState<"WAITING" | "FLYING" | "CRASHED">("WAITING");
  const [countdown, setCountdown] = useState<number>(5);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [crashPoint, setCrashPoint] = useState<number>(2.5);
  const [history, setHistory] = useState<number[]>([1.84, 3.42, 1.21, 15.8, 1.05, 4.22, 2.15, 8.9]);

  // Dual Bet Slips
  // Bet 1
  const [bet1Amount, setBet1Amount] = useState<number>(500);
  const [bet1Active, setBet1Active] = useState<boolean>(false);
  const [bet1CashedOut, setBet1CashedOut] = useState<boolean>(false);
  const [bet1AutoCashout, setBet1AutoCashout] = useState<string>("2.00");
  const [bet1AutoEnabled, setBet1AutoEnabled] = useState<boolean>(false);

  // Bet 2
  const [bet2Amount, setBet2Amount] = useState<number>(200);
  const [bet2Active, setBet2Active] = useState<boolean>(false);
  const [bet2CashedOut, setBet2CashedOut] = useState<boolean>(false);
  const [bet2AutoCashout, setBet2AutoCashout] = useState<string>("5.00");
  const [bet2AutoEnabled, setBet2AutoEnabled] = useState<boolean>(false);

  // Live Multiplayer Feed
  const [liveBets, setLiveBets] = useState<LivePlayerBet[]>([]);

  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const { settings } = useAdminConfigStore();

  // Generate randomized crash point (Controlled dynamically by Admin Panel)
  const generateCrashPoint = () => {
    // 1. Force Next Crash Multiplier if set in Admin
    if (settings.aviatorMode === "FORCE_NEXT_CRASH") {
      return Math.max(1.01, settings.aviatorForceNextMultiplier || 1.15);
    }

    // 2. Mega Win Event
    if (settings.aviatorMode === "MEGA_WIN_EVENT") {
      return 25.0 + Math.random() * 75.0;
    }

    // 3. House Profit Mode (Customized instant crash %)
    const instantCrashChance = (settings.aviatorHouseCrashUnder120Chance || 25) / 100;
    const rand = Math.random();

    if (rand < instantCrashChance) {
      return 1.0 + Math.random() * 0.18; // Instant crash between 1.00x - 1.18x
    }

    if (rand < 0.60) {
      return 1.18 + Math.random() * 1.6; // 1.18x - 2.78x
    }

    if (rand < 0.85) {
      return 2.78 + Math.random() * 3.5; // 2.78x - 6.28x
    }

    if (rand < 0.96) {
      return 6.28 + Math.random() * 10.0; // 6.28x - 16.28x
    }

    const maxCap = settings.aviatorMaxMultiplierCap || 250;
    const highFlight = 16.28 + Math.random() * 40.0;
    return Math.min(maxCap, highFlight);
  };

  // Generate simulated other players' bets
  const generateLiveBets = () => {
    const count = 6 + Math.floor(Math.random() * 6);
    const bets: LivePlayerBet[] = [];
    for (let i = 0; i < count; i++) {
      bets.push({
        username: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
        amount: [100, 250, 500, 1000, 2500, 5000][Math.floor(Math.random() * 6)],
      });
    }
    return bets;
  };

  // Save game round to backend
  const recordGameRound = async (betAmt: number, mult: number, payoutAmt: number, isWin: boolean) => {
    try {
      await fetch("/api/casino/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: "AVIATOR",
          betAmount: betAmt,
          multiplier: mult,
          payout: payoutAmt,
          isWin,
          details: { crashPoint, cashedOutAt: mult },
        }),
      });
    } catch {
      // ignore
    }
  };

  // Start a new flight cycle
  useEffect(() => {
    let timer: any;
    if (gameState === "WAITING") {
      setMultiplier(1.0);
      setLiveBets(generateLiveBets());
      setCountdown(5);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Launch flight!
            const newCrash = generateCrashPoint();
            setCrashPoint(newCrash);
            setGameState("FLYING");
            startTimeRef.current = performance.now();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Main Canvas Rendering & Physics Loop during FLYING
  useEffect(() => {
    if (gameState !== "FLYING") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;

    const render = (now: number) => {
      if (!isRunning) return;
      const elapsed = (now - startTimeRef.current) / 1000; // seconds

      // Multiplier formula: starts slow, accelerates exponential
      const currentMult = 1.0 + 0.08 * Math.pow(elapsed, 1.85);
      const rounded = Math.round(currentMult * 100) / 100;
      setMultiplier(rounded);

      // Auto Cashout checks
      if (bet1Active && !bet1CashedOut && bet1AutoEnabled) {
        const target = parseFloat(bet1AutoCashout);
        if (rounded >= target) {
          handleCashout(1, rounded);
        }
      }

      if (bet2Active && !bet2CashedOut && bet2AutoEnabled) {
        const target = parseFloat(bet2AutoCashout);
        if (rounded >= target) {
          handleCashout(2, rounded);
        }
      }

      // Simulate random multiplayer cashouts
      setLiveBets((prev) =>
        prev.map((b) => {
          if (!b.cashedOutMultiplier && rounded > 1.2 && Math.random() < 0.03) {
            return {
              ...b,
              cashedOutMultiplier: rounded,
              winAmount: Math.round(b.amount * rounded),
            };
          }
          return b;
        })
      );

      // Check if crash point reached
      if (rounded >= crashPoint) {
        sound.playCrash();
        setGameState("CRASHED");
        setHistory((prev) => [rounded, ...prev.slice(0, 14)]);

        // Check uncashed active bets (loss)
        if (bet1Active && !bet1CashedOut) {
          recordGameRound(bet1Amount, 0, 0, false);
        }
        if (bet2Active && !bet2CashedOut) {
          recordGameRound(bet2Amount, 0, 0, false);
        }

        // Delay 3s before starting next round
        setTimeout(() => {
          setBet1Active(false);
          setBet1CashedOut(false);
          setBet2Active(false);
          setBet2CashedOut(false);
          setGameState("WAITING");
        }, 3200);

        return;
      }

      // Draw Flight Canvas
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw Coordinate Grid
      ctx.strokeStyle = "rgba(35, 51, 78, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Compute Jet Position along bezier curve
      const progress = Math.min(elapsed / 12, 1);
      const startX = 40;
      const startY = height - 40;
      const targetX = width - 80;
      const targetY = 60;

      const currentX = startX + (targetX - startX) * Math.sin((progress * Math.PI) / 2);
      const currentY = startY - (startY - targetY) * Math.pow(progress, 1.4);

      // Draw Vapor Trail Curve
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(startX + (currentX - startX) * 0.5, startY, currentX, currentY);
      ctx.strokeStyle = "#EF4444";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#EF4444";
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Fill Area under curve
      ctx.lineTo(currentX, startY);
      ctx.lineTo(startX, startY);
      ctx.closePath();
      const gradient = ctx.createLinearGradient(0, currentY, 0, startY);
      gradient.addColorStop(0, "rgba(239, 68, 68, 0.25)");
      gradient.addColorStop(1, "rgba(239, 68, 68, 0.0)");
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw Red Jet Plane
      ctx.save();
      ctx.translate(currentX, currentY);
      const angle = -Math.atan2(startY - currentY, currentX - startX) * 0.35 - 0.2;
      ctx.rotate(angle);

      // Sleek Modern Jet Graphic
      ctx.fillStyle = "#EF4444";
      ctx.beginPath();
      ctx.moveTo(25, 0); // nose
      ctx.lineTo(-20, -12); // top wing
      ctx.lineTo(-12, 0); // body
      ctx.lineTo(-20, 12); // bottom wing
      ctx.closePath();
      ctx.fill();

      // Jet Cockpit Glow
      ctx.fillStyle = "#FDE047";
      ctx.beginPath();
      ctx.arc(4, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Jet Engine Fire Glow
      ctx.fillStyle = "#F97316";
      ctx.beginPath();
      ctx.arc(-18, 0, 4 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, crashPoint]);

  // Cash out action
  const handleCashout = (betIndex: 1 | 2, currentMult: number) => {
    if (betIndex === 1) {
      if (!bet1Active || bet1CashedOut) return;
      setBet1CashedOut(true);
      const winAmt = Math.round(bet1Amount * currentMult);
      sound.playWin();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      updateBalance(winAmt);
      showNotification(`Cashed out ৳${winAmt.toLocaleString()} at ${currentMult.toFixed(2)}x!`, "SUCCESS");
      recordGameRound(bet1Amount, currentMult, winAmt, true);
    } else {
      if (!bet2Active || bet2CashedOut) return;
      setBet2CashedOut(true);
      const winAmt = Math.round(bet2Amount * currentMult);
      sound.playWin();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      updateBalance(winAmt);
      showNotification(`Cashed out ৳${winAmt.toLocaleString()} at ${currentMult.toFixed(2)}x!`, "SUCCESS");
      recordGameRound(bet2Amount, currentMult, winAmt, true);
    }
  };

  // Place Bet action
  const handlePlaceBet = (betIndex: 1 | 2) => {
    const amt = betIndex === 1 ? bet1Amount : bet2Amount;
    if (!user || user.balance < amt) {
      showNotification("Insufficient balance. Please deposit.", "ERROR");
      return;
    }

    sound.playBetPlaced();
    updateBalance(-amt);

    if (betIndex === 1) {
      setBet1Active(true);
      setBet1CashedOut(false);
    } else {
      setBet2Active(true);
      setBet2CashedOut(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Crash History */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-[#23334E] p-4 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center">
            <Flame className="w-6 h-6 text-[#EF4444]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">AVIATOR CRASH</h1>
            <p className="text-xs text-gray-400">Provably Fair Real-Time Flight Multiplier</p>
          </div>
        </div>

        {/* Multiplier History Badges */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase mr-1 flex-shrink-0">History:</span>
          {history.map((h, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold flex-shrink-0 ${
                h >= 10
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-gold"
                  : h >= 2
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              }`}
            >
              {h.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>

      {/* Main Game Stage + Live Multiplayer Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Multiplayer Live Bets Panel */}
        <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-4 flex flex-col h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#23334E] text-xs font-bold text-gray-300">
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span>All Bets ({liveBets.length + (bet1Active ? 1 : 0) + (bet2Active ? 1 : 0)})</span>
            </div>
            <span className="text-[#10B981] font-mono">LIVE FEED</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 py-3 text-xs">
            {/* User Active Bet 1 */}
            {bet1Active && (
              <div className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#D4AF37]">You (Bet 1)</span>
                  <div className="text-[10px] text-gray-400">৳{bet1Amount.toLocaleString()}</div>
                </div>
                {bet1CashedOut ? (
                  <span className="text-[#10B981] font-mono font-bold">Cashed Out</span>
                ) : (
                  <span className="text-yellow-400 font-mono font-bold animate-pulse">In Flight</span>
                )}
              </div>
            )}

            {/* Simulated Live Bets */}
            {liveBets.map((b, idx) => (
              <div
                key={idx}
                className="p-2 bg-[#0B0F1A] border border-[#23334E] rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-white">{b.username}</div>
                  <div className="text-[10px] text-gray-400 font-mono">৳{b.amount.toLocaleString()}</div>
                </div>
                {b.cashedOutMultiplier ? (
                  <div className="text-right">
                    <div className="text-[#10B981] font-mono font-bold">
                      {b.cashedOutMultiplier.toFixed(2)}x
                    </div>
                    <div className="text-[10px] text-gray-300 font-mono">
                      +৳{b.winAmount?.toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500 text-[11px] font-mono">Flying...</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Flight Stage & Dual Bet Consoles */}
        <div className="lg:col-span-3 space-y-6">
          {/* Flight Display Canvas */}
          <div className="relative w-full h-[320px] bg-[#0B0F1A] border border-[#23334E] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            <canvas ref={canvasRef} width={800} height={320} className="w-full h-full block" />

            {/* Waiting Countdown Overlay */}
            {gameState === "WAITING" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0F1A]/85 backdrop-blur-sm space-y-3 z-10">
                <div className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
                  Next Flight Starting In
                </div>
                <div className="text-6xl font-black font-mono text-white tracking-wider animate-pulse">
                  00:0{countdown}
                </div>
                <div className="w-48 h-1.5 bg-[#23334E] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37] transition-all duration-1000"
                    style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] text-gray-400">Place your bets before takeoff!</div>
              </div>
            )}

            {/* Flying Multiplier Big Number */}
            {gameState === "FLYING" && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
                <div className="text-6xl sm:text-7xl font-black font-mono text-white tracking-tight drop-shadow-md">
                  {multiplier.toFixed(2)}
                  <span className="text-[#EF4444] text-4xl">x</span>
                </div>
              </div>
            )}

            {/* Crashed Notice */}
            {gameState === "CRASHED" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/40 backdrop-blur-sm space-y-2 z-10">
                <div className="text-xs uppercase font-extrabold tracking-widest text-red-400">
                  FLEW AWAY AT
                </div>
                <div className="text-6xl font-black font-mono text-red-400 tracking-tight">
                  {multiplier.toFixed(2)}x
                </div>
              </div>
            )}
          </div>

          {/* Dual Betting Consoles (Bet 1 & Bet 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bet Slip 1 */}
            <div className="p-4 bg-[#111827] border border-[#23334E] rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Bet Console 1</span>
                <label className="flex items-center space-x-1.5 cursor-pointer text-gray-400">
                  <input
                    type="checkbox"
                    checked={bet1AutoEnabled}
                    onChange={(e) => setBet1AutoEnabled(e.target.checked)}
                    className="accent-[#D4AF37] rounded"
                  />
                  <span>Auto Cashout</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Amount Input */}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Amount (৳)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">৳</span>
                    <input
                      type="number"
                      disabled={bet1Active}
                      value={bet1Amount}
                      onChange={(e) => setBet1Amount(Number(e.target.value))}
                      className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl pl-6 pr-2 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37] disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Auto Multiplier Input */}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Auto Cashout (x)</label>
                  <input
                    type="text"
                    disabled={!bet1AutoEnabled || bet1Active}
                    value={bet1AutoCashout}
                    onChange={(e) => setBet1AutoCashout(e.target.value)}
                    className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37] disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {[100, 500, 1000, 2500].map((val) => (
                  <button
                    key={val}
                    disabled={bet1Active}
                    onClick={() => {
                      setBet1Amount(val);
                      sound.playChipClick();
                    }}
                    className="py-1 text-[11px] font-bold bg-[#151F32] border border-[#23334E] text-gray-300 rounded hover:border-[#D4AF37] transition disabled:opacity-50"
                  >
                    +{val}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              {bet1Active ? (
                bet1CashedOut ? (
                  <div className="py-3.5 text-center bg-[#10B981]/20 text-[#10B981] font-bold text-xs rounded-xl border border-[#10B981]/40">
                    CASHED OUT ৳{Math.round(bet1Amount * multiplier).toLocaleString()}
                  </div>
                ) : gameState === "FLYING" ? (
                  <button
                    onClick={() => handleCashout(1, multiplier)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-extrabold text-sm rounded-xl transition shadow-emerald flex flex-col items-center justify-center animate-pulse"
                  >
                    <span>CASH OUT</span>
                    <span className="text-xs font-mono font-normal">
                      ৳{Math.round(bet1Amount * multiplier).toLocaleString()} ({multiplier.toFixed(2)}x)
                    </span>
                  </button>
                ) : (
                  <div className="py-3.5 text-center bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-xs rounded-xl border border-[#D4AF37]/40">
                    BET PLACED (WAITING TAKEOFF)
                  </div>
                )
              ) : (
                <button
                  onClick={() => handlePlaceBet(1)}
                  className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B0F1A] font-extrabold text-sm rounded-xl transition shadow-gold"
                >
                  BET ৳{bet1Amount.toLocaleString()}
                </button>
              )}
            </div>

            {/* Bet Slip 2 */}
            <div className="p-4 bg-[#111827] border border-[#23334E] rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Bet Console 2</span>
                <label className="flex items-center space-x-1.5 cursor-pointer text-gray-400">
                  <input
                    type="checkbox"
                    checked={bet2AutoEnabled}
                    onChange={(e) => setBet2AutoEnabled(e.target.checked)}
                    className="accent-[#D4AF37] rounded"
                  />
                  <span>Auto Cashout</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Amount Input */}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Amount (৳)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">৳</span>
                    <input
                      type="number"
                      disabled={bet2Active}
                      value={bet2Amount}
                      onChange={(e) => setBet2Amount(Number(e.target.value))}
                      className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl pl-6 pr-2 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37] disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Auto Multiplier Input */}
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Auto Cashout (x)</label>
                  <input
                    type="text"
                    disabled={!bet2AutoEnabled || bet2Active}
                    value={bet2AutoCashout}
                    onChange={(e) => setBet2AutoCashout(e.target.value)}
                    className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37] disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {[100, 200, 500, 1000].map((val) => (
                  <button
                    key={val}
                    disabled={bet2Active}
                    onClick={() => {
                      setBet2Amount(val);
                      sound.playChipClick();
                    }}
                    className="py-1 text-[11px] font-bold bg-[#151F32] border border-[#23334E] text-gray-300 rounded hover:border-[#D4AF37] transition disabled:opacity-50"
                  >
                    +{val}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              {bet2Active ? (
                bet2CashedOut ? (
                  <div className="py-3.5 text-center bg-[#10B981]/20 text-[#10B981] font-bold text-xs rounded-xl border border-[#10B981]/40">
                    CASHED OUT ৳{Math.round(bet2Amount * multiplier).toLocaleString()}
                  </div>
                ) : gameState === "FLYING" ? (
                  <button
                    onClick={() => handleCashout(2, multiplier)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-extrabold text-sm rounded-xl transition shadow-emerald flex flex-col items-center justify-center animate-pulse"
                  >
                    <span>CASH OUT</span>
                    <span className="text-xs font-mono font-normal">
                      ৳{Math.round(bet2Amount * multiplier).toLocaleString()} ({multiplier.toFixed(2)}x)
                    </span>
                  </button>
                ) : (
                  <div className="py-3.5 text-center bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-xs rounded-xl border border-[#D4AF37]/40">
                    BET PLACED (WAITING TAKEOFF)
                  </div>
                )
              ) : (
                <button
                  onClick={() => handlePlaceBet(2)}
                  className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B0F1A] font-extrabold text-sm rounded-xl transition shadow-gold"
                >
                  BET ৳{bet2Amount.toLocaleString()}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
