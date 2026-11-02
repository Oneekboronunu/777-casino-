"use client";

import React, { useState } from "react";
import GameCard from "@/components/arcade/GameCard";
import { ARCADE_GAMES, ArcadeGame } from "@/data/arcadeGames";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import { Dices, Sparkles, Filter } from "lucide-react";
import sound from "@/lib/sound";

export default function SlotsPage() {
  const { setActiveDemoGame } = useArcadeStore();
  const [selectedTheme, setSelectedTheme] = useState<string>("ALL");

  const slotGames = ARCADE_GAMES.filter((g) => g.category === "Slots");

  const themes = ["ALL", "Fish", "Mythology", "Candy", "Adventure"];

  const filteredSlots = selectedTheme === "ALL"
    ? slotGames
    : slotGames.filter((g) => g.theme === selectedTheme);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6 select-none">
      {/* Page Header */}
      <div className="bg-[#FFF6D4] border-2 border-[#EADBBE] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-[#C33355] text-white flex items-center justify-center">
              <Dices className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#40243B] tracking-tight">
                Arcade Slots
              </h1>
              <p className="text-xs text-gray-600 font-semibold">
                100% Free Virtual Spins • Authentic Cascades & Reel Mechanics
              </p>
            </div>
          </div>
        </div>

        {/* Theme Filter Pills */}
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => {
                sound.playChipClick();
                setSelectedTheme(theme);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                selectedTheme === theme
                  ? "bg-[#C33355] text-white shadow-sm"
                  : "bg-white/80 hover:bg-white text-[#40243B] border border-[#DECF9E]"
              }`}
            >
              {theme === "ALL" ? "All Themes" : theme}
            </button>
          ))}
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {filteredSlots.map((game) => (
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
