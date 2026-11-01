"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Layers,
  Dices,
  Activity,
  Coins,
  Trophy,
  Sparkles,
  ChevronRight,
  Star,
  Heart,
  Zap,
  ArrowRight,
} from "lucide-react";
import SportsBettingLayout from "@/components/sports/SportsBettingLayout";
import FlashscoreSportsView from "@/components/sports/FlashscoreSportsView";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";
import { BKashLogo, NagadLogo, RocketLogo, UpayLogo, BankLogo } from "@/components/common/PaymentLogos";
import { Radio, TableProperties } from "lucide-react";

export default function HomePage() {
  const { user, setIsDepositModalOpen, openAuthModal } = useUserStore();
  const [jackpotAmount, setJackpotAmount] = useState<number>(18452390);
  const [sportsViewMode, setSportsViewMode] = useState<"FLASHSCORE" | "MATRIX">("FLASHSCORE");

  // Progressive jackpot increment
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpotAmount((prev) => prev + Math.floor(15 + Math.random() * 45));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const casinoGames = [
    {
      title: "Spin to Win (Lucky Wheel)",
      desc: "Luxury casino wheel with weighted probability, Jackpot rewards & live admin hub",
      href: "/casino/wheel",
      icon: Sparkles,
      color: "from-purple-950 to-[#120624]",
      accent: "text-amber-400",
      badge: "HOT",
    },
    {
      title: "24 Goti (Bead 12)",
      desc: "Traditional South Asian board game with forts, multi-jumps, and live chat",
      href: "/casino/goti",
      icon: Layers,
      color: "from-amber-950 to-[#1A1108]",
      accent: "text-amber-500",
      badge: "CLASSIC",
    },
    {
      title: "Aviator Crash",
      desc: "Retro flight rocket curve with dual cashout consoles",
      href: "/casino/aviator",
      icon: Flame,
      color: "from-red-950 to-[#180A0E]",
      accent: "text-red-500",
      badge: "HOTTEST",
    },
    {
      title: "24/7 Hearts Online",
      desc: "Authentic 4-Player trick-taking, passing cycle & Shoot the Moon",
      href: "/casino/hearts",
      icon: Heart,
      color: "from-rose-950 to-[#180A12]",
      accent: "text-rose-400",
      badge: "4P PRO",
    },
    {
      title: "Carrom Board Pro",
      desc: "Authentic 2D physics board with Queen cover 10x jackpot",
      href: "/casino/carrom",
      icon: Layers,
      color: "from-yellow-950 to-[#161208]",
      accent: "text-amber-300",
      badge: "POPULAR",
    },
    {
      title: "European Roulette 3D",
      desc: "Single zero wheel with 36x straight up & outside bets",
      href: "/casino/roulette",
      icon: Dices,
      color: "from-emerald-950 to-[#0A1812]",
      accent: "text-[#95D600]",
      badge: "97.3% RTP",
    },
    {
      title: "Provably Fair Dice",
      desc: "99% RTP customizable slider with roll under/over multipliers",
      href: "/casino/dice",
      icon: Activity,
      color: "from-blue-950 to-[#0A121E]",
      accent: "text-blue-400",
      badge: "INSTANT ROLL",
    },
    {
      title: "Coin Flip Streak",
      desc: "Consecutive win multipliers scaling up to 100x cashout",
      href: "/casino/coinflip",
      icon: Coins,
      color: "from-purple-950 to-[#14081E]",
      accent: "text-yellow-400",
      badge: "FAST PACED",
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. BET777 PROMO BANNER (Modern Dark Sportsbook Hero) */}
      <section className="relative w-full bg-gradient-to-r from-[#0C121A] via-[#111A26] to-[#0C121A] border-b border-[#1A2534] py-6 sm:py-8 px-4 sm:px-8 overflow-hidden select-none">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#95D600]/15 border border-[#95D600]/30 text-[#95D600] text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#95D600] animate-pulse" />
              <span>SUPER ODDS LIVE • UP TO ৳25,000 WELCOME BONUS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Premier Sportsbook & Casino
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
              Real-time competitive in-play odds for Cricket, Football, and Basketball. Enjoy provably fair Casino Originals with instant local bKash, Nagad, and Rocket payouts.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => {
                if (user) {
                  setIsDepositModalOpen(true);
                } else {
                  openAuthModal("REGISTER");
                }
                sound.playWin();
              }}
              className="px-6 sm:px-8 py-3.5 rounded-full bg-[#95D600] hover:bg-[#85c200] text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(149,214,0,0.4)] active:scale-95"
            >
              Deposit & Play
            </button>
            <Link
              href="/casino/wheel"
              className="px-5 sm:px-7 py-3.5 rounded-full border border-amber-400/50 hover:border-amber-400 text-amber-300 hover:text-white font-black text-xs sm:text-sm uppercase tracking-wider transition bg-black/40 flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Spin to Win</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CORE SPORTS VISUALS (Flashscore Scores & Trading, or bet777 Matrix) */}
      <section className="w-full">
        {/* Experience Switcher Bar */}
        <div className="w-full bg-[#0B0F16] border-b border-[#16202D] px-4 sm:px-8 py-2.5">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 hidden sm:inline">
                Sports Mode:
              </span>
              <div className="flex items-center bg-[#131A24] p-1 rounded-xl border border-[#1E2938] overflow-x-auto scrollbar-none">
                {/* Flashscore Mode */}
                <button
                  onClick={() => {
                    sound.playChipClick();
                    setSportsViewMode("FLASHSCORE");
                  }}
                  className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition whitespace-nowrap ${
                    sportsViewMode === "FLASHSCORE"
                      ? "bg-[#95D600] text-black shadow-[0_0_12px_rgba(149,214,0,0.35)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Activity
                    className={`w-3.5 h-3.5 ${
                      sportsViewMode === "FLASHSCORE" ? "text-black" : "text-[#95D600]"
                    }`}
                  />
                  <span>Flashscore Scores & Trading</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-bold">
                    LIVE
                  </span>
                </button>

                {/* bet777 Matrix Mode */}
                <button
                  onClick={() => {
                    sound.playChipClick();
                    setSportsViewMode("MATRIX");
                  }}
                  className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition whitespace-nowrap ${
                    sportsViewMode === "MATRIX"
                      ? "bg-[#95D600] text-black shadow-[0_0_12px_rgba(149,214,0,0.35)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <TableProperties className="w-3.5 h-3.5" />
                  <span>bet777 Matrix</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
              <span className="w-2 h-2 rounded-full bg-[#95D600] animate-ping" />
              <span className="hidden md:inline text-gray-300">Live Match Tracking:</span>
              <span className="text-[#95D600] font-bold">Flashscore Real-Time Probabilities</span>
            </div>
          </div>
        </div>

        {/* View Component */}
        {sportsViewMode === "FLASHSCORE" ? (
          <FlashscoreSportsView />
        ) : (
          <SportsBettingLayout />
        )}
      </section>

      {/* 3. PROGRESSIVE GRAND JACKPOT TICKER */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#111721] via-[#162130] to-[#111721] border border-[#1F2E40] rounded-3xl p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shadow-lg">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="text-xs uppercase font-black tracking-widest text-[#95D600]">
                bet777 Progressive Mega Jackpot
              </div>
              <div className="text-2xl sm:text-4xl font-mono font-black text-white tracking-tight mt-0.5">
                ৳{jackpotAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-gray-400 font-medium">Last Mega Drop Winner</div>
              <div className="text-xs font-bold text-white">Tanvir H. (৳2,450,000)</div>
            </div>
            <button
              onClick={() => {
                if (user) {
                  setIsDepositModalOpen(true);
                } else {
                  openAuthModal("LOGIN");
                }
              }}
              className="px-6 py-3 rounded-full bg-[#95D600] hover:bg-[#85c200] text-black font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-[0_0_12px_rgba(149,214,0,0.3)]"
            >
              Play to Trigger
            </button>
          </div>
        </div>
      </div>

      {/* 4. INSTANT LOCAL PAYMENT LOGOS STRIP */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111721] border border-[#19232F] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#95D600] animate-ping" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-white">
              Instant 24/7 Deposits & Withdrawals (Bangladesh):
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div
              onClick={() => { setIsDepositModalOpen(true); sound.playChipClick(); }}
              className="cursor-pointer hover:scale-105 transition transform"
            >
              <BKashLogo variant="badge" />
            </div>
            <div
              onClick={() => { setIsDepositModalOpen(true); sound.playChipClick(); }}
              className="cursor-pointer hover:scale-105 transition transform"
            >
              <NagadLogo variant="badge" />
            </div>
            <div
              onClick={() => { setIsDepositModalOpen(true); sound.playChipClick(); }}
              className="cursor-pointer hover:scale-105 transition transform"
            >
              <RocketLogo variant="badge" />
            </div>
            <div
              onClick={() => { setIsDepositModalOpen(true); sound.playChipClick(); }}
              className="cursor-pointer hover:scale-105 transition transform"
            >
              <UpayLogo variant="badge" />
            </div>
            <div
              onClick={() => { setIsDepositModalOpen(true); sound.playChipClick(); }}
              className="cursor-pointer hover:scale-105 transition transform"
            >
              <BankLogo variant="badge" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. POPULAR CASINO ORIGINALS SHELF */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-black text-white tracking-wide uppercase">
              777 Casino Originals
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-medium">Provably Fair & Instant Payouts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {casinoGames.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.title}
                href={game.href}
                className="group relative bg-[#111721] hover:bg-[#141C28] border border-[#19232F] hover:border-[#95D600]/60 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 shadow-lg flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-[#16202C] border border-[#212E3F] group-hover:border-[#95D600] flex items-center justify-center transition">
                      <Icon className={`w-5 h-5 ${game.accent}`} />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#16202C] text-[#95D600] border border-[#95D600]/30">
                      {game.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-white group-hover:text-[#95D600] transition">
                      {game.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                      {game.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#19232F] flex items-center justify-between text-xs font-black text-[#95D600]">
                  <span>PLAY NOW</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
