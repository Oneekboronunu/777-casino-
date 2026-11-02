"use client";

import React from "react";
import GameCard from "@/components/arcade/GameCard";
import { ARCADE_GAMES } from "@/data/arcadeGames";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import { Star, Sparkles } from "lucide-react";

export default function NewGamesPage() {
  const { setActiveDemoGame } = useArcadeStore();

  const newGames = ARCADE_GAMES.filter(
    (g) => g.badge === "NEW" || g.id === "sweet-bonanza" || g.id === "golden-treasure" || g.id === "wild-adventure" || g.id === "carrom-arcade"
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6 select-none">
      {/* Page Header */}
      <div className="bg-[#FFF6D4] border-2 border-[#EADBBE] rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0D9488] text-white flex items-center justify-center">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#40243B] tracking-tight">
              New Releases
            </h1>
            <p className="text-xs text-gray-600 font-semibold">
              The latest additions to the 777 Retro Arcade catalog
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#0D9488] text-white text-xs font-black uppercase tracking-wider">
          Fresh Weekly Drops
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {newGames.map((game) => (
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
