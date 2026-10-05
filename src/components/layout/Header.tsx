"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  PlusCircle,
  Volume2,
  VolumeX,
  User,
  Shield,
  LogOut,
  Flame,
  Trophy,
  Dices,
  ChevronDown,
  Layers,
  Sparkles,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

export default function Header() {
  const pathname = usePathname();
  const { user, setIsDepositModalOpen, setIsWithdrawModalOpen, openAuthModal, setUser } = useUserStore();
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FBF3DE] border-b border-[#E6D7B8] shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: 777 Retro Badge Logo */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative logo-777-badge px-3.5 py-1.5 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="logo-777-text text-2xl font-black tracking-wider leading-none">
                777
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="font-black text-sm tracking-wider text-[#381523] uppercase">
                CASINO & SPORTS
              </div>
              <div className="text-[10px] tracking-widest text-[#BA2649] font-bold">
                RETRO VEGAS EDITION
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1.5">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                pathname === "/"
                  ? "bg-[#381523] text-[#FFDE59]"
                  : "text-[#381523] hover:bg-[#EEDEB8]"
              }`}
            >
              Home
            </Link>
            <Link
              href="/sports"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                pathname.startsWith("/sports")
                  ? "bg-[#381523] text-[#FFDE59]"
                  : "text-[#381523] hover:bg-[#EEDEB8]"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#BA2649]" />
              <span>Sportsbook</span>
              <span className="px-1.5 py-0.2 bg-[#BA2649] text-white text-[9px] font-black rounded-full">
                LIVE
              </span>
            </Link>
            <Link
              href="/casino/aviator"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                pathname.includes("aviator")
                  ? "bg-[#381523] text-[#FFDE59]"
                  : "text-[#381523] hover:bg-[#EEDEB8]"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#BA2649]" />
              <span>Aviator</span>
            </Link>
            <Link
              href="/casino/carrom"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                pathname.includes("carrom")
                  ? "bg-[#381523] text-[#FFDE59]"
                  : "text-[#381523] hover:bg-[#EEDEB8]"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>Carrom Board</span>
            </Link>
            <Link
              href="/casino/roulette"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                pathname.includes("roulette")
                  ? "bg-[#381523] text-[#FFDE59]"
                  : "text-[#381523] hover:bg-[#EEDEB8]"
              }`}
            >
              <Dices className="w-3.5 h-3.5 text-[#BA2649]" />
              <span>Roulette 3D</span>
            </Link>
          </nav>
        </div>

        {/* Right Section: Sound, Balance & 777 Login / Sign Up */}
        <div className="flex items-center space-x-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 text-[#381523] hover:text-[#BA2649] bg-[#FEF9E7] border border-[#E6D7B8] rounded-xl transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-2.5">
              {/* Balance Card */}
              <div
                onClick={() => setIsDepositModalOpen(true)}
                className="hidden sm:flex items-center bg-[#FEF9E7] border-2 border-[#E6D7B8] hover:border-[#BA2649] rounded-xl px-3.5 py-1.5 cursor-pointer transition shadow-sm"
              >
                <div className="mr-3">
                  <div className="text-[10px] text-[#6B4B58] font-bold">Cash Balance</div>
                  <div className="text-sm font-mono font-black text-[#10B981]">
                    ৳{(user.balance ?? 0).toLocaleString()}
                  </div>
                </div>
                {(user.bonusBalance ?? 0) > 0 && (
                  <div className="border-l border-[#E6D7B8] pl-2.5">
                    <div className="text-[10px] text-[#6B4B58] font-bold">Bonus</div>
                    <div className="text-xs font-mono font-black text-[#BA2649]">
                      ৳{(user.bonusBalance ?? 0).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Deposit Button */}
              <button
                onClick={() => {
                  setIsDepositModalOpen(true);
                  sound.playChipClick();
                }}
                className="btn-burgundy px-4 py-2 text-xs uppercase tracking-wider"
              >
                + Deposit
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1.5 p-1.5 bg-[#FEF9E7] border-2 border-[#E6D7B8] hover:border-[#BA2649] rounded-xl transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#BA2649] text-[#FFDE59] flex items-center justify-center font-black text-xs">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#381523]" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#FEF9E7] border-2 border-[#E6D7B8] rounded-xl shadow-2xl py-2 z-50 text-xs text-[#381523]">
                    <div className="px-3.5 py-2 border-b border-[#E6D7B8]">
                      <div className="font-bold text-[#381523] truncate">{user.name}</div>
                      <div className="text-[10px] text-[#6B4B58] truncate">{user.email}</div>
                      <span className="mt-1 inline-block px-1.5 py-0.5 bg-[#BA2649]/15 text-[#BA2649] rounded text-[9px] font-black">
                        {user.role} MEMBER
                      </span>
                    </div>

                    <Link
                      href="/wallet"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-3.5 py-2 hover:bg-[#F3E5C8] font-semibold"
                    >
                      <Wallet className="w-4 h-4 text-[#BA2649]" />
                      <span>Wallet & Banking</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsWithdrawModalOpen(true);
                      }}
                      className="w-full flex items-center space-x-2 px-3.5 py-2 hover:bg-[#F3E5C8] text-left font-semibold"
                    >
                      <PlusCircle className="w-4 h-4 text-[#10B981]" />
                      <span>Withdraw Cash</span>
                    </button>

                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-3.5 py-2 hover:bg-[#F3E5C8] font-semibold"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Account & Bets</span>
                    </Link>

                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-3.5 py-2 text-[#BA2649] hover:bg-[#F3E5C8] font-bold"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Controller</span>
                      </Link>
                    )}

                    <div className="border-t border-[#E6D7B8] mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUser(null);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3.5 py-2 text-red-600 hover:bg-[#F3E5C8] text-left font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Screenshot Replica: Burgundy LOGIN + Teal SIGN UP */
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => {
                  openAuthModal("LOGIN");
                  sound.playChipClick();
                }}
                className="btn-burgundy px-7 py-2 text-xs uppercase tracking-wider font-black shadow-retro"
              >
                LOGIN
              </button>

              <button
                onClick={() => {
                  openAuthModal("REGISTER");
                  sound.playChipClick();
                }}
                className="btn-teal-outline px-6 py-2 text-xs uppercase tracking-wider font-black shadow-sm"
              >
                SIGN UP
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
