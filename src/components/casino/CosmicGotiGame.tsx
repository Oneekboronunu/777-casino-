"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  X,
  ArrowLeft,
  Smile,
  MessageCircle,
  Users,
  Bot,
} from "lucide-react";
import confetti from "canvas-confetti";
import sound from "@/lib/sound";
import { useUserStore } from "@/lib/store/useUserStore";

// ==========================================
// 1. BOARD TYPES & GRAPH DEFINITIONS
// ==========================================
export type Player = 1 | 2; // 1: Red (Top / Opponent), 2: Blue (Bottom / You)
export type BoardMode = "NEXUS_FORTS" | "CENTRAL_MATRIX";

export interface BoardNode {
  id: number;
  row: number;
  col: number;
  nx: number; // Normalized x [0, 1]
  ny: number; // Normalized y [0, 1]
  neighbors: number[];
}

export interface MoveStep {
  from: number;
  to: number;
  captured?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  alpha: number;
}

// Build 37-Node Traditional Board (Forts Layout matching Reference Picture 2)
function buildNexusFortsGraph(): BoardNode[] {
  const nodes: BoardNode[] = [];
  let id = 0;

  // Row 0: Top Apex (col 2)
  nodes.push({ id: id++, row: 0, col: 2, nx: 0.5, ny: 0.05, neighbors: [] });

  // Row 1: Top Fort Mid (cols 1, 2, 3)
  nodes.push({ id: id++, row: 1, col: 1, nx: 0.35, ny: 0.14, neighbors: [] });
  nodes.push({ id: id++, row: 1, col: 2, nx: 0.5, ny: 0.14, neighbors: [] });
  nodes.push({ id: id++, row: 1, col: 3, nx: 0.65, ny: 0.14, neighbors: [] });

  // Rows 2 to 6: 5x5 Central Matrix (cols 0 to 4)
  for (let r = 2; r <= 6; r++) {
    const ny = 0.23 + (r - 2) * 0.135;
    for (let c = 0; c <= 4; c++) {
      const nx = 0.16 + c * 0.17;
      nodes.push({ id: id++, row: r, col: c, nx, ny, neighbors: [] });
    }
  }

  // Row 7: Bottom Fort Mid (cols 1, 2, 3)
  nodes.push({ id: id++, row: 7, col: 1, nx: 0.35, ny: 0.86, neighbors: [] });
  nodes.push({ id: id++, row: 7, col: 2, nx: 0.5, ny: 0.86, neighbors: [] });
  nodes.push({ id: id++, row: 7, col: 3, nx: 0.65, ny: 0.86, neighbors: [] });

  // Row 8: Bottom Apex (col 2)
  nodes.push({ id: id++, row: 8, col: 2, nx: 0.5, ny: 0.95, neighbors: [] });

  const map: Record<string, number> = {};
  nodes.forEach((n) => {
    map[`${n.row},${n.col}`] = n.id;
  });

  const connect = (id1: number, id2: number) => {
    if (!nodes[id1].neighbors.includes(id2)) nodes[id1].neighbors.push(id2);
    if (!nodes[id2].neighbors.includes(id1)) nodes[id2].neighbors.push(id1);
  };

  // Connect Top Fort:
  connect(map["0,2"], map["1,1"]);
  connect(map["0,2"], map["1,2"]);
  connect(map["0,2"], map["1,3"]);

  connect(map["1,1"], map["1,2"]);
  connect(map["1,2"], map["1,3"]);

  connect(map["1,1"], map["2,0"]);
  connect(map["1,1"], map["2,1"]);
  connect(map["1,1"], map["2,2"]);
  connect(map["1,2"], map["2,2"]);
  connect(map["1,3"], map["2,2"]);
  connect(map["1,3"], map["2,3"]);
  connect(map["1,3"], map["2,4"]);

  // Connect 5x5 Central Matrix:
  for (let r = 2; r <= 6; r++) {
    for (let c = 0; c <= 4; c++) {
      const cur = map[`${r},${c}`];
      if (c < 4) connect(cur, map[`${r},${c + 1}`]);
      if (r < 6) connect(cur, map[`${r + 1},${c}`]);
      if ((r - 2 + c) % 2 === 0) {
        if (r < 6 && c < 4) connect(cur, map[`${r + 1},${c + 1}`]);
        if (r < 6 && c > 0) connect(cur, map[`${r + 1},${c - 1}`]);
      }
    }
  }

  // Connect Bottom Fort:
  connect(map["6,0"], map["7,1"]);
  connect(map["6,1"], map["7,1"]);
  connect(map["6,2"], map["7,1"]);
  connect(map["6,2"], map["7,2"]);
  connect(map["6,2"], map["7,3"]);
  connect(map["6,3"], map["7,3"]);
  connect(map["6,4"], map["7,3"]);

  connect(map["7,1"], map["7,2"]);
  connect(map["7,2"], map["7,3"]);

  connect(map["7,1"], map["8,2"]);
  connect(map["7,2"], map["8,2"]);
  connect(map["7,3"], map["8,2"]);

  return nodes;
}

// Build 25-Node Central Matrix Board (Picture 3 mode)
function buildCentralMatrixGraph(): BoardNode[] {
  const nodes: BoardNode[] = [];
  let id = 0;
  for (let r = 0; r < 5; r++) {
    const ny = 0.12 + r * 0.19;
    for (let c = 0; c < 5; c++) {
      const nx = 0.12 + c * 0.19;
      nodes.push({ id: id++, row: r, col: c, nx, ny, neighbors: [] });
    }
  }

  const map: Record<string, number> = {};
  nodes.forEach((n) => {
    map[`${n.row},${n.col}`] = n.id;
  });

  const connect = (id1: number, id2: number) => {
    if (!nodes[id1].neighbors.includes(id2)) nodes[id1].neighbors.push(id2);
    if (!nodes[id2].neighbors.includes(id1)) nodes[id2].neighbors.push(id1);
  };

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const cur = map[`${r},${c}`];
      if (c < 4) connect(cur, map[`${r},${c + 1}`]);
      if (r < 4) connect(cur, map[`${r + 1},${c}`]);
      if ((r + c) % 2 === 0) {
        if (r < 4 && c < 4) connect(cur, map[`${r + 1},${c + 1}`]);
        if (r < 4 && c > 0) connect(cur, map[`${r + 1},${c - 1}`]);
      }
    }
  }

  return nodes;
}

// Initial 12 vs 12 Beads setup
function getInitialBoardState(mode: BoardMode, nodes: BoardNode[]): (Player | null)[] {
  const state: (Player | null)[] = new Array(nodes.length).fill(null);

  if (mode === "NEXUS_FORTS") {
    nodes.forEach((n) => {
      // 12 Red Beads (Player 1) at top
      if (n.row === 0 || n.row === 1 || n.row === 2) {
        state[n.id] = 1;
      } else if (n.row === 3 && (n.col === 1 || n.col === 2 || n.col === 3)) {
        state[n.id] = 1;
      }
      // 12 Blue Beads (Player 2) at bottom
      else if (n.row === 8 || n.row === 7 || n.row === 6) {
        state[n.id] = 2;
      } else if (n.row === 5 && (n.col === 1 || n.col === 2 || n.col === 3)) {
        state[n.id] = 2;
      }
    });
  } else {
    // 25-Node Matrix: Top 2 rows + 2 middle = 12
    nodes.forEach((n) => {
      if (n.row === 0 || n.row === 1) {
        state[n.id] = 1;
      } else if (n.row === 2 && (n.col === 0 || n.col === 1)) {
        state[n.id] = 1;
      } else if (n.row === 2 && (n.col === 3 || n.col === 4)) {
        state[n.id] = 2;
      } else if (n.row === 3 || n.row === 4) {
        state[n.id] = 2;
      }
    });
  }

  return state;
}

// Quick Chat options matching Right-Side Picture (Panel 4)
const QUICK_CHATS = [
  "Hello!",
  "Good Luck",
  "Thank You!",
  "Bye",
  "So close",
  "Oops!",
  "Congratulations!",
  "Rematch?",
  "Faster please",
  "Well Played",
  "You Won",
  "Nice Move.",
];

// Quick Emojis matching Panel 4
const QUICK_EMOJIS = [
  "😂", "😭", "🤣", "😜",
  "🤭", "😘", "🤐", "🥳",
  "🤧", "😷", "😎", "🤠",
  "⏰", "🤕", "😴", "😱"
];

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function CosmicGotiGame() {
  const { user } = useUserStore();

  // Settings & Modes
  const [boardMode, setBoardMode] = useState<BoardMode>("NEXUS_FORTS");
  const [gameMode, setGameMode] = useState<"AI" | "PVP">("AI");

  // State
  const [nodes, setNodes] = useState<BoardNode[]>(() => buildNexusFortsGraph());
  const [board, setBoard] = useState<(Player | null)[]>(() =>
    getInitialBoardState("NEXUS_FORTS", buildNexusFortsGraph())
  );
  const [turn, setTurn] = useState<Player>(2); // Player 2 is "You" at bottom
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [validMoves, setValidMoves] = useState<MoveStep[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Scores (captured beads)
  const [p1Captured, setP1Captured] = useState(0); // By Opponent
  const [p2Captured, setP2Captured] = useState(0); // By You

  // Audio & Speech bubble
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [activeSpeech, setActiveSpeech] = useState<string>("Nice Move.");
  const [showQuickSheet, setShowQuickSheet] = useState(false);

  // Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Toggle Sound
  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  // Switch Board Mode
  const handleBoardModeChange = (mode: BoardMode) => {
    sound.playChipClick();
    setBoardMode(mode);
    const newNodes = mode === "NEXUS_FORTS" ? buildNexusFortsGraph() : buildCentralMatrixGraph();
    setNodes(newNodes);
    setBoard(getInitialBoardState(mode, newNodes));
    setSelectedNode(null);
    setValidMoves([]);
    setWinner(null);
    setP1Captured(0);
    setP2Captured(0);
    setTurn(2);
  };

  // Toggle Game Mode (Vs Computer AI or Pass & Play)
  const toggleGameMode = () => {
    sound.playChipClick();
    const next = gameMode === "AI" ? "PVP" : "AI";
    setGameMode(next);
    restartMatch();
  };

  // ==========================================
  // 3. MOVE COMPUTATION (Traditional Bead 12)
  // ==========================================
  const getMovesForNode = useCallback(
    (nodeId: number, currentBoard: (Player | null)[], currentPlayer: Player): MoveStep[] => {
      const moves: MoveStep[] = [];
      const node = nodes[nodeId];
      if (!node || currentBoard[nodeId] !== currentPlayer) return moves;

      // Regular 1-step slide along connecting line
      for (const nbrId of node.neighbors) {
        if (currentBoard[nbrId] === null) {
          moves.push({ from: nodeId, to: nbrId });
        }
      }

      // Traditional Capture Jump along connecting line
      for (const oppId of node.neighbors) {
        const occupant = currentBoard[oppId];
        if (occupant !== null && occupant !== currentPlayer) {
          const oppNode = nodes[oppId];
          const dRow = oppNode.row - node.row;
          const dCol = oppNode.col - node.col;

          for (const landingId of oppNode.neighbors) {
            const landingNode = nodes[landingId];
            if (
              landingNode.row - oppNode.row === dRow &&
              landingNode.col - oppNode.col === dCol &&
              currentBoard[landingId] === null
            ) {
              moves.push({ from: nodeId, to: landingId, captured: oppId });
            }
          }
        }
      }

      return moves;
    },
    [nodes]
  );

  const getAllPlayerMoves = useCallback(
    (currentPlayer: Player, currentBoard: (Player | null)[]): MoveStep[] => {
      let allMoves: MoveStep[] = [];
      currentBoard.forEach((p, idx) => {
        if (p === currentPlayer) {
          allMoves = allMoves.concat(getMovesForNode(idx, currentBoard, currentPlayer));
        }
      });
      return allMoves;
    },
    [getMovesForNode]
  );

  // Particle burst on capture
  const spawnParticles = (nx: number, ny: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const px = nx * canvas.width;
    const py = ny * canvas.height;

    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3.5;
      particlesRef.current.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2.5 + Math.random() * 2.5,
        life: 0,
        maxLife: 18 + Math.floor(Math.random() * 15),
        alpha: 1,
      });
    }
  };

  // Execute Move
  const executeMove = (step: MoveStep) => {
    const nextBoard = [...board];
    const player = turn;

    nextBoard[step.from] = null;
    nextBoard[step.to] = player;

    let wasCaptured = false;
    if (step.captured !== undefined) {
      wasCaptured = true;
      nextBoard[step.captured] = null;
      sound.playCosmicShatter();

      const capNode = nodes[step.captured];
      spawnParticles(capNode.nx, capNode.ny, player === 1 ? "#D32F2F" : "#1976D2");

      if (player === 2) {
        setP2Captured((s) => s + 1);
      } else {
        setP1Captured((s) => s + 1);
      }
    } else {
      sound.playCosmicSlide();
    }

    setBoard(nextBoard);
    setSelectedNode(null);
    setValidMoves([]);

    // Check Multi-Jump Chain
    if (wasCaptured) {
      const furtherCaptures = getMovesForNode(step.to, nextBoard, player).filter(
        (m) => m.captured !== undefined
      );
      if (furtherCaptures.length > 0) {
        setSelectedNode(step.to);
        setValidMoves(furtherCaptures);
        setActiveSpeech("Chain Jump! 💥");
        return;
      }
    }

    // Switch turn
    finalizeTurn(nextBoard, player);
  };

  const finalizeTurn = (currentBoard: (Player | null)[], justMovedPlayer: Player) => {
    const nextPlayer: Player = justMovedPlayer === 1 ? 2 : 1;

    // Victory check
    const p1Remaining = currentBoard.filter((p) => p === 1).length;
    const p2Remaining = currentBoard.filter((p) => p === 2).length;

    if (p1Remaining === 0) {
      handleGameOver(2);
      return;
    }
    if (p2Remaining === 0) {
      handleGameOver(1);
      return;
    }

    const nextMoves = getAllPlayerMoves(nextPlayer, currentBoard);
    if (nextMoves.length === 0) {
      handleGameOver(justMovedPlayer); // Opponent trapped
      return;
    }

    setTurn(nextPlayer);
  };

  const handleGameOver = (winPlayer: Player) => {
    setWinner(winPlayer);
    if (winPlayer === 2) {
      sound.playWin();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setActiveSpeech("You Won! 🎉");
    } else {
      sound.playLoss();
      setActiveSpeech("Well Played! 🤝");
    }
  };

  const restartMatch = () => {
    sound.playChipClick();
    const newNodes =
      boardMode === "NEXUS_FORTS" ? buildNexusFortsGraph() : buildCentralMatrixGraph();
    setNodes(newNodes);
    setBoard(getInitialBoardState(boardMode, newNodes));
    setSelectedNode(null);
    setValidMoves([]);
    setWinner(null);
    setP1Captured(0);
    setP2Captured(0);
    setTurn(2);
    setActiveSpeech("Good Luck!");
  };

  // Node Click Handler
  const handleNodeClick = (nodeId: number) => {
    if (winner) return;
    if (gameMode === "AI" && turn === 1) return; // Computer's turn

    // If destination clicked
    const move = validMoves.find((m) => m.to === nodeId);
    if (move) {
      executeMove(move);
      return;
    }

    // If clicking own piece
    if (board[nodeId] === turn) {
      sound.playChipClick();
      setSelectedNode(nodeId);
      const moves = getMovesForNode(nodeId, board, turn);
      setValidMoves(moves);
      return;
    }

    // Deselect if clicking elsewhere
    setSelectedNode(null);
    setValidMoves([]);
  };

  // Computer AI Turn Logic
  useEffect(() => {
    if (gameMode !== "AI" || turn !== 1 || winner) return;

    setIsAiThinking(true);
    const timer = setTimeout(() => {
      const allMoves = getAllPlayerMoves(1, board);
      if (allMoves.length === 0) {
        setIsAiThinking(false);
        handleGameOver(2);
        return;
      }

      // 1. Prioritize capturing moves
      const captureMoves = allMoves.filter((m) => m.captured !== undefined);
      let chosenMove: MoveStep;

      if (captureMoves.length > 0) {
        chosenMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
      } else {
        // 2. Prefer moves that advance toward opponent
        const forwardMoves = allMoves.filter((m) => {
          const fromNode = nodes[m.from];
          const toNode = nodes[m.to];
          return toNode.row > fromNode.row;
        });
        if (forwardMoves.length > 0 && Math.random() < 0.7) {
          chosenMove = forwardMoves[Math.floor(Math.random() * forwardMoves.length)];
        } else {
          chosenMove = allMoves[Math.floor(Math.random() * allMoves.length)];
        }
      }

      executeMove(chosenMove);
      setIsAiThinking(false);
    }, 550);

    return () => clearTimeout(timer);
  }, [turn, gameMode, winner, board, nodes, getAllPlayerMoves]);

  // ==========================================
  // 4. CANVAS RENDERING (100% Traditional Wood Style)
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.save();

      // 1. Draw Connecting Grid Lines (Deep crimson / maroon matching reference)
      ctx.strokeStyle = "rgba(139, 30, 30, 0.88)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      nodes.forEach((n) => {
        const x1 = n.nx * w;
        const y1 = n.ny * h;

        n.neighbors.forEach((nbrId) => {
          if (nbrId > n.id) {
            const nbr = nodes[nbrId];
            const x2 = nbr.nx * w;
            const y2 = nbr.ny * h;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        });
      });

      // 2. Nodes / Intersections (small maroon junction points)
      nodes.forEach((n) => {
        const px = n.nx * w;
        const py = n.ny * h;
        const isSelected = selectedNode === n.id;
        const isValidDest = validMoves.some((m) => m.to === n.id);

        ctx.beginPath();
        ctx.arc(px, py, isSelected ? 6 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isValidDest ? "#10B981" : isSelected ? "#FFDE59" : "#8B1E1E";
        ctx.fill();

        // Valid move destination ring
        if (isValidDest) {
          ctx.strokeStyle = "#10B981";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(px, py, 13 + Math.sin(Date.now() * 0.008) * 2.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // 3. Render 3D Spherical Beads (Red at top, Blue at bottom matching reference)
      const beadRadius = Math.min(w, h) * 0.046;

      nodes.forEach((n) => {
        const piece = board[n.id];
        if (!piece) return;

        const cx = n.nx * w;
        const cy = n.ny * h;
        const isSelected = selectedNode === n.id;

        // Drop Shadow
        ctx.beginPath();
        ctx.ellipse(cx, cy + 3.5, beadRadius * 0.9, beadRadius * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.fill();

        // Selection Ring
        if (isSelected) {
          ctx.strokeStyle = "#FFDE59";
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(cx, cy, beadRadius * 1.25, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Spherical 3D Bead Radial Gradient
        const grad = ctx.createRadialGradient(
          cx - beadRadius * 0.35,
          cy - beadRadius * 0.35,
          beadRadius * 0.1,
          cx,
          cy,
          beadRadius
        );

        if (piece === 1) {
          // RED BEAD (Top Player / AI - exact match to red bead in screenshot)
          grad.addColorStop(0, "#FF8A80");
          grad.addColorStop(0.3, "#E53935");
          grad.addColorStop(0.75, "#B71C1C");
          grad.addColorStop(1, "#5F0909");
        } else {
          // BLUE BEAD (Bottom Player / You - exact match to blue bead in screenshot)
          grad.addColorStop(0, "#90CAF9");
          grad.addColorStop(0.3, "#1E88E5");
          grad.addColorStop(0.75, "#0D47A1");
          grad.addColorStop(1, "#051E44");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, beadRadius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle specular rim highlight
        ctx.strokeStyle = piece === 1 ? "#FFCDD2" : "#BBDEFB";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, beadRadius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 4. Particles render
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [nodes, board, selectedNode, validMoves]);

  return (
    <div className="w-full h-[100dvh] max-h-screen overflow-hidden bg-[#D8A368] text-gray-900 flex flex-col items-center justify-between select-none relative font-sans">
      {/* ==========================================
          TOP BAR: OPPONENT CAPSULE & GAME CONTROLS (Reference Panel 2 Style)
          ========================================== */}
      <div className="w-full max-w-md px-3 pt-2 pb-1 flex items-center justify-between z-10">
        {/* Back Button (Circular white/cream button matching reference) */}
        <Link
          href="/"
          className="w-9 h-9 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition active:scale-95 border border-amber-900/20"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>

        {/* Center: Opponent Capsule (Top Player) */}
        <div className="flex items-center space-x-2 bg-[#F3D7B0]/95 border border-amber-900/30 px-3.5 py-1 rounded-full shadow-sm">
          {/* Avatar circle */}
          <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-red-500 flex items-center justify-center text-sm shadow">
            🥷
          </div>
          <div>
            <div className="text-[11px] font-black text-gray-900 leading-none">
              {gameMode === "AI" ? "Opponent" : "Player 1"}
            </div>
            <div className="text-[9px] text-gray-600 font-bold leading-tight">
              Points 14000
            </div>
          </div>
          <div className="border-l border-amber-900/20 pl-2">
            <span className="text-xs font-black text-red-700 font-mono">
              Score: {p1Captured}
            </span>
          </div>
        </div>

        {/* Right Controls: Restart & Sound */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={restartMatch}
            className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-700 shadow-sm flex items-center justify-center transition border border-amber-900/20"
            title="Restart Match"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleSound}
            className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-700 shadow-sm flex items-center justify-center transition border border-amber-900/20"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Mode Switches: Forts / Matrix & AI / Pass & Play */}
      <div className="flex items-center space-x-2 py-0.5">
        <button
          onClick={() => handleBoardModeChange("NEXUS_FORTS")}
          className={`px-3 py-1 rounded-full text-[11px] font-black transition ${
            boardMode === "NEXUS_FORTS"
              ? "bg-[#6E3C0F] text-amber-100 shadow"
              : "bg-white/70 text-[#6E3C0F] hover:bg-white"
          }`}
        >
          Forts (37 Nodes)
        </button>
        <button
          onClick={() => handleBoardModeChange("CENTRAL_MATRIX")}
          className={`px-3 py-1 rounded-full text-[11px] font-black transition ${
            boardMode === "CENTRAL_MATRIX"
              ? "bg-[#6E3C0F] text-amber-100 shadow"
              : "bg-white/70 text-[#6E3C0F] hover:bg-white"
          }`}
        >
          Matrix (25 Nodes)
        </button>
        <button
          onClick={toggleGameMode}
          className="px-2.5 py-1 rounded-full bg-white/70 hover:bg-white text-[#6E3C0F] text-[11px] font-black transition flex items-center space-x-1 shadow-sm"
          title="Switch AI / 2 Player"
        >
          {gameMode === "AI" ? (
            <>
              <Bot className="w-3.5 h-3.5 text-red-700" />
              <span>Vs AI</span>
            </>
          ) : (
            <>
              <Users className="w-3.5 h-3.5 text-blue-700" />
              <span>2P</span>
            </>
          )}
        </button>
      </div>

      {/* ==========================================
          CENTER STAGE: MOBILE ADAPTIVE 60FPS BOARD CANVAS
          ========================================== */}
      <div className="flex-1 w-full max-w-md flex items-center justify-center p-2 relative">
        <div className="relative w-full h-full max-h-[74vh] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#8C5824] flex items-center justify-center bg-[#D8A368]">
          <canvas
            ref={canvasRef}
            width={600}
            height={740}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = (e.clientX - rect.left) / rect.width;
              const clickY = (e.clientY - rect.top) / rect.height;

              let closest = -1;
              let minDist = 0.08;

              nodes.forEach((n) => {
                const dist = Math.hypot(n.nx - clickX, n.ny - clickY);
                if (dist < minDist) {
                  minDist = dist;
                  closest = n.id;
                }
              });

              if (closest !== -1) {
                handleNodeClick(closest);
              }
            }}
            className="w-full h-full object-contain cursor-pointer touch-none"
          />

          {/* AI Thinking Indicator */}
          {isAiThinking && (
            <div className="absolute top-3 bg-black/60 backdrop-blur-xs text-amber-200 text-[10px] font-bold px-3 py-1 rounded-full shadow animate-pulse">
              Opponent thinking...
            </div>
          )}

          {/* Victory Overlay */}
          {winner && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3 z-30 animate-in fade-in duration-300">
              <div className="text-4xl animate-bounce">
                {winner === 2 ? "👑" : "🏆"}
              </div>
              <h3 className="text-2xl font-black text-[#FFDE59] uppercase tracking-wider">
                {winner === 2 ? "YOU WON!" : "OPPONENT WON!"}
              </h3>
              <p className="text-xs text-gray-200">
                {winner === 2
                  ? "Brilliant match! All opponent beads conquered!"
                  : "Good match! Try a rematch to claim victory!"}
              </p>
              <button
                onClick={restartMatch}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition active:scale-95"
              >
                Rematch ➔
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          BOTTOM BAR: YOU PROFILE & CHAT TRIGGERS (Reference Panel 2, 3 Style)
          ========================================== */}
      <div className="w-full max-w-md px-4 pb-3 flex flex-col items-center space-y-1.5 z-10">
        {/* Active Speech / Reaction Bubble (Matching Reference Panel 3 "Nice Move.") */}
        {activeSpeech && (
          <div className="px-4 py-1 bg-white/95 border border-amber-900/30 rounded-full shadow-md text-xs font-bold text-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {activeSpeech}
          </div>
        )}

        {/* Bottom Profile Bar */}
        <div className="w-full flex items-center justify-between">
          {/* Left: Yellow Emoji Circle Button (Panel 2/3 style) */}
          <button
            onClick={() => {
              sound.playChipClick();
              setShowQuickSheet(true);
            }}
            className="w-10 h-10 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 shadow-md flex items-center justify-center transition active:scale-90 border-2 border-white"
            title="Emoji Reactions"
          >
            <Smile className="w-6 h-6 text-gray-800" />
          </button>

          {/* Center: You Capsule (Bottom Player) */}
          <div className="flex items-center space-x-2 bg-[#F3D7B0]/95 border border-amber-900/30 px-4 py-1.5 rounded-full shadow-md">
            {/* Avatar circle (Green leaf hero style from picture) */}
            <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-blue-600 flex items-center justify-center text-sm shadow text-white font-black">
              🦸
            </div>
            <div>
              <div className="text-[11px] font-black text-gray-900 leading-none">
                {user?.name || "You"}
              </div>
              <div className="text-[9px] text-gray-600 font-bold leading-tight">
                Points 17000
              </div>
            </div>
            <div className="border-l border-amber-900/20 pl-2">
              <span className="text-xs font-black text-blue-700 font-mono">
                Score: {p2Captured}
              </span>
            </div>
          </div>

          {/* Right: Blue Quick Chat Speech Bubble Button (Panel 2/3 style) */}
          <button
            onClick={() => {
              sound.playChipClick();
              setShowQuickSheet(true);
            }}
            className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 text-white shadow-md flex items-center justify-center transition active:scale-90 border-2 border-white"
            title="Quick Chat"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* ==========================================
          RIGHT SIDE PICTURE STYLE MODAL (Panel 4 Replica)
          ========================================== */}
      {showQuickSheet && (
        <div
          onClick={() => setShowQuickSheet(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xs bg-[#F9E9CE] border-4 border-[#C89456] rounded-3xl p-4 shadow-2xl text-gray-900 space-y-3 cursor-default"
          >
            {/* Red Circle Close Button (X) at Top-Right matching Panel 4 */}
            <button
              onClick={() => setShowQuickSheet(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg border-2 border-white transition active:scale-90"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>

            {/* 12 Quick Chat Buttons (3 columns x 4 rows) */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {QUICK_CHATS.map((phrase) => (
                <button
                  key={phrase}
                  onClick={() => {
                    sound.playChipClick();
                    setActiveSpeech(phrase);
                    setShowQuickSheet(false);
                    // AI reply reaction
                    if (gameMode === "AI" && Math.random() < 0.6) {
                      setTimeout(() => {
                        const aiReplies = ["Good Luck", "Nice Move.", "Thanks!", "😎", "Rematch?"];
                        setActiveSpeech(aiReplies[Math.floor(Math.random() * aiReplies.length)]);
                      }, 1200);
                    }
                  }}
                  className="py-2 px-1 rounded-xl bg-[#F4CA78] hover:bg-[#E8B85A] active:scale-95 text-[10px] font-black text-[#5B340B] shadow-sm transition text-center truncate border border-[#DBA441]"
                >
                  {phrase}
                </button>
              ))}
            </div>

            {/* Emojis Grid (4 columns x 4 rows matching Panel 4) */}
            <div className="border-t-2 border-[#D8A368]/40 pt-2">
              <div className="grid grid-cols-4 gap-2 text-2xl text-center">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      sound.playChipClick();
                      setActiveSpeech(emoji);
                      setShowQuickSheet(false);
                    }}
                    className="p-1 rounded-xl hover:bg-[#E8B85A]/50 transition active:scale-125"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}