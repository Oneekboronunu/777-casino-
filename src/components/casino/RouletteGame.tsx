"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  RotateCcw,
  Trash2,
  Zap,
  ShieldCheck,
  Trophy,
  Volume2,
  VolumeX,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useUserStore } from "@/lib/store/useUserStore";
import { useAdminConfigStore } from "@/lib/store/useAdminConfigStore";
import sound from "@/lib/sound";

// European Roulette 37 Number Wheel Sequence
const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

const CHIP_VALUES = [
  { value: 10, label: "10", color: "#F3F4F6", border: "#9CA3AF", textColor: "#111827" },
  { value: 50, label: "50", color: "#EF4444", border: "#B91C1C", textColor: "#FFFFFF" },
  { value: 100, label: "100", color: "#3B82F6", border: "#1D4ED8", textColor: "#FFFFFF" },
  { value: 500, label: "500", color: "#10B981", border: "#047857", textColor: "#FFFFFF" },
  { value: 1000, label: "1K", color: "#1F2937", border: "#F59E0B", textColor: "#F59E0B" },
  { value: 5000, label: "5K", color: "#8B5CF6", border: "#C084FC", textColor: "#FFFFFF" },
];

export default function RouletteGame() {
  const { user, updateBalance, showNotification } = useUserStore();
  const { settings } = useAdminConfigStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  // Betting States
  const [selectedChip, setSelectedChip] = useState<number>(500);
  const [bets, setBets] = useState<Record<string, number>>({});
  const [previousBets, setPreviousBets] = useState<Record<string, number>>({});
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [landedNumber, setLandedNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([14, 32, 0, 7, 21, 9, 28, 18, 3]);
  const [lastWinAmount, setLastWinAmount] = useState<number | null>(null);

  // Animation Physics State (Refs for 60fps canvas loop)
  const wheelAngleRef = useRef<number>(0);
  const wheelSpeedRef = useRef<number>(0);
  const ballAngleRef = useRef<number>(0);
  const ballSpeedRef = useRef<number>(0);
  const ballRadiusRatioRef = useRef<number>(0.86);
  const targetNumberRef = useRef<number | null>(null);
  const spinStartTimeRef = useRef<number>(0);
  const spinDurationRef = useRef<number>(6500); // 6.5s smooth spin

  const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);

  const isRed = (num: number) => RED_NUMBERS.includes(num);
  const isGreen = (num: number) => num === 0;

  // ==================== CANVAS ROULETTE WHEEL RENDERER ====================
  const renderWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const outerRadius = center - 8;
    const trackRadius = outerRadius * 0.88;
    const numbersOuterRadius = trackRadius * 0.94;
    const numbersInnerRadius = numbersOuterRadius * 0.68;
    const innerConeRadius = numbersInnerRadius * 0.65;
    const centerTurretRadius = innerConeRadius * 0.42;

    ctx.clearRect(0, 0, size, size);
    ctx.save();

    // 1. Outer Mahogany Wooden Rim
    const woodGrad = ctx.createRadialGradient(center, center, trackRadius, center, center, outerRadius);
    woodGrad.addColorStop(0, "#2D150B");
    woodGrad.addColorStop(0.4, "#4A2211");
    woodGrad.addColorStop(0.7, "#6B3219");
    woodGrad.addColorStop(1, "#1A0B05");

    ctx.beginPath();
    ctx.arc(center, center, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = woodGrad;
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Outer Gold Border Ring
    ctx.beginPath();
    ctx.arc(center, center, outerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // 2. Brass Diamond Deflectors (8 around the rim)
    for (let i = 0; i < 8; i++) {
      const defAngle = (i * Math.PI) / 4;
      const defX = center + Math.cos(defAngle) * (outerRadius * 0.93);
      const defY = center + Math.sin(defAngle) * (outerRadius * 0.93);

      ctx.save();
      ctx.translate(defX, defY);
      ctx.rotate(defAngle);
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.lineTo(0, -6);
      ctx.lineTo(3, 0);
      ctx.lineTo(0, 6);
      ctx.closePath();
      ctx.fillStyle = "#F5D77F";
      ctx.fill();
      ctx.restore();
    }

    // 3. Inner Ball Track (Metallic Dark Bronze)
    const trackGrad = ctx.createRadialGradient(center, center, numbersOuterRadius, center, center, trackRadius);
    trackGrad.addColorStop(0, "#1F1B18");
    trackGrad.addColorStop(1, "#38312B");

    ctx.beginPath();
    ctx.arc(center, center, trackRadius, 0, Math.PI * 2);
    ctx.fillStyle = trackGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(center, center, trackRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "#8C733E";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 4. Rotating Wheel Slices & Pockets
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(wheelAngleRef.current);

    const sliceAngle = (Math.PI * 2) / 37;

    for (let i = 0; i < 37; i++) {
      const num = WHEEL_NUMBERS[i];
      const startAngle = i * sliceAngle - sliceAngle / 2;
      const endAngle = startAngle + sliceAngle;

      // Slice Background
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, numbersOuterRadius, startAngle, endAngle);
      ctx.closePath();

      if (num === 0) {
        ctx.fillStyle = "#1E7E34"; // Green 0
      } else if (isRed(num)) {
        ctx.fillStyle = "#C81E1E"; // Red
      } else {
        ctx.fillStyle = "#18181B"; // Black
      }
      ctx.fill();

      // Golden Pocket Separator / Fret Lines
      ctx.beginPath();
      ctx.moveTo(Math.cos(startAngle) * numbersInnerRadius, Math.sin(startAngle) * numbersInnerRadius);
      ctx.lineTo(Math.cos(startAngle) * numbersOuterRadius, Math.sin(startAngle) * numbersOuterRadius);
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Number Text
      ctx.save();
      const midAngle = i * sliceAngle;
      ctx.rotate(midAngle);
      ctx.translate(0, -numbersOuterRadius * 0.83);
      ctx.rotate(Math.PI); // Orient number outwards

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 2;
      ctx.fillText(String(num), 0, 0);
      ctx.restore();
    }

    // 5. Inner Brass Cone
    const coneGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, innerConeRadius);
    coneGrad.addColorStop(0, "#E5C158");
    coneGrad.addColorStop(0.5, "#B8860B");
    coneGrad.addColorStop(0.9, "#6B4E08");
    coneGrad.addColorStop(1, "#3D2B03");

    ctx.beginPath();
    ctx.arc(0, 0, numbersInnerRadius, 0, Math.PI * 2);
    ctx.fillStyle = coneGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, numbersInnerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 6. Central 4-Spoke Turret Spinner
    for (let s = 0; s < 4; s++) {
      const spokeAngle = (s * Math.PI) / 2;
      ctx.save();
      ctx.rotate(spokeAngle);

      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(-2, -innerConeRadius * 0.75);
      ctx.arc(0, -innerConeRadius * 0.75, 4, Math.PI, 0);
      ctx.lineTo(2, 0);
      ctx.closePath();

      const spokeGrad = ctx.createLinearGradient(-4, 0, 4, 0);
      spokeGrad.addColorStop(0, "#FBE38E");
      spokeGrad.addColorStop(0.5, "#D4AF37");
      spokeGrad.addColorStop(1, "#8C6D1F");

      ctx.fillStyle = spokeGrad;
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    }

    // Center Gold Cap
    const capGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, centerTurretRadius);
    capGrad.addColorStop(0, "#FFF3B0");
    capGrad.addColorStop(0.5, "#D4AF37");
    capGrad.addColorStop(1, "#7A5E12");

    ctx.beginPath();
    ctx.arc(0, 0, centerTurretRadius, 0, Math.PI * 2);
    ctx.fillStyle = capGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, centerTurretRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore(); // Restore wheel rotation

    // 7. Ivory Roulette Ball (Independent motion over wheel)
    if (isSpinning || landedNumber !== null) {
      const ballR = outerRadius * ballRadiusRatioRef.current;
      const bx = center + Math.cos(ballAngleRef.current) * ballR;
      const by = center + Math.sin(ballAngleRef.current) * ballR;

      // Ball Shadow
      ctx.beginPath();
      ctx.arc(bx + 2, by + 2, 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fill();

      // Ball Body (Ivory White with 3D Specular Highlight)
      const ballGrad = ctx.createRadialGradient(bx - 2, by - 2, 1, bx, by, 6);
      ballGrad.addColorStop(0, "#FFFFFF");
      ballGrad.addColorStop(0.6, "#E8E8E8");
      ballGrad.addColorStop(1, "#A3A3A3");

      ctx.beginPath();
      ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = ballGrad;
      ctx.fill();
    }

    ctx.restore();
  }, [isSpinning, landedNumber]);

  // ==================== PHYSICS & ANIMATION LOOP ====================
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isSpinning) {
        const elapsed = time - spinStartTimeRef.current;
        const progress = Math.min(1, elapsed / spinDurationRef.current);

        // Cubic ease out for smooth slowing down
        const easeOut = 1 - Math.pow(1 - progress, 3.2);

        // Rotate wheel continuously clockwise
        wheelAngleRef.current += (3.5 * (1 - easeOut * 0.75)) * dt;

        // Ball rotates counter-clockwise rapidly, then decelerates
        const initialBallSpeed = -18.0;
        const currentBallSpeed = initialBallSpeed * (1 - easeOut);
        ballAngleRef.current += currentBallSpeed * dt;

        // Ball spirals down from outer track to pocket radius
        if (progress < 0.6) {
          ballRadiusRatioRef.current = 0.85; // Riding outer track
        } else if (progress < 0.85) {
          // Spiraling inwards
          const spiralProg = (progress - 0.6) / 0.25;
          ballRadiusRatioRef.current = 0.85 - spiralProg * 0.17; // Drops to 0.68
        } else {
          // Bouncing in pocket frets
          const fretBounce = Math.sin((progress - 0.85) * 45) * 0.015 * (1 - progress);
          ballRadiusRatioRef.current = 0.68 + fretBounce;
        }
      } else if (landedNumber !== null) {
        // When stopped: slow idle wheel drift and ball locked into winning slice
        wheelAngleRef.current += 0.2 * dt;
        const targetIndex = WHEEL_NUMBERS.indexOf(landedNumber);
        const sliceAngle = (Math.PI * 2) / 37;
        ballAngleRef.current = wheelAngleRef.current + targetIndex * sliceAngle - Math.PI / 2;
        ballRadiusRatioRef.current = 0.68;
      }

      renderWheel();
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isSpinning, landedNumber, renderWheel]);

  // ==================== BETTING ACTIONS ====================
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
    setPreviousBets(bets);
    setBets({});
  };

  const doubleBets = () => {
    if (isSpinning) return;
    sound.playChipClick();
    const doubled: Record<string, number> = {};
    for (const [k, v] of Object.entries(bets)) {
      doubled[k] = v * 2;
    }
    setBets(doubled);
  };

  const repeatBets = () => {
    if (isSpinning || Object.keys(previousBets).length === 0) return;
    sound.playChipClick();
    setBets(previousBets);
  };

  // ==================== SPIN THE WHEEL ====================
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
    setPreviousBets(bets);
    setIsSpinning(true);
    setLandedNumber(null);
    setLastWinAmount(null);

    // ==================== ADMIN RIG CALCULATION ====================
    let winningNumber = Math.floor(Math.random() * 37);

    // 1. Zero Frequency Boost
    if (Math.random() < (settings.rouletteZeroFrequencyBoost || 10) / 100) {
      winningNumber = 0;
    } 
    // 2. Magnet Ball Diversion (Deflect away from player bets)
    else if (settings.rouletteMagnetMode && Math.random() < (settings.rouletteHouseAdvantageBias || 35) / 100) {
      // Find empty numbers without bets
      const emptyNumbers = [];
      for (let n = 0; n <= 36; n++) {
        if (!bets[`NUM_${n}`]) emptyNumbers.push(n);
      }
      if (emptyNumbers.length > 0) {
        winningNumber = emptyNumbers[Math.floor(Math.random() * emptyNumbers.length)];
      }
    }

    targetNumberRef.current = winningNumber;
    spinStartTimeRef.current = performance.now();

    // Rattle sounds during spin
    const rattleInterval = setInterval(() => {
      sound.playBallRattle();
    }, 160);

    setTimeout(() => {
      clearInterval(rattleInterval);
      sound.playBallDrop();

      setLandedNumber(winningNumber);
      setIsSpinning(false);
      setHistory((prev) => [winningNumber, ...prev.slice(0, 11)]);

      // Calculate Total Payout
      let winPayout = 0;
      const isWinRed = isRed(winningNumber);
      const isWinEven = winningNumber !== 0 && winningNumber % 2 === 0;

      // Straight Up (36x)
      if (bets[`NUM_${winningNumber}`]) {
        winPayout += bets[`NUM_${winningNumber}`] * 36;
      }
      // Color Red / Black (2x)
      if (isWinRed && bets["COLOR_RED"]) {
        winPayout += bets["COLOR_RED"] * 2;
      }
      if (!isWinRed && winningNumber !== 0 && bets["COLOR_BLACK"]) {
        winPayout += bets["COLOR_BLACK"] * 2;
      }
      // Even / Odd (2x)
      if (isWinEven && bets["EVEN"]) {
        winPayout += bets["EVEN"] * 2;
      }
      if (!isWinEven && winningNumber !== 0 && bets["ODD"]) {
        winPayout += bets["ODD"] * 2;
      }
      // Low (1-18) / High (19-36) (2x)
      if (winningNumber >= 1 && winningNumber <= 18 && bets["RANGE_1_18"]) {
        winPayout += bets["RANGE_1_18"] * 2;
      }
      if (winningNumber >= 19 && winningNumber <= 36 && bets["RANGE_19_36"]) {
        winPayout += bets["RANGE_19_36"] * 2;
      }
      // Dozens (3x)
      if (winningNumber >= 1 && winningNumber <= 12 && bets["DOZEN_1"]) {
        winPayout += bets["DOZEN_1"] * 3;
      }
      if (winningNumber >= 13 && winningNumber <= 24 && bets["DOZEN_2"]) {
        winPayout += bets["DOZEN_2"] * 3;
      }
      if (winningNumber >= 25 && winningNumber <= 36 && bets["DOZEN_3"]) {
        winPayout += bets["DOZEN_3"] * 3;
      }
      // Columns (3x)
      if (winningNumber > 0) {
        if (winningNumber % 3 === 0 && bets["COL_3"]) winPayout += bets["COL_3"] * 3;
        if (winningNumber % 3 === 2 && bets["COL_2"]) winPayout += bets["COL_2"] * 3;
        if (winningNumber % 3 === 1 && bets["COL_1"]) winPayout += bets["COL_1"] * 3;
      }

      setLastWinAmount(winPayout);

      if (winPayout > 0) {
        sound.playWin();
        updateBalance(winPayout);
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        showNotification(`🎉 WON ৳${winPayout.toLocaleString()} on number ${winningNumber}!`, "SUCCESS");
      } else {
        sound.playCrash();
        showNotification(`Landed on ${winningNumber} (${isWinRed ? "Red" : winningNumber === 0 ? "Green" : "Black"}). Better luck next spin!`, "INFO");
      }

      // Record to backend
      fetch("/api/casino/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: "ROULETTE",
          betAmount: totalBet,
          multiplier: winPayout > 0 ? winPayout / totalBet : 0,
          payout: winPayout,
          isWin: winPayout > 0,
          details: { winningNumber, isRed: isWinRed },
        }),
      }).catch(() => {});
    }, spinDurationRef.current);
  };

  // Table number rows (matching standard European layout)
  const row1 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
  const row2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
  const row3 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];

  return (
    <div className="p-3 sm:p-5 lg:p-7 max-w-[1500px] mx-auto space-y-6">
      {/* 1. Header & Live Results Billboard */}
      <div className="bg-[#111827] border border-[#23334E] rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center shadow-lg">
            <span className="text-xl font-black text-[#0B0F1A]">36</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-white tracking-wide">EUROPEAN ROULETTE 3D</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold">
                97.3% RTP (Single Zero)
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Classic French & European table with 35:1 straight-up payouts and racetrack call bets
            </p>
          </div>
        </div>

        {/* History Billboard */}
        <div className="flex items-center space-x-3 bg-[#0B0F1A] border border-[#23334E] px-4 py-2.5 rounded-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">History:</span>
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {history.slice(0, 8).map((num, idx) => (
              <div
                key={idx}
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shadow-md transition transform ${
                  idx === 0 ? "ring-2 ring-[#FFDE59] scale-110" : ""
                } ${
                  num === 0
                    ? "bg-[#1E7E34] text-white"
                    : isRed(num)
                    ? "bg-[#C81E1E] text-white"
                    : "bg-[#1F2937] text-gray-200 border border-gray-600"
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Game Arena (Wheel on Left, Table on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==================== LEFT: 3D ROULETTE WHEEL ==================== */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#121B2B] to-[#0A101D] border-2 border-[#D4AF37]/40 rounded-3xl p-5 shadow-2xl flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isSpinning ? "bg-[#FFDE59] animate-ping" : "bg-[#10B981]"}`} />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white">
              {isSpinning ? "Ball Spinning in Track..." : landedNumber !== null ? `Result: ${landedNumber} ${isRed(landedNumber) ? "RED" : landedNumber === 0 ? "ZERO" : "BLACK"}` : "Place Your Bets"}
            </span>
          </div>

          {/* Canvas Roulette Wheel */}
          <div className="relative flex items-center justify-center my-2">
            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] max-w-full drop-shadow-2xl"
            />

            {/* Winning Number Callout Badge */}
            {landedNumber !== null && !isSpinning && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none animate-bounce">
                <div className={`px-4 py-2 rounded-2xl font-black text-2xl shadow-2xl border-2 border-[#FFDE59] ${
                  landedNumber === 0 ? "bg-[#1E7E34] text-white" : isRed(landedNumber) ? "bg-[#C81E1E] text-white" : "bg-[#111827] text-white"
                }`}>
                  {landedNumber}
                </div>
              </div>
            )}
          </div>

          {/* Last Result & Win Notification */}
          {lastWinAmount !== null && (
            <div className={`w-full py-2.5 px-4 rounded-xl text-center text-xs font-black tracking-wide ${
              lastWinAmount > 0
                ? "bg-[#10B981]/20 border border-[#10B981] text-[#10B981] animate-pulse"
                : "bg-gray-800/60 border border-gray-700 text-gray-400"
            }`}>
              {lastWinAmount > 0 ? `🎉 WIN PAYOUT: ৳${lastWinAmount.toLocaleString()}` : "NO WIN • SPIN AGAIN"}
            </div>
          )}
        </div>

        {/* ==================== RIGHT: GREEN FELT BETTING TABLE ==================== */}
        <div className="lg:col-span-7 bg-[#0D4A2B] border-4 border-[#8C6D1F] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 select-none relative overflow-x-auto">
          {/* Table Header Felt Title */}
          <div className="text-center font-serif text-lg font-bold text-[#E6D7B8] tracking-widest uppercase border-b border-[#1E6B42] pb-2">
            European Roulette
          </div>

          {/* 36 Numbers Grid + 0 */}
          <div className="min-w-[580px] space-y-1.5">
            <div className="flex">
              {/* Green 0 Slot */}
              <button
                onClick={() => placeBet("NUM_0")}
                className="w-14 bg-[#1E7E34] hover:bg-[#28A745] border-2 border-white/80 rounded-l-2xl flex flex-col items-center justify-center font-black text-xl text-white shadow-inner relative transition transform active:scale-95"
              >
                <span>0</span>
                {bets["NUM_0"] && (
                  <span className="absolute -top-2 -right-2 bg-[#FFDE59] text-[#0B0F1A] font-mono font-black text-[10px] px-1.5 py-0.5 rounded-full border border-black shadow-lg">
                    {bets["NUM_0"]}
                  </span>
                )}
              </button>

              {/* 3 Rows of 12 Numbers */}
              <div className="flex-1 grid grid-rows-3 gap-1.5 px-1.5">
                {/* Row 1: [3, 6, 9, ... 36] */}
                <div className="grid grid-cols-12 gap-1.5">
                  {row1.map((num) => {
                    const red = isRed(num);
                    const betKey = `NUM_${num}`;
                    return (
                      <button
                        key={num}
                        onClick={() => placeBet(betKey)}
                        className={`h-11 rounded-lg font-black text-sm text-white flex items-center justify-center relative border border-white/70 transition transform active:scale-95 shadow-md ${
                          red ? "bg-[#C81E1E] hover:bg-[#E53E3E]" : "bg-[#18181B] hover:bg-[#27272A]"
                        }`}
                      >
                        <span>{num}</span>
                        {bets[betKey] && (
                          <span className="absolute -top-1.5 -right-1.5 bg-[#FFDE59] text-[#0B0F1A] font-mono font-black text-[9px] px-1 py-0.2 rounded-full border border-black shadow-lg">
                            {bets[betKey]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Row 2: [2, 5, 8, ... 35] */}
                <div className="grid grid-cols-12 gap-1.5">
                  {row2.map((num) => {
                    const red = isRed(num);
                    const betKey = `NUM_${num}`;
                    return (
                      <button
                        key={num}
                        onClick={() => placeBet(betKey)}
                        className={`h-11 rounded-lg font-black text-sm text-white flex items-center justify-center relative border border-white/70 transition transform active:scale-95 shadow-md ${
                          red ? "bg-[#C81E1E] hover:bg-[#E53E3E]" : "bg-[#18181B] hover:bg-[#27272A]"
                        }`}
                      >
                        <span>{num}</span>
                        {bets[betKey] && (
                          <span className="absolute -top-1.5 -right-1.5 bg-[#FFDE59] text-[#0B0F1A] font-mono font-black text-[9px] px-1 py-0.2 rounded-full border border-black shadow-lg">
                            {bets[betKey]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Row 3: [1, 4, 7, ... 34] */}
                <div className="grid grid-cols-12 gap-1.5">
                  {row3.map((num) => {
                    const red = isRed(num);
                    const betKey = `NUM_${num}`;
                    return (
                      <button
                        key={num}
                        onClick={() => placeBet(betKey)}
                        className={`h-11 rounded-lg font-black text-sm text-white flex items-center justify-center relative border border-white/70 transition transform active:scale-95 shadow-md ${
                          red ? "bg-[#C81E1E] hover:bg-[#E53E3E]" : "bg-[#18181B] hover:bg-[#27272A]"
                        }`}
                      >
                        <span>{num}</span>
                        {bets[betKey] && (
                          <span className="absolute -top-1.5 -right-1.5 bg-[#FFDE59] text-[#0B0F1A] font-mono font-black text-[9px] px-1 py-0.2 rounded-full border border-black shadow-lg">
                            {bets[betKey]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2 to 1 (Column Bets) */}
              <div className="w-14 grid grid-rows-3 gap-1.5">
                {["COL_3", "COL_2", "COL_1"].map((colKey, idx) => (
                  <button
                    key={colKey}
                    onClick={() => placeBet(colKey)}
                    className="h-11 bg-[#09331D] hover:bg-[#12502F] border-2 border-white/80 rounded-r-xl font-black text-xs text-white flex items-center justify-center relative transition transform active:scale-95"
                  >
                    <span>2 to 1</span>
                    {bets[colKey] && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#FFDE59] text-[#0B0F1A] font-mono font-black text-[9px] px-1 py-0.2 rounded-full border border-black shadow-lg">
                        {bets[colKey]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dozens (1st 12, 2nd 12, 3rd 12) */}
            <div className="pl-14 pr-14 grid grid-cols-3 gap-2 pt-1">
              {[
                { id: "DOZEN_1", label: "1 st 12" },
                { id: "DOZEN_2", label: "2 nd 12" },
                { id: "DOZEN_3", label: "3 rd 12" },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => placeBet(d.id)}
                  className="py-2.5 bg-[#09331D] hover:bg-[#12502F] border border-white/80 rounded-xl font-black text-xs text-white flex items-center justify-center relative transition transform active:scale-95 shadow-md"
                >
                  <span>{d.label}</span>
                  {bets[d.id] && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#FFDE59] text-[#0B0F1A] font-mono font-black text-[9px] px-1.5 py-0.2 rounded-full border border-black shadow-lg">
                      {bets[d.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Outside Bets (1-18, EVEN, RED, BLACK, ODD, 19-36) */}
            <div className="pl-14 pr-14 grid grid-cols-6 gap-2 pt-1">
              {[
                { id: "RANGE_1_18", label: "1 to 18" },
                { id: "EVEN", label: "EVEN" },
                { id: "COLOR_RED", label: "RED", isRedDiamond: true },
                { id: "COLOR_BLACK", label: "BLACK", isBlackDiamond: true },
                { id: "ODD", label: "ODD" },
                { id: "RANGE_19_36", label: "19 to 36" },
              ].map((out) => (
                <button
                  key={out.id}
                  onClick={() => placeBet(out.id)}
                  className={`py-3 rounded-xl font-black text-xs flex items-center justify-center relative border border-white/80 transition transform active:scale-95 shadow-md ${
                    out.isRedDiamond
                      ? "bg-[#C81E1E] text-white hover:bg-[#E53E3E]"
                      : out.isBlackDiamond
                      ? "bg-[#18181B] text-white hover:bg-[#27272A]"
                      : "bg-[#09331D] text-white hover:bg-[#12502F]"
                  }`}
                >
                  {out.isRedDiamond ? (
                    <div className="w-4 h-4 bg-white transform rotate-45 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-[#C81E1E]" />
                    </div>
                  ) : out.isBlackDiamond ? (
                    <div className="w-4 h-4 bg-white transform rotate-45 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-[#18181B]" />
                    </div>
                  ) : (
                    <span>{out.label}</span>
                  )}

                  {bets[out.id] && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#FFDE59] text-[#0B0F1A] font-mono font-black text-[9px] px-1.5 py-0.2 rounded-full border border-black shadow-lg">
                      {bets[out.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 3. CHIPS SELECTOR & ACTION CONSOLE ==================== */}
      <div className="bg-[#111827] border-2 border-[#23334E] rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Chip Selection Bar */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto py-1">
          {CHIP_VALUES.map((chip) => {
            const isSelected = selectedChip === chip.value;
            return (
              <button
                key={chip.value}
                onClick={() => {
                  setSelectedChip(chip.value);
                  sound.playChipClick();
                }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center font-black transition transform hover:scale-110 active:scale-95 shadow-lg border-2 ${
                  isSelected ? "ring-4 ring-[#FFDE59] scale-110 -translate-y-1" : "opacity-85 hover:opacity-100"
                }`}
                style={{
                  backgroundColor: chip.color,
                  borderColor: chip.border,
                  color: chip.textColor,
                }}
              >
                <div className="text-[9px] uppercase tracking-tighter opacity-80">৳</div>
                <div className="text-xs sm:text-sm font-extrabold leading-none">{chip.label}</div>
              </button>
            );
          })}
        </div>

        {/* Total Bet & Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
          {/* Total Wager Box */}
          <div className="bg-[#0B0F1A] border border-[#23334E] px-5 py-2.5 rounded-2xl text-right flex-1 sm:flex-initial">
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Chips Bet</div>
            <div className="text-xl font-mono font-black text-[#10B981]">
              ৳{totalBet.toLocaleString()}
            </div>
          </div>

          <button
            onClick={clearBets}
            disabled={isSpinning || totalBet === 0}
            className="px-4 py-3 bg-[#151F32] hover:bg-[#1E2B45] text-gray-300 hover:text-white font-bold text-xs rounded-xl border border-[#23334E] transition disabled:opacity-50 flex items-center space-x-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>

          <button
            onClick={doubleBets}
            disabled={isSpinning || totalBet === 0}
            className="px-4 py-3 bg-[#151F32] hover:bg-[#1E2B45] text-[#FFDE59] font-bold text-xs rounded-xl border border-[#23334E] transition disabled:opacity-50"
          >
            2X Double
          </button>

          <button
            onClick={repeatBets}
            disabled={isSpinning || Object.keys(previousBets).length === 0}
            className="px-4 py-3 bg-[#151F32] hover:bg-[#1E2B45] text-[#10B981] font-bold text-xs rounded-xl border border-[#23334E] transition disabled:opacity-50 flex items-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rebet</span>
          </button>

          <button
            onClick={spinWheel}
            disabled={isSpinning || totalBet === 0}
            className="px-10 py-3.5 btn-burgundy text-white font-black text-sm sm:text-base rounded-2xl shadow-retro uppercase tracking-wider transition disabled:opacity-50 flex items-center space-x-2"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>{isSpinning ? "SPINNING..." : "SPIN"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
