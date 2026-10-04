import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Award, Flame, CreditCard } from "lucide-react";
import { BKashLogo, NagadLogo, RocketLogo, UpayLogo, BankLogo } from "@/components/common/PaymentLogos";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0E070C] border-t border-[#342230] text-gray-400 py-10 px-4 sm:px-6 lg:px-8 content-lazy">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Payment Partners Bar */}
        <div>
          <div className="text-center text-xs uppercase font-bold tracking-wider text-[#FFDE59] mb-4">
            Official Instant Payment Methods & Banking Partners (BD Local)
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <BKashLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <NagadLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <RocketLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <UpayLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <BankLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
          </div>
        </div>

        {/* Brand & Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-[#342230] text-xs">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="logo-777-badge px-2.5 py-0.5 rounded-lg flex items-center justify-center">
                <span className="logo-777-text text-sm font-black tracking-wider leading-none">
                  777
                </span>
              </div>
              <span className="font-extrabold text-white text-sm">777 CASINO & SPORTSBOOK</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-[11px] max-w-md">
              777 Casino operates with certified random number generator (RNG) verification and real-time provably fair cryptographic hashing. Fast local bKash & Nagad withdrawals and 24/7 dedicated support.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-[#FFDE59] text-xs uppercase tracking-wider mb-2">Casino Originals</div>
            <div><Link href="/casino/aviator" className="hover:text-white transition">Aviator Crash</Link></div>
            <div><Link href="/casino/carrom" className="hover:text-white transition">Carrom Board Pro</Link></div>
            <div><Link href="/casino/roulette" className="hover:text-white transition">European Roulette 3D</Link></div>
            <div><Link href="/casino/dice" className="hover:text-white transition">Provably Fair Dice</Link></div>
            <div><Link href="/casino/coinflip" className="hover:text-white transition">Coin Flip Streak</Link></div>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-[#FFDE59] text-xs uppercase tracking-wider mb-2">Sports Prediction</div>
            <div><Link href="/sports?sport=CRICKET" className="hover:text-white transition">IPL 2026 Prediction</Link></div>
            <div><Link href="/sports?sport=CRICKET" className="hover:text-white transition">BPL Matches</Link></div>
            <div><Link href="/sports?sport=FOOTBALL" className="hover:text-white transition">UEFA Champions League</Link></div>
            <div><Link href="/sports?sport=FOOTBALL" className="hover:text-white transition">Premier League</Link></div>
            <div><Link href="/account" className="hover:text-white transition">VIP Loyalty Rewards</Link></div>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="pt-6 border-t border-[#342230] flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 bg-[#BA2649]/20 text-[#FFDE59] font-bold rounded">18+</span>
            <span>Gambling can be addictive. Play responsibly.</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Curacao License #8048/JAZ</span>
            </span>
            <span className="flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-[#FFDE59]" />
              <span>256-Bit SSL Encrypted</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
