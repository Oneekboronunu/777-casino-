import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Award, Flame, CreditCard } from "lucide-react";
import { BKashLogo, NagadLogo, RocketLogo, UpayLogo, BankLogo } from "@/components/common/PaymentLogos";

export default function Footer() {
  return (
    <footer className="w-full bg-[#080B12] border-t border-[#23334E] text-gray-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Payment Partners Bar */}
        <div>
          <div className="text-center text-xs uppercase font-bold tracking-wider text-gray-500 mb-4">
            Official Instant Payment Methods & Banking Partners (BD Local)
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <BKashLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <NagadLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <RocketLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <UpayLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <BankLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white hover:scale-105 transition">
              <CreditCard className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-extrabold text-xs tracking-wider text-gray-200">Visa / MC</span>
            </div>
          </div>
        </div>

        {/* Brand & Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-[#23334E]/60 text-xs">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-extrabold text-white text-sm">AURA CASINO & SPORTSBOOK</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-[11px] max-w-md">
              Aura Casino operates with certified random number generator (RNG) verification and real-time provably fair cryptographic hashing. Fast local withdrawals and 24/7 dedicated support.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">Casino Originals</div>
            <div><Link href="/casino/aviator" className="hover:text-white">Aviator Crash</Link></div>
            <div><Link href="/casino/carrom" className="hover:text-white">Carrom Board Pro</Link></div>
            <div><Link href="/casino/roulette" className="hover:text-white">European Roulette 3D</Link></div>
            <div><Link href="/casino/dice" className="hover:text-white">Provably Fair Dice</Link></div>
            <div><Link href="/casino/coinflip" className="hover:text-white">Coin Flip Streak</Link></div>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">Sports Prediction</div>
            <div><Link href="/sports?sport=CRICKET" className="hover:text-white">IPL 2026 Prediction</Link></div>
            <div><Link href="/sports?sport=CRICKET" className="hover:text-white">BPL Matches</Link></div>
            <div><Link href="/sports?sport=FOOTBALL" className="hover:text-white">UEFA Champions League</Link></div>
            <div><Link href="/sports?sport=FOOTBALL" className="hover:text-white">Premier League</Link></div>
            <div><Link href="/account" className="hover:text-white">VIP Loyalty Rewards</Link></div>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="pt-6 border-t border-[#23334E]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-bold rounded">18+</span>
            <span>Gambling can be addictive. Play responsibly.</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Curacao License #8048/JAZ</span>
            </span>
            <span className="flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>256-Bit SSL Encrypted</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
