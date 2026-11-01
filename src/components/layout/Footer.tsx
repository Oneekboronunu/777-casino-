import React from "react";
import Link from "next/link";
import { Shield, Lock, Award, HeartHandshake } from "lucide-react";
import { BKashLogo, NagadLogo, RocketLogo, UpayLogo, BankLogo } from "@/components/common/PaymentLogos";
import Bet777Logo from "@/components/common/Bet777Logo";

export default function Footer() {
  return (
    <footer className="w-full bg-[#080B0F] border-t border-[#141A23] text-gray-400 py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Payment Partners Bar */}
        <div>
          <div className="text-center text-xs uppercase font-extrabold tracking-wider text-gray-300 mb-4 flex items-center justify-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#95D600] animate-pulse" />
            <span>Official Instant 24/7 Payment & Banking Partners</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <BKashLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <NagadLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <RocketLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <UpayLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
            <BankLogo variant="badge" className="hover:scale-105 transition shadow-sm" />
          </div>
        </div>

        {/* Brand & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-[#141A23] text-xs">
          <div className="space-y-3 md:col-span-2">
            <Bet777Logo size="md" href="/" />
            <p className="text-gray-400 leading-relaxed text-[11px] max-w-md">
              bet777 is an elite online sports betting and casino gaming platform. We offer competitive live in-play odds across Cricket, Football, Tennis, and Basketball, alongside provably fair Casino Originals with instant local bKash, Nagad, and Rocket withdrawals.
            </p>
            <div className="flex items-center space-x-3 text-[11px] text-gray-500 pt-1">
              <span className="flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-[#95D600]" />
                <span>256-bit SSL Encrypted</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>RNG Certified Fair</span>
              </span>
              <span className="flex items-center space-x-1">
                <HeartHandshake className="w-3.5 h-3.5 text-red-500" />
                <span>18+ Play Responsibly</span>
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="font-extrabold text-white text-xs uppercase tracking-wider mb-2">
              Sports Betting
            </div>
            <div><Link href="/sports?sport=CRICKET" className="hover:text-[#95D600] transition">Cricket Markets (IPL & BPL)</Link></div>
            <div><Link href="/sports?sport=FOOTBALL" className="hover:text-[#95D600] transition">Premier League & Champions League</Link></div>
            <div><Link href="/sports?status=LIVE" className="hover:text-[#95D600] transition">Live In-Play Matches</Link></div>
            <div><Link href="/sports?boost=SUPER" className="hover:text-[#95D600] transition">777 Super Odds</Link></div>
          </div>

          <div className="space-y-1.5">
            <div className="font-extrabold text-white text-xs uppercase tracking-wider mb-2">
              Casino Originals
            </div>
            <div><Link href="/casino/wheel" className="hover:text-[#95D600] transition">Spin to Win (Lucky Wheel)</Link></div>
            <div><Link href="/casino/goti" className="hover:text-[#95D600] transition">24 Goti (Bead 12)</Link></div>
            <div><Link href="/casino/aviator" className="hover:text-[#95D600] transition">Aviator Crash</Link></div>
            <div><Link href="/casino/roulette" className="hover:text-[#95D600] transition">European Roulette 3D</Link></div>
            <div><Link href="/casino/carrom" className="hover:text-[#95D600] transition">Carrom Board Pro</Link></div>
            <div><Link href="/admin" className="hover:text-amber-400 transition font-mono text-[11px]">Admin Business Center</Link></div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#141A23] flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 space-y-2 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} bet777. All rights reserved. Licensed & Provably Fair.
          </div>
          <div className="flex space-x-4">
            <Link href="/" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/" className="hover:text-white transition">Fairness & RNG</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
