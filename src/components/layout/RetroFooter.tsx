"use client";

import React from "react";
import Link from "next/link";
import { Shield, Sparkles, HeartHandshake, Info, Dices, Trophy, Award, Gamepad2 } from "lucide-react";
import sound from "@/lib/sound";

export default function RetroFooter() {
  return (
    <footer className="w-full bg-[#A2DAC6]/40 border-t border-[#7EBEA9] text-[#40243B] py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-[1500px] mx-auto space-y-8">
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FFF6D4]/80 border border-[#DECF9E] shadow-xs text-xs font-semibold">
          <div className="flex items-center space-x-2.5">
            <Gamepad2 className="w-5 h-5 text-[#C33355] shrink-0" />
            <div>
              <div className="font-black text-[#40243B]">100% Free to Play</div>
              <div className="text-[10px] text-[#40243B]/70">Zero real money gambling</div>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-black text-[#40243B]">Daily Bonus Drops</div>
              <div className="text-[10px] text-[#40243B]/70">+1,000 points every 24h</div>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <Trophy className="w-5 h-5 text-[#0D9488] shrink-0" />
            <div>
              <div className="font-black text-[#40243B]">Retro Sound & Physics</div>
              <div className="text-[10px] text-[#40243B]/70">Authentic arcade feel</div>
            </div>
          </div>
          <div className="flex items-center space-x-2.5">
            <Shield className="w-5 h-5 text-blue-700 shrink-0" />
            <div>
              <div className="font-black text-[#40243B]">Fair RNG Engine</div>
              <div className="text-[10px] text-[#40243B]/70">Mathematical simulation</div>
            </div>
          </div>
        </div>

        {/* 4 Column Sitemap & Legal Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          {/* Col 1: Brand & FreePlay Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="logo-777-badge px-3 py-1 rounded-xl">
                <span className="logo-777-text text-xl font-black">777</span>
              </div>
              <span className="text-base font-black tracking-wider text-[#40243B]">
                RETRO ARCADE
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#40243B]/80 max-w-md">
              777 Retro Arcade is an interactive social gaming and retro entertainment platform designed for players who love classic arcade slots, spinning wheels, roulette, and board games. All game modes utilize virtual FreePlay points with no real money, no deposits, and no financial risk.
            </p>
            <div className="flex items-center space-x-4 pt-1 text-[11px] font-bold text-[#40243B]/70">
              <span className="flex items-center space-x-1">
                <HeartHandshake className="w-4 h-4 text-[#C33355]" />
                <span>Play for Fun</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-[#0D9488]" />
                <span>Safe & Secure</span>
              </span>
              <span className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Simulated Results</span>
              </span>
            </div>
          </div>

          {/* Col 2: Arcade Categories */}
          <div className="space-y-2">
            <div className="font-black text-[#40243B] uppercase tracking-wider text-xs">
              Arcade Games
            </div>
            <div className="flex flex-col space-y-1.5 text-[11px] font-semibold text-[#40243B]/80">
              <Link href="/slots" className="hover:text-[#C33355] transition">
                Classic 777 Slots
              </Link>
              <Link href="/new-games" className="hover:text-[#C33355] transition">
                New Releases
              </Link>
              <Link href="/casino/roulette" className="hover:text-[#C33355] transition">
                European & American Roulette
              </Link>
              <Link href="/blackjack" className="hover:text-[#C33355] transition">
                Classic Blackjack
              </Link>
              <Link href="/casino/wheel" className="hover:text-[#C33355] transition">
                Lucky Spin Wheel
              </Link>
              <Link href="/jackpots" className="hover:text-[#C33355] transition">
                Virtual Jackpots
              </Link>
            </div>
          </div>

          {/* Col 3: Information & Compliance */}
          <div className="space-y-2">
            <div className="font-black text-[#40243B] uppercase tracking-wider text-xs">
              Platform Info
            </div>
            <div className="flex flex-col space-y-1.5 text-[11px] font-semibold text-[#40243B]/80">
              <Link href="/promotions" className="hover:text-[#C33355] transition">
                Arcade Promotions
              </Link>
              <Link href="/vip" className="hover:text-[#C33355] transition">
                VIP High Roller Club
              </Link>
              <button
                onClick={() => {
                  sound.playChipClick();
                  try {
                    localStorage.removeItem("777_arcade_cookie_consent");
                    window.location.reload();
                  } catch {}
                }}
                className="text-left hover:text-[#C33355] transition"
              >
                Cookie Preferences
              </button>
              <span className="text-[#40243B]/60 cursor-default">
                Community Guidelines
              </span>
              <span className="text-[#40243B]/60 cursor-default">
                Terms of Entertainment
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-6 border-t border-[#7EBEA9]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#40243B]/70 font-medium space-y-2 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} 777 Retro Arcade Platform. All rights reserved.
          </div>
          <div className="text-[10px] text-[#40243B]/60 text-center sm:text-right">
            Entertainment purposes only. Virtual points have no monetary value.
          </div>
        </div>
      </div>
    </footer>
  );
}
