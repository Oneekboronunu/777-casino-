"use client";

import React from "react";
import GameCard from "@/components/arcade/GameCard";
import { ARCADE_GAMES } from "@/data/arcadeGames";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import { UserCheck, Sparkles, Radio } from "lucide-react";

export default function LiveCasinoPage() {
  const { setActiveDemoGame } = useArcadeStore();

  const liveTables = ARCADE_GAMES.filter(
    (g) => g.category === "Roulette" || g.category === "Blackjack" || g.category === "Arcade"
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6 select-none">
      {/* Header */}
      <div className="bg-[#FFF6D4] border-2 border-[#EADBBE] rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C33355] text-white flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#40243B] tracking-tight">
              Live Arcade Tables
            </h1>
            <p className="text-xs text-gray-600 font-semibold">
              Interactive dealer simulations • European Roulette & Multi-hand Blackjack
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs font-black">
          <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          <span>SIMULATED LIVE</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {liveTables.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onPlay={(g) => setActiveDemoGame(g)}
          />
        ))}
      </div>
    </div>
  );
}
