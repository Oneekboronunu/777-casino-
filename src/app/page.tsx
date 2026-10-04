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
  ShieldCheck,
  Gift,
  ArrowRight,
  Sparkles,
  Users,
  ChevronRight,
  Star,
  X,
  Check,
} from "lucide-react";
import LiveMatchBanner from "@/components/sports/LiveMatchBanner";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";
import { BKashLogo, NagadLogo, RocketLogo, UpayLogo, BankLogo } from "@/components/common/PaymentLogos";

export default function HomePage() {
  const { user, setIsDepositModalOpen, openAuthModal } = useUserStore();
  const [jackpotAmount, setJackpotAmount] = useState<number>(18452390);
  const [showCookieCard, setShowCookieCard] = useState<boolean>(true);

  // Progressive jackpot increment
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpotAmount((prev) => prev + Math.floor(15 + Math.random() * 45));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const casinoGames = [
    {
      title: "Aviator Crash",
      desc: "Retro flight rocket curve with dual cashout consoles",
      href: "/casino/aviator",
      icon: Flame,
      color: "from-red-600/30 to-amber-600/10",
      accent: "text-[#BA2649]",
      badge: "HOTTEST",
    },
    {
      title: "Carrom Board Pro",
      desc: "Authentic 2D physics board with Queen cover 10x jackpot",
      href: "/casino/carrom",
      icon: Layers,
      color: "from-amber-600/30 to-yellow-600/10",
      accent: "text-[#D4AF37]",
      badge: "NEW RELEASE",
    },
    {
      title: "European Roulette 3D",
      desc: "Single zero wheel with 36x straight up & outside bets",
      href: "/casino/roulette",
      icon: Dices,
      color: "from-emerald-600/30 to-teal-600/10",
      accent: "text-[#0D9488]",
      badge: "97.3% RTP",
    },
    {
      title: "Provably Fair Dice",
      desc: "99% RTP customizable slider with roll under/over multipliers",
      href: "/casino/dice",
      icon: Activity,
      color: "from-blue-600/30 to-cyan-600/10",
      accent: "text-blue-400",
      badge: "INSTANT ROLL",
    },
    {
      title: "Coin Flip Streak",
      desc: "Consecutive win multipliers scaling up to 100x cashout",
      href: "/casino/coinflip",
      icon: Coins,
      color: "from-purple-600/30 to-pink-600/10",
      accent: "text-yellow-400",
      badge: "FAST PACED",
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION (Exact visual replica of 777 Las Vegas image) */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] vegas-hero-bg overflow-hidden flex flex-col items-center justify-center p-6 sm:p-12 select-none border-b border-[#D7A667]">
        {/* Palm Trees Left & Right SVG Decorative Silhouette */}
        <div className="absolute left-0 bottom-0 top-0 w-36 sm:w-64 pointer-events-none opacity-40 sm:opacity-75 z-0 flex items-end">
          <svg viewBox="0 0 200 400" className="w-full h-full object-contain">
            {/* Trunk */}
            <path d="M 30,400 Q 60,200 45,60 Q 40,40 50,30" stroke="#2B1B10" strokeWidth="12" fill="none" />
            {/* Leaves */}
            <path d="M 50,30 Q -10,-10 -20,60" stroke="#1D3E2E" strokeWidth="8" fill="none" />
            <path d="M 50,30 Q 110,-10 130,50" stroke="#1D3E2E" strokeWidth="8" fill="none" />
            <path d="M 50,30 Q 80,-30 60,-50" stroke="#2E5C46" strokeWidth="8" fill="none" />
            <path d="M 50,30 Q -10,-40 -40,-20" stroke="#2E5C46" strokeWidth="8" fill="none" />
          </svg>
        </div>

        <div className="absolute right-0 bottom-0 top-0 w-36 sm:w-64 pointer-events-none opacity-40 sm:opacity-75 z-0 flex items-end">
          <svg viewBox="0 0 200 400" className="w-full h-full object-contain transform scale-x-[-1]">
            <path d="M 30,400 Q 60,200 45,60 Q 40,40 50,30" stroke="#2B1B10" strokeWidth="12" fill="none" />
            <path d="M 50,30 Q -10,-10 -20,60" stroke="#1D3E2E" strokeWidth="8" fill="none" />
            <path d="M 50,30 Q 110,-10 130,50" stroke="#1D3E2E" strokeWidth="8" fill="none" />
            <path d="M 50,30 Q 80,-30 60,-50" stroke="#2E5C46" strokeWidth="8" fill="none" />
          </svg>
        </div>

        {/* Flying Birds Silhouette */}
        <div className="absolute top-16 left-1/4 opacity-40 pointer-events-none">
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
            <path d="M 10,20 Q 20,10 30,20 Q 40,10 50,20" stroke="#1B3338" strokeWidth="2" fill="none" />
            <path d="M 60,10 Q 70,0 80,10 Q 90,0 100,10" stroke="#1B3338" strokeWidth="2" fill="none" />
            <path d="M 40,35 Q 48,27 56,35 Q 64,27 72,35" stroke="#1B3338" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Las Vegas Retro Sign (Lower Left) */}
        <div className="absolute bottom-6 left-6 sm:left-14 hidden md:flex flex-col items-center z-10 pointer-events-none">
          <div className="relative bg-[#FEF9E7] border-2 border-[#D1345B] rounded-2xl px-4 py-3 text-center shadow-lg transform -rotate-3">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B] mx-auto mb-1 animate-pulse" />
            <div className="text-[9px] font-black text-[#1D3E2E] uppercase tracking-widest">
              WELCOME
            </div>
            <div className="text-[8px] text-[#381523] uppercase">TO Fabulous</div>
            <div className="text-xs font-black text-[#BA2649] tracking-wider uppercase">
              LAS VEGAS
            </div>
            <div className="text-[7px] text-[#0D9488] font-bold">NEVADA</div>
          </div>
          {/* Sign Pole */}
          <div className="w-2 h-16 bg-[#381523] mt-[-2px]" />
        </div>

        {/* Central Hero Offer Content */}
        <div className="relative z-10 text-center max-w-3xl space-y-4 my-auto">
          {/* "Get up to" in vintage dark serif font */}
          <h2 className="retro-hero-title text-2xl sm:text-4xl">
            Get up to
          </h2>

          {/* "$200 WELCOME BONUS" in 3D Yellow/Gold Extruded Font */}
          <div className="retro-3d-text text-4xl sm:text-6xl md:text-7xl leading-none py-2">
            $200 WELCOME BONUS
          </div>
          <div className="text-xs sm:text-sm font-bold text-[#381523] uppercase tracking-widest">
            OR ৳25,000 FIRST DEPOSIT BONUS
          </div>

          {/* "JOIN" Burgundy Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (user) {
                  setIsDepositModalOpen(true);
                } else {
                  openAuthModal("REGISTER");
                }
                sound.playWin();
              }}
              className="btn-burgundy px-14 sm:px-20 py-4 text-xl sm:text-2xl font-black uppercase tracking-wider rounded-xl shadow-retro"
            >
              JOIN
            </button>
          </div>

          {/* Promocode: WELCOME777 */}
          <div className="text-base sm:text-xl font-black text-[#D1345B] tracking-wide pt-1">
            Promocode: <span className="underline decoration-2">WELCOME777</span>
          </div>

          {/* Terms and Conditions Link */}
          <div>
            <button
              onClick={() => openAuthModal("REGISTER")}
              className="text-xs sm:text-sm text-[#D1345B] underline font-bold hover:text-[#BA2649] transition"
            >
              Terms and Conditions
            </button>
          </div>
        </div>

        {/* Cookie / Promo Overlay Card (Exact replica of lower right in screenshot) */}
        {showCookieCard && (
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 max-w-md w-full p-4 sm:p-5 retro-cream-card space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between">
              <div className="text-xs font-black text-[#381523]">This Website uses cookies</div>
              <button
                onClick={() => setShowCookieCard(false)}
                className="text-gray-400 hover:text-black p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-[#5A3845] leading-relaxed">
              We use cookies to improve your experience, tailor content and optimize functionality. For more information: <span className="underline cursor-pointer font-semibold">Cookie Policy</span>
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                onClick={() => setShowCookieCard(false)}
                className="text-[11px] text-[#381523] underline font-bold"
              >
                Customize Cookies
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowCookieCard(false)}
                  className="btn-burgundy px-3 py-1.5 text-[10px] uppercase font-bold"
                >
                  ACCEPT ESSENTIAL COOKIES ONLY
                </button>
                <button
                  onClick={() => setShowCookieCard(false)}
                  className="btn-burgundy px-4 py-1.5 text-[10px] uppercase font-bold"
                >
                  ACCEPT
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. PROGRESSIVE GRAND JACKPOT TICKER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1C141B] via-[#2A1820] to-[#1C141B] border-2 border-[#BA2649]/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#BA2649]/20 border-2 border-[#BA2649] flex items-center justify-center shadow-lg">
              <Star className="w-9 h-9 text-[#FFDE59] fill-[#FFDE59]" />
            </div>
            <div>
              <div className="text-xs uppercase font-black tracking-widest text-[#FFDE59]">
                777 PROGRESSIVE MEGA JACKPOT
              </div>
              <div className="text-3xl sm:text-5xl font-mono font-black text-[#FFDE59] tracking-tight mt-0.5">
                ৳{jackpotAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-400 font-medium">Last Mega Drop Winner</div>
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
              className="btn-burgundy px-7 py-3 text-xs uppercase tracking-wider font-black shadow-retro"
            >
              Play to Trigger
            </button>
          </div>
        </div>
      </div>

      {/* 2.5 INSTANT LOCAL PAYMENT LOGOS STRIP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#101726]/90 border border-[#23334E] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-white">
              Instant 24/7 Deposits & Withdrawals:
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

      {/* 3. LIVE SPORTSBOOK HIGHLIGHTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-[#BA2649]" />
            <h2 className="text-lg font-black text-white tracking-wide uppercase">
              LIVE SPORTS PREDICTION (IPL & UCL)
            </h2>
          </div>
          <Link
            href="/sports"
            className="text-xs font-bold text-[#FFDE59] hover:underline flex items-center space-x-1"
          >
            <span>View All Sports Markets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <LiveMatchBanner />
      </div>

      {/* 4. FEATURED CASINO ORIGINALS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-[#BA2649]" />
            <h2 className="text-lg font-black text-white tracking-wide uppercase">
              777 CASINO ORIGINALS
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-medium">Provably Fair & Instant Payouts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {casinoGames.map((game) => {
            const Icon = game.icon;
            return (
              <Link
                key={game.title}
                href={game.href}
                className="group relative casino-card hover:border-[#BA2649] rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] shadow-lg flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#281822] border border-[#442335] group-hover:border-[#BA2649] flex items-center justify-center transition">
                      <Icon className={`w-6 h-6 ${game.accent}`} />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#BA2649]/20 text-[#FFDE59] border border-[#BA2649]/40">
                      {game.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-[#FFDE59] transition">
                      {game.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {game.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#342230] flex items-center justify-between text-xs font-black text-[#FFDE59]">
                  <span>PLAY NOW</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition text-[#BA2649]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
