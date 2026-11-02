"use client";

import React, { useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Star,
  Search,
  Filter,
  Trophy,
  Dices,
  CircleDot,
  Layers,
  Gamepad2,
  CheckCircle2,
} from "lucide-react";
import HeroBanner from "@/components/arcade/HeroBanner";
import GameCard from "@/components/arcade/GameCard";
import { ARCADE_GAMES, ArcadeGame } from "@/data/arcadeGames";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import sound from "@/lib/sound";
import { Gift } from "lucide-react";

export default function ArcadeHomePage() {
  const { searchQuery, setSearchQuery, setActiveDemoGame, setIsFreePlayModalOpen } = useArcadeStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const featuredRowRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "ALL", label: "All Games", icon: Gamepad2 },
    { id: "Slots", label: "Slots", icon: Dices },
    { id: "Roulette", label: "Roulette", icon: CircleDot },
    { id: "Blackjack", label: "Blackjack", icon: Layers },
    { id: "Jackpot", label: "Jackpots", icon: Trophy },
    { id: "Arcade", label: "Arcade Hits", icon: Flame },
  ];

  // Filter games based on search query and category
  const filteredGames = useMemo(() => {
    let result = ARCADE_GAMES;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.theme.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      );
    } else if (selectedCategory !== "ALL") {
      result = result.filter((g) => g.category === selectedCategory);
    }

    return result;
  }, [searchQuery, selectedCategory]);

  const featuredGames = useMemo(() => {
    // Exact 8 games from reference screenshot 1
    return ARCADE_GAMES.slice(0, 8);
  }, []);

  const newGames = useMemo(() => {
    return ARCADE_GAMES.filter(
      (g) => g.badge === "NEW" || g.id === "sweet-bonanza" || g.id === "golden-treasure" || g.id === "wild-adventure"
    );
  }, []);

  const scrollFeatured = (direction: "left" | "right") => {
    sound.playChipClick();
    if (featuredRowRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      featuredRowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6 pb-8 select-none">
      {/* 1. HERO PROMOTIONAL BANNER */}
      <HeroBanner
        onPlayClick={() => {
          const featured = ARCADE_GAMES[0];
          setActiveDemoGame(featured);
        }}
      />

      {/* 2. CATEGORY PILL FILTER BAR */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id && !searchQuery.trim();
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playChipClick();
                  setSearchQuery("");
                  setSelectedCategory(cat.id);
                }}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 shadow-xs ${
                  isSelected
                    ? "bg-[#C33355] text-white shadow-md scale-105"
                    : "bg-[#FFF6D4] text-[#40243B] hover:bg-[#FFEEC0] border border-[#DECF9E]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-[#C33355]"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SEARCH RESULTS (Active when user types in search bar) */}
      {searchQuery.trim() ? (
        <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-[#40243B] tracking-tight">
              Search Results for <span className="text-[#C33355]">"{searchQuery}"</span>
            </h2>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-[#C33355] hover:underline"
            >
              Clear Search
            </button>
          </div>

          {filteredGames.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#FFF6D4] border-2 border-[#EADBBE] text-center space-y-2">
              <Search className="w-10 h-10 text-gray-400 mx-auto" />
              <div className="text-sm font-black text-[#40243B]">No Arcade Games Found</div>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Try searching for "Bass", "Rush", "Zeus", "Roulette", or explore categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={(g) => setActiveDemoGame(g)}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* ========================================================
              4. FEATURED GAMES (Matches Screenshot Reference)
              ======================================================== */}
          <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-[#40243B] tracking-tight">
                Featured Games
              </h2>
              {/* Carousel navigation arrows */}
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => scrollFeatured("left")}
                  className="w-8 h-8 rounded-full bg-[#FFF6D4] hover:bg-white text-[#40243B] border border-[#DECF9E] flex items-center justify-center shadow-xs transition active:scale-95"
                  aria-label="Previous Featured Games"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollFeatured("right")}
                  className="w-8 h-8 rounded-full bg-[#FFF6D4] hover:bg-white text-[#40243B] border border-[#DECF9E] flex items-center justify-center shadow-xs transition active:scale-95"
                  aria-label="Next Featured Games"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Carousel Row with Floating Gift Button */}
            <div className="relative">
              <div
                ref={featuredRowRef}
                className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-[#91D2BC] scrollbar-track-[#FFF6D4]/40 scroll-smooth pr-14"
              >
                {featuredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPlay={(g) => setActiveDemoGame(g)}
                  />
                ))}
              </div>

              {/* Floating Teal Gift Icon Button (Exact match to screenshot!) */}
              <button
                onClick={() => {
                  sound.playWin();
                  setIsFreePlayModalOpen(true);
                }}
                className="absolute right-2 bottom-6 z-20 w-11 h-11 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white flex items-center justify-center shadow-2xl border-2 border-white/80 transition-transform transform hover:scale-110 active:scale-95 animate-bounce"
                title="Claim Free Bonus Gift"
                aria-label="FreePlay Gift"
              >
                <Gift className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Track Indicator Bar (matches screenshot scrollbar styling) */}
            <div className="w-full flex items-center justify-between px-2 pt-1">
              <div className="h-1.5 w-full bg-[#B2DFC0] rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-[#7ABEA9] rounded-full animate-pulse" />
              </div>
            </div>
          </section>

          {/* ========================================================
              5. NEW GAMES SECTION (Matches Screenshot Reference)
              ======================================================== */}
          <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#40243B] tracking-tight">
                  New Games
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#0D9488] text-white text-[9px] font-black uppercase tracking-wider">
                  HOT PICKS
                </span>
              </div>

              <Link
                href="/new-games"
                onClick={() => sound.playChipClick()}
                className="px-4 py-1.5 rounded-full bg-[#FFF6D4] hover:bg-[#FFEEC0] border border-[#DECF9E] text-[#40243B] text-xs font-black transition shadow-xs flex items-center space-x-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Responsive Grid of New Games */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {newGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={(g) => setActiveDemoGame(g)}
                />
              ))}
            </div>
          </section>

          {/* ========================================================
              6. ARCADE & TABLE CLASSICS SECTION
              ======================================================== */}
          <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-[#40243B] tracking-tight">
                Arcade & Table Classics
              </h2>
              <span className="text-xs font-bold text-[#40243B]/70">
                100% Free Virtual Chips
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {ARCADE_GAMES.filter(
                (g) => g.category === "Roulette" || g.category === "Blackjack" || g.category === "Arcade"
              ).map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={(g) => setActiveDemoGame(g)}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
