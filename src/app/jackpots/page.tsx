"use client";

import React, { useState, useEffect } from "react";
import GameCard from "@/components/arcade/GameCard";
import { ARCADE_GAMES } from "@/data/arcadeGames";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import { Trophy, Sparkles, Coins, Flame } from "lucide-react";

export default function JackpotsPage() {
  const { setActiveDemoGame } = useArcadeStore();
  const [jackpotPool, setJackpotPool] = useState(2485600);

  useEffect(() => {
    const interval = setInterval(() => {
      setJackpotPool((prev) => prev + Math.floor(10 + Math.random() * 35));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const jackpotGames = ARCADE_GAMES.filter(
    (g) => g.category === "Jackpot" || g.category === "Slots"
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6 select-none">
      {/* Huge Mega Jackpot Banner */}
      <div className="relative bg-[#303030] border-2 border-[#91D2BC] rounded-3xl p-6 sm:p-10 shadow-xl text-center space-y-3 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,229,139,0.12),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-[#C33355] text-white text-xs font-black uppercase tracking-wider">
          <Flame className="w-4 h-4 fill-current animate-pulse" />
          <span>Mega Arcade Progressive Pool</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl sm:text-6xl font-black text-[#FFE58B] tracking-tight font-mono drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            {jackpotPool.toLocaleString()} <span className="text-2xl sm:text-3xl text-white">PTS</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-semibold pt-1">
            Simulated community jackpot. Every free spin increases the pool!
          </p>
        </div>
      </div>

      {/* Grid of Jackpot Games */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-[#40243B] tracking-tight">
            Jackpot Qualifying Games
          </h2>
          <span className="text-xs font-bold text-[#40243B]/80">
            Spin any game for a random jackpot drop
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {jackpotGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={(g) => setActiveDemoGame(g)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
