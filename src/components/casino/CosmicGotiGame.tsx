"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  Shield,
  Trophy,
  Swords,
  Users,
  Bot,
  HelpCircle,
  MessageSquare,
  Smile,
  X,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import confetti from "canvas-confetti";
import sound from "@/lib/sound";
import { useUserStore } from "@/lib/store/useUserStore";
import CoinIcon from "@/components/common/CoinIcon";

// ==========================================
// 1. GAME DATA TYPES & GRAPH SPECIFICATIONS
// ==========================================

export type Player = 1 | 2; // 1: Solar Flare (Red/Gold), 2: Void Eclipse (Purple/Dark)
export type BoardMode = "NEXUS_FORTS" | "CENTRAL_MATRIX";
export type GodPower = "SLIPSTREAM" | "SINGULARITY_LEAP";

export interface BoardNode {
  id: number;
  row: number;
  col: number;
  nx: number; // Normalized x [0, 1]
  ny: number; // Normalized y [0, 1]
  neighbors: number[]; // Adjacency list
}

export interface MoveStep {
  from: number;
  to: number;
  captured?: number;
  isSlipstream?: boolean;
  isSingularityLeap?: boolean;
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

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  color: string;
}

// ==========================================
// 2. GRAPH BUILDER ALGORITHMS
// ==========================================

// Build 37-Node Traditional Board (Nexus Forts)
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

  // Helper map for (row, col) => id
  const map: Record<string, number> = {};
  nodes.forEach((n) => {
    map[`${n.row},${n.col}`] = n.id;
  });

  const connect = (id1: number, id2: number) => {
    if (!nodes[id1].neighbors.includes(id2)) nodes[id1].neighbors.push(id2);
    if (!nodes[id2].neighbors.includes(id1)) nodes[id2].neighbors.push(id1);
  };

  // Connect Top Fort:
  // Apex (0,2) to (1,1), (1,2), (1,3)
  connect(map["0,2"], map["1,1"]);
  connect(map["0,2"], map["1,2"]);
  connect(map["0,2"], map["1,3"]);

  // Mid row 1 connections
  connect(map["1,1"], map["1,2"]);
  connect(map["1,2"], map["1,3"]);

  // Mid row 1 to Row 2 base
  connect(map["1,1"], map["2,0"]);
  connect(map["1,1"], map["2,1"]);
  connect(map["1,1"], map["2,2"]);
  connect(map["1,2"], map["2,2"]);
  connect(map["1,3"], map["2,2"]);
  connect(map["1,3"], map["2,3"]);
  connect(map["1,3"], map["2,4"]);

  // Connect 5x5 Central Matrix (rows 2 to 6, cols 0 to 4)
  for (let r = 2; r <= 6; r++) {
    for (let c = 0; c <= 4; c++) {
      const cur = map[`${r},${c}`];
      // Horizontal right
      if (c < 4) connect(cur, map[`${r},${c + 1}`]);
      // Vertical down
      if (r < 6) connect(cur, map[`${r + 1},${c}`]);

      // Alquerque Diagonals (on alternating sum nodes)
      if ((r - 2 + c) % 2 === 0) {
        if (r < 6 && c < 4) connect(cur, map[`${r + 1},${c + 1}`]);
        if (r < 6 && c > 0) connect(cur, map[`${r + 1},${c - 1}`]);
      }
    }
  }

  // Connect Bottom Fort:
  // Row 6 base to Row 7 mid
  connect(map["6,0"], map["7,1"]);
  connect(map["6,1"], map["7,1"]);
  connect(map["6,2"], map["7,1"]);
  connect(map["6,2"], map["7,2"]);
  connect(map["6,2"], map["7,3"]);
  connect(map["6,3"], map["7,3"]);
  connect(map["6,4"], map["7,3"]);

  // Mid row 7 connections
  connect(map["7,1"], map["7,2"]);
  connect(map["7,2"], map["7,3"]);

  // Mid row 7 to Bottom Apex (8,2)
  connect(map["7,1"], map["8,2"]);
  connect(map["7,2"], map["8,2"]);
  connect(map["7,3"], map["8,2"]);

  return nodes;
}

// Build 25-Node Central Matrix Board
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

// Initial Piece Placement (12 Gotis each)
function getInitialBoardState(mode: BoardMode, nodes: BoardNode[]): (Player | null)[] {
  const state: (Player | null)[] = new Array(nodes.length).fill(null);

  if (mode === "NEXUS_FORTS") {
    // 12 Solar Flare (Player 1) on top fort and top rows
    nodes.forEach((n) => {
      if (n.row === 0 || n.row === 1 || n.row === 2) {
        state[n.id] = 1;
      } else if (n.row === 3 && (n.col === 1 || n.col === 2 || n.col === 3)) {
        state[n.id] = 1;
      }
    });

    // 12 Void Eclipse (Player 2) on bottom fort and bottom rows
    nodes.forEach((n) => {
      if (n.row === 8 || n.row === 7 || n.row === 6) {
        state[n.id] = 2;
      } else if (n.row === 5 && (n.col === 1 || n.col === 2 || n.col === 3)) {
        state[n.id] = 2;
      }
    });
  } else {
    // 25-Node Matrix: Top 2 rows + 2 on middle row = 12
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

// ==========================================
// 3. SARCASTIC AI COMMENTATOR PHRASES
// ==========================================
const COMMENTARY_POOL = {
  start: [
    "Welcome to the Cosmic Nexus! Let the battle begin! 🤜🤛",
    "Solar Flare vs Void Eclipse: the universe trembles! 🌌",
    "May the laws of gravity have mercy on your pieces! 🪐",
  ],
  slide: [
    "A calculated slide... 🧠 Safe, but for how long?",
    "Advancing through the starfield. Steady positioning. 🛰️",
    "Creeping into enemy territory. Tension builds! 🛸",
    "Quiet maneuver. Setting a cosmic trap? ♟️",
  ],
  capture: [
    "BOOM! Shattered into cosmic dust! ☄️💥 Someone check shields!",
    "Obliterated! A soul swallowed by the celestial abyss! 💀🔥",
    "VAPORIZED! Stardust particles scattered across lightyears! ✨⚡",
    "Direct supernova strike! That goti is never coming back! 💥🪐",
  ],
  multiCapture: [
    "DOUBLE SUPERNOVA! 🔥 Two pieces banished in one sweep!",
    "CHAIN REACTION! Hyperspace hopping like a cosmic god! ⚡🚀",
    "MASS EXTINCTION EVENT! The board is in shambles! 🌌💥",
  ],
  godMode: [
    "🚨 WARNING: ANTI-GRAVITY GOD MODE DETECTED! 🚨 Gravity is a lie! 🛸👑",
    "⚡ MAXIMUM COSMIC OVERLOAD! Zero-G Physics Activated! 🌀✨",
    "👑 THE DEITY AWAKENS! Dimensional warp rules are now in effect! 🌌",
  ],
  slipstream: [
    "Slipstream engaged! Gliding through double hyperspace! ☄️💨",
    "Two spaces in one breath! Physics just ragequit! 🛸⚡",
  ],
  singularity: [
    "SINGULARITY LEAP! Curving around corners like a black hole! 🌀🔮",
    "Spacetime bent! A non-linear capture from another dimension! 🌌🪐",
  ],
  blunder: [
    "Oof... absolute zero brainpower on that move. 🧊💀 Watch flanks!",
    "A catastrophic miscalculation. The galaxy winces! 🤦‍♂️☄️",
    "Did you just gift-wrap that goti for the enemy? 🎁💀",
  ],
  victoryP1: [
    "GAME OVER! 👑 Cosmic dominance achieved! Solar Flare reigns supreme! ☀️🏆",
    "The cosmos shines blinding gold! Player 1 ascends as the True Deity! 🌟🎉",
  ],
  victoryP2: [
    "GAME OVER! 👑 The Void has consumed all light! Void Eclipse wins! 🔮🏆",
    "Eternal darkness conquers the nexus! Absolute cosmic supremacy! 🌌🖤",
  ],
};

const QUICK_CHATS = [
  "Nice Move. 👏",
  "Well Played! 👑",
  "Oops! 😅",
  "So close! 😱",
  "Good Luck! 🍀",
  "Rematch? ⚔️",
  "Faster please ⚡",
  "Thank You! ✨",
  "You Won! 🏆",
  "Bye! 🚀",
];

const QUICK_EMOJIS = ["😂", "🔥", "👑", "😱", "😎", "🥳", "💀", "🛸", "🌀", "🪐", "⚡", "😴"];

// ==========================================
// 4. MAIN REACT COMPONENT
// ==========================================

export default function CosmicGotiGame() {
  const { user, updateBalance, showNotification } = useUserStore();

  // Mode and Configuration
  const [boardMode, setBoardMode] = useState<BoardMode>("NEXUS_FORTS");
  const [gameMode, setGameMode] = useState<"AI" | "PVP">("AI");
  const [aiDifficulty, setAiDifficulty] = useState<"EASY" | "MEDIUM" | "GOD">("MEDIUM");

  // Betting System
  const [betAmount, setBetAmount] = useState<number>(0);
  const [betPlaced, setBetPlaced] = useState<boolean>(false);

  // Graph and Board State
  const [nodes, setNodes] = useState<BoardNode[]>(() => buildNexusFortsGraph());
  const [board, setBoard] = useState<(Player | null)[]>(() =>
    getInitialBoardState("NEXUS_FORTS", buildNexusFortsGraph())
  );

  // Turn and Selection State
  const [turn, setTurn] = useState<Player>(1);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [validMoves, setValidMoves] = useState<MoveStep[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Chain-Capture continuation state
  const [chainActiveFrom, setChainActiveFrom] = useState<number | null>(null);

  // Anti-Gravity God Mode State
  const [p1Streak, setP1Streak] = useState(0);
  const [p2Streak, setP2Streak] = useState(0);
  const [isGodMode, setIsGodMode] = useState(false);
  const [godModePlayer, setGodModePlayer] = useState<Player | null>(null);
  const [godPower, setGodPower] = useState<GodPower>("SLIPSTREAM");
  const [godTurnsLeft, setGodTurnsLeft] = useState(0);

  // Audio and Visuals
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [commentary, setCommentary] = useState(
    "Welcome to the Cosmic Nexus! Let the battle begin! 🤜🤛"
  );
  const [chatBubble, setChatBubble] = useState<{ player: Player; text: string } | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Canvas references
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const trailsRef = useRef<TrailPoint[]>([]);

  // Piece animation positions (for buttery 60fps Lerp)
  const piecePositionsRef = useRef<{ id: number; cx: number; cy: number; z: number }[]>([]);
  const screenShakeRef = useRef<{ x: number; y: number; trauma: number }>({ x: 0, y: 0, trauma: 0 });

  // Score count
  const p1Count = board.filter((p) => p === 1).length;
  const p2Count = board.filter((p) => p === 2).length;

  // Sync Graph on BoardMode switch
  const handleBoardModeChange = (mode: BoardMode) => {
    sound.playChipClick();
    setBoardMode(mode);
    const newNodes = mode === "NEXUS_FORTS" ? buildNexusFortsGraph() : buildCentralMatrixGraph();
    setNodes(newNodes);
    setBoard(getInitialBoardState(mode, newNodes));
    setSelectedNode(null);
    setValidMoves([]);
    setWinner(null);
    setChainActiveFrom(null);
    setIsGodMode(false);
    setP1Streak(0);
    setP2Streak(0);
    setCommentary(
      mode === "NEXUS_FORTS"
        ? "Celestial Nexus Forts calibrated. Dual stargates online!"
        : "Central 5x5 Matrix locked. Pure tactical Alquerque!"
    );
  };

  // Sound toggle
  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  // ==========================================
  // 5. VALID MOVE COMPUTATION ENGINE
  // ==========================================
  const getMovesForNode = useCallback(
    (
      nodeId: number,
      currentBoard: (Player | null)[],
      currentPlayer: Player,
      godActive: boolean,
      power: GodPower
    ): MoveStep[] => {
      const moves: MoveStep[] = [];
      const node = nodes[nodeId];
      if (!node || currentBoard[nodeId] !== currentPlayer) return moves;

      // 1. Regular 1-step slide
      for (const nbrId of node.neighbors) {
        if (currentBoard[nbrId] === null) {
          moves.push({ from: nodeId, to: nbrId });
        }
      }

      // 2. God Move: The Cosmic Slipstream (Slide 2 spaces in a straight line)
      if (godActive && power === "SLIPSTREAM") {
        for (const nbrId of node.neighbors) {
          if (currentBoard[nbrId] === null) {
            const nbrNode = nodes[nbrId];
            const dRow = nbrNode.row - node.row;
            const dCol = nbrNode.col - node.col;

            // Find continuation node
            for (const secondNbrId of nbrNode.neighbors) {
              const secondNode = nodes[secondNbrId];
              if (
                secondNode.row - nbrNode.row === dRow &&
                secondNode.col - nbrNode.col === dCol &&
                currentBoard[secondNbrId] === null
              ) {
                moves.push({ from: nodeId, to: secondNbrId, isSlipstream: true });
              }
            }
          }
        }
      }

      // 3. Traditional Capture Jump (Hop over opponent to empty space in straight line)
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

      // 4. God Move: The Singularity Leap (Curved/Corner capture around any neighbor)
      if (godActive && power === "SINGULARITY_LEAP") {
        for (const oppId of node.neighbors) {
          const occupant = currentBoard[oppId];
          if (occupant !== null && occupant !== currentPlayer) {
            const oppNode = nodes[oppId];
            for (const landingId of oppNode.neighbors) {
              if (landingId !== nodeId && currentBoard[landingId] === null) {
                // If not already covered as straight capture
                const alreadyExists = moves.some(
                  (m) => m.from === nodeId && m.to === landingId && m.captured === oppId
                );
                if (!alreadyExists) {
                  moves.push({
                    from: nodeId,
                    to: landingId,
                    captured: oppId,
                    isSingularityLeap: true,
                  });
                }
              }
            }
          }
        }
      }

      return moves;
    },
    [nodes]
  );

  // Compute all available moves for a player
  const getAllPlayerMoves = useCallback(
    (
      currentPlayer: Player,
      currentBoard: (Player | null)[],
      godActive: boolean,
      power: GodPower
    ): MoveStep[] => {
      let allMoves: MoveStep[] = [];
      currentBoard.forEach((p, idx) => {
        if (p === currentPlayer) {
          const m = getMovesForNode(idx, currentBoard, currentPlayer, godActive, power);
          allMoves = allMoves.concat(m);
        }
      });
      return allMoves;
    },
    [getMovesForNode]
  );

  // Spawn visual particle supernova
  const spawnSupernova = (nx: number, ny: number, color: string, count = 35) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const px = nx * canvas.width;
    const py = ny * canvas.height;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5.5;
      particlesRef.current.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2 + Math.random() * 4,
        life: 0,
        maxLife: 25 + Math.floor(Math.random() * 25),
        alpha: 1,
      });
    }

    // Screenshake
    screenShakeRef.current.trauma = Math.min(screenShakeRef.current.trauma + 14, 25);
  };

  // ==========================================
  // 6. MOVE EXECUTION ENGINE
  // ==========================================
  const executeMove = (step: MoveStep) => {
    const nextBoard = [...board];
    const player = turn;

    // Move piece
    nextBoard[step.from] = null;
    nextBoard[step.to] = player;

    // Check capture
    let wasCaptured = false;
    if (step.captured !== undefined) {
      wasCaptured = true;
      nextBoard[step.captured] = null;
      sound.playCosmicShatter();

      const capNode = nodes[step.captured];
      spawnSupernova(capNode.nx, capNode.ny, player === 1 ? "#FF6B00" : "#A855F7", 45);

      // Increment streaks
      if (player === 1) {
        setP1Streak((s) => Math.min(s + 35, 100));
      } else {
        setP2Streak((s) => Math.min(s + 35, 100));
      }
    } else {
      sound.playCosmicSlide();
    }

    setBoard(nextBoard);
    setSelectedNode(null);
    setValidMoves([]);

    // Commentary Reaction
    if (step.isSingularityLeap) {
      setCommentary(
        COMMENTARY_POOL.singularity[
          Math.floor(Math.random() * COMMENTARY_POOL.singularity.length)
        ]
      );
    } else if (step.isSlipstream) {
      setCommentary(
        COMMENTARY_POOL.slipstream[Math.floor(Math.random() * COMMENTARY_POOL.slipstream.length)]
      );
    } else if (wasCaptured) {
      setCommentary(
        COMMENTARY_POOL.capture[Math.floor(Math.random() * COMMENTARY_POOL.capture.length)]
      );
    } else {
      setCommentary(
        COMMENTARY_POOL.slide[Math.floor(Math.random() * COMMENTARY_POOL.slide.length)]
      );
    }

    // Check Multi-Jump Chain
    if (wasCaptured) {
      const furtherCaptures = getMovesForNode(
        step.to,
        nextBoard,
        player,
        isGodMode,
        godPower
      ).filter((m) => m.captured !== undefined);

      if (furtherCaptures.length > 0) {
        setChainActiveFrom(step.to);
        setSelectedNode(step.to);
        setValidMoves(furtherCaptures);
        setCommentary(
          COMMENTARY_POOL.multiCapture[
            Math.floor(Math.random() * COMMENTARY_POOL.multiCapture.length)
          ]
        );
        return; // Turn continues for player
      }
    }

    setChainActiveFrom(null);

    // End Turn -> Switch to other player
    finalizeTurn(nextBoard, player);
  };

  const finalizeTurn = (currentBoard: (Player | null)[], justMovedPlayer: Player) => {
    const nextPlayer: Player = justMovedPlayer === 1 ? 2 : 1;

    // Check Victory
    const p1Left = currentBoard.filter((p) => p === 1).length;
    const p2Left = currentBoard.filter((p) => p === 2).length;

    if (p2Left === 0) {
      handleGameOver(1);
      return;
    }
    if (p1Left === 0) {
      handleGameOver(2);
      return;
    }

    // Check if next player has any legal moves
    const nextMoves = getAllPlayerMoves(nextPlayer, currentBoard, isGodMode, godPower);
    if (nextMoves.length === 0) {
      handleGameOver(justMovedPlayer); // Opponent is completely trapped!
      return;
    }

    // Update God Mode turns countdown
    if (isGodMode && godModePlayer === justMovedPlayer) {
      if (godTurnsLeft <= 1) {
        setIsGodMode(false);
        setGodModePlayer(null);
        setCommentary("Dimensional equilibrium restored. Standard cosmic gravity returns.");
      } else {
        setGodTurnsLeft((t) => t - 1);
      }
    }

    setTurn(nextPlayer);
  };

  // Trigger Anti-Gravity God Mode
  const triggerGodMode = (player: Player) => {
    sound.playGodMode();
    setIsGodMode(true);
    setGodModePlayer(player);
    setGodTurnsLeft(3);
    screenShakeRef.current.trauma = 25;

    // Supernova burst from center
    spawnSupernova(0.5, 0.5, player === 1 ? "#FFA500" : "#9333EA", 70);

    setCommentary(
      COMMENTARY_POOL.godMode[Math.floor(Math.random() * COMMENTARY_POOL.godMode.length)]
    );
  };

  // Check streaks for auto God Mode trigger
  useEffect(() => {
    if (!isGodMode) {
      if (p1Streak >= 100) {
        triggerGodMode(1);
        setP1Streak(0);
      } else if (p2Streak >= 100) {
        triggerGodMode(2);
        setP2Streak(0);
      }
    }
  }, [p1Streak, p2Streak, isGodMode]);

  // Handle Game Over
  const handleGameOver = (winningPlayer: Player) => {
    setWinner(winningPlayer);
    sound.playWin();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: winningPlayer === 1 ? ["#FFD700", "#FF4500", "#FF8C00"] : ["#9333EA", "#C084FC", "#3B82F6"],
    });

    if (winningPlayer === 1) {
      setCommentary(
        COMMENTARY_POOL.victoryP1[
          Math.floor(Math.random() * COMMENTARY_POOL.victoryP1.length)
        ]
      );
      if (betPlaced && betAmount > 0) {
        const winReward = Math.round(betAmount * 1.95);
        updateBalance(winReward);
        showNotification(`🎉 You won ৳${winReward.toLocaleString()} against the Cosmic Deity!`, "SUCCESS");
      }
    } else {
      setCommentary(
        COMMENTARY_POOL.victoryP2[
          Math.floor(Math.random() * COMMENTARY_POOL.victoryP2.length)
        ]
      );
      if (betPlaced && betAmount > 0) {
        showNotification("Cosmic Defeat! Try another strategy against the Void Deity.", "ERROR");
      }
    }
  };

  // ==========================================
  // 7. COSMIC AI OPPONENT (MINIMAX ENGINE)
  // ==========================================
  useEffect(() => {
    if (gameMode === "AI" && turn === 2 && !winner && !isAiThinking) {
      setIsAiThinking(true);

      const aiTimer = setTimeout(() => {
        // Collect all moves for AI (Player 2)
        let moves: MoveStep[] = [];
        if (chainActiveFrom !== null) {
          moves = getMovesForNode(chainActiveFrom, board, 2, isGodMode, godPower).filter(
            (m) => m.captured !== undefined
          );
        } else {
          moves = getAllPlayerMoves(2, board, isGodMode, godPower);
        }

        if (moves.length === 0) {
          setIsAiThinking(false);
          handleGameOver(1); // AI has no moves, player 1 wins!
          return;
        }

        // Heuristic AI Evaluation:
        // Priority 1: Multi-captures & Captures (highest value)
        // Priority 2: Singularity Leaps & Slipstreams
        // Priority 3: Advancing towards center / safe nodes
        moves.sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;

          if (a.captured !== undefined) scoreA += 50;
          if (b.captured !== undefined) scoreB += 50;

          if (a.isSingularityLeap) scoreA += 30;
          if (b.isSingularityLeap) scoreB += 30;

          if (a.isSlipstream) scoreA += 15;
          if (b.isSlipstream) scoreB += 15;

          // Centrality
          const nodeA = nodes[a.to];
          const nodeB = nodes[b.to];
          scoreA -= Math.abs(nodeA.nx - 0.5) * 10 + Math.abs(nodeA.ny - 0.5) * 10;
          scoreB -= Math.abs(nodeB.nx - 0.5) * 10 + Math.abs(nodeB.ny - 0.5) * 10;

          if (aiDifficulty === "EASY") {
            return Math.random() - 0.5; // Random blunder
          }

          return scoreB - scoreA;
        });

        const chosenMove = moves[0];
        executeMove(chosenMove);
        setIsAiThinking(false);
      }, 750);

      return () => clearTimeout(aiTimer);
    }
  }, [turn, gameMode, winner, board, isAiThinking, chainActiveFrom, isGodMode, godPower]);

  // Handle Board Click Interaction
  const handleNodeClick = (nodeId: number) => {
    if (winner || (gameMode === "AI" && turn === 2)) return;

    const occupant = board[nodeId];

    // If a chain jump is active, player can ONLY move that piece to complete further captures
    if (chainActiveFrom !== null) {
      const match = validMoves.find((m) => m.to === nodeId);
      if (match) {
        executeMove(match);
      } else {
        // Conclude chain jump if player clicks elsewhere
        setChainActiveFrom(null);
        finalizeTurn(board, turn);
      }
      return;
    }

    // Select piece
    if (occupant === turn) {
      sound.playChipClick();
      setSelectedNode(nodeId);
      const moves = getMovesForNode(nodeId, board, turn, isGodMode, godPower);
      setValidMoves(moves);
      return;
    }

    // If already selected, check if clicking valid destination
    if (selectedNode !== null) {
      const matchedMove = validMoves.find((m) => m.to === nodeId);
      if (matchedMove) {
        executeMove(matchedMove);
      } else {
        setSelectedNode(null);
        setValidMoves([]);
      }
    }
  };

  // Restart Match
  const restartMatch = () => {
    sound.playChipClick();
    const newBoard = getInitialBoardState(boardMode, nodes);
    setBoard(newBoard);
    setTurn(1);
    setSelectedNode(null);
    setValidMoves([]);
    setWinner(null);
    setChainActiveFrom(null);
    setIsGodMode(false);
    setGodModePlayer(null);
    setP1Streak(0);
    setP2Streak(0);
    setBetPlaced(false);
    setCommentary("Game reset. The stars realign for a new cosmic conflict! 🌌");
  };

  // Place Bet
  const handlePlaceBet = (amount: number) => {
    if (!user || user.balance < amount) {
      showNotification("Insufficient balance for this cosmic wager!", "ERROR");
      return;
    }
    sound.playBetPlaced();
    updateBalance(-amount);
    setBetAmount(amount);
    setBetPlaced(true);
    showNotification(`৳${amount.toLocaleString()} wager locked! Win 1.95x on cosmic victory!`, "SUCCESS");
  };

  // ==========================================
  // 8. HIGH-PERFORMANCE 60FPS CANVAS RENDERER
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let starRotation = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Handle Screen Shake Decay
      const shake = screenShakeRef.current;
      shake.trauma = Math.max(0, shake.trauma * 0.92 - 0.05);
      const currentShakeX = (Math.random() * 2 - 1) * shake.trauma;
      const currentShakeY = (Math.random() * 2 - 1) * shake.trauma;

      ctx.save();
      ctx.clearRect(0, 0, w, h);
      ctx.translate(currentShakeX, currentShakeY);

      // 1. Deep Space Nebula & Swirling Starfield Background
      starRotation += 0.0008;
      const bgGrad = ctx.createRadialGradient(
        w / 2 + Math.cos(starRotation) * 40,
        h / 2 + Math.sin(starRotation) * 40,
        20,
        w / 2,
        h / 2,
        w * 0.75
      );

      if (isGodMode) {
        // God Mode intense cosmic nebula colors
        bgGrad.addColorStop(0, "#2D0A35");
        bgGrad.addColorStop(0.35, "#180628");
        bgGrad.addColorStop(0.7, "#0D041A");
        bgGrad.addColorStop(1, "#05010A");
      } else {
        // Standard Deep Space Nebula
        bgGrad.addColorStop(0, "#160C1D");
        bgGrad.addColorStop(0.4, "#0C0714");
        bgGrad.addColorStop(0.75, "#07040D");
        bgGrad.addColorStop(1, "#030206");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Starfield dust particles
      ctx.fillStyle = isGodMode ? "rgba(235, 180, 255, 0.45)" : "rgba(255, 230, 180, 0.35)";
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 1234 + starRotation * 300) % w);
        const sy = ((i * 5678 + starRotation * 150) % h);
        const sSize = (i % 3) + 0.8;
        ctx.beginPath();
        ctx.arc(sx, sy, sSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. 3D Perspective Pitch in Anti-Gravity God Mode
      const tiltScaleY = isGodMode ? 0.94 : 1.0;
      const offsetY = isGodMode ? h * 0.03 : 0;
      ctx.save();
      ctx.translate(w / 2, h / 2 + offsetY);
      ctx.scale(1.0, tiltScaleY);
      ctx.translate(-w / 2, -h / 2);

      // 3. Holographic Grid Lines
      ctx.lineWidth = isGodMode ? 2.5 : 1.8;
      nodes.forEach((n) => {
        const x1 = n.nx * w;
        const y1 = n.ny * h;

        n.neighbors.forEach((nbrId) => {
          if (nbrId > n.id) {
            // Draw each line segment once
            const nbr = nodes[nbrId];
            const x2 = nbr.nx * w;
            const y2 = nbr.ny * h;

            const lineGrad = ctx.createLinearGradient(x1, y1, x2, y2);
            if (isGodMode) {
              lineGrad.addColorStop(0, "rgba(236, 72, 153, 0.65)");
              lineGrad.addColorStop(0.5, "rgba(255, 222, 89, 0.8)");
              lineGrad.addColorStop(1, "rgba(168, 85, 247, 0.65)");
            } else {
              lineGrad.addColorStop(0, "rgba(212, 175, 55, 0.4)");
              lineGrad.addColorStop(0.5, "rgba(13, 148, 136, 0.5)");
              lineGrad.addColorStop(1, "rgba(212, 175, 55, 0.4)");
            }

            ctx.strokeStyle = lineGrad;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        });
      });

      // 4. Grid Nodes (Pulsing holographic anchor points)
      nodes.forEach((n) => {
        const px = n.nx * w;
        const py = n.ny * h;
        const isSelected = selectedNode === n.id;
        const isValidDest = validMoves.some((m) => m.to === n.id);

        ctx.beginPath();
        ctx.arc(px, py, isSelected ? 8 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = isValidDest
          ? "#10B981"
          : isSelected
          ? "#FFDE59"
          : isGodMode
          ? "rgba(192, 132, 252, 0.6)"
          : "rgba(212, 175, 55, 0.45)";
        ctx.fill();

        // Valid move glowing ring indicator
        if (isValidDest) {
          ctx.strokeStyle = "#10B981";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, 14 + Math.sin(Date.now() * 0.008) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // 5. Piece Rendering with Photorealistic Faction Shaders
      const pieceRadius = Math.min(w, h) * 0.042;

      nodes.forEach((n) => {
        const piece = board[n.id];
        if (!piece) return;

        const cx = n.nx * w;
        const cy = n.ny * h;
        const isSelected = selectedNode === n.id;

        // Anti-Gravity Float Offset
        const floatZ = isGodMode ? 10 + Math.sin(Date.now() * 0.005 + n.id) * 3 : 0;

        // Dynamic Cast Shadow on Grid
        ctx.beginPath();
        ctx.ellipse(cx, cy + 4 + floatZ * 0.8, pieceRadius * 0.95, pieceRadius * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fill();

        // Floating Piece Center
        const py = cy - floatZ;

        if (piece === 1) {
          // ===============================
          // FACTION 1: SOLAR FLARE (Fiery Plasma Orb)
          // ===============================
          // Outer plasma bloom glow
          const glowGrad = ctx.createRadialGradient(cx, py, pieceRadius * 0.4, cx, py, pieceRadius * 1.6);
          glowGrad.addColorStop(0, "rgba(255, 110, 0, 0.7)");
          glowGrad.addColorStop(0.6, "rgba(255, 60, 0, 0.3)");
          glowGrad.addColorStop(1, "rgba(255, 0, 0, 0)");
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(cx, py, pieceRadius * 1.6, 0, Math.PI * 2);
          ctx.fill();

          // Magnetic Containment Ring
          ctx.strokeStyle = "#FFE066";
          ctx.lineWidth = isSelected ? 3 : 1.8;
          ctx.beginPath();
          ctx.arc(cx, py, pieceRadius * 1.08, 0, Math.PI * 2);
          ctx.stroke();

          // Liquid fire plasma sphere
          const orbGrad = ctx.createRadialGradient(
            cx - pieceRadius * 0.35,
            py - pieceRadius * 0.35,
            pieceRadius * 0.1,
            cx,
            py,
            pieceRadius
          );
          orbGrad.addColorStop(0, "#FFFFFF");
          orbGrad.addColorStop(0.25, "#FFE600");
          orbGrad.addColorStop(0.65, "#FF4500");
          orbGrad.addColorStop(1, "#8B0000");

          ctx.fillStyle = orbGrad;
          ctx.beginPath();
          ctx.arc(cx, py, pieceRadius, 0, Math.PI * 2);
          ctx.fill();

          // Solar Flare Core Symbol
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.font = `bold ${Math.round(pieceRadius * 0.75)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("☀️", cx, py);
        } else {
          // ===============================
          // FACTION 2: VOID ECLIPSE (Obsidian Crystal / Dark Matter)
          // ===============================
          // Micro-black hole event horizon distortion glow
          const darkGlow = ctx.createRadialGradient(cx, py, pieceRadius * 0.3, cx, py, pieceRadius * 1.6);
          darkGlow.addColorStop(0, "rgba(168, 85, 247, 0.8)");
          darkGlow.addColorStop(0.5, "rgba(126, 34, 206, 0.35)");
          darkGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = darkGlow;
          ctx.beginPath();
          ctx.arc(cx, py, pieceRadius * 1.6, 0, Math.PI * 2);
          ctx.fill();

          // Crystalline Glass Ring
          ctx.strokeStyle = isSelected ? "#F3E8FF" : "#C084FC";
          ctx.lineWidth = isSelected ? 3 : 1.8;
          ctx.beginPath();
          ctx.arc(cx, py, pieceRadius * 1.08, 0, Math.PI * 2);
          ctx.stroke();

          // Obsidian Dark Crystal Sphere
          const voidGrad = ctx.createRadialGradient(
            cx - pieceRadius * 0.35,
            py - pieceRadius * 0.35,
            pieceRadius * 0.1,
            cx,
            py,
            pieceRadius
          );
          voidGrad.addColorStop(0, "#E9D5FF");
          voidGrad.addColorStop(0.3, "#7E22CE");
          voidGrad.addColorStop(0.75, "#2E1065");
          voidGrad.addColorStop(1, "#0A0014");

          ctx.fillStyle = voidGrad;
          ctx.beginPath();
          ctx.arc(cx, py, pieceRadius, 0, Math.PI * 2);
          ctx.fill();

          // Void Eclipse Core Symbol
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.font = `bold ${Math.round(pieceRadius * 0.75)}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("🔮", cx, py);
        }
      });

      // 6. Particle Supernova Render Loop
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
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

      ctx.restore(); // Restore perspective transform
      ctx.restore(); // Restore screen shake

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [nodes, board, selectedNode, validMoves, isGodMode]);

  return (
    <div className="min-h-screen bg-[#07040B] text-white flex flex-col items-center justify-between p-2 sm:p-4 select-none font-sans">
      {/* Top Header Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 sm:py-3 border-b border-[#2C1835] px-2 sm:px-4 bg-[#12081A]/80 backdrop-blur-md rounded-2xl mb-2 sm:mb-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-[#261033] hover:bg-[#3B194F] border border-[#5B277D] text-xs font-bold text-gray-300 transition"
          >
            ← 777 Casino
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wider bg-gradient-to-r from-[#FFDE59] via-[#FF7A00] to-[#E11D48] bg-clip-text text-transparent uppercase flex items-center space-x-2">
              <span>24 GOTI: COSMIC ANTI-GRAVITY</span>
              <span className="px-1.5 py-0.2 bg-[#FFDE59] text-black text-[9px] font-black rounded-full shadow">
                GOD MODE
              </span>
            </h1>
            <p className="text-[10px] text-gray-400">Authentic South Asian Bead 12 • Zero-G Nexus Engine</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Sound */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-[#1D0C27] border border-[#3C1A50] text-[#FFDE59] hover:brightness-110 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Rules Modal */}
          <button
            onClick={() => setShowRulesModal(true)}
            className="p-2 rounded-xl bg-[#1D0C27] border border-[#3C1A50] text-gray-300 hover:text-white transition flex items-center space-x-1"
          >
            <HelpCircle className="w-4 h-4 text-[#FFDE59]" />
            <span className="text-xs font-bold hidden sm:inline">Rules</span>
          </button>

          {/* Reset */}
          <button
            onClick={restartMatch}
            className="p-2 rounded-xl bg-[#1D0C27] border border-[#3C1A50] text-gray-300 hover:text-white transition"
            title="Restart Match"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Game Interface */}
      <div className="w-full max-w-5xl flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4">
        {/* Left Column: Player Stats & Factions */}
        <div className="w-full lg:w-72 space-y-3 flex-shrink-0">
          {/* Player 1 Card: Solar Flare */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              turn === 1 && !winner
                ? "bg-gradient-to-br from-[#2D1108] to-[#1A0A05] border-[#FF7A00] shadow-[0_0_15px_rgba(255,122,0,0.3)] scale-[1.02]"
                : "bg-[#140A18] border-[#2E163B] opacity-80"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">☀️</span>
                <div>
                  <div className="text-xs font-black text-[#FFDE59] uppercase tracking-wide">
                    Solar Flare Faction
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {gameMode === "AI" ? "You (Player 1)" : "Player 1 (Red)"}
                  </div>
                </div>
              </div>
              <span className="text-base font-black text-[#FF9E0B] font-mono">{p1Count}/12</span>
            </div>

            {/* Streak Meter */}
            <div>
              <div className="flex justify-between text-[10px] text-gray-300 font-bold mb-1">
                <span>God Streak</span>
                <span className="text-[#FF9E0B]">{p1Streak}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-[#5C2B0B]">
                <div
                  className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FFDE59] transition-all duration-300"
                  style={{ width: `${p1Streak}%` }}
                />
              </div>
            </div>
          </div>

          {/* Player 2 Card: Void Eclipse */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              turn === 2 && !winner
                ? "bg-gradient-to-br from-[#1E092D] to-[#12051C] border-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-[1.02]"
                : "bg-[#140A18] border-[#2E163B] opacity-80"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🔮</span>
                <div>
                  <div className="text-xs font-black text-[#C084FC] uppercase tracking-wide">
                    Void Eclipse Faction
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {gameMode === "AI" ? `Cosmic AI (${aiDifficulty})` : "Player 2 (Purple)"}
                  </div>
                </div>
              </div>
              <span className="text-base font-black text-[#C084FC] font-mono">{p2Count}/12</span>
            </div>

            {/* Streak Meter */}
            <div>
              <div className="flex justify-between text-[10px] text-gray-300 font-bold mb-1">
                <span>God Streak</span>
                <span className="text-[#C084FC]">{p2Streak}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-[#4C1D6E]">
                <div
                  className="h-full bg-gradient-to-r from-[#A855F7] to-[#E9D5FF] transition-all duration-300"
                  style={{ width: `${p2Streak}%` }}
                />
              </div>
            </div>
          </div>

          {/* Anti-Gravity God Mode Active Banner */}
          {isGodMode && (
            <div className="p-3 bg-gradient-to-r from-[#5B1072] via-[#B81E73] to-[#5B1072] border-2 border-[#FFDE59] rounded-2xl animate-pulse shadow-lg text-center space-y-1">
              <div className="text-xs font-black text-[#FFDE59] uppercase tracking-wider flex items-center justify-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>ANTI-GRAVITY GOD MODE</span>
              </div>
              <div className="text-[10px] text-white font-medium">
                Gravity: 0 G • {godPower === "SLIPSTREAM" ? "☄️ Cosmic Slipstream" : "🌀 Singularity Leap"} Active!
              </div>
              <div className="text-[9px] text-amber-200">
                Turns remaining: {godTurnsLeft}
              </div>
            </div>
          )}

          {/* Mode Selector */}
          <div className="p-3 bg-[#140A18] border border-[#2E163B] rounded-2xl space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Cosmic Board Layout
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleBoardModeChange("NEXUS_FORTS")}
                className={`py-2 text-[11px] font-bold rounded-xl transition border ${
                  boardMode === "NEXUS_FORTS"
                    ? "bg-[#2A1137] border-[#FFDE59] text-[#FFDE59] shadow"
                    : "border-transparent bg-[#1B0E20] text-gray-400 hover:text-white"
                }`}
              >
                Forts (37 Nodes)
              </button>
              <button
                onClick={() => handleBoardModeChange("CENTRAL_MATRIX")}
                className={`py-2 text-[11px] font-bold rounded-xl transition border ${
                  boardMode === "CENTRAL_MATRIX"
                    ? "bg-[#2A1137] border-[#FFDE59] text-[#FFDE59] shadow"
                    : "border-transparent bg-[#1B0E20] text-gray-400 hover:text-white"
                }`}
              >
                Matrix (25 Nodes)
              </button>
            </div>

            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block pt-1">
              Opponent Mode
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  setGameMode("AI");
                  restartMatch();
                }}
                className={`py-2 text-[11px] font-bold rounded-xl transition border flex items-center justify-center space-x-1 ${
                  gameMode === "AI"
                    ? "bg-[#2A1137] border-[#FFDE59] text-[#FFDE59] shadow"
                    : "border-transparent bg-[#1B0E20] text-gray-400 hover:text-white"
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Cosmic AI</span>
              </button>
              <button
                onClick={() => {
                  setGameMode("PVP");
                  restartMatch();
                }}
                className={`py-2 text-[11px] font-bold rounded-xl transition border flex items-center justify-center space-x-1 ${
                  gameMode === "PVP"
                    ? "bg-[#2A1137] border-[#FFDE59] text-[#FFDE59] shadow"
                    : "border-transparent bg-[#1B0E20] text-gray-400 hover:text-white"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>2-Player Pass</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Column: The Interactive 60FPS Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-[560px]">
          {/* Dynamic AI Sarcastic Commentary Ticker */}
          <div className="w-full bg-[#180A22] border border-[#3A184D] rounded-2xl px-4 py-2.5 mb-2 shadow-md flex items-center space-x-2">
            <span className="text-base flex-shrink-0 animate-bounce">🤖</span>
            <div className="flex-1 text-xs font-semibold text-amber-200 truncate">
              {isAiThinking ? (
                <span className="text-purple-300 animate-pulse">
                  🔮 Void Deity is calculating hyperspace trajectories...
                </span>
              ) : (
                commentary
              )}
            </div>
            {/* Quick Emoji Trigger */}
            <button
              onClick={() => setShowChatModal(true)}
              className="p-1.5 bg-[#2A1239] hover:bg-[#3D1A52] rounded-xl text-amber-300 transition"
              title="Quick Reaction & Emojis"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative w-full aspect-[4/5] sm:aspect-square max-h-[580px] bg-[#0A0410] border-2 border-[#38164A] rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={700}
              height={700}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = (e.clientX - rect.left) / rect.width;
                const clickY = (e.clientY - rect.top) / rect.height;

                // Find closest node within threshold
                let closest = -1;
                let minDist = 0.07; // Normalized distance threshold

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
              className="w-full h-full object-contain cursor-pointer"
            />

            {/* Victory / Defeat Overlay */}
            {winner && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-300">
                <div className="text-5xl animate-bounce">
                  {winner === 1 ? "☀️" : "🔮"}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#FFDE59] to-[#FF7A00] bg-clip-text text-transparent uppercase tracking-wider">
                  {winner === 1 ? "SOLAR FLARE SUPREME!" : "VOID ECLIPSE VICTORIOUS!"}
                </h3>
                <p className="text-xs text-gray-300 max-w-xs leading-relaxed">
                  {winner === 1
                    ? "The cosmic nexus has been cleansed with celestial plasma. Cosmic Deity supremacy achieved!"
                    : "The dimensional void has consumed all opponents. Total singularity darkness!"}
                </p>

                <button
                  onClick={restartMatch}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#FF7A00] to-[#E11D48] hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-retro transition"
                >
                  Play Rematch ➔
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Casino Betting & Power-Up Controls */}
        <div className="w-full lg:w-64 space-y-3 flex-shrink-0">
          {/* God Power Selector */}
          <div className="p-3.5 bg-[#140A18] border border-[#2E163B] rounded-2xl space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-black text-[#FFDE59] uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-[#FFDE59]" />
              <span>God Mode Power-Up</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-tight">
              Select power-up to activate when streak fills:
            </p>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => {
                  sound.playChipClick();
                  setGodPower("SLIPSTREAM");
                }}
                className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                  godPower === "SLIPSTREAM"
                    ? "bg-[#2C1035] border-[#FFDE59] text-white shadow"
                    : "bg-[#180A20] border-[#361745] text-gray-400 hover:text-gray-200"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#FFDE59]">The Slipstream ☄️</div>
                  <div className="text-[9px] text-gray-400">Slide across 2 empty spaces</div>
                </div>
                {godPower === "SLIPSTREAM" && <span className="text-[#FFDE59] text-xs font-black">✓</span>}
              </button>

              <button
                onClick={() => {
                  sound.playChipClick();
                  setGodPower("SINGULARITY_LEAP");
                }}
                className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                  godPower === "SINGULARITY_LEAP"
                    ? "bg-[#2C1035] border-[#A855F7] text-white shadow"
                    : "bg-[#180A20] border-[#361745] text-gray-400 hover:text-gray-200"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#C084FC]">Singularity Leap 🌀</div>
                  <div className="text-[9px] text-gray-400">Curving jump captures</div>
                </div>
                {godPower === "SINGULARITY_LEAP" && <span className="text-[#C084FC] text-xs font-black">✓</span>}
              </button>
            </div>
          </div>

          {/* 777 Casino Wager System */}
          <div className="p-3.5 bg-[#140A18] border border-[#2E163B] rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wide flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>Cosmic Wager</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-black">1.95x Payout</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[50, 100, 250].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handlePlaceBet(amt)}
                  disabled={betPlaced}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition border ${
                    betAmount === amt
                      ? "bg-[#FFDE59] text-black border-[#FFDE59] shadow font-black"
                      : "bg-[#1B0E20] border-[#361745] text-gray-300 hover:border-gray-500"
                  }`}
                >
                  ৳{amt}
                </button>
              ))}
            </div>

            {betPlaced && (
              <div className="p-2 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center">
                <div className="text-[10px] text-gray-300">Active Wager: ৳{betAmount}</div>
                <div className="text-xs font-black text-emerald-400">
                  Potential Win: ৳{Math.round(betAmount * 1.95)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Reaction & Emoji Modal (Screenshot 4 replica) */}
      {showChatModal && (
        <div
          onClick={() => setShowChatModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#160A1E] border-2 border-[#5B277D] rounded-3xl p-5 shadow-2xl space-y-4 text-white"
          >
            <div className="flex items-center justify-between border-b border-[#3B194F] pb-2">
              <span className="text-xs font-black uppercase text-[#FFDE59]">Quick Chat & Reactions</span>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Messages */}
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_CHATS.map((msg) => (
                <button
                  key={msg}
                  onClick={() => {
                    sound.playChipClick();
                    setCommentary(`Player says: "${msg}"`);
                    setShowChatModal(false);
                  }}
                  className="p-2 rounded-xl bg-[#230F30] hover:bg-[#3B194F] text-[11px] font-bold text-gray-200 text-left transition"
                >
                  {msg}
                </button>
              ))}
            </div>

            {/* Emojis Grid */}
            <div className="border-t border-[#3B194F] pt-2">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1.5">
                Emoji Reactions
              </span>
              <div className="grid grid-cols-6 gap-2 text-xl text-center">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      sound.playChipClick();
                      setCommentary(`Player reacted: ${emoji}`);
                      setShowChatModal(false);
                    }}
                    className="p-1.5 rounded-xl hover:bg-[#3B194F] hover:scale-110 transition active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <div
          onClick={() => setShowRulesModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#160A1E] border-2 border-[#5B277D] rounded-3xl p-6 shadow-2xl space-y-4 text-white text-xs max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-[#3B194F] pb-2">
              <span className="text-sm font-black text-[#FFDE59] uppercase">
                24 Goti: Cosmic Rules & Guide
              </span>
              <button
                onClick={() => setShowRulesModal(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 leading-relaxed text-gray-300">
              <div>
                <h4 className="font-bold text-[#FFDE59] mb-1">1. The Setup</h4>
                <p>
                  Each player commands 12 Gotis (Player 1: Solar Flare, Player 2: Void Eclipse). The
                  goal is to eliminate all 12 opposing beads or trap them with no legal moves.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#FFDE59] mb-1">2. Basic Movement & Captures</h4>
                <p>
                  Pieces can slide 1 step along any intersecting line to an adjacent empty node. If an
                  opponent piece is adjacent with an empty node directly behind it, you hop over to
                  capture and shatter it into stardust! Chain multi-jumps are allowed.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#FFDE59] mb-1">3. Anti-Gravity God Mode (The Twist)</h4>
                <p>
                  Capturing 2+ pieces in one turn or achieving a 3-turn streak fills the God Streak
                  meter to 100%. Spacetime warps: gravity drops to 0, pieces float in 3D perspective,
                  and special powers activate:
                </p>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px] text-amber-200">
                  <li>
                    <strong>The Cosmic Slipstream:</strong> Slide across 2 empty spaces in a row!
                  </li>
                  <li>
                    <strong>The Singularity Leap:</strong> Non-linear curved jumps around corners!
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full py-3 bg-[#FF7A00] text-white font-black uppercase text-xs rounded-xl shadow transition"
            >
              Understood (Play Now)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
