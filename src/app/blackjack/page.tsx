"use client";

import React, { useState } from "react";
import { Layers, RotateCcw, Sparkles, Trophy, Plus, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

interface Card {
  suit: "♠" | "♥" | "♦" | "♣";
  value: string;
  weight: number;
}

const DECK: Card[] = [
  { suit: "♠", value: "A", weight: 11 }, { suit: "♠", value: "K", weight: 10 }, { suit: "♠", value: "Q", weight: 10 }, { suit: "♠", value: "J", weight: 10 }, { suit: "♠", value: "10", weight: 10 }, { suit: "♠", value: "9", weight: 9 }, { suit: "♠", value: "8", weight: 8 }, { suit: "♠", value: "7", weight: 7 },
  { suit: "♥", value: "A", weight: 11 }, { suit: "♥", value: "K", weight: 10 }, { suit: "♥", value: "Q", weight: 10 }, { suit: "♥", value: "J", weight: 10 }, { suit: "♥", value: "10", weight: 10 }, { suit: "♥", value: "9", weight: 9 }, { suit: "♥", value: "8", weight: 8 }, { suit: "♥", value: "7", weight: 7 },
  { suit: "♦", value: "A", weight: 11 }, { suit: "♦", value: "K", weight: 10 }, { suit: "♦", value: "Q", weight: 10 }, { suit: "♦", value: "J", weight: 10 }, { suit: "♦", value: "10", weight: 10 }, { suit: "♦", value: "9", weight: 9 }, { suit: "♦", value: "8", weight: 8 }, { suit: "♦", value: "7", weight: 7 },
  { suit: "♣", value: "A", weight: 11 }, { suit: "♣", value: "K", weight: 10 }, { suit: "♣", value: "Q", weight: 10 }, { suit: "♣", value: "J", weight: 10 }, { suit: "♣", value: "10", weight: 10 }, { suit: "♣", value: "9", weight: 9 }, { suit: "♣", value: "8", weight: 8 }, { suit: "♣", value: "7", weight: 7 },
];

function drawCard(): Card {
  return DECK[Math.floor(Math.random() * DECK.length)];
}

function calcScore(cards: Card[]): number {
  let sum = cards.reduce((acc, c) => acc + c.weight, 0);
  let aceCount = cards.filter((c) => c.value === "A").length;
  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount--;
  }
  return sum;
}

export default function BlackjackPage() {
  const { freePlayPoints, deductFreePlayPoints, addFreePlayPoints } = useArcadeStore();
  const { addCoins, showNotification } = useUserStore();

  const [bet, setBet] = useState(200);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "RESOLVED">("IDLE");
  const [resultMessage, setResultMessage] = useState<string>("");

  const startRound = () => {
    if (freePlayPoints < bet) {
      showNotification("Not enough points! Click FreePlay to reset.", "INFO");
      return;
    }

    sound.playChipClick();
    deductFreePlayPoints(bet);
    addCoins(-bet, "Blackjack Bet");

    const p1 = drawCard();
    const d1 = drawCard();
    const p2 = drawCard();
    const d2 = drawCard();

    const pHand = [p1, p2];
    const dHand = [d1, d2];

    setPlayerCards(pHand);
    setDealerCards(dHand);
    setGameState("PLAYING");
    setResultMessage("");

    // Check instant blackjack
    if (calcScore(pHand) === 21) {
      endRound(pHand, dHand);
    }
  };

  const handleHit = () => {
    sound.playChipClick();
    const nextCard = drawCard();
    const newHand = [...playerCards, nextCard];
    setPlayerCards(newHand);

    if (calcScore(newHand) > 21) {
      // Bust
      setGameState("RESOLVED");
      setResultMessage("Bust! You went over 21.");
    }
  };

  const handleStand = () => {
    sound.playChipClick();
    endRound(playerCards, dealerCards);
  };

  const endRound = (pHand: Card[], dHand: Card[]) => {
    let currentDealer = [...dHand];
    while (calcScore(currentDealer) < 17) {
      currentDealer.push(drawCard());
    }
    setDealerCards(currentDealer);

    const pScore = calcScore(pHand);
    const dScore = calcScore(currentDealer);

    setGameState("RESOLVED");

    if (pScore > 21) {
      setResultMessage("Bust! Dealer wins.");
    } else if (dScore > 21) {
      const winPts = bet * 2;
      sound.playWin();
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {}
      addFreePlayPoints(winPts);
      addCoins(winPts, "Blackjack Win");
      setResultMessage(`Dealer busts! You win +${winPts} Points! 🎉`);
    } else if (pScore > dScore) {
      const winPts = bet * 2;
      sound.playWin();
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {}
      addFreePlayPoints(winPts);
      addCoins(winPts, "Blackjack Win");
      setResultMessage(`You win! (${pScore} vs ${dScore}) +${winPts} Points! 🎉`);
    } else if (pScore === dScore) {
      addFreePlayPoints(bet);
      addCoins(bet, "Blackjack Push");
      setResultMessage(`Push! It's a tie (${pScore} - ${dScore}). Bet returned.`);
    } else {
      setResultMessage(`Dealer wins with ${dScore} vs ${pScore}.`);
    }
  };

  const playerScore = calcScore(playerCards);
  const dealerScore = gameState === "RESOLVED" ? calcScore(dealerCards) : (dealerCards[0]?.weight ?? 0);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 space-y-6 select-none">
      {/* Header */}
      <div className="bg-[#FFF6D4] border-2 border-[#EADBBE] rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0D9488] text-white flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#40243B] tracking-tight">
              Blackjack 21 Pro
            </h1>
            <p className="text-xs text-gray-600 font-semibold">
              Vegas Rules • 100% Free Virtual Chips • Beat the Dealer
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-600 uppercase font-black">FreePlay Balance</span>
          <div className="text-xl font-mono font-black text-[#C33355]">
            {freePlayPoints.toLocaleString()} PTS
          </div>
        </div>
      </div>

      {/* Felt Table Layout */}
      <div className="bg-gradient-to-b from-emerald-800 via-teal-900 to-[#0F2D25] border-4 border-[#7ABEA9] rounded-3xl p-6 sm:p-10 shadow-2xl text-white space-y-8 relative overflow-hidden">
        {/* Table Felt Decorative Oval */}
        <div className="absolute inset-4 border-2 border-dashed border-emerald-500/30 rounded-2xl pointer-events-none" />

        {/* Dealer Section */}
        <div className="relative z-10 flex flex-col items-center space-y-2">
          <div className="text-xs font-black tracking-widest uppercase text-emerald-200">
            Dealer's Hand {gameState === "RESOLVED" && `(${dealerScore})`}
          </div>
          <div className="flex items-center space-x-2">
            {dealerCards.map((card, idx) => (
              <div
                key={idx}
                className={`w-14 sm:w-16 h-20 sm:h-24 rounded-xl border flex flex-col justify-between p-2 shadow-lg transition-transform ${
                  idx === 1 && gameState === "PLAYING"
                    ? "bg-[#C33355] border-white/40 text-white flex items-center justify-center font-black text-xl"
                    : card.suit === "♥" || card.suit === "♦"
                    ? "bg-white border-gray-300 text-red-600"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                {idx === 1 && gameState === "PLAYING" ? (
                  <span>?</span>
                ) : (
                  <>
                    <div className="text-xs font-black leading-none">{card.value}</div>
                    <div className="text-center text-xl leading-none">{card.suit}</div>
                    <div className="text-right text-xs font-black leading-none">{card.value}</div>
                  </>
                )}
              </div>
            ))}
            {dealerCards.length === 0 && (
              <div className="w-14 h-20 rounded-xl border border-dashed border-emerald-400/40 flex items-center justify-center text-xs text-emerald-300">
                Empty
              </div>
            )}
          </div>
        </div>

        {/* Center Result Banner */}
        {resultMessage && (
          <div className="relative z-10 text-center py-2 px-6 rounded-2xl bg-[#FFF6D4] text-[#40243B] font-black text-sm sm:text-base border-2 border-[#DECF9E] max-w-md mx-auto shadow-xl animate-in zoom-in-95">
            {resultMessage}
          </div>
        )}

        {/* Player Section */}
        <div className="relative z-10 flex flex-col items-center space-y-2">
          <div className="text-xs font-black tracking-widest uppercase text-emerald-200">
            Your Hand {playerCards.length > 0 && `(${playerScore})`}
          </div>
          <div className="flex items-center space-x-2">
            {playerCards.map((card, idx) => (
              <div
                key={idx}
                className={`w-14 sm:w-16 h-20 sm:h-24 rounded-xl border flex flex-col justify-between p-2 shadow-lg ${
                  card.suit === "♥" || card.suit === "♦"
                    ? "bg-white border-gray-300 text-red-600"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <div className="text-xs font-black leading-none">{card.value}</div>
                <div className="text-center text-xl leading-none">{card.suit}</div>
                <div className="text-right text-xs font-black leading-none">{card.value}</div>
              </div>
            ))}
            {playerCards.length === 0 && (
              <div className="w-14 h-20 rounded-xl border border-dashed border-emerald-400/40 flex items-center justify-center text-xs text-emerald-300">
                Empty
              </div>
            )}
          </div>
        </div>

        {/* Control Console */}
        <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-emerald-600/40">
          {gameState === "PLAYING" ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleHit}
                className="px-8 py-3 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-xs uppercase tracking-wider transition shadow-lg active:scale-95"
              >
                HIT (+Card)
              </button>
              <button
                onClick={handleStand}
                className="px-8 py-3 rounded-full bg-[#C33355] hover:bg-[#AA2443] text-white font-black text-xs uppercase tracking-wider transition shadow-lg active:scale-95"
              >
                STAND
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Bet amount buttons */}
              <div className="flex items-center space-x-2 bg-black/40 p-1.5 rounded-full border border-emerald-500/30">
                {[100, 200, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      sound.playChipClick();
                      setBet(amt);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-black transition ${
                      bet === amt
                        ? "bg-[#FFE58B] text-[#40243B]"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>

              <button
                onClick={startRound}
                className="px-10 py-3 rounded-full bg-[#FFE58B] hover:bg-[#FCE17E] text-[#40243B] font-black text-xs uppercase tracking-wider transition shadow-lg active:scale-95"
              >
                DEAL ROUND ({bet} PTS)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
