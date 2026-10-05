"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Home,
  HelpCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

// Suit & Rank Definitions
export type Suit = "CLUBS" | "DIAMONDS" | "SPADES" | "HEARTS";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number; // 2..14 (A=14)
  points: number; // Hearts=1, Q of Spades=13, others=0
}

export type PlayerPosition = "YOU" | "BETSY" | "DONALD" | "LEROY";

export interface Player {
  id: PlayerPosition;
  name: string;
  avatar: string;
  hand: Card[];
  tricksWon: Card[][];
  roundScore: number;
  totalScore: number;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  CLUBS: "♣",
  DIAMONDS: "♦",
  SPADES: "♠",
  HEARTS: "♥",
};

const SUIT_COLORS: Record<Suit, string> = {
  CLUBS: "text-gray-900",
  DIAMONDS: "text-red-600",
  SPADES: "text-gray-900",
  HEARTS: "text-red-600",
};

// Create a standard 52-card deck
function createDeck(): Card[] {
  const suits: Suit[] = ["CLUBS", "DIAMONDS", "SPADES", "HEARTS"];
  const ranks: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck: Card[] = [];

  suits.forEach((suit) => {
    ranks.forEach((rank, idx) => {
      const value = idx + 2;
      let points = 0;
      if (suit === "HEARTS") points = 1;
      if (suit === "SPADES" && rank === "Q") points = 13;

      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value,
        points,
      });
    });
  });

  return deck;
}

// Shuffle helper (Fisher-Yates)
function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Sort cards by Suit (Clubs, Diamonds, Spades, Hearts) then by Value ascending
function sortHand(hand: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = { CLUBS: 0, DIAMONDS: 1, SPADES: 2, HEARTS: 3 };
  return [...hand].sort((a, b) => {
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return a.value - b.value;
  });
}

type GameStage = "SPLASH" | "DIFFICULTY" | "PASSING" | "PLAYING" | "ROUND_END" | "GAME_OVER";
type PassingDirection = "LEFT" | "RIGHT" | "ACROSS" | "HOLD";
type Difficulty = "EASY" | "MEDIUM" | "PRO";

export default function HeartsGame() {
  const { user, updateBalance, showNotification } = useUserStore();

  // Screen Stages
  const [stage, setStage] = useState<GameStage>("SPLASH");
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getIsMuted());

  // Casino Stakes (Winner of match takes 4x pot!)
  const [betAmount, setBetAmount] = useState<number>(500);

  // Round State
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [passingDirection, setPassingDirection] = useState<PassingDirection>("LEFT");
  const [selectedPassCards, setSelectedPassCards] = useState<Card[]>([]);
  const [heartsBroken, setHeartsBroken] = useState<boolean>(false);
  const [currentTrickNumber, setCurrentTrickNumber] = useState<number>(1);
  const [turn, setTurn] = useState<PlayerPosition>("YOU");
  const [leadSuit, setLeadSuit] = useState<Suit | null>(null);

  // 4 Players
  const [players, setPlayers] = useState<Record<PlayerPosition, Player>>({
    YOU: { id: "YOU", name: "You", avatar: "👤", hand: [], tricksWon: [], roundScore: 0, totalScore: 0 },
    BETSY: { id: "BETSY", name: "Betsy", avatar: "👩", hand: [], tricksWon: [], roundScore: 0, totalScore: 0 },
    DONALD: { id: "DONALD", name: "Donald", avatar: "👨", hand: [], tricksWon: [], roundScore: 0, totalScore: 0 },
    LEROY: { id: "LEROY", name: "Leroy", avatar: "🧔", hand: [], tricksWon: [], roundScore: 0, totalScore: 0 },
  });

  // Current Trick table cards { player: Card }
  const [currentTrick, setCurrentTrick] = useState<{ player: PlayerPosition; card: Card }[]>([]);
  const [trickWinnerBanner, setTrickWinnerBanner] = useState<string | null>(null);
  const [moonShotPlayer, setMoonShotPlayer] = useState<string | null>(null);

  // Start New Round Deal
  const startNewRound = useCallback(
    (newRoundNum: number) => {
      // Determine passing direction: 1=Left, 2=Right, 3=Across, 4=Hold
      const dirIndex = (newRoundNum - 1) % 4;
      const dirs: PassingDirection[] = ["LEFT", "RIGHT", "ACROSS", "HOLD"];
      const dir = dirs[dirIndex];
      setPassingDirection(dir);
      setRoundNumber(newRoundNum);
      setHeartsBroken(false);
      setCurrentTrickNumber(1);
      setCurrentTrick([]);
      setSelectedPassCards([]);
      setTrickWinnerBanner(null);
      setMoonShotPlayer(null);

      // Deal 13 cards to each of the 4 players
      const deck = shuffleDeck(createDeck());
      const pYou = sortHand(deck.slice(0, 13));
      const pBetsy = sortHand(deck.slice(13, 26));
      const pDonald = sortHand(deck.slice(26, 39));
      const pLeroy = sortHand(deck.slice(39, 52));

      setPlayers((prev) => ({
        YOU: { ...prev.YOU, hand: pYou, tricksWon: [], roundScore: 0 },
        BETSY: { ...prev.BETSY, hand: pBetsy, tricksWon: [], roundScore: 0 },
        DONALD: { ...prev.DONALD, hand: pDonald, tricksWon: [], roundScore: 0 },
        LEROY: { ...prev.LEROY, hand: pLeroy, tricksWon: [], roundScore: 0 },
      }));

      sound.playBetPlaced();

      if (dir === "HOLD") {
        // No passing on round 4, find who has 2 of clubs and start trick phase
        findOpeningLead({
          YOU: { ...players.YOU, hand: pYou },
          BETSY: { ...players.BETSY, hand: pBetsy },
          DONALD: { ...players.DONALD, hand: pDonald },
          LEROY: { ...players.LEROY, hand: pLeroy },
        });
        setStage("PLAYING");
      } else {
        setStage("PASSING");
      }
    },
    [players]
  );

  // Start Full Match
  const handleStartGame = () => {
    if (betAmount < 10) {
      showNotification("Minimum bet is ৳10", "ERROR");
      return;
    }
    if (!user || user.balance < betAmount) {
      showNotification("Insufficient balance to enter table", "ERROR");
      return;
    }

    updateBalance(-betAmount);
    // Reset total scores
    setPlayers({
      YOU: { id: "YOU", name: user?.name || "You", avatar: "👤", hand: [], tricksWon: [], roundScore: 0, totalScore: 0 },
      BETSY: { id: "BETSY", name: "Betsy", avatar: "👩", hand: [], tricksWon: [], roundScore: 0, totalScore: 0 },
      DONALD: { id: "DONALD", name: "Donald", avatar: "👨", hand: [], tricksWon: [], roundScore: 0, totalScore: 0 },
      LEROY: { id: "LEROY", name: "Leroy", avatar: "🧔", hand: [], tricksWon: [], roundScore: 0, totalScore: 0 },
    });

    startNewRound(1);
  };

  // Find player holding 2 of Clubs to open the trick
  const findOpeningLead = (currPlayers: Record<PlayerPosition, Player>) => {
    const order: PlayerPosition[] = ["YOU", "BETSY", "DONALD", "LEROY"];
    for (const p of order) {
      if (currPlayers[p].hand.some((c) => c.suit === "CLUBS" && c.rank === "2")) {
        setTurn(p);
        setLeadSuit(null);
        return p;
      }
    }
    setTurn("YOU");
    return "YOU";
  };

  // Execute 3-Card Pass
  const handleConfirmPass = () => {
    if (selectedPassCards.length !== 3) {
      showNotification("Please select exactly 3 cards to pass", "ERROR");
      return;
    }

    sound.playStrikerFlick();

    // AI selects 3 highest non-essential cards to pass
    const getAiPassCards = (hand: Card[]): Card[] => {
      // AI prefers passing Spades A/K/Q, high Hearts, or singleton high cards
      const sorted = [...hand].sort((a, b) => b.value - a.value);
      return sorted.slice(0, 3);
    };

    const youPass = selectedPassCards;
    const betsyPass = getAiPassCards(players.BETSY.hand);
    const donaldPass = getAiPassCards(players.DONALD.hand);
    const leroyPass = getAiPassCards(players.LEROY.hand);

    // Pass routing mapping
    // Clockwise order: YOU -> BETSY (Left) -> DONALD (Across) -> LEROY (Right) -> YOU
    let newYouHand: Card[] = [];
    let newBetsyHand: Card[] = [];
    let newDonaldHand: Card[] = [];
    let newLeroyHand: Card[] = [];

    const removePassed = (hand: Card[], passed: Card[]) =>
      hand.filter((c) => !passed.some((p) => p.id === c.id));

    const cleanYou = removePassed(players.YOU.hand, youPass);
    const cleanBetsy = removePassed(players.BETSY.hand, betsyPass);
    const cleanDonald = removePassed(players.DONALD.hand, donaldPass);
    const cleanLeroy = removePassed(players.LEROY.hand, leroyPass);

    if (passingDirection === "LEFT") {
      newBetsyHand = sortHand([...cleanBetsy, ...youPass]);
      newDonaldHand = sortHand([...cleanDonald, ...betsyPass]);
      newLeroyHand = sortHand([...cleanLeroy, ...donaldPass]);
      newYouHand = sortHand([...cleanYou, ...leroyPass]);
    } else if (passingDirection === "RIGHT") {
      newLeroyHand = sortHand([...cleanLeroy, ...youPass]);
      newDonaldHand = sortHand([...cleanDonald, ...leroyPass]);
      newBetsyHand = sortHand([...cleanBetsy, ...donaldPass]);
      newYouHand = sortHand([...cleanYou, ...betsyPass]);
    } else if (passingDirection === "ACROSS") {
      newDonaldHand = sortHand([...cleanDonald, ...youPass]);
      newYouHand = sortHand([...cleanYou, ...donaldPass]);
      newLeroyHand = sortHand([...cleanLeroy, ...betsyPass]);
      newBetsyHand = sortHand([...cleanBetsy, ...leroyPass]);
    }

    const updatedPlayers = {
      YOU: { ...players.YOU, hand: newYouHand },
      BETSY: { ...players.BETSY, hand: newBetsyHand },
      DONALD: { ...players.DONALD, hand: newDonaldHand },
      LEROY: { ...players.LEROY, hand: newLeroyHand },
    };

    setPlayers(updatedPlayers);
    setSelectedPassCards([]);
    findOpeningLead(updatedPlayers);
    setStage("PLAYING");
    showNotification(`3 cards passed ${passingDirection.toLowerCase()}!`, "INFO");
  };

  // Card Selection for Passing
  const togglePassSelection = (card: Card) => {
    sound.playChipClick();
    if (selectedPassCards.some((c) => c.id === card.id)) {
      setSelectedPassCards((prev) => prev.filter((c) => c.id !== card.id));
    } else if (selectedPassCards.length < 3) {
      setSelectedPassCards((prev) => [...prev, card]);
    }
  };

  // Check if a card is legally playable
  const isCardPlayable = (card: Card, player: Player): boolean => {
    // 1. Opening lead of trick 1 MUST be 2 of Clubs
    if (currentTrickNumber === 1 && currentTrick.length === 0) {
      return card.suit === "CLUBS" && card.rank === "2";
    }

    // 2. If leading the trick:
    if (currentTrick.length === 0) {
      // Cannot lead Hearts unless Hearts broken or player has ONLY Hearts
      if (card.suit === "HEARTS" && !heartsBroken) {
        const onlyHearts = player.hand.every((c) => c.suit === "HEARTS");
        return onlyHearts;
      }
      return true;
    }

    // 3. Following suit:
    const activeLeadSuit = currentTrick[0].card.suit;
    const hasLeadSuit = player.hand.some((c) => c.suit === activeLeadSuit);

    if (hasLeadSuit) {
      return card.suit === activeLeadSuit;
    }

    // 4. Discarding on void:
    // On Trick 1, cannot discard Hearts or Queen of Spades
    if (currentTrickNumber === 1) {
      if (card.suit === "HEARTS" || (card.suit === "SPADES" && card.rank === "Q")) {
        const hasSafeDiscard = player.hand.some(
          (c) => c.suit !== "HEARTS" && !(c.suit === "SPADES" && c.rank === "Q")
        );
        if (hasSafeDiscard) return false;
      }
    }

    return true;
  };

  // Play Card handler
  const playCard = (playerPos: PlayerPosition, card: Card) => {
    sound.playCoinHit();

    // Check if heart was broken
    if (card.suit === "HEARTS" && !heartsBroken) {
      setHeartsBroken(true);
      showNotification("💔 Hearts have been broken!", "INFO");
    }

    // Remove from hand
    setPlayers((prev) => ({
      ...prev,
      [playerPos]: {
        ...prev[playerPos],
        hand: prev[playerPos].hand.filter((c) => c.id !== card.id),
      },
    }));

    const newTrick = [...currentTrick, { player: playerPos, card }];
    setCurrentTrick(newTrick);

    if (currentTrick.length === 0) {
      setLeadSuit(card.suit);
    }

    // If trick complete (4 cards played)
    if (newTrick.length === 4) {
      resolveTrick(newTrick);
    } else {
      // Next turn clockwise
      const rotation: Record<PlayerPosition, PlayerPosition> = {
        YOU: "BETSY",
        BETSY: "DONALD",
        DONALD: "LEROY",
        LEROY: "YOU",
      };
      setTurn(rotation[playerPos]);
    }
  };

  // Resolve Completed Trick
  const resolveTrick = (trickCards: { player: PlayerPosition; card: Card }[]) => {
    const trickLeadSuit = trickCards[0].card.suit;

    // Highest card of the lead suit wins
    let winningPlay = trickCards[0];
    trickCards.forEach((play) => {
      if (play.card.suit === trickLeadSuit && play.card.value > winningPlay.card.value) {
        winningPlay = play;
      }
    });

    const winner = winningPlay.player;
    const trickCardsArr = trickCards.map((p) => p.card);
    const trickPoints = trickCardsArr.reduce((sum, c) => sum + c.points, 0);

    setTimeout(() => {
      sound.playPocketSink();
      setTrickWinnerBanner(`${players[winner].name} wins trick! (+${trickPoints} pts)`);

      // Add trick to winner
      setPlayers((prev) => ({
        ...prev,
        [winner]: {
          ...prev[winner],
          tricksWon: [...prev[winner].tricksWon, trickCardsArr],
          roundScore: prev[winner].roundScore + trickPoints,
        },
      }));

      setTimeout(() => {
        setTrickWinnerBanner(null);
        setCurrentTrick([]);
        setLeadSuit(null);

        // If all 13 tricks complete
        if (currentTrickNumber >= 13) {
          concludeRound();
        } else {
          setCurrentTrickNumber((prev) => prev + 1);
          setTurn(winner);
        }
      }, 1000);
    }, 900);
  };

  // Conclude Round & Scoreboard
  const concludeRound = () => {
    sound.playWin();

    // Check for "Shooting the Moon" (Taking all 26 points)
    let shooter: PlayerPosition | null = null;
    const playerPositions: PlayerPosition[] = ["YOU", "BETSY", "DONALD", "LEROY"];

    playerPositions.forEach((pos) => {
      if (players[pos].roundScore === 26) {
        shooter = pos;
      }
    });

    setPlayers((prev) => {
      const next = { ...prev };
      if (shooter) {
        setMoonShotPlayer(prev[shooter].name);
        // Shooter gets 0, all others get 26
        playerPositions.forEach((pos) => {
          if (pos === shooter) {
            next[pos] = { ...next[pos], roundScore: 0, totalScore: next[pos].totalScore + 0 };
          } else {
            next[pos] = { ...next[pos], roundScore: 26, totalScore: next[pos].totalScore + 26 };
          }
        });
      } else {
        playerPositions.forEach((pos) => {
          next[pos] = { ...next[pos], totalScore: next[pos].totalScore + next[pos].roundScore };
        });
      }
      return next;
    });

    // Check if any player reached 100+ points
    const checkScores = playerPositions.map((pos) => players[pos].totalScore + players[pos].roundScore);
    const gameEnded = checkScores.some((score) => score >= 100);

    if (gameEnded) {
      setStage("GAME_OVER");
      // Find winner with lowest total score
      const sorted = [...playerPositions].sort((a, b) => players[a].totalScore - players[b].totalScore);
      const gameWinner = sorted[0];

      if (gameWinner === "YOU") {
        const winPot = betAmount * 4;
        sound.playWin();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        updateBalance(winPot);
        showNotification(`🏆 CHAMPION! Lowest Score (${players.YOU.totalScore})! Won ৳${winPot.toLocaleString()}!`, "SUCCESS");
      } else {
        sound.playCrash();
        showNotification(`Game Over! ${players[gameWinner].name} won with lowest score.`, "INFO");
      }
    } else {
      setStage("ROUND_END");
    }
  };

  // AI Turn Execution
  useEffect(() => {
    if (stage !== "PLAYING" || turn === "YOU" || currentTrick.length >= 4) return;

    const aiPlayer = players[turn];
    if (aiPlayer.hand.length === 0) return;

    const timer = setTimeout(() => {
      // Filter valid playable cards
      const validCards = aiPlayer.hand.filter((c) => isCardPlayable(c, aiPlayer));
      if (validCards.length === 0) return;

      let chosenCard = validCards[0];

      // Smart AI Choice based on difficulty
      if (difficulty === "EASY") {
        // Random choice
        chosenCard = validCards[Math.floor(Math.random() * validCards.length)];
      } else {
        // Medium / Pro AI Strategy
        const trickLead = currentTrick.length > 0 ? currentTrick[0].card.suit : null;

        if (trickLead) {
          const matchingSuitCards = validCards.filter((c) => c.suit === trickLead);
          if (matchingSuitCards.length > 0) {
            // Try to play card under current highest if safe
            const highestInTrick = Math.max(
              ...currentTrick.filter((p) => p.card.suit === trickLead).map((p) => p.card.value)
            );
            const lowerCards = matchingSuitCards.filter((c) => c.value < highestInTrick);
            if (lowerCards.length > 0) {
              chosenCard = lowerCards[lowerCards.length - 1]; // highest safe card under
            } else {
              chosenCard = matchingSuitCards[0]; // lowest card
            }
          } else {
            // Void in suit: DUMP Queen of Spades or high Hearts!
            const queenOfSpades = validCards.find((c) => c.suit === "SPADES" && c.rank === "Q");
            if (queenOfSpades) {
              chosenCard = queenOfSpades;
            } else {
              const hearts = validCards.filter((c) => c.suit === "HEARTS").sort((a, b) => b.value - a.value);
              if (hearts.length > 0) {
                chosenCard = hearts[0]; // dump highest heart
              } else {
                // dump highest card of any suit
                chosenCard = [...validCards].sort((a, b) => b.value - a.value)[0];
              }
            }
          }
        } else {
          // AI Leading: Play lowest non-heart card
          const safeLeads = validCards.filter((c) => c.suit !== "HEARTS");
          if (safeLeads.length > 0) {
            chosenCard = safeLeads.sort((a, b) => a.value - b.value)[0];
          } else {
            chosenCard = validCards.sort((a, b) => a.value - b.value)[0];
          }
        }
      }

      playCard(turn, chosenCard);
    }, 700);

    return () => clearTimeout(timer);
  }, [stage, turn, currentTrick, players, difficulty]);

  // Card Visual Component
  const renderCardFace = (card: Card, isSelected: boolean = false, isPlayable: boolean = true) => {
    return (
      <div
        style={{
          boxShadow: isSelected
            ? "0 10px 25px rgba(255, 222, 89, 0.7), 0 0 10px rgba(255,222,89,0.9)"
            : "0 6px 14px rgba(0,0,0,0.35)",
        }}
        className={`w-14 h-20 sm:w-16 sm:h-24 bg-white rounded-xl border-2 flex flex-col justify-between p-1.5 transition-all transform select-none ${
          isSelected
            ? "border-[#FFDE59] -translate-y-4 scale-105"
            : isPlayable
            ? "border-gray-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer"
            : "border-gray-200 opacity-60 cursor-not-allowed"
        }`}
      >
        {/* Top-Left Rank & Suit */}
        <div className={`text-xs sm:text-sm font-black leading-none ${SUIT_COLORS[card.suit]}`}>
          <div>{card.rank}</div>
          <div className="text-[10px]">{SUIT_SYMBOLS[card.suit]}</div>
        </div>

        {/* Center Big Symbol */}
        <div className={`text-xl sm:text-2xl text-center leading-none ${SUIT_COLORS[card.suit]}`}>
          {SUIT_SYMBOLS[card.suit]}
        </div>

        {/* Bottom-Right Inverted */}
        <div className={`text-xs sm:text-sm font-black leading-none text-right rotate-180 ${SUIT_COLORS[card.suit]}`}>
          <div>{card.rank}</div>
          <div className="text-[10px]">{SUIT_SYMBOLS[card.suit]}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#0C150E] text-white select-none font-sans p-3 sm:p-6 flex flex-col items-center justify-center">
      {/* ========================================================================= */}
      {/* 1. SPLASH / TITLE SCREEN (Matching 24/7 Hearts Logo Screenshot 2) */}
      {/* ========================================================================= */}
      {stage === "SPLASH" && (
        <div className="w-full max-w-xl bg-gradient-to-b from-[#143B1D] via-[#0E2814] to-[#0A1A0D] border-4 border-[#1E5C2C] rounded-[36px] p-8 sm:p-12 text-center shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-8 animate-in fade-in duration-300 relative overflow-hidden">
          {/* Decorative Corner Felt Highlights */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={() => {
                const next = sound.toggleMute();
                setIsMuted(next);
              }}
              className="p-2 bg-[#0A1A0D] border border-[#1E5C2C] rounded-xl text-gray-300 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* 24/7 Hearts Master Brand Logo */}
          <div className="space-y-2">
            <div className="inline-block relative">
              <span className="text-sm sm:text-base font-black font-mono tracking-widest text-white block -mb-2 drop-shadow">
                24·7
              </span>
              <h1 className="text-5xl sm:text-7xl font-serif font-black text-[#D92638] tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] stroke-black">
                Hearts
              </h1>
            </div>

            {/* King of Hearts Emblem Card */}
            <div className="w-16 h-20 bg-white rounded-xl shadow-2xl border-2 border-red-500 mx-auto flex flex-col items-center justify-center text-red-600 font-black text-xl rotate-6 transform hover:rotate-0 transition">
              <div className="text-xs">K</div>
              <div>♥</div>
            </div>
          </div>

          {/* Bet Stake Pot Selector */}
          <div className="bg-[#0A1A0D]/80 border border-[#1E5C2C] p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-300 font-bold uppercase tracking-wider">
              <span>Table Stake (BDT ৳):</span>
              <span className="text-[#FFDE59] font-mono font-black">Winner Takes 4x Pot (৳{(betAmount * 4).toLocaleString()})</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[100, 500, 1000, 2000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setBetAmount(amt);
                    sound.playChipClick();
                  }}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition ${
                    betAmount === amt
                      ? "bg-[#22C55E] text-white border-[#86EFAC] shadow-lg"
                      : "bg-[#143B1D] text-gray-300 border-[#1E5C2C] hover:border-gray-400"
                  }`}
                >
                  ৳{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Main Action Buttons matching Screenshot 2 */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onClick={() => {
                setStage("DIFFICULTY");
                sound.playChipClick();
              }}
              className="py-4 bg-[#000000] hover:bg-[#111827] text-white font-black text-sm uppercase tracking-wider rounded-xl border border-gray-700 shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition"
            >
              <span>▶ PLAY</span>
            </button>

            <button
              onClick={() => {
                setShowInstructions(true);
                sound.playChipClick();
              }}
              className="py-4 bg-[#000000] hover:bg-[#111827] text-white font-black text-sm uppercase tracking-wider rounded-xl border border-gray-700 shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition"
            >
              <span>+ RULES</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-400 flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Classic 4-Player Rules | Passing Cycle | Shoot the Moon 26 pts</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DIFFICULTY SELECTOR (Matching Medium Screenshot 1) */}
      {/* ========================================================================= */}
      {stage === "DIFFICULTY" && (
        <div className="w-full max-w-md bg-gradient-to-b from-[#143B1D] to-[#0A1A0D] border-4 border-[#1E5C2C] rounded-[36px] p-8 text-center shadow-2xl space-y-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E5C2C]">
            <button
              onClick={() => setStage("SPLASH")}
              className="p-2 bg-[#0A1A0D] border border-[#1E5C2C] rounded-xl text-gray-300 hover:text-white"
            >
              <Home className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-serif font-black text-[#FFDE59]">Select Difficulty</h2>
            <div className="w-8" />
          </div>

          {/* Carousel Difficulty Card matching Screenshot 1 */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => {
                if (difficulty === "PRO") setDifficulty("MEDIUM");
                else if (difficulty === "MEDIUM") setDifficulty("EASY");
                sound.playChipClick();
              }}
              className="p-3 bg-[#0A1A0D] hover:bg-[#1E5C2C] rounded-2xl text-white shadow transition"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
            </button>

            {/* Center Difficulty Box */}
            <div className="flex-1 bg-[#1F2937] border-4 border-[#374151] rounded-3xl p-6 shadow-2xl space-y-3">
              <div className="bg-[#15803D] rounded-2xl py-4 px-2 shadow-inner border-2 border-[#16A34A]">
                <span className="font-serif italic font-black text-3xl text-white drop-shadow-md">
                  {difficulty === "EASY" ? "Easy" : difficulty === "MEDIUM" ? "Medium" : "Hard Pro"}
                </span>
              </div>
              <div className="flex justify-center space-x-1.5 text-2xl text-[#FFDE59]">
                {difficulty === "EASY" && <span>⭐☆☆</span>}
                {difficulty === "MEDIUM" && <span>⭐⭐⭐</span>}
                {difficulty === "PRO" && <span>⭐⭐⭐⭐⭐</span>}
              </div>
            </div>

            <button
              onClick={() => {
                if (difficulty === "EASY") setDifficulty("MEDIUM");
                else if (difficulty === "MEDIUM") setDifficulty("PRO");
                sound.playChipClick();
              }}
              className="p-3 bg-[#0A1A0D] hover:bg-[#1E5C2C] rounded-2xl text-white shadow transition"
            >
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full py-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-black text-base uppercase tracking-wider rounded-2xl shadow-xl active:scale-95 transition"
          >
            Start Table Match
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN TABLE ARENA (Matching Table Screenshot 4) */}
      {/* ========================================================================= */}
      {(stage === "PASSING" || stage === "PLAYING" || stage === "ROUND_END" || stage === "GAME_OVER") && (
        <div className="w-full max-w-5xl bg-gradient-to-b from-[#144820] via-[#0D3316] to-[#08200E] border-8 border-[#2D1B10] rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.9)] p-4 sm:p-6 flex flex-col justify-between min-h-[680px] relative overflow-hidden">
          
          {/* Top Control Bar with Home, Help, Round, Sound */}
          <div className="flex items-center justify-between z-10 px-2 mb-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setStage("SPLASH")}
                className="p-2 bg-[#08200E]/80 border border-[#1E5C2C] rounded-xl hover:bg-[#1E5C2C] text-white"
              >
                <Home className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowInstructions(true)}
                className="p-2 bg-[#08200E]/80 border border-[#1E5C2C] rounded-xl hover:bg-[#1E5C2C] text-white"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Center Match Banner */}
            <div className="bg-[#000000]/70 border border-[#1E5C2C] px-4 py-1.5 rounded-2xl flex items-center space-x-3 text-xs">
              <span className="text-[#FFDE59] font-black">Round {roundNumber}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">Trick {currentTrickNumber}/13</span>
              <span className="text-gray-400">|</span>
              <span className="text-[#22C55E] font-bold">Pot: ৳{(betAmount * 4).toLocaleString()}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const next = sound.toggleMute();
                  setIsMuted(next);
                }}
                className="p-2 bg-[#08200E]/80 border border-[#1E5C2C] rounded-xl hover:bg-[#1E5C2C] text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* TOP PLAYER: Donald */}
          <div className="flex flex-col items-center justify-center z-10">
            <div className="flex items-center space-x-2 bg-[#000000]/60 px-3.5 py-1.5 rounded-2xl border border-gray-700 shadow-md">
              <span className="text-xs font-bold text-white">Donald</span>
              <div className="flex items-center space-x-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-[11px] font-black">
                <span>♥</span>
                <span>{players.DONALD.roundScore}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">Tot: {players.DONALD.totalScore}</span>
            </div>
            {/* Donald's cards fan */}
            <div className="flex -space-x-4 mt-1 opacity-80">
              {Array.from({ length: players.DONALD.hand.length }).map((_, i) => (
                <div key={i} className="w-7 h-10 bg-blue-900 border border-white/40 rounded-md shadow-sm" />
              ))}
            </div>
          </div>

          {/* MIDDLE ROW: Betsy (Left), Center Trick Arena / Passing, Leroy (Right) */}
          <div className="flex items-center justify-between w-full my-auto px-2 sm:px-6">
            {/* LEFT PLAYER: Betsy */}
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1.5 bg-[#000000]/60 px-3 py-1.5 rounded-2xl border border-gray-700 shadow-md">
                <span className="text-xs font-bold text-white">Betsy</span>
                <div className="flex items-center space-x-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-[11px] font-black">
                  <span>♥</span>
                  <span>{players.BETSY.roundScore}</span>
                </div>
              </div>
              <div className="flex flex-col -space-y-7 opacity-80">
                {Array.from({ length: Math.min(8, players.BETSY.hand.length) }).map((_, i) => (
                  <div key={i} className="w-10 h-7 bg-blue-900 border border-white/40 rounded-md shadow-sm" />
                ))}
              </div>
            </div>

            {/* CENTER ARENA: Passing Box OR Trick Table */}
            <div className="flex-1 max-w-md mx-auto flex flex-col items-center justify-center min-h-[220px]">
              {/* PHASE 1: PASSING CARDS INTERFACE (Matching Screenshot 4) */}
              {stage === "PASSING" && (
                <div className="w-full text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <h3 className="text-sm sm:text-base font-bold text-white drop-shadow">
                    Pick three cards to pass to the {passingDirection.toLowerCase()}
                  </h3>

                  {/* 3 Card Passing Slots */}
                  <div className="flex items-center justify-center space-x-3">
                    {[0, 1, 2].map((idx) => {
                      const card = selectedPassCards[idx];
                      return (
                        <div
                          key={idx}
                          className="w-16 h-24 sm:w-20 sm:h-28 rounded-2xl border-2 border-[#86EFAC]/70 bg-[#0F3818]/80 flex items-center justify-center shadow-lg transition"
                        >
                          {card ? (
                            renderCardFace(card, false, true)
                          ) : (
                            <span className="text-3xl font-serif font-black text-[#86EFAC]/40">{idx + 1}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* PASS Button */}
                  <button
                    onClick={handleConfirmPass}
                    disabled={selectedPassCards.length !== 3}
                    className="px-8 py-2.5 bg-[#000000] hover:bg-[#111827] disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider rounded-xl border border-gray-600 shadow-xl transition"
                  >
                    PASS
                  </button>
                </div>
              )}

              {/* PHASE 2: PLAYING ACTIVE TRICK */}
              {stage === "PLAYING" && (
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {/* Trick Winner Banner */}
                  {trickWinnerBanner && (
                    <div className="absolute top-1/2 -translate-y-1/2 z-30 bg-[#000000]/90 border-2 border-[#FFDE59] px-4 py-2 rounded-2xl text-xs font-black text-[#FFDE59] shadow-2xl animate-in zoom-in-95 duration-150">
                      {trickWinnerBanner}
                    </div>
                  )}

                  {/* Cards played in Trick (Positions: Top, Left, Right, Bottom) */}
                  {currentTrick.map((play) => {
                    let posStyle = "translate-y-0";
                    if (play.player === "DONALD") posStyle = "-translate-y-14";
                    if (play.player === "YOU") posStyle = "translate-y-14";
                    if (play.player === "BETSY") posStyle = "-translate-x-14";
                    if (play.player === "LEROY") posStyle = "translate-x-14";

                    return (
                      <div key={play.card.id} className={`absolute transition-all duration-300 transform ${posStyle} z-20`}>
                        {renderCardFace(play.card, false, true)}
                      </div>
                    );
                  })}

                  {/* Current Turn Indicator */}
                  {currentTrick.length < 4 && (
                    <div className="text-center text-xs font-bold text-gray-300 bg-[#000000]/40 px-3 py-1 rounded-full border border-white/10">
                      Turn: <span className="text-[#FFDE59] font-black">{players[turn].name}</span>
                    </div>
                  )}
                </div>
              )}

              {/* ROUND END SUMMARY */}
              {stage === "ROUND_END" && (
                <div className="bg-[#000000]/90 border-2 border-[#1E5C2C] p-6 rounded-3xl text-center space-y-4 shadow-2xl animate-in zoom-in-95">
                  <h3 className="text-lg font-serif font-black text-[#FFDE59]">Round {roundNumber} Complete!</h3>
                  {moonShotPlayer && (
                    <div className="p-2.5 bg-yellow-500/20 border border-yellow-500 text-yellow-300 rounded-xl text-xs font-black">
                      🌙 {moonShotPlayer} SHOT THE MOON! (+0 pts, opponents +26 pts!)
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {["YOU", "BETSY", "DONALD", "LEROY"].map((p) => (
                      <div key={p} className="p-2 bg-[#143B1D] rounded-xl flex items-center justify-between">
                        <span>{players[p as PlayerPosition].name}</span>
                        <span className="font-mono font-bold text-red-400">+{players[p as PlayerPosition].roundScore} (Tot: {players[p as PlayerPosition].totalScore})</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => startNewRound(roundNumber + 1)}
                    className="w-full py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg"
                  >
                    Next Round ({roundNumber + 1})
                  </button>
                </div>
              )}

              {/* GAME OVER (Winner takes 4x Cashout) */}
              {stage === "GAME_OVER" && (
                <div className="bg-[#000000]/95 border-2 border-[#FFDE59] p-6 rounded-3xl text-center space-y-4 shadow-2xl animate-in zoom-in-95">
                  <Trophy className="w-12 h-12 text-[#FFDE59] mx-auto animate-bounce" />
                  <h3 className="text-2xl font-serif font-black text-white">GAME FINISHED!</h3>
                  <p className="text-xs text-gray-300">
                    Target 100+ penalty points hit. Winner is player with LOWEST score.
                  </p>
                  <div className="space-y-1.5 text-xs">
                    {["YOU", "BETSY", "DONALD", "LEROY"]
                      .sort((a, b) => players[a as PlayerPosition].totalScore - players[b as PlayerPosition].totalScore)
                      .map((p, idx) => (
                        <div
                          key={p}
                          className={`p-2.5 rounded-xl flex items-center justify-between ${
                            idx === 0 ? "bg-[#22C55E]/30 border border-[#22C55E] text-[#86EFAC] font-black" : "bg-[#143B1D] text-gray-300"
                          }`}
                        >
                          <span>#{idx + 1} {players[p as PlayerPosition].name}</span>
                          <span className="font-mono">{players[p as PlayerPosition].totalScore} pts</span>
                        </div>
                      ))}
                  </div>
                  <button
                    onClick={() => setStage("SPLASH")}
                    className="w-full py-3.5 bg-gradient-to-r from-[#FFDE59] to-[#E5C158] text-[#0A1A0D] font-black text-xs uppercase tracking-wider rounded-xl shadow-gold"
                  >
                    Back to Hearts Lobby
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT PLAYER: Leroy */}
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1.5 bg-[#000000]/60 px-3 py-1.5 rounded-2xl border border-gray-700 shadow-md">
                <span className="text-xs font-bold text-white">Leroy</span>
                <div className="flex items-center space-x-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-[11px] font-black">
                  <span>♥</span>
                  <span>{players.LEROY.roundScore}</span>
                </div>
              </div>
              <div className="flex flex-col -space-y-7 opacity-80">
                {Array.from({ length: Math.min(8, players.LEROY.hand.length) }).map((_, i) => (
                  <div key={i} className="w-10 h-7 bg-blue-900 border border-white/40 rounded-md shadow-sm" />
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM: YOU PLAYER & YOUR 13 CARDS HAND */}
          <div className="w-full flex flex-col items-center z-20 space-y-2">
            {/* Player Info Badge */}
            <div className="flex items-center space-x-2 bg-[#000000]/70 px-4 py-1.5 rounded-2xl border border-[#FFDE59]/50 shadow-md">
              <span className="text-xs font-black text-[#FFDE59]">{players.YOU.name} (You)</span>
              <div className="flex items-center space-x-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-[11px] font-black">
                <span>♥</span>
                <span>{players.YOU.roundScore}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">Tot: {players.YOU.totalScore}</span>
            </div>

            {/* Player 13 Cards Fan Layout */}
            <div className="flex items-center justify-center -space-x-4 sm:-space-x-5 overflow-x-auto max-w-full px-2 py-2">
              {players.YOU.hand.map((card) => {
                const isSelectedForPass = selectedPassCards.some((c) => c.id === card.id);
                const playable = stage === "PASSING" ? true : stage === "PLAYING" && turn === "YOU" ? isCardPlayable(card, players.YOU) : false;

                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (stage === "PASSING") {
                        togglePassSelection(card);
                      } else if (stage === "PLAYING" && turn === "YOU" && playable) {
                        playCard("YOU", card);
                      }
                    }}
                  >
                    {renderCardFace(card, isSelectedForPass, playable)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. INSTRUCTIONS MODAL (Exact Matching Screenshot 3) */}
      {/* ========================================================================= */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-[#1F2937] border-4 border-[#374151] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 text-white">
            <h3 className="text-2xl font-serif font-black text-center text-white">Instructions</h3>

            <ul className="space-y-2.5 text-xs text-gray-300 leading-relaxed list-disc list-inside">
              <li>You must match the suit of the leading card, whenever possible.</li>
              <li>AVOID playing the high card (of the matching suit) to take a trick.</li>
              <li>When you take a trick, you lead the next trick. You cannot lead with a heart until a heart has been played.</li>
              <li>You get 1 point for every heart you take.</li>
              <li>You get 13 points for the Queen of Spades (♠Q).</li>
              <li>You can &apos;Shoot the Moon&apos; by taking all 26 points in one round (+0 pts for shooter, +26 pts for all opponents).</li>
              <li>Hearts ends when the first player reaches 100 points. The person with the LOWEST score wins.</li>
            </ul>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-3.5 bg-[#000000] hover:bg-[#111827] text-white font-black text-sm uppercase tracking-wider rounded-xl border border-gray-600 shadow-xl transition"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
