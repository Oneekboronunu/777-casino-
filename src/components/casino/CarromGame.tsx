"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Layers,
  RotateCcw,
  Zap,
  Award,
  Crown,
  Trophy,
  ShieldCheck,
  Target,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useUserStore } from "@/lib/store/useUserStore";
import { useAdminConfigStore } from "@/lib/store/useAdminConfigStore";
import sound from "@/lib/sound";

interface Coin {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: "WHITE" | "BLACK" | "QUEEN";
  color: string;
  isPotted: boolean;
}

const BOARD_SIZE = 560;
const POCKET_RADIUS = 28;
const COIN_RADIUS = 13;
const STRIKER_RADIUS = 19;

export default function CarromGame() {
  const { user, updateBalance, showNotification } = useUserStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game Settings & Wager
  const [wager, setWager] = useState<number>(500);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [strikesLeft, setStrikesLeft] = useState<number>(8);
  const [score, setScore] = useState<number>(0);
  const [coinsPottedCount, setCoinsPottedCount] = useState<number>(0);
  const [queenCovered, setQueenCovered] = useState<boolean>(false);

  // Striker State
  const [strikerBaselineX, setStrikerBaselineX] = useState<number>(BOARD_SIZE / 2);
  const [aimAngle, setAimAngle] = useState<number>(-Math.PI / 2); // aiming upwards
  const [power, setPower] = useState<number>(75); // 10 to 100
  const [isStriking, setIsStriking] = useState<boolean>(false);

  // Coins & Physics State Ref
  const coinsRef = useRef<Coin[]>([]);
  const strikerRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    isMoving: boolean;
  }>({
    x: BOARD_SIZE / 2,
    y: BOARD_SIZE - 80,
    vx: 0,
    vy: 0,
    radius: STRIKER_RADIUS,
    isMoving: false,
  });

  const animationIdRef = useRef<number | null>(null);

  // Initialize coins layout in center rosette
  const initBoard = () => {
    const cx = BOARD_SIZE / 2;
    const cy = BOARD_SIZE / 2;
    const initialCoins: Coin[] = [];

    // 1. Red Queen in center
    initialCoins.push({
      id: 0,
      x: cx,
      y: cy,
      vx: 0,
      vy: 0,
      radius: COIN_RADIUS,
      type: "QUEEN",
      color: "#DC2626",
      isPotted: false,
    });

    // 2. Inner ring (6 alternating coins: 3 White, 3 Black)
    const innerDist = COIN_RADIUS * 2 + 1;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const type = i % 2 === 0 ? "WHITE" : "BLACK";
      initialCoins.push({
        id: i + 1,
        x: cx + Math.cos(angle) * innerDist,
        y: cy + Math.sin(angle) * innerDist,
        vx: 0,
        vy: 0,
        radius: COIN_RADIUS,
        type,
        color: type === "WHITE" ? "#F5EBE1" : "#1E293B",
        isPotted: false,
      });
    }

    // 3. Outer ring (12 alternating coins: 6 White, 6 Black)
    const outerDist = innerDist * 1.95;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6 + Math.PI / 12;
      const type = i % 2 === 0 ? "WHITE" : "BLACK";
      initialCoins.push({
        id: i + 7,
        x: cx + Math.cos(angle) * outerDist,
        y: cy + Math.sin(angle) * outerDist,
        vx: 0,
        vy: 0,
        radius: COIN_RADIUS,
        type,
        color: type === "WHITE" ? "#F5EBE1" : "#1E293B",
        isPotted: false,
      });
    }

    coinsRef.current = initialCoins;

    // Reset striker
    strikerRef.current = {
      x: BOARD_SIZE / 2,
      y: BOARD_SIZE - 80,
      vx: 0,
      vy: 0,
      radius: STRIKER_RADIUS,
      isMoving: false,
    };

    setStrikerBaselineX(BOARD_SIZE / 2);
    setIsStriking(false);
  };

  useEffect(() => {
    initBoard();
  }, []);

  // Main Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;

    // Corner Pockets Coordinates
    const pockets = [
      { x: 42, y: 42 },
      { x: BOARD_SIZE - 42, y: 42 },
      { x: 42, y: BOARD_SIZE - 42 },
      { x: BOARD_SIZE - 42, y: BOARD_SIZE - 42 },
    ];

    const friction = 0.984; // smooth surface sliding
    const bounceDamping = 0.88; // wooden cushion bounce

    const loop = () => {
      if (!isRunning) return;

      const striker = strikerRef.current;
      const coins = coinsRef.current;

      // 1. UPDATE PHYSICS
      let moving = false;

      // Update Striker
      if (striker.isMoving) {
        striker.x += striker.vx;
        striker.y += striker.vy;
        striker.vx *= friction;
        striker.vy *= friction;

        if (Math.hypot(striker.vx, striker.vy) < 0.15) {
          striker.vx = 0;
          striker.vy = 0;
          striker.isMoving = false;
        } else {
          moving = true;
        }

        // Striker Cushion Bounce
        const minX = 40 + striker.radius;
        const maxX = BOARD_SIZE - 40 - striker.radius;
        const minY = 40 + striker.radius;
        const maxY = BOARD_SIZE - 40 - striker.radius;

        if (striker.x <= minX) {
          striker.x = minX;
          striker.vx = -striker.vx * bounceDamping;
          sound.playCoinHit();
        } else if (striker.x >= maxX) {
          striker.x = maxX;
          striker.vx = -striker.vx * bounceDamping;
          sound.playCoinHit();
        }

        if (striker.y <= minY) {
          striker.y = minY;
          striker.vy = -striker.vy * bounceDamping;
          sound.playCoinHit();
        } else if (striker.y >= maxY) {
          striker.y = maxY;
          striker.vy = -striker.vy * bounceDamping;
          sound.playCoinHit();
        }

        // Striker Pocket check (foul)
        pockets.forEach((p) => {
          if (Math.hypot(striker.x - p.x, striker.y - p.y) < POCKET_RADIUS - 5) {
            sound.playPocketSink();
            striker.vx = 0;
            striker.vy = 0;
            striker.isMoving = false;
          }
        });
      }

      // Update Coins
      coins.forEach((c) => {
        if (c.isPotted) return;

        if (Math.hypot(c.vx, c.vy) > 0.15) {
          moving = true;
          c.x += c.vx;
          c.y += c.vy;
          c.vx *= friction;
          c.vy *= friction;

          // Wall cushion collisions
          const minX = 40 + c.radius;
          const maxX = BOARD_SIZE - 40 - c.radius;
          const minY = 40 + c.radius;
          const maxY = BOARD_SIZE - 40 - c.radius;

          if (c.x <= minX) {
            c.x = minX;
            c.vx = -c.vx * bounceDamping;
            sound.playCoinHit();
          } else if (c.x >= maxX) {
            c.x = maxX;
            c.vx = -c.vx * bounceDamping;
            sound.playCoinHit();
          }

          if (c.y <= minY) {
            c.y = minY;
            c.vy = -c.vy * bounceDamping;
            sound.playCoinHit();
          } else if (c.y >= maxY) {
            c.y = maxY;
            c.vy = -c.vy * bounceDamping;
            sound.playCoinHit();
          }

          // Check Pocket Drop
          pockets.forEach((p) => {
            if (Math.hypot(c.x - p.x, c.y - p.y) < POCKET_RADIUS) {
              c.isPotted = true;
              c.vx = 0;
              c.vy = 0;
              sound.playPocketSink();

              // Add score
              let pts = c.type === "WHITE" ? 10 : c.type === "BLACK" ? 5 : 25;
              if (c.type === "QUEEN") {
                setQueenCovered(true);
              }
              setScore((prev) => prev + pts);
              setCoinsPottedCount((prev) => prev + 1);
            }
          });
        } else {
          c.vx = 0;
          c.vy = 0;
        }
      });

      // Striker - Coin Collisions
      if (striker.isMoving) {
        coins.forEach((c) => {
          if (c.isPotted) return;
          const dx = c.x - striker.x;
          const dy = c.y - striker.y;
          const dist = Math.hypot(dx, dy);
          const minDist = striker.radius + c.radius;

          if (dist < minDist && dist > 0) {
            sound.playCoinHit();
            const nx = dx / dist;
            const ny = dy / dist;

            // Elastic 2D momentum collision
            const kx = striker.vx - c.vx;
            const ky = striker.vy - c.vy;
            const p = 2 * (nx * kx + ny * ky) / (1 + 0.6); // striker is heavier

            striker.vx -= p * 0.4 * nx;
            striker.vy -= p * 0.4 * ny;
            c.vx += p * 0.95 * nx;
            c.vy += p * 0.95 * ny;

            // Separate overlapping bodies
            const overlap = minDist - dist;
            c.x += nx * overlap * 0.6;
            c.y += ny * overlap * 0.6;
          }
        });
      }

      // Coin - Coin Collisions
      for (let i = 0; i < coins.length; i++) {
        for (let j = i + 1; j < coins.length; j++) {
          const c1 = coins[i];
          const c2 = coins[j];
          if (c1.isPotted || c2.isPotted) continue;

          const dx = c2.x - c1.x;
          const dy = c2.y - c1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = c1.radius + c2.radius;

          if (dist < minDist && dist > 0) {
            sound.playCoinHit();
            const nx = dx / dist;
            const ny = dy / dist;

            const kx = c1.vx - c2.vx;
            const ky = c1.vy - c2.vy;
            const p = 2 * (nx * kx + ny * ky) / 2;

            c1.vx -= p * nx * 0.95;
            c1.vy -= p * ny * 0.95;
            c2.vx += p * nx * 0.95;
            c2.vy += p * ny * 0.95;

            const overlap = minDist - dist;
            c1.x -= nx * overlap * 0.5;
            c1.y -= ny * overlap * 0.5;
            c2.x += nx * overlap * 0.5;
            c2.y += ny * overlap * 0.5;
          }
        }
      }

      // If everything stopped after a strike, allow next turn
      if (!moving && isStriking) {
        setIsStriking(false);
        striker.x = strikerBaselineX;
        striker.y = BOARD_SIZE - 80;
        striker.vx = 0;
        striker.vy = 0;
      }

      // 2. DRAW BOARD CANVAS
      ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

      // Wooden Frame Background
      ctx.fillStyle = "#281810";
      ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

      // Board Playing Surface (Lacquered Birch / Mahogany veneer)
      const surfaceGrad = ctx.createRadialGradient(
        BOARD_SIZE / 2,
        BOARD_SIZE / 2,
        30,
        BOARD_SIZE / 2,
        BOARD_SIZE / 2,
        BOARD_SIZE / 1.5
      );
      surfaceGrad.addColorStop(0, "#E7C99F");
      surfaceGrad.addColorStop(1, "#C29B6A");

      ctx.fillStyle = surfaceGrad;
      ctx.fillRect(36, 36, BOARD_SIZE - 72, BOARD_SIZE - 72);

      // Border Lines
      ctx.strokeStyle = "#451E0E";
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, BOARD_SIZE - 72, BOARD_SIZE - 72);

      // Center Rosette & Circles
      const cx = BOARD_SIZE / 2;
      const cy = BOARD_SIZE / 2;

      ctx.strokeStyle = "#852614";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 55, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fillStyle = "#A8321C";
      ctx.fill();
      ctx.stroke();

      // Baselines (Top, Bottom, Left, Right)
      ctx.strokeStyle = "#5C2B14";
      ctx.lineWidth = 1.5;

      // Bottom Baseline (Where striker is placed)
      ctx.beginPath();
      ctx.moveTo(110, BOARD_SIZE - 80);
      ctx.lineTo(BOARD_SIZE - 110, BOARD_SIZE - 80);
      ctx.stroke();

      // Baseline Circles
      [110, BOARD_SIZE - 110].forEach((bx) => {
        ctx.beginPath();
        ctx.arc(bx, BOARD_SIZE - 80, 16, 0, Math.PI * 2);
        ctx.fillStyle = "#D9534F";
        ctx.fill();
        ctx.stroke();
      });

      // Pockets
      pockets.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, POCKET_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#111827";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#FDE047";
        ctx.stroke();
      });

      // Draw Aiming Line (when not moving)
      if (!isStriking) {
        const aimLength = power * 2.2;
        const targetX = striker.x + Math.cos(aimAngle) * aimLength;
        const targetY = striker.y + Math.sin(aimAngle) * aimLength;

        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(striker.x, striker.y);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Target Reticle
        ctx.beginPath();
        ctx.arc(targetX, targetY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#D4AF37";
        ctx.fill();
      }

      // Draw Coins
      coins.forEach((c) => {
        if (c.isPotted) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;
        ctx.fill();

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = c.type === "WHITE" ? "#C29B6A" : "#0F172A";
        ctx.stroke();

        // Coin inner ring engraving
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = c.type === "QUEEN" ? "#FEE2E2" : "rgba(0,0,0,0.3)";
        ctx.stroke();
        ctx.restore();
      });

      // Draw Striker
      ctx.save();
      ctx.beginPath();
      ctx.arc(striker.x, striker.y, striker.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#F8FAFC";
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#D4AF37";
      ctx.stroke();

      // Striker Center Emblem
      ctx.beginPath();
      ctx.arc(striker.x, striker.y, striker.radius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#0B0F1A";
      ctx.fill();
      ctx.restore();

      animationIdRef.current = requestAnimationFrame(loop);
    };

    animationIdRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [isStriking, strikerBaselineX, aimAngle, power]);

  // Start Wager Challenge Game
  const handleStartGame = () => {
    if (!user || user.balance < wager) {
      showNotification("Insufficient balance for this wager.", "ERROR");
      return;
    }

    sound.playBetPlaced();
    updateBalance(-wager);
    setIsPlaying(true);
    setStrikesLeft(8);
    setScore(0);
    setCoinsPottedCount(0);
    setQueenCovered(false);
    initBoard();
    showNotification(`Carrom Wager Challenge Started with ৳${wager.toLocaleString()}!`, "INFO");
  };

  // Flick / Shoot Striker
  const handleFlickStriker = () => {
    if (isStriking) return;
    if (isPlaying && strikesLeft <= 0) {
      showNotification("No strikes remaining in this round!", "ERROR");
      return;
    }

    sound.playStrikerFlick();
    const speed = (power / 100) * 22; // launch velocity

    strikerRef.current.vx = Math.cos(aimAngle) * speed;
    strikerRef.current.vy = Math.sin(aimAngle) * speed;
    strikerRef.current.isMoving = true;
    setIsStriking(true);

    if (isPlaying) {
      setStrikesLeft((prev) => {
        const next = prev - 1;
        if (next === 0) {
          setTimeout(handleEndGame, 3000);
        }
        return next;
      });
    }
  };

  // Complete Game & Cashout
  const handleEndGame = async () => {
    // Multiplier calculation: base on score
    // 0-15 pts: 0x
    // 20-40 pts: 1.5x
    // 45-75 pts: 3.0x
    // Queen Covered: +5x Bonus
    let mult = 0;
    if (score >= 45) mult = 3.0;
    else if (score >= 20) mult = 1.5;
    else if (score >= 10) mult = 1.0;

    if (queenCovered) mult += 4.0; // Mega queen multiplier

    const winAmt = Math.round(wager * mult);
    const isWin = winAmt > 0;

    if (isWin) {
      sound.playWin();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
      updateBalance(winAmt);
      showNotification(`🏆 Challenge Complete! You scored ${score} pts and won ৳${winAmt.toLocaleString()} (${mult.toFixed(1)}x)!`, "SUCCESS");
    } else {
      showNotification(`Challenge Finished. Score: ${score} pts. Better luck on the next break!`, "INFO");
    }

    try {
      await fetch("/api/casino/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: "CARROM",
          betAmount: wager,
          multiplier: mult,
          payout: winAmt,
          isWin,
          details: { score, coinsPottedCount, queenCovered },
        }),
      });
    } catch {
      // ignore
    }

    setIsPlaying(false);
  };

  // Striker Baseline Slider
  const handleBaselineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setStrikerBaselineX(val);
    if (!isStriking) {
      strikerRef.current.x = val;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-[#23334E] p-4 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
            <Layers className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">CARROM BOARD PRO</h1>
            <p className="text-xs text-gray-400">Authentic 2D Physics, Queen Bonus & High-Roller Challenges</p>
          </div>
        </div>

        {/* Score & Multiplier Overview */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3.5 py-1.5 bg-[#0B0F1A] border border-[#23334E] rounded-xl">
            <span className="text-gray-400 block text-[10px]">Current Score:</span>
            <span className="text-sm font-mono font-bold text-[#10B981]">{score} PTS</span>
          </div>

          <div className="px-3.5 py-1.5 bg-[#0B0F1A] border border-[#23334E] rounded-xl">
            <span className="text-gray-400 block text-[10px]">Coins Sunk:</span>
            <span className="text-sm font-mono font-bold text-white">{coinsPottedCount}</span>
          </div>

          {queenCovered && (
            <div className="px-3 py-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-xl flex items-center space-x-1.5 text-[#D4AF37] font-bold animate-pulse">
              <Crown className="w-4 h-4" />
              <span>QUEEN COVERED (+5X)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Board & Control Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Physics Canvas Board */}
        <div className="lg:col-span-2 flex justify-center bg-[#111827] border border-[#23334E] rounded-2xl p-4 sm:p-6">
          <div className="relative border-4 border-[#1F130A] rounded-2xl shadow-2xl overflow-hidden bg-[#281810]">
            <canvas
              ref={canvasRef}
              width={BOARD_SIZE}
              height={BOARD_SIZE}
              className="block cursor-crosshair max-w-full h-auto"
            />
          </div>
        </div>

        {/* Right: Controls & Wager Console */}
        <div className="space-y-4">
          {/* Striker Positioning & Aiming Controls */}
          <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
              <span>Striker & Aim Controls</span>
              <Target className="w-4 h-4 text-[#D4AF37]" />
            </div>

            {/* Baseline Position Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-300 mb-1.5">
                <span>Baseline Position:</span>
                <span className="font-mono text-[#D4AF37]">{Math.round(strikerBaselineX)}px</span>
              </div>
              <input
                type="range"
                min="115"
                max={BOARD_SIZE - 115}
                disabled={isStriking}
                value={strikerBaselineX}
                onChange={handleBaselineChange}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            {/* Aiming Angle Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-300 mb-1.5">
                <span>Aim Angle:</span>
                <span className="font-mono text-[#D4AF37]">
                  {Math.round(((aimAngle * 180) / Math.PI + 90))}°
                </span>
              </div>
              <input
                type="range"
                min="-3.1"
                max="-0.04"
                step="0.02"
                disabled={isStriking}
                value={aimAngle}
                onChange={(e) => setAimAngle(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            {/* Power Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-300 mb-1.5">
                <span>Flick Power:</span>
                <span className="font-mono font-bold text-[#EF4444]">{power}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                disabled={isStriking}
                value={power}
                onChange={(e) => setPower(Number(e.target.value))}
                className="w-full accent-[#EF4444] cursor-pointer"
              />
            </div>

            {/* Flick Button */}
            <button
              onClick={handleFlickStriker}
              disabled={isStriking}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-[#0B0F1A] font-black text-sm rounded-xl transition shadow-gold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-[#0B0F1A]" />
              <span>{isStriking ? "STRIKER IN MOTION..." : "STRIKE / FLICK COINS"}</span>
            </button>
          </div>

          {/* High Roller Challenge Console */}
          <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
              <span>Wager Challenge Mode</span>
              <Trophy className="w-4 h-4 text-[#E5C158]" />
            </div>

            {!isPlaying ? (
              <div className="space-y-3">
                <div className="text-xs text-gray-400 leading-relaxed">
                  Start an 8-strike challenge! Sink White (10 pts) & Black (5 pts) coins. Pot the Queen for an instant 10x multiplier!
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Select Challenge Stake (৳)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2500, 5000, 10000, 25000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => {
                          setWager(amt);
                          sound.playChipClick();
                        }}
                        className={`py-2 text-xs font-bold rounded-lg border transition ${
                          wager === amt
                            ? "border-[#D4AF37] bg-[#D4AF37] text-[#0B0F1A]"
                            : "border-[#23334E] bg-[#0B0F1A] text-gray-300"
                        }`}
                      >
                        ৳{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartGame}
                  className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-sm rounded-xl transition shadow-emerald"
                >
                  Start Challenge (৳{wager.toLocaleString()})
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-[#0B0F1A] border border-[#23334E] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400">Strikes Remaining</span>
                    <div className="text-2xl font-mono font-black text-[#D4AF37]">{strikesLeft} / 8</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400">Active Wager</span>
                    <div className="text-sm font-mono font-bold text-white">৳{wager.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleEndGame}
                    className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B0F1A] font-bold text-xs rounded-xl transition shadow-gold"
                  >
                    Cash Out Current Score
                  </button>
                  <button
                    onClick={() => {
                      initBoard();
                      sound.playChipClick();
                    }}
                    className="p-2.5 bg-[#151F32] border border-[#23334E] hover:border-gray-500 rounded-xl text-gray-300"
                    title="Reset Board"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
