"use client";

import React from "react";
import { Play, Sparkles } from "lucide-react";
import { ArcadeGame } from "@/data/arcadeGames";
import sound from "@/lib/sound";

interface GameCardProps {
  game: ArcadeGame;
  onPlay: (game: ArcadeGame) => void;
}

export default function GameCard({ game, onPlay }: GameCardProps) {
  return (
    <div
      onClick={() => {
        sound.playChipClick();
        onPlay(game);
      }}
      className="group relative w-36 sm:w-44 h-52 sm:h-60 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.03] select-none shrink-0 border border-[#91D2BC]/60 bg-gradient-to-br from-white/10 to-black/30"
    >
      {/* Background Thematic Artwork Container */}
      <div
        className={`w-full h-full bg-gradient-to-b ${game.bgGradient} flex flex-col justify-between p-3 relative overflow-hidden`}
      >
        {/* Artwork Visual Motif */}
        <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
          {game.artworkType === "fisherman" && (
            <div className="flex flex-col items-center">
              <span className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                🤠
              </span>
              <span className="text-2xl mt-1 animate-pulse">🐟</span>
            </div>
          )}
          {game.artworkType === "egypt" && (
            <div className="flex flex-col items-center">
              <span className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                🏛️
              </span>
              <span className="text-2xl mt-1 text-yellow-300">⚱️</span>
            </div>
          )}
          {game.artworkType === "candy" && (
            <div className="flex flex-col items-center">
              <span className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                🧸
              </span>
              <span className="text-2xl mt-1">🍭</span>
            </div>
          )}
          {game.artworkType === "roulette" && (
            <div className="flex flex-col items-center">
              <span className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                🎡
              </span>
              <span className="text-2xl mt-1">🔥</span>
            </div>
          )}
          {game.artworkType === "zeus" && (
            <div className="flex flex-col items-center">
              <span className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                ⚡
              </span>
              <span className="text-2xl mt-1">👑</span>
            </div>
          )}
          {game.artworkType === "fruit" && (
            <div className="flex flex-col items-center">
              <span className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                🍓
              </span>
              <span className="text-2xl mt-1">🍬</span>
            </div>
          )}
          {game.artworkType === "plane" && (
            <div className="flex flex-col items-center">
              <span className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                ✈️
              </span>
              <span className="text-2xl mt-1">📈</span>
            </div>
          )}
          {game.artworkType === "wheel" && (
            <div className="flex flex-col items-center">
              <span className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                🎯
              </span>
              <span className="text-2xl mt-1">💎</span>
            </div>
          )}
          {game.artworkType === "cards" && (
            <div className="flex flex-col items-center">
              <span className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                ♠️
              </span>
              <span className="text-2xl mt-1">🃏</span>
            </div>
          )}
        </div>

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between w-full">
          {game.badge ? (
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-sm ${
                game.badge === "NEW"
                  ? "bg-[#0D9488]"
                  : game.badge === "HOT"
                  ? "bg-red-600"
                  : "bg-[#C33355]"
              }`}
            >
              {game.badge}
            </span>
          ) : (
            <span />
          )}

          <span className="px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-xs text-white/90 text-[9px] font-mono font-bold">
            {game.category}
          </span>
        </div>

        {/* Center Hover Play Button */}
        <div className="relative z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-[#C33355] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          </div>
        </div>

        {/* Bottom Title Bar Overlay */}
        <div className="relative z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent -mx-3 -mb-3 p-3 pt-5 rounded-b-2xl sm:rounded-b-3xl">
          <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-[#FFE58B] transition-colors truncate drop-shadow-sm">
            {game.title}
          </h3>
          <div className="flex items-center justify-between mt-0.5 text-[10px] text-gray-300">
            <span className="text-yellow-300 font-bold">Free Demo</span>
            <span className="font-mono text-emerald-300">{game.rtp || "96.5%"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
