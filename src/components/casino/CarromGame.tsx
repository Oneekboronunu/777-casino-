"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Crown,
  RotateCcw,
  Zap,
  Swords,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  User as UserIcon,
  Bot,
  Volume2,
  VolumeX,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

interface Puck {
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

const BOARD_SIZE = 540;
const POCKET_RADIUS = 28;
const PUCK_RADIUS = 13;
const STRIKER_RADIUS = 18;

const OPPONENTS = [
  { name: "Grandmaster Shakib", rating: "2150", avatar: "👨‍💼", winRate: "68%" },
  { name: "Pro Saimon", rating: "1980", avatar: "🧔", winRate: "62%" },
  { name: "Champion Tanvir", rating: "2280", avatar: "👑", winRate: "74%" },
  { name: "Rifat Strike", rating: "1850", avatar: "🎯", winRate: "58%" },
];

export default function CarromGame() {
  const { user, updateBalance, showNotification } = useUserStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Match State
  const [betAmount, setBetAmount] = useState<number>(1000);
  const [matchStatus, setMatchStatus] = useState<"IDLE" | "PLAYING" | "WON" | "LOST">("IDLE");
  const [turn, setTurn] = useState<"PLAYER" | "OPPONENT">("PLAYER");
  const [selectedOpponent, setSelectedOpponent] = useState(OPPONENTS[0]);

  // Scores / Puck counts
  const [playerPucksLeft, setPlayerPucksLeft] = useState<number>(6);
  const [opponentPucksLeft, setOpponentPucksLeft] = useState<number>(6);
  const [queenPotted, setQueenPotted] = useState<boolean>(false);

  // Striker baseline slider position
  const [strikerX, setStrikerX] = useState<number>(BOARD_SIZE / 2);

  // Swipe Aiming state
  const [isAiming, setIsAiming] = useState<boolean>(false);
  const [aimStart, setAimStart] = useState<{ x: number; y: number } | null>(null);
  const [aimCurrent, setAimCurrent] = useState<{ x: number; y: number } | null>(null);
  const [isStriking, setIsStriking] = useState<boolean>(false);
  const [turnMessage, setTurnMessage] = useState<string>("Your Turn! Drag back on striker to shoot");

  // Physics simulation refs
  const pucksRef = useRef<Puck[]>([]);
  const strikerRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    isMoving: boolean;
  }>({
    x: BOARD_SIZE / 2,
    y: BOARD_SIZE - 75,
    vx: 0,
    vy: 0,
    radius: STRIKER_RADIUS,
    isMoving: false,
  });

  const animationIdRef = useRef<number | null>(null);
  const isOpponentTurnRef = useRef<boolean>(false);

  // Initialize board with classic Carrom Disc Pool arrangement (6 White, 6 Black, 1 Red Queen)
  const setupBoard = () => {
    const cx = BOARD_SIZE / 2;
    const cy = BOARD_SIZE / 2;
    const pucks: Puck[] = [];

    // Red Queen in center
    pucks.push({
      id: 0,
      x: cx,
      y: cy,
      vx: 0,
      vy: 0,
      radius: PUCK_RADIUS,
      type: "QUEEN",
      color: "#E11D48",
      isPotted: false,
    });

    // 6 Alternating ring pucks
    const ringDist = PUCK_RADIUS * 2 + 1;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const type = i % 2 === 0 ? "WHITE" : "BLACK";
      pucks.push({
        id: i + 1,
        x: cx + Math.cos(angle) * ringDist,
        y: cy + Math.sin(angle) * ringDist,
        vx: 0,
        vy: 0,
        radius: PUCK_RADIUS,
        type,
        color: type === "WHITE" ? "#F5ECE1" : "#1E222B",
        isPotted: false,
      });
    }

    // 6 Outer ring pucks (alternating)
    const outerDist = ringDist * 1.9;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + Math.PI / 6;
      const type = i % 2 === 0 ? "BLACK" : "WHITE";
      pucks.push({
        id: i + 7,
        x: cx + Math.cos(angle) * outerDist,
        y: cy + Math.sin(angle) * outerDist,
        vx: 0,
        vy: 0,
        radius: PUCK_RADIUS,
        type,
        color: type === "WHITE" ? "#F5ECE1" : "#1E222B",
        isPotted: false,
      });
    }

    pucksRef.current = pucks;

    // Reset striker
    strikerRef.current = {
      x: BOARD_SIZE / 2,
      y: BOARD_SIZE - 75,
      vx: 0,
      vy: 0,
      radius: STRIKER_RADIUS,
      isMoving: false,
    };
    setStrikerX(BOARD_SIZE / 2);
    setPlayerPucksLeft(6);
    setOpponentPucksLeft(6);
    setQueenPotted(false);
    setIsStriking(false);
  };

  useEffect(() => {
    setupBoard();
  }, []);

  // Main 60fps Physics & Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;

    // Corner Pockets Coordinates
    const pockets = [
      { x: 38, y: 38 },
      { x: BOARD_SIZE - 38, y: 38 },
      { x: 38, y: BOARD_SIZE - 38 },
      { x: BOARD_SIZE - 38, y: BOARD_SIZE - 38 },
    ];

    const friction = 0.985;
    const bounce = 0.88;

    const loop = () => {
      if (!isRunning) return;

      const striker = strikerRef.current;
      const pucks = pucksRef.current;

      let anyMoving = false;

      // 1. UPDATE STRIKER PHYSICS
      if (striker.isMoving) {
        striker.x += striker.vx;
        striker.y += striker.vy;
        striker.vx *= friction;
        striker.vy *= friction;

        if (Math.hypot(striker.vx, striker.vy) < 0.12) {
          striker.vx = 0;
          striker.vy = 0;
          striker.isMoving = false;
        } else {
          anyMoving = true;
        }

        // Striker Cushion Collisions
        const minX = 36 + striker.radius;
        const maxX = BOARD_SIZE - 36 - striker.radius;
        const minY = 36 + striker.radius;
        const maxY = BOARD_SIZE - 36 - striker.radius;

        if (striker.x <= minX) {
          striker.x = minX;
          striker.vx = -striker.vx * bounce;
          sound.playCoinHit();
        } else if (striker.x >= maxX) {
          striker.x = maxX;
          striker.vx = -striker.vx * bounce;
          sound.playCoinHit();
        }

        if (striker.y <= minY) {
          striker.y = minY;
          striker.vy = -striker.vy * bounce;
          sound.playCoinHit();
        } else if (striker.y >= maxY) {
          striker.y = maxY;
          striker.vy = -striker.vy * bounce;
          sound.playCoinHit();
        }

        // Striker Pocket check
        pockets.forEach((p) => {
          if (Math.hypot(striker.x - p.x, striker.y - p.y) < POCKET_RADIUS - 6) {
            sound.playPocketSink();
            striker.vx = 0;
            striker.vy = 0;
            striker.isMoving = false;
          }
        });
      }

      // 2. UPDATE PUCKS PHYSICS
      pucks.forEach((puck) => {
        if (puck.isPotted) return;

        if (Math.hypot(puck.vx, puck.vy) > 0.12) {
          anyMoving = true;
          puck.x += puck.vx;
          puck.y += puck.vy;
          puck.vx *= friction;
          puck.vy *= friction;

          // Cushion bounds
          const minX = 36 + puck.radius;
          const maxX = BOARD_SIZE - 36 - puck.radius;
          const minY = 36 + puck.radius;
          const maxY = BOARD_SIZE - 36 - puck.radius;

          if (puck.x <= minX) {
            puck.x = minX;
            puck.vx = -puck.vx * bounce;
            sound.playCoinHit();
          } else if (puck.x >= maxX) {
            puck.x = maxX;
            puck.vx = -puck.vx * bounce;
            sound.playCoinHit();
          }

          if (puck.y <= minY) {
            puck.y = minY;
            puck.vy = -puck.vy * bounce;
            sound.playCoinHit();
          } else if (puck.y >= maxY) {
            puck.y = maxY;
            puck.vy = -puck.vy * bounce;
            sound.playCoinHit();
          }

          // Check Pocket Drop
          pockets.forEach((pkt) => {
            if (Math.hypot(puck.x - pkt.x, puck.y - pkt.y) < POCKET_RADIUS) {
              puck.isPotted = true;
              puck.vx = 0;
              puck.vy = 0;
              sound.playPocketSink();

              if (puck.type === "WHITE") {
                setPlayerPucksLeft((prev) => Math.max(0, prev - 1));
              } else if (puck.type === "BLACK") {
                setOpponentPucksLeft((prev) => Math.max(0, prev - 1));
              } else if (puck.type === "QUEEN") {
                setQueenPotted(true);
              }
            }
          });
        } else {
          puck.vx = 0;
          puck.vy = 0;
        }
      });

      // 3. STRIKER <-> PUCK COLLISIONS
      if (striker.isMoving) {
        pucks.forEach((puck) => {
          if (puck.isPotted) return;
          const dx = puck.x - striker.x;
          const dy = puck.y - striker.y;
          const dist = Math.hypot(dx, dy);
          const minDist = striker.radius + puck.radius;

          if (dist < minDist && dist > 0) {
            sound.playCoinHit();
            const nx = dx / dist;
            const ny = dy / dist;

            const kx = striker.vx - puck.vx;
            const ky = striker.vy - puck.vy;
            const p = (2 * (nx * kx + ny * ky)) / 1.6;

            striker.vx -= p * 0.45 * nx;
            striker.vy -= p * 0.45 * ny;
            puck.vx += p * 0.95 * nx;
            puck.vy += p * 0.95 * ny;

            const overlap = minDist - dist;
            puck.x += nx * overlap * 0.6;
            puck.y += ny * overlap * 0.6;
          }
        });
      }

      // 4. PUCK <-> PUCK COLLISIONS
      for (let i = 0; i < pucks.length; i++) {
        for (let j = i + 1; j < pucks.length; j++) {
          const p1 = pucks[i];
          const p2 = pucks[j];
          if (p1.isPotted || p2.isPotted) continue;

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = p1.radius + p2.radius;

          if (dist < minDist && dist > 0) {
            sound.playCoinHit();
            const nx = dx / dist;
            const ny = dy / dist;

            const kx = p1.vx - p2.vx;
            const ky = p1.vy - p2.vy;
            const p = (nx * kx + ny * ky);

            p1.vx -= p * nx * 0.95;
            p1.vy -= p * ny * 0.95;
            p2.vx += p * nx * 0.95;
            p2.vy += p * ny * 0.95;

            const overlap = minDist - dist;
            p1.x -= nx * overlap * 0.5;
            p1.y -= ny * overlap * 0.5;
            p2.x += nx * overlap * 0.5;
            p2.y += ny * overlap * 0.5;
          }
        }
      }

      // 5. Turn Complete Logic (when all motion halts)
      if (!anyMoving && isStriking) {
        setIsStriking(false);
        handleTurnSettled();
      }

      // 6. RENDER CARROM BOARD
      ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

      // Deep Wooden Outer Border (Frame with rounded corners)
      ctx.fillStyle = "#26130B";
      ctx.beginPath();
      ctx.roundRect(0, 0, BOARD_SIZE, BOARD_SIZE, 24);
      ctx.fill();

      // Yellow Rubber Cushion Corners (Just like in screenshot)
      const cornerSize = 48;
      ctx.fillStyle = "#F59E0B";
      // Top Left
      ctx.beginPath();
      ctx.arc(38, 38, cornerSize, Math.PI, Math.PI * 1.5);
      ctx.lineTo(38, 38);
      ctx.fill();
      // Top Right
      ctx.beginPath();
      ctx.arc(BOARD_SIZE - 38, 38, cornerSize, Math.PI * 1.5, 0);
      ctx.lineTo(BOARD_SIZE - 38, 38);
      ctx.fill();
      // Bottom Left
      ctx.beginPath();
      ctx.arc(38, BOARD_SIZE - 38, cornerSize, Math.PI * 0.5, Math.PI);
      ctx.lineTo(38, BOARD_SIZE - 38);
      ctx.fill();
      // Bottom Right
      ctx.beginPath();
      ctx.arc(BOARD_SIZE - 38, BOARD_SIZE - 38, cornerSize, 0, Math.PI * 0.5);
      ctx.lineTo(BOARD_SIZE - 38, BOARD_SIZE - 38);
      ctx.fill();

      // Board Surface (Polished Natural Birch Wood Veneer)
      const woodGrad = ctx.createRadialGradient(
        BOARD_SIZE / 2,
        BOARD_SIZE / 2,
        40,
        BOARD_SIZE / 2,
        BOARD_SIZE / 2,
        BOARD_SIZE / 1.4
      );
      woodGrad.addColorStop(0, "#E5BF8E");
      woodGrad.addColorStop(0.6, "#D4A972");
      woodGrad.addColorStop(1, "#BD8E57");

      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(28, 28, BOARD_SIZE - 56, BOARD_SIZE - 56, 16);
      ctx.fill();

      // Board Border Outline
      ctx.strokeStyle = "#8A4926";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Center Mandala / Rosette Pattern
      const cx = BOARD_SIZE / 2;
      const cy = BOARD_SIZE / 2;

      ctx.strokeStyle = "#A45934";
      ctx.lineWidth = 1.5;

      // Outer pattern circle
      ctx.beginPath();
      ctx.arc(cx, cy, 64, 0, Math.PI * 2);
      ctx.stroke();

      // Intricate Petals
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const px = cx + Math.cos(angle) * 38;
        const py = cy + Math.sin(angle) * 38;
        ctx.beginPath();
        ctx.arc(px, py, 26, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Center red circle
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fillStyle = "#A8321C";
      ctx.fill();
      ctx.stroke();

      // Baseline Lines & Yellow/Red Circles (Top & Bottom Baselines)
      const drawBaseline = (yPos: number) => {
        ctx.strokeStyle = "#9A522E";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(95, yPos);
        ctx.lineTo(BOARD_SIZE - 95, yPos);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(95, yPos - (yPos < BOARD_SIZE / 2 ? -16 : 16));
        ctx.lineTo(BOARD_SIZE - 95, yPos - (yPos < BOARD_SIZE / 2 ? -16 : 16));
        ctx.stroke();

        // Baseline Circles at Ends
        [95, BOARD_SIZE - 95].forEach((bx) => {
          ctx.beginPath();
          ctx.arc(bx, yPos - (yPos < BOARD_SIZE / 2 ? -8 : 8), 13, 0, Math.PI * 2);
          ctx.fillStyle = "#F59E0B";
          ctx.fill();
          ctx.strokeStyle = "#9A522E";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(bx, yPos - (yPos < BOARD_SIZE / 2 ? -8 : 8), 6, 0, Math.PI * 2);
          ctx.fillStyle = "#DC2626";
          ctx.fill();
        });
      };

      // Bottom Baseline (Player) & Top Baseline (Opponent)
      drawBaseline(BOARD_SIZE - 75);
      drawBaseline(75);

      // 4 Pockets (Black holes with shadow)
      pockets.forEach((p) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, POCKET_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#0A080C";
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      // 7. Draw Trajectory Aiming Line (when dragging to aim)
      if (isAiming && aimStart && aimCurrent && !isStriking) {
        const dx = aimStart.x - aimCurrent.x;
        const dy = aimStart.y - aimCurrent.y;
        const dragDist = Math.hypot(dx, dy);

        if (dragDist > 5) {
          const angle = Math.atan2(dy, dx);
          const powerPercent = Math.min(100, Math.round((dragDist / 120) * 100));

          // Draw Trajectory Guideline with dots
          const guideLen = Math.min(220, dragDist * 2.2);
          const dotsCount = 12;

          for (let i = 1; i <= dotsCount; i++) {
            const t = i / dotsCount;
            const dotX = striker.x + Math.cos(angle) * (guideLen * t);
            const dotY = striker.y + Math.sin(angle) * (guideLen * t);
            const dotRadius = 3.5 * (1 - t * 0.4);

            ctx.beginPath();
            ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = powerPercent > 70 ? "#EF4444" : powerPercent > 40 ? "#F59E0B" : "#10B981";
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 4;
            ctx.fill();
          }

          // Pullback line with power indicator
          ctx.strokeStyle = "rgba(255,255,255,0.4)";
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(striker.x, striker.y);
          ctx.lineTo(striker.x - Math.cos(angle) * (dragDist * 0.6), striker.y - Math.sin(angle) * (dragDist * 0.6));
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 8. Draw Pucks (Coins)
      pucks.forEach((puck) => {
        if (puck.isPotted) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(puck.x, puck.y, puck.radius, 0, Math.PI * 2);
        ctx.fillStyle = puck.color;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        ctx.fill();

        // Edge rim
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = puck.type === "WHITE" ? "#CDB296" : puck.type === "QUEEN" ? "#FFDE59" : "#0D1117";
        ctx.stroke();

        // Concentric inner grooves
        ctx.beginPath();
        ctx.arc(puck.x, puck.y, puck.radius * 0.55, 0, Math.PI * 2);
        ctx.strokeStyle = puck.type === "QUEEN" ? "#FCA5A5" : "rgba(255,255,255,0.15)";
        ctx.stroke();

        ctx.restore();
      });

      // 9. Draw Striker (Glossy Carrom Disc with Star Emblem)
      ctx.save();
      ctx.beginPath();
      ctx.arc(striker.x, striker.y, striker.radius, 0, Math.PI * 2);
      
      const strikerGrad = ctx.createRadialGradient(
        striker.x - 4,
        striker.y - 4,
        2,
        striker.x,
        striker.y,
        striker.radius
      );
      strikerGrad.addColorStop(0, "#FFFFFF");
      strikerGrad.addColorStop(0.7, "#BA2649");
      strikerGrad.addColorStop(1, "#731128");

      ctx.fillStyle = strikerGrad;
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#FFDE59";
      ctx.stroke();

      // Center Star on Striker
      ctx.beginPath();
      ctx.arc(striker.x, striker.y, striker.radius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#FFDE59";
      ctx.fill();

      ctx.fillStyle = "#731128";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("★", striker.x, striker.y + 0.5);

      ctx.restore();

      animationIdRef.current = requestAnimationFrame(loop);
    };

    animationIdRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [isAiming, aimStart, aimCurrent, isStriking]);

  // Turn settled logic
  const handleTurnSettled = () => {
    // Check Win/Loss conditions
    const whiteLeft = pucksRef.current.filter((p) => p.type === "WHITE" && !p.isPotted).length;
    const blackLeft = pucksRef.current.filter((p) => p.type === "BLACK" && !p.isPotted).length;

    setPlayerPucksLeft(whiteLeft);
    setOpponentPucksLeft(blackLeft);

    if (whiteLeft === 0) {
      handleMatchComplete("PLAYER");
      return;
    }

    if (blackLeft === 0) {
      handleMatchComplete("OPPONENT");
      return;
    }

    // Switch turns
    if (turn === "PLAYER") {
      setTurn("OPPONENT");
      setTurnMessage(`${selectedOpponent.name} is taking their shot...`);
      isOpponentTurnRef.current = true;

      // Position striker at top baseline for opponent
      strikerRef.current.y = 75;
      strikerRef.current.x = BOARD_SIZE / 2 + (Math.random() * 160 - 80);

      // Trigger AI Opponent Shot after 1.5s delay
      setTimeout(triggerOpponentShot, 1500);
    } else {
      setTurn("PLAYER");
      setTurnMessage("Your Turn! Drag back on striker to shoot");
      isOpponentTurnRef.current = false;

      // Position striker at bottom baseline for player
      strikerRef.current.y = BOARD_SIZE - 75;
      strikerRef.current.x = strikerX;
    }
  };

  // AI Opponent Shot Simulator
  const triggerOpponentShot = () => {
    if (matchStatus !== "PLAYING") return;

    // Find nearest active black puck or red queen
    const activeBlacks = pucksRef.current.filter((p) => (p.type === "BLACK" || p.type === "QUEEN") && !p.isPotted);
    if (activeBlacks.length === 0) return;

    const targetPuck = activeBlacks[Math.floor(Math.random() * activeBlacks.length)];
    const dx = targetPuck.x - strikerRef.current.x + (Math.random() * 14 - 7);
    const dy = targetPuck.y - strikerRef.current.y + (Math.random() * 14 - 7);
    const angle = Math.atan2(dy, dx);
    const speed = 12 + Math.random() * 8;

    sound.playStrikerFlick();
    strikerRef.current.vx = Math.cos(angle) * speed;
    strikerRef.current.vy = Math.sin(angle) * speed;
    strikerRef.current.isMoving = true;
    setIsStriking(true);
  };

  // Start 1v1 Disc Pool Match
  const handleStartMatch = () => {
    if (!user || user.balance < betAmount) {
      showNotification("Insufficient balance to enter match. Please deposit first.", "ERROR");
      return;
    }

    // Deduct entry bet amount
    sound.playBetPlaced();
    updateBalance(-betAmount);

    setupBoard();
    setMatchStatus("PLAYING");
    setTurn("PLAYER");
    setTurnMessage("Match Started! Your Turn — Drag to aim & release to strike!");
    showNotification(`৳${betAmount.toLocaleString()} 1v1 Match Started against ${selectedOpponent.name}! Prize Pool: ৳${(betAmount * 2).toLocaleString()}`, "INFO");
  };

  // Handle Match Win or Loss
  const handleMatchComplete = async (winner: "PLAYER" | "OPPONENT") => {
    const prizePot = betAmount * 2; // 2x bet (1000 -> 2000)

    if (winner === "PLAYER") {
      setMatchStatus("WON");
      sound.playWin();
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
      updateBalance(prizePot);
      showNotification(`🏆 YOU WON THE MATCH! Sunk all white pucks! Payout: ৳${prizePot.toLocaleString()} (2.0X)!`, "SUCCESS");

      try {
        await fetch("/api/casino/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            game: "CARROM",
            betAmount: betAmount,
            multiplier: 2.0,
            payout: prizePot,
            isWin: true,
            details: { winner: "PLAYER", opponent: selectedOpponent.name, prizePot },
          }),
        });
      } catch {
        // ignore
      }
    } else {
      setMatchStatus("LOST");
      showNotification(`Match Lost! ${selectedOpponent.name} pocketed their pucks first. Better luck next game!`, "ERROR");

      try {
        await fetch("/api/casino/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            game: "CARROM",
            betAmount: betAmount,
            multiplier: 0,
            payout: 0,
            isWin: false,
            details: { winner: "OPPONENT", opponent: selectedOpponent.name },
          }),
        });
      } catch {
        // ignore
      }
    }
  };

  // Mouse / Touch Event Handlers for Swipe & Aiming
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (matchStatus !== "PLAYING" || turn !== "PLAYER" || isStriking) return;
    const coords = getCanvasCoords(e);
    setIsAiming(true);
    setAimStart(coords);
    setAimCurrent(coords);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isAiming || isStriking) return;
    const coords = getCanvasCoords(e);
    setAimCurrent(coords);
  };

  const handlePointerUp = () => {
    if (!isAiming || !aimStart || !aimCurrent || isStriking) {
      setIsAiming(false);
      return;
    }

    const dx = aimStart.x - aimCurrent.x;
    const dy = aimStart.y - aimCurrent.y;
    const dragDist = Math.hypot(dx, dy);

    setIsAiming(false);

    // Minimum swipe threshold to shoot
    if (dragDist > 12) {
      const angle = Math.atan2(dy, dx);
      const power = Math.min(24, (dragDist / 120) * 22);

      sound.playStrikerFlick();
      strikerRef.current.vx = Math.cos(angle) * power;
      strikerRef.current.vy = Math.sin(angle) * power;
      strikerRef.current.isMoving = true;
      setIsStriking(true);
    }
  };

  // Slider change for baseline striker positioning
  const handleBaselinePositionChange = (val: number) => {
    setStrikerX(val);
    if (!isStriking && turn === "PLAYER") {
      strikerRef.current.x = val;
    }
  };

  const prizePool = betAmount * 2;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-[#2B0830] via-[#431346] to-[#1C0520] p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start select-none">
      <div className="w-full max-w-4xl space-y-5">
        {/* 1. SCREENSHOT MATCH HEADER (Player vs Opponent + Prize Pot in Center) */}
        <div className="relative bg-[#1A091D]/80 backdrop-blur-md border-2 border-[#BA2649]/40 rounded-3xl p-4 sm:p-5 shadow-2xl flex items-center justify-between">
          {/* Player (Left) */}
          <div className="flex items-center space-x-3">
            <div className={`relative p-1 rounded-2xl ${turn === "PLAYER" && matchStatus === "PLAYING" ? "ring-4 ring-[#FFDE59] animate-pulse" : "ring-2 ring-gray-600"}`}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#BA2649] to-[#871630] flex items-center justify-center text-xl font-black text-white shadow-lg">
                {user?.name ? user.name[0].toUpperCase() : "👤"}
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-[#10B981] text-[9px] font-black text-white rounded-full">
                YOU
              </span>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white truncate max-w-[110px] sm:max-w-[160px]">
                {user?.name || "Player"}
              </div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#F5ECE1] border border-gray-400 shadow-sm" />
                <span className="text-xs font-mono font-black text-[#FFDE59]">
                  {playerPucksLeft} Pucks
                </span>
              </div>
            </div>
          </div>

          {/* Central Prize Pot (Exact replica of top 1000/2000 coin in screenshot) */}
          <div className="flex flex-col items-center px-4 py-1.5 bg-[#2E0E34] border border-[#FFDE59]/30 rounded-2xl shadow-inner">
            <div className="flex items-center space-x-1 text-[#FFDE59]">
              <Sparkles className="w-3.5 h-3.5 fill-[#FFDE59]" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#FFDE59]">
                MATCH PRIZE POT
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black text-[#FFDE59] tracking-tight drop-shadow-md">
              ৳{prizePool.toLocaleString()}
            </div>
            <span className="text-[9px] font-bold text-gray-300 uppercase">
              Winner Takes 2.0x
            </span>
          </div>

          {/* Opponent (Right) */}
          <div className="flex items-center space-x-3 text-right">
            <div>
              <div className="text-xs sm:text-sm font-black text-white truncate max-w-[110px] sm:max-w-[160px]">
                {selectedOpponent.name}
              </div>
              <div className="flex items-center justify-end space-x-1.5 mt-0.5">
                <span className="text-xs font-mono font-black text-gray-300">
                  {opponentPucksLeft} Pucks
                </span>
                <div className="w-3.5 h-3.5 rounded-full bg-[#1E222B] border border-gray-600 shadow-sm" />
              </div>
            </div>
            <div className={`relative p-1 rounded-2xl ${turn === "OPPONENT" && matchStatus === "PLAYING" ? "ring-4 ring-red-500 animate-pulse" : "ring-2 ring-gray-600"}`}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#381523] to-[#180A12] flex items-center justify-center text-2xl shadow-lg">
                {selectedOpponent.avatar}
              </div>
              <span className="absolute -bottom-1 -left-1 px-1.5 py-0.2 bg-[#BA2649] text-[9px] font-black text-white rounded-full">
                {selectedOpponent.rating}
              </span>
            </div>
          </div>
        </div>

        {/* 2. MATCH ARENA & CANVAS */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Status Overlay Banner */}
          {matchStatus === "PLAYING" && (
            <div className="mb-2 px-4 py-1.5 rounded-full bg-[#1A091D]/90 border border-[#BA2649] text-xs font-bold text-[#FFDE59] shadow-lg flex items-center space-x-2 animate-bounce">
              <Zap className="w-3.5 h-3.5 text-[#FFDE59] fill-[#FFDE59]" />
              <span>{turnMessage}</span>
            </div>
          )}

          {/* Canvas Board Container */}
          <div className="relative rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-4 border-[#3D1D13] p-1 bg-[#1F0E08] overflow-hidden">
            <canvas
              ref={canvasRef}
              width={BOARD_SIZE}
              height={BOARD_SIZE}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              className="block cursor-grab active:cursor-grabbing max-w-full h-auto rounded-2xl"
              style={{ width: `${BOARD_SIZE}px`, height: `${BOARD_SIZE}px`, touchAction: "none" }}
            />

            {/* Victory / Defeat Modal Overlay */}
            {matchStatus === "WON" && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in zoom-in-90 duration-300">
                <div className="w-20 h-20 rounded-full bg-[#FFDE59]/20 border-2 border-[#FFDE59] flex items-center justify-center animate-bounce">
                  <Trophy className="w-10 h-10 text-[#FFDE59]" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[#FFDE59] uppercase tracking-wider">
                    VICTORY! YOU WON!
                  </h2>
                  <p className="text-sm text-gray-300 mt-1">
                    You cleared your pucks before {selectedOpponent.name}!
                  </p>
                </div>
                <div className="bg-[#2E0E34] border border-[#FFDE59]/40 px-6 py-3 rounded-2xl">
                  <span className="text-xs text-gray-400 block uppercase">Total Cash Won</span>
                  <span className="text-3xl font-mono font-black text-[#10B981]">
                    +৳{prizePool.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleStartMatch}
                  className="btn-burgundy px-10 py-3.5 text-sm uppercase tracking-wider font-black rounded-xl shadow-retro"
                >
                  PLAY AGAIN (৳{betAmount.toLocaleString()})
                </button>
              </div>
            )}

            {matchStatus === "LOST" && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in zoom-in-90 duration-300">
                <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center">
                  <RotateCcw className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-red-500 uppercase tracking-wider">
                    MATCH LOST
                  </h2>
                  <p className="text-xs text-gray-300 mt-1">
                    {selectedOpponent.name} pocketed all their black pucks first.
                  </p>
                </div>
                <button
                  onClick={handleStartMatch}
                  className="btn-burgundy px-10 py-3 text-sm uppercase tracking-wider font-black rounded-xl shadow-retro"
                >
                  REMATCH NOW
                </button>
              </div>
            )}
          </div>

          {/* 3. STRIKER BASELINE POSITION SLIDER (Screenshot Bottom Controls) */}
          {matchStatus === "PLAYING" && turn === "PLAYER" && (
            <div className="w-full max-w-[500px] mt-4 bg-[#1A091D]/90 border border-[#BA2649]/40 rounded-2xl p-3 flex items-center space-x-3 shadow-lg">
              <span className="text-[11px] font-black text-[#FFDE59] uppercase whitespace-nowrap">
                Position Striker:
              </span>
              <input
                type="range"
                min="115"
                max={BOARD_SIZE - 115}
                disabled={isStriking}
                value={strikerX}
                onChange={(e) => handleBaselinePositionChange(Number(e.target.value))}
                className="w-full accent-[#BA2649] cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-white whitespace-nowrap">
                {Math.round(strikerX)}px
              </span>
            </div>
          )}
        </div>

        {/* 4. BET SELECTION & MATCH SETUP CONSOLE (When IDLE or ready) */}
        {matchStatus === "IDLE" && (
          <div className="bg-[#1A091D]/90 border-2 border-[#BA2649]/40 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Swords className="w-5 h-5 text-[#FFDE59]" />
                <h3 className="text-base font-black text-white uppercase tracking-wider">
                  SELECT 1v1 MATCH STAKE
                </h3>
              </div>
              <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-full border border-[#10B981]/30">
                100% WINNER MULTIPLIER (2.0X POT)
              </span>
            </div>

            {/* Quick Stake Buttons */}
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[100, 500, 1000, 2500, 5000].map((amt) => {
                  const pot = amt * 2;
                  const isSelected = betAmount === amt;
                  return (
                    <button
                      key={amt}
                      onClick={() => {
                        setBetAmount(amt);
                        sound.playChipClick();
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? "border-[#FFDE59] bg-gradient-to-b from-[#BA2649] to-[#731128] text-white shadow-retro scale-105"
                          : "border-[#3D1D34] bg-[#220B27] text-gray-300 hover:border-[#BA2649]"
                      }`}
                    >
                      <span className="text-xs text-gray-300 font-medium">Bet</span>
                      <span className="text-base font-mono font-black text-white">
                        ৳{amt.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-black text-[#FFDE59] mt-0.5">
                        Win ৳{pot.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Opponent */}
            <div>
              <label className="text-xs text-gray-400 block mb-2 font-bold uppercase tracking-wider">
                Select Challenger:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {OPPONENTS.map((opp) => (
                  <div
                    key={opp.name}
                    onClick={() => {
                      setSelectedOpponent(opp);
                      sound.playChipClick();
                    }}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer transition flex items-center space-x-2 ${
                      selectedOpponent.name === opp.name
                        ? "border-[#FFDE59] bg-[#381523]"
                        : "border-[#3D1D34] bg-[#160619] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <span className="text-2xl">{opp.avatar}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{opp.name}</div>
                      <div className="text-[10px] text-[#FFDE59]">Rating {opp.rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Match Button */}
            <button
              onClick={handleStartMatch}
              className="w-full py-4 btn-burgundy text-base font-black uppercase tracking-wider rounded-2xl shadow-retro flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>START MATCH FOR ৳{betAmount.toLocaleString()} (WIN ৳{prizePool.toLocaleString()})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
