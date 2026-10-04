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
  Clock,
  Minus,
  Plus,
  History,
  CheckCircle2,
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

const INITIAL_HISTORY = [
  5.47, 1.07, 10.38, 1.14, 1.00, 1.29, 1.32, 2.12, 19.95, 1.33, 2.84, 2.13, 1.72, 5.22, 5.19,
];

const MOCK_USERS = [
  "d***6", "a***9", "k***3", "m***8", "r***1", "s***5", "t***2", "f***7", "z***4", "p***0", "j***8", "b***2"
];

export default function AviatorGame() {
  const { user, updateBalance, showNotification } = useUserStore();
  const { settings } = useAdminConfigStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game Lifecycle State
  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState<"WAITING" | "FLYING" | "CRASHED">("WAITING");
  const [countdown, setCountdown] = useState<number>(5.0);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [crashPoint, setCrashPoint] = useState<number>(2.25);
  const [history, setHistory] = useState<number[]>(INITIAL_HISTORY);
  const [activeTab, setActiveTab] = useState<"ALL" | "MY" | "TOP">("ALL");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dual Bet Consoles
  // Console 1 (Left)
  const [bet1Mode, setBet1Mode] = useState<"BET" | "AUTO">("BET");
  const [bet1Amount, setBet1Amount] = useState<number>(100);
  const [bet1Active, setBet1Active] = useState<boolean>(false);
  const [bet1CashedOut, setBet1CashedOut] = useState<boolean>(false);
  const [bet1AutoCashout, setBet1AutoCashout] = useState<string>("2.00");

  // Console 2 (Right)
  const [bet2Mode, setBet2Mode] = useState<"BET" | "AUTO">("BET");
  const [bet2Amount, setBet2Amount] = useState<number>(100);
  const [bet2Active, setBet2Active] = useState<boolean>(false);
  const [bet2CashedOut, setBet2CashedOut] = useState<boolean>(false);
  const [bet2AutoCashout, setBet2AutoCashout] = useState<string>("5.00");

  // Live Multiplayer Bets Feed
  const [liveBets, setLiveBets] = useState<LivePlayerBet[]>([]);
  const [myBetsHistory, setMyBetsHistory] = useState<Array<{ bet: number; mult: number; payout: number; isWin: boolean; time: string }>>([]);

  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Crash Point Generator connected to 777 Admin Rigging Controller
  const generateCrashPoint = () => {
    if (settings.aviatorMode === "FORCE_NEXT_CRASH") {
      return Math.max(1.01, settings.aviatorForceNextMultiplier || 1.15);
    }
    if (settings.aviatorMode === "MEGA_WIN_EVENT") {
      return 25.0 + Math.random() * 75.0;
    }

    const instantCrashChance = (settings.aviatorHouseCrashUnder120Chance || 22) / 100;
    const rand = Math.random();

    if (rand < instantCrashChance) {
      return 1.0 + Math.random() * 0.18; // 1.00x - 1.18x instant crash
    }
    if (rand < 0.55) {
      return 1.18 + Math.random() * 1.5; // 1.18x - 2.68x
    }
    if (rand < 0.82) {
      return 2.68 + Math.random() * 3.5; // 2.68x - 6.18x
    }
    if (rand < 0.94) {
      return 6.18 + Math.random() * 12.0; // 6.18x - 18.18x
    }
    const maxCap = settings.aviatorMaxMultiplierCap || 250;
    return Math.min(maxCap, 18.18 + Math.random() * 50.0);
  };

  // Generate simulated live players
  const generateLiveBets = () => {
    const count = 10 + Math.floor(Math.random() * 8);
    const bets: LivePlayerBet[] = [];
    for (let i = 0; i < count; i++) {
      bets.push({
        username: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)],
        amount: [50, 100, 200, 500, 1000, 2500][Math.floor(Math.random() * 6)],
      });
    }
    return bets;
  };

  // Record round to backend
  const recordGameRound = async (betAmt: number, mult: number, payoutAmt: number, isWin: boolean) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setMyBetsHistory((prev) => [{ bet: betAmt, mult, payout: payoutAmt, isWin, time }, ...prev.slice(0, 19)]);

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

  // Lifecycle WAITING countdown
  useEffect(() => {
    if (gameState === "WAITING") {
      setMultiplier(1.0);
      setLiveBets(generateLiveBets());
      setCountdown(5.0);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 0.2) {
            clearInterval(interval);
            const newCrash = generateCrashPoint();
            setCrashPoint(newCrash);
            setGameState("FLYING");
            startTimeRef.current = performance.now();
            return 0;
          }
          return Math.max(0, +(prev - 0.1).toFixed(1));
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Main 60fps Canvas Loop during FLYING
  useEffect(() => {
    if (gameState !== "FLYING") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;

    const render = (now: number) => {
      if (!isRunning) return;
      const elapsed = (now - startTimeRef.current) / 1000;

      // Realistic Spribe exponential acceleration curve
      const currentMult = 1.0 + 0.075 * Math.pow(elapsed, 1.88);
      const rounded = Math.round(currentMult * 100) / 100;
      setMultiplier(rounded);

      // Auto Cashout checks
      if (bet1Active && !bet1CashedOut && bet1Mode === "AUTO") {
        const target = parseFloat(bet1AutoCashout);
        if (target && rounded >= target) {
          handleCashout(1, rounded);
        }
      }

      if (bet2Active && !bet2CashedOut && bet2Mode === "AUTO") {
        const target = parseFloat(bet2AutoCashout);
        if (target && rounded >= target) {
          handleCashout(2, rounded);
        }
      }

      // Simulate other players cashing out dynamically
      setLiveBets((prev) =>
        prev.map((b) => {
          if (!b.cashedOutMultiplier && rounded > 1.25 && Math.random() < 0.035) {
            return {
              ...b,
              cashedOutMultiplier: rounded,
              winAmount: Math.round(b.amount * rounded),
            };
          }
          return b;
        })
      );

      // CRASH CONDITION
      if (rounded >= crashPoint) {
        sound.playCrash();
        setGameState("CRASHED");
        setHistory((prev) => [rounded, ...prev.slice(0, 19)]);

        if (bet1Active && !bet1CashedOut) {
          recordGameRound(bet1Amount, 0, 0, false);
        }
        if (bet2Active && !bet2CashedOut) {
          recordGameRound(bet2Amount, 0, 0, false);
        }

        setTimeout(() => {
          setBet1Active(false);
          setBet1CashedOut(false);
          setBet2Active(false);
          setBet2CashedOut(false);
          setGameState("WAITING");
        }, 3200);

        return;
      }

      // 60FPS CANVAS DRAWING
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // 1. Dark Black/Violet Gradient Background
      const bgGrad = ctx.createRadialGradient(0, height, 20, width / 2, height / 2, width);
      bgGrad.addColorStop(0, "#22051E");
      bgGrad.addColorStop(0.5, "#140416");
      bgGrad.addColorStop(1, "#0A010C");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Radial Fan Beams (Authentic Spribe Dark Sunburst from bottom-left)
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      for (let i = 0; i < 18; i++) {
        const beamAngle = (i * Math.PI) / 36;
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(Math.cos(beamAngle) * width * 1.5, height - Math.sin(beamAngle) * height * 1.5);
        ctx.lineTo(Math.cos(beamAngle + 0.04) * width * 1.5, height - Math.sin(beamAngle + 0.04) * height * 1.5);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 3. Bottom Axis & Dots
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height - 20);
      ctx.lineTo(width, height - 20);
      ctx.stroke();

      for (let x = 60; x < width; x += 90) {
        ctx.beginPath();
        ctx.arc(x, height - 20, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fill();
      }

      // 4. Calculate Plane Position along exponential trajectory
      const progress = Math.min(elapsed / 10, 1);
      const startX = 20;
      const startY = height - 30;
      const targetX = width - 120;
      const targetY = 70;

      // Subtle aerodynamic turbulence bobbing
      const bobbing = Math.sin(elapsed * 7) * 3.5;

      const currentX = startX + (targetX - startX) * Math.sin((progress * Math.PI) / 2);
      const currentY = startY - (startY - targetY) * Math.pow(progress, 1.45) + bobbing;

      // 5. Draw Red Glow Curve
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(startX + (currentX - startX) * 0.45, startY, currentX, currentY);
      ctx.strokeStyle = "#E11D48";
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "#E11D48";
      ctx.shadowBlur = 12;
      ctx.stroke();

      // 6. Draw Red Transparent Fill Area Under Curve
      ctx.lineTo(currentX, startY);
      ctx.lineTo(startX, startY);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, currentY, 0, startY);
      fillGrad.addColorStop(0, "rgba(225, 29, 72, 0.45)");
      fillGrad.addColorStop(0.7, "rgba(225, 29, 72, 0.18)");
      fillGrad.addColorStop(1, "rgba(225, 29, 72, 0.0)");
      ctx.fillStyle = fillGrad;
      ctx.fill();
      ctx.restore();

      // 7. Draw Authentic Spribe Red Monoplane
      ctx.save();
      ctx.translate(currentX, currentY);

      // Plane angle calculated along trajectory slope
      const slopeAngle = -Math.atan2(startY - currentY, currentX - startX) * 0.45 - 0.08;
      ctx.rotate(slopeAngle);

      // Airplane Body (Authentic Red Aviator Propeller Plane Silhouette)
      ctx.fillStyle = "#E11D48";
      ctx.beginPath();
      ctx.moveTo(32, 0); // Propeller nose
      ctx.lineTo(24, -4);
      ctx.lineTo(-4, -5);
      ctx.lineTo(-24, -14); // Upper tail fin tip
      ctx.lineTo(-26, -14);
      ctx.lineTo(-22, -2);
      ctx.lineTo(-30, -1);
      ctx.lineTo(-30, 2);
      ctx.lineTo(-20, 3);
      ctx.lineTo(4, 5);
      ctx.lineTo(24, 4);
      ctx.closePath();
      ctx.shadowColor = "#E11D48";
      ctx.shadowBlur = 8;
      ctx.fill();

      // Main Wing (Swept wing)
      ctx.beginPath();
      ctx.moveTo(10, -2);
      ctx.lineTo(-6, -18);
      ctx.lineTo(-12, -18);
      ctx.lineTo(-4, 0);
      ctx.closePath();
      ctx.fill();

      // Bottom Wing
      ctx.beginPath();
      ctx.moveTo(10, 2);
      ctx.lineTo(-4, 16);
      ctx.lineTo(-10, 16);
      ctx.lineTo(-2, 2);
      ctx.closePath();
      ctx.fill();

      // Cockpit Window Glass
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(16, -3);
      ctx.lineTo(10, -4);
      ctx.lineTo(8, -1);
      ctx.lineTo(15, -1);
      ctx.closePath();
      ctx.fill();

      // Spinning Nose Propeller (Rotating blur blade)
      const propPhase = (now / 25) % Math.PI;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(33, -Math.sin(propPhase) * 14);
      ctx.lineTo(33, Math.sin(propPhase) * 14);
      ctx.stroke();

      // Propeller Hub Nose Cone
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(33, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Jet exhaust smoke puffs
      ctx.fillStyle = "rgba(225, 29, 72, 0.35)";
      ctx.beginPath();
      ctx.arc(-34 - Math.random() * 4, 1, 3 + Math.random() * 2, 0, Math.PI * 2);
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

  // Cashout button handler
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

  // Place Bet handler
  const handlePlaceBet = (betIndex: 1 | 2) => {
    const amt = betIndex === 1 ? bet1Amount : bet2Amount;
    if (!user || user.balance < amt) {
      showNotification("Insufficient balance. Please deposit to play.", "ERROR");
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

  const adjustBet = (index: 1 | 2, delta: number) => {
    sound.playChipClick();
    if (index === 1) {
      setBet1Amount((prev) => Math.max(10, prev + delta));
    } else {
      setBet2Amount((prev) => Math.max(10, prev + delta));
    }
  };

  const getMultiplierBadgeColor = (val: number) => {
    if (val >= 10.0) return "bg-[#9333EA] text-[#F3E8FF] border border-purple-400";
    if (val >= 2.0) return "bg-[#6B21A8]/60 text-[#E9D5FF] border border-purple-500/40";
    return "bg-[#1E3A8A]/60 text-[#93C5FD] border border-blue-500/40";
  };

  if (!mounted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4 bg-[#0C070D] text-white">
        <div className="w-12 h-12 rounded-full border-4 border-[#BA2649] border-t-transparent animate-spin" />
        <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#FFDE59]">
          Loading Aviator Flight Engine...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#0C070D] p-2 sm:p-4 lg:p-6 flex flex-col items-center select-none font-sans">
      <div className="w-full max-w-5xl space-y-3">
        {/* 1. TOP RECENT MULTIPLIERS STRIP (Exact Match of Screenshot) */}
        <div className="bg-[#160B18] border border-[#2B142F] rounded-2xl px-3 py-2 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {history.map((val, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-full text-xs font-mono font-black tracking-tight whitespace-nowrap shadow-sm transition-transform hover:scale-105 ${getMultiplierBadgeColor(
                  val
                )}`}
              >
                {val.toFixed(2)}x
              </span>
            ))}
          </div>

          <button
            title="Flight History"
            className="p-1.5 ml-2 rounded-xl bg-[#26122B] text-gray-400 hover:text-white border border-[#3E1B46] transition flex-shrink-0"
          >
            <History className="w-4 h-4" />
          </button>
        </div>

        {/* 2. MAIN FLIGHT STAGE (Exact Visual Replica of Screenshot) */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-[#2E1533] bg-[#0E0410] shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          {/* Top Golden Strip Header ("FUN MODE" / "777 PROVABLY FAIR") */}
          <div className="w-full bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#D97706] text-[#241005] font-black text-xs uppercase tracking-widest text-center py-1 shadow-sm">
            FUN MODE &bull; 777 PROVABLY FAIR FLIGHT
          </div>

          {/* Canvas Area */}
          <div className="relative w-full h-[260px] sm:h-[340px]">
            <canvas ref={canvasRef} width={880} height={340} className="w-full h-full block" />

            {/* Huge Multiplier in Center */}
            {gameState === "FLYING" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-5xl sm:text-7xl md:text-8xl font-black font-mono text-white tracking-tight drop-shadow-[0_4px_25px_rgba(255,255,255,0.4)]">
                  {multiplier.toFixed(2)}x
                </div>
              </div>
            )}

            {/* Waiting State: 5.0s Progress Bar Overlay */}
            {gameState === "WAITING" && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 z-10">
                <div className="text-xs uppercase font-extrabold tracking-widest text-[#FFDE59]">
                  NEXT ROUND IN
                </div>
                <div className="text-5xl sm:text-6xl font-black font-mono text-white tracking-wider animate-pulse">
                  {countdown.toFixed(1)}s
                </div>
                <div className="w-56 h-2 bg-[#2E1533] rounded-full overflow-hidden border border-[#52235B]">
                  <div
                    className="h-full bg-gradient-to-r from-[#BA2649] to-[#EF4444] transition-all duration-100"
                    style={{ width: `${((5.0 - countdown) / 5.0) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                  Place your bets for takeoff
                </div>
              </div>
            )}

            {/* Crashed State Overlay */}
            {gameState === "CRASHED" && (
              <div className="absolute inset-0 bg-red-950/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-2 z-10 animate-in zoom-in-95 duration-200">
                <div className="text-xs uppercase font-black tracking-widest text-red-500">
                  FLEW AWAY!
                </div>
                <div className="text-6xl sm:text-7xl font-black font-mono text-red-500 tracking-tight drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                  {multiplier.toFixed(2)}x
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. DUAL BET CONSOLES (Exact Replica of Screenshot: Stepper + Presets + Big Green BET Button) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Console 1 (Left) */}
          <div className="bg-[#1A0C1C] border border-[#341739] rounded-2xl p-3 sm:p-4 space-y-3 shadow-lg">
            {/* Mode Switcher Tabs: Bet / Auto */}
            <div className="flex items-center justify-center">
              <div className="bg-[#110613] p-0.5 rounded-full border border-[#2B142F] flex items-center space-x-1">
                <button
                  onClick={() => setBet1Mode("BET")}
                  className={`px-6 py-1 rounded-full text-xs font-black transition ${
                    bet1Mode === "BET" ? "bg-[#2E1533] text-white shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Bet
                </button>
                <button
                  onClick={() => setBet1Mode("AUTO")}
                  className={`px-6 py-1 rounded-full text-xs font-black transition ${
                    bet1Mode === "AUTO" ? "bg-[#2E1533] text-white shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Auto
                </button>
              </div>
            </div>

            {/* Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Stepper Input & Quick Presets */}
              <div className="space-y-2">
                <div className="flex items-center bg-[#110613] border border-[#2B142F] rounded-xl px-2 py-1.5 justify-between">
                  <button
                    disabled={bet1Active}
                    onClick={() => adjustBet(1, -10)}
                    className="w-7 h-7 rounded-lg bg-[#26122B] hover:bg-[#3E1B46] text-white font-black flex items-center justify-center transition disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-center font-mono font-black text-sm text-white">
                    {bet1Amount.toFixed(2)}
                  </div>
                  <button
                    disabled={bet1Active}
                    onClick={() => adjustBet(1, 10)}
                    className="w-7 h-7 rounded-lg bg-[#26122B] hover:bg-[#3E1B46] text-white font-black flex items-center justify-center transition disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Preset Chips: 100, 200, 500, 1000 */}
                <div className="grid grid-cols-4 gap-1">
                  {[50, 100, 500, 1000].map((val) => (
                    <button
                      key={val}
                      disabled={bet1Active}
                      onClick={() => {
                        setBet1Amount(val);
                        sound.playChipClick();
                      }}
                      className="py-1 rounded-lg bg-[#150918] hover:bg-[#28132C] border border-[#2B142F] text-[11px] font-mono font-bold text-gray-300 transition disabled:opacity-40"
                    >
                      {val}
                    </button>
                  ))}
                </div>

                {/* Auto Cashout Input (when Auto tab active) */}
                {bet1Mode === "AUTO" && (
                  <div className="flex items-center justify-between text-xs bg-[#110613] p-1.5 rounded-xl border border-[#2B142F]">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Auto Cashout:</span>
                    <input
                      type="text"
                      disabled={bet1Active}
                      value={bet1AutoCashout}
                      onChange={(e) => setBet1AutoCashout(e.target.value)}
                      className="w-16 bg-[#1A0C1C] border border-[#3E1B46] rounded-lg px-2 py-0.5 text-center text-xs font-mono font-black text-[#FFDE59] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Big Green BET / Orange CASHOUT Button */}
              <div>
                {bet1Active ? (
                  bet1CashedOut ? (
                    <div className="h-20 bg-[#10B981]/20 border-2 border-[#10B981] rounded-2xl flex flex-col items-center justify-center text-[#10B981]">
                      <span className="text-xs font-black uppercase">CASHED OUT</span>
                      <span className="text-base font-mono font-black">
                        ৳{Math.round(bet1Amount * multiplier).toLocaleString()}
                      </span>
                    </div>
                  ) : gameState === "FLYING" ? (
                    <button
                      onClick={() => handleCashout(1, multiplier)}
                      className="w-full h-20 bg-gradient-to-b from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-[#241005] font-black rounded-2xl shadow-[0_4px_20px_rgba(245,158,11,0.5)] flex flex-col items-center justify-center transition active:scale-95 animate-pulse"
                    >
                      <span className="text-base uppercase tracking-wider font-black">CASH OUT</span>
                      <span className="text-sm font-mono font-black">
                        ৳{Math.round(bet1Amount * multiplier).toLocaleString()} ({multiplier.toFixed(2)}x)
                      </span>
                    </button>
                  ) : (
                    <div className="h-20 bg-[#BA2649]/25 border-2 border-[#BA2649] rounded-2xl flex flex-col items-center justify-center text-white">
                      <span className="text-xs font-black uppercase">WAITING TAKEOFF</span>
                      <span className="text-xs font-mono font-bold text-gray-300">
                        ৳{bet1Amount.toFixed(2)}
                      </span>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => handlePlaceBet(1)}
                    className="w-full h-20 bg-gradient-to-b from-[#22C55E] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] text-white rounded-2xl shadow-[0_4px_20px_rgba(34,197,94,0.4)] flex flex-col items-center justify-center transition active:scale-95"
                  >
                    <span className="text-lg font-black uppercase tracking-wider">BET</span>
                    <span className="text-sm font-mono font-black text-[#FEF08A]">
                      {bet1Amount.toFixed(2)} ৳
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Console 2 (Right) */}
          <div className="bg-[#1A0C1C] border border-[#341739] rounded-2xl p-3 sm:p-4 space-y-3 shadow-lg">
            {/* Mode Switcher Tabs: Bet / Auto */}
            <div className="flex items-center justify-center">
              <div className="bg-[#110613] p-0.5 rounded-full border border-[#2B142F] flex items-center space-x-1">
                <button
                  onClick={() => setBet2Mode("BET")}
                  className={`px-6 py-1 rounded-full text-xs font-black transition ${
                    bet2Mode === "BET" ? "bg-[#2E1533] text-white shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Bet
                </button>
                <button
                  onClick={() => setBet2Mode("AUTO")}
                  className={`px-6 py-1 rounded-full text-xs font-black transition ${
                    bet2Mode === "AUTO" ? "bg-[#2E1533] text-white shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Auto
                </button>
              </div>
            </div>

            {/* Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Stepper Input & Quick Presets */}
              <div className="space-y-2">
                <div className="flex items-center bg-[#110613] border border-[#2B142F] rounded-xl px-2 py-1.5 justify-between">
                  <button
                    disabled={bet2Active}
                    onClick={() => adjustBet(2, -10)}
                    className="w-7 h-7 rounded-lg bg-[#26122B] hover:bg-[#3E1B46] text-white font-black flex items-center justify-center transition disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-center font-mono font-black text-sm text-white">
                    {bet2Amount.toFixed(2)}
                  </div>
                  <button
                    disabled={bet2Active}
                    onClick={() => adjustBet(2, 10)}
                    className="w-7 h-7 rounded-lg bg-[#26122B] hover:bg-[#3E1B46] text-white font-black flex items-center justify-center transition disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Preset Chips: 100, 200, 500, 1000 */}
                <div className="grid grid-cols-4 gap-1">
                  {[50, 100, 500, 1000].map((val) => (
                    <button
                      key={val}
                      disabled={bet2Active}
                      onClick={() => {
                        setBet2Amount(val);
                        sound.playChipClick();
                      }}
                      className="py-1 rounded-lg bg-[#150918] hover:bg-[#28132C] border border-[#2B142F] text-[11px] font-mono font-bold text-gray-300 transition disabled:opacity-40"
                    >
                      {val}
                    </button>
                  ))}
                </div>

                {/* Auto Cashout Input (when Auto tab active) */}
                {bet2Mode === "AUTO" && (
                  <div className="flex items-center justify-between text-xs bg-[#110613] p-1.5 rounded-xl border border-[#2B142F]">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Auto Cashout:</span>
                    <input
                      type="text"
                      disabled={bet2Active}
                      value={bet2AutoCashout}
                      onChange={(e) => setBet2AutoCashout(e.target.value)}
                      className="w-16 bg-[#1A0C1C] border border-[#3E1B46] rounded-lg px-2 py-0.5 text-center text-xs font-mono font-black text-[#FFDE59] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Big Green BET / Orange CASHOUT Button */}
              <div>
                {bet2Active ? (
                  bet2CashedOut ? (
                    <div className="h-20 bg-[#10B981]/20 border-2 border-[#10B981] rounded-2xl flex flex-col items-center justify-center text-[#10B981]">
                      <span className="text-xs font-black uppercase">CASHED OUT</span>
                      <span className="text-base font-mono font-black">
                        ৳{Math.round(bet2Amount * multiplier).toLocaleString()}
                      </span>
                    </div>
                  ) : gameState === "FLYING" ? (
                    <button
                      onClick={() => handleCashout(2, multiplier)}
                      className="w-full h-20 bg-gradient-to-b from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-[#241005] font-black rounded-2xl shadow-[0_4px_20px_rgba(245,158,11,0.5)] flex flex-col items-center justify-center transition active:scale-95 animate-pulse"
                    >
                      <span className="text-base uppercase tracking-wider font-black">CASH OUT</span>
                      <span className="text-sm font-mono font-black">
                        ৳{Math.round(bet2Amount * multiplier).toLocaleString()} ({multiplier.toFixed(2)}x)
                      </span>
                    </button>
                  ) : (
                    <div className="h-20 bg-[#BA2649]/25 border-2 border-[#BA2649] rounded-2xl flex flex-col items-center justify-center text-white">
                      <span className="text-xs font-black uppercase">WAITING TAKEOFF</span>
                      <span className="text-xs font-mono font-bold text-gray-300">
                        ৳{bet2Amount.toFixed(2)}
                      </span>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => handlePlaceBet(2)}
                    className="w-full h-20 bg-gradient-to-b from-[#22C55E] to-[#16A34A] hover:from-[#4ADE80] hover:to-[#15803D] text-white rounded-2xl shadow-[0_4px_20px_rgba(34,197,94,0.4)] flex flex-col items-center justify-center transition active:scale-95"
                  >
                    <span className="text-lg font-black uppercase tracking-wider">BET</span>
                    <span className="text-sm font-mono font-black text-[#FEF08A]">
                      {bet2Amount.toFixed(2)} ৳
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. BOTTOM LIVE BETS & HISTORY TABLE (Screenshot Replica: All Bets / My Bets / Top) */}
        <div className="bg-[#160B18] border border-[#2B142F] rounded-2xl p-4 shadow-lg space-y-3">
          {/* Tabs: All Bets / My Bets / Top */}
          <div className="flex items-center justify-between border-b border-[#2B142F] pb-3">
            <div className="flex items-center space-x-1.5 bg-[#0F0511] p-1 rounded-full border border-[#2B142F]">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-4 py-1 rounded-full text-xs font-bold transition ${
                  activeTab === "ALL" ? "bg-[#2E1533] text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                All Bets
              </button>
              <button
                onClick={() => setActiveTab("MY")}
                className={`px-4 py-1 rounded-full text-xs font-bold transition ${
                  activeTab === "MY" ? "bg-[#2E1533] text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                My Bets
              </button>
              <button
                onClick={() => setActiveTab("TOP")}
                className={`px-4 py-1 rounded-full text-xs font-bold transition ${
                  activeTab === "TOP" ? "bg-[#2E1533] text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                Top
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-400 font-bold">
              <History className="w-3.5 h-3.5 text-[#FFDE59]" />
              <span className="hidden sm:inline">Previous hand</span>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-4 text-[11px] font-black uppercase tracking-wider text-gray-400 px-2 py-1">
            <div>User</div>
            <div className="text-center">Bet (৳)</div>
            <div className="text-center">Multiplier (X)</div>
            <div className="text-right">Cash Out (৳)</div>
          </div>

          {/* Table Body */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {activeTab === "ALL" && (
              <>
                {/* Active user bets on top */}
                {bet1Active && (
                  <div className="grid grid-cols-4 items-center p-2 rounded-xl bg-[#BA2649]/20 border border-[#BA2649]/50 text-xs font-mono font-bold text-white">
                    <div className="flex items-center space-x-1.5 text-[#FFDE59]">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                      <span>You (Bet 1)</span>
                    </div>
                    <div className="text-center">৳{bet1Amount.toFixed(2)}</div>
                    <div className="text-center text-[#FFDE59]">
                      {bet1CashedOut ? `${multiplier.toFixed(2)}x` : "Flying..."}
                    </div>
                    <div className="text-right text-[#10B981]">
                      {bet1CashedOut ? `+৳${Math.round(bet1Amount * multiplier).toLocaleString()}` : "-"}
                    </div>
                  </div>
                )}

                {/* Simulated live bets */}
                {liveBets.map((b, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-4 items-center p-2 rounded-xl border text-xs font-mono ${
                      b.cashedOutMultiplier
                        ? "bg-[#10B981]/10 border-[#10B981]/30 text-white"
                        : "bg-[#110613] border-[#220D25] text-gray-300"
                    }`}
                  >
                    <div className="truncate font-sans font-medium text-gray-300">{b.username}</div>
                    <div className="text-center">৳{b.amount.toFixed(2)}</div>
                    <div className="text-center font-bold">
                      {b.cashedOutMultiplier ? (
                        <span className="text-[#FFDE59] bg-[#FFDE59]/15 px-2 py-0.5 rounded-full">
                          {b.cashedOutMultiplier.toFixed(2)}x
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </div>
                    <div className="text-right font-bold">
                      {b.winAmount ? (
                        <span className="text-[#10B981]">+৳{b.winAmount.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === "MY" && (
              myBetsHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-500">No bets recorded yet in this session.</div>
              ) : (
                myBetsHistory.map((h, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-4 items-center p-2 rounded-xl border text-xs font-mono ${
                      h.isWin ? "bg-[#10B981]/10 border-[#10B981]/30 text-white" : "bg-red-950/20 border-red-900/30 text-gray-400"
                    }`}
                  >
                    <div className="text-gray-400 font-sans">{h.time}</div>
                    <div className="text-center">৳{h.bet.toFixed(2)}</div>
                    <div className="text-center font-bold text-[#FFDE59]">
                      {h.isWin ? `${h.mult.toFixed(2)}x` : "CRASH"}
                    </div>
                    <div className="text-right font-bold">
                      {h.isWin ? <span className="text-[#10B981]">+৳{h.payout.toLocaleString()}</span> : <span className="text-red-400">0.00</span>}
                    </div>
                  </div>
                ))
              )
            )}

            {activeTab === "TOP" && (
              [
                { user: "Tanvir_Boss", bet: 2500, x: 24.50, win: 61250 },
                { user: "Rafi_VIP", bet: 5000, x: 14.20, win: 71000 },
                { user: "Shakib_Pro", bet: 1000, x: 45.80, win: 45800 },
                { user: "Saimon_King", bet: 2000, x: 19.95, win: 39900 },
              ].map((top, idx) => (
                <div key={idx} className="grid grid-cols-4 items-center p-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-mono text-white">
                  <div className="font-sans font-bold text-[#FFDE59]">{top.user}</div>
                  <div className="text-center">৳{top.bet.toLocaleString()}</div>
                  <div className="text-center font-bold text-[#9333EA] bg-purple-500/20 px-2 py-0.5 rounded-full">
                    {top.x.toFixed(2)}x
                  </div>
                  <div className="text-right font-bold text-[#10B981]">
                    +৳{top.win.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
