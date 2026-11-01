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
  Sparkles,
  Search,
  Radio,
  Star,
  Award,
  Layers,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";
import Bet777Logo from "@/components/common/Bet777Logo";
import TopUtilityBar from "./TopUtilityBar";

export default function Header() {
  const rawPathname = usePathname();
  const pathname = rawPathname || "";
  const {
    user,
    setIsDepositModalOpen,
    setIsWithdrawModalOpen,
    setIsCoinStoreOpen,
    openAuthModal,
    setUser,
  } = useUserStore();

  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const isSportsActive = pathname === "/" || pathname.startsWith("/sports");
  const isLiveActive = pathname.includes("status=LIVE");
  const isCasinoActive = pathname.startsWith("/casino");
  const isPromosActive = pathname.includes("promo");

  return (
    <header className="sticky top-0 z-40 w-full select-none shadow-md">
      {/* 1. TOP UTILITY BAR */}
      <TopUtilityBar />

      {/* 2. PRIMARY HEADER (Exact replica of bet777 screenshot) */}
      <div className="w-full bg-[#0D131A] border-b border-[#1A2330]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand Logo & Main Nav Tabs */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <Bet777Logo size="md" href="/" />

            {/* Primary Nav Links */}
            <nav className="flex items-center space-x-1 sm:space-x-2">
              <Link
                href="/sports"
                className={`relative px-3 sm:px-4 py-5 text-sm font-black transition tracking-wide ${
                  isSportsActive && !isLiveActive && !isCasinoActive
                    ? "text-[#95D600]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span>Sports</span>
                {isSportsActive && !isLiveActive && !isCasinoActive && (
                  <span className="absolute bottom-0 inset-x-2 h-1 bg-[#95D600] rounded-t-full shadow-[0_0_8px_#95D600]" />
                )}
              </Link>

              <Link
                href="/sports?status=LIVE"
                className={`relative px-3 sm:px-4 py-5 text-sm font-black transition tracking-wide flex items-center space-x-1.5 ${
                  isLiveActive
                    ? "text-[#95D600]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Live</span>
                {isLiveActive && (
                  <span className="absolute bottom-0 inset-x-2 h-1 bg-[#95D600] rounded-t-full shadow-[0_0_8px_#95D600]" />
                )}
              </Link>

              <Link
                href="/casino/wheel"
                className={`relative px-3 sm:px-4 py-5 text-sm font-black transition tracking-wide ${
                  isCasinoActive
                    ? "text-[#95D600]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span>Casino</span>
                {isCasinoActive && (
                  <span className="absolute bottom-0 inset-x-2 h-1 bg-[#95D600] rounded-t-full shadow-[0_0_8px_#95D600]" />
                )}
              </Link>

              <Link
                href="/"
                className="hidden md:inline-block px-3 sm:px-4 py-5 text-sm font-black text-gray-300 hover:text-white transition tracking-wide"
              >
                <span>Promotions</span>
              </Link>
            </nav>
          </div>

          {/* Right: Auth / Balances / Search / Sound */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="w-9 h-9 rounded-full bg-[#16202C] hover:bg-[#1E2B3B] text-gray-400 hover:text-white flex items-center justify-center transition border border-[#243345]"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Circular Search Button */}
            <button
              onClick={() => sound.playChipClick()}
              className="w-9 h-9 rounded-full bg-[#16202C] hover:bg-[#1E2B3B] text-gray-300 hover:text-white flex items-center justify-center transition border border-[#243345]"
              title="Search Matches or Games"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User State */}
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Coins Pill */}
                <div
                  onClick={() => setIsCoinStoreOpen(true)}
                  className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#16202C] border border-amber-500/40 cursor-pointer hover:border-amber-400 transition"
                  title="Buy 777 Coins"
                >
                  <span className="text-xs">🪙</span>
                  <span className="text-xs font-mono font-black text-amber-300">
                    {(user.coins ?? 999).toLocaleString()}
                  </span>
                </div>

                {/* Cash Balance */}
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#16202C] border border-[#243345]">
                  <span className="text-xs font-bold text-gray-400">৳</span>
                  <span className="text-xs font-mono font-black text-[#95D600]">
                    {(user.balance ?? 0).toLocaleString()}
                  </span>
                </div>

                {/* Deposit Button */}
                <button
                  onClick={() => setIsDepositModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#95D600] hover:bg-[#85c200] text-black font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-sm"
                >
                  + Deposit
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1.5 p-1 rounded-full bg-[#16202C] border border-[#243345] hover:border-gray-500 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-xs font-black text-black">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 pr-1" />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      onClick={() => setIsUserMenuOpen(false)}
                      className="absolute right-0 mt-2 w-52 bg-[#121922] border border-[#243345] rounded-2xl p-2 shadow-2xl z-50 space-y-1 animate-in fade-in duration-150"
                    >
                      <div className="px-3 py-2 border-b border-[#243345]">
                        <div className="text-xs font-bold text-white truncate">{user.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{user.phone || user.email}</div>
                      </div>

                      <Link
                        href="/account"
                        className="flex items-center space-x-2 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition"
                      >
                        <User className="w-4 h-4 text-[#95D600]" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>Admin Hub</span>
                      </Link>

                      <button
                        onClick={() => {
                          setUser(null);
                          sessionStorage.removeItem("auth_token");
                          sound.playChipClick();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Auth Buttons matching exact bet777 screenshot */
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal("REGISTER")}
                  className="px-4 sm:px-5 py-2 rounded-full border border-white/50 hover:border-white text-white font-black text-xs uppercase tracking-wider transition active:scale-95"
                >
                  Register
                </button>
                <button
                  onClick={() => openAuthModal("LOGIN")}
                  className="px-4 sm:px-5 py-2 rounded-full bg-[#95D600] hover:bg-[#85c200] text-black font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-[0_0_12px_rgba(149,214,0,0.3)]"
                >
                  Log In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. SECONDARY QUICK SUB-BAR (Exact replica of bet777 sub-nav) */}
      <div className="w-full bg-[#111822] border-b border-[#1A2432] text-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-6 sm:space-x-8 text-gray-300 font-bold whitespace-nowrap">
            <Link
              href="/"
              className={`flex items-center space-x-1.5 transition ${
                pathname === "/" ? "text-[#95D600]" : "hover:text-white"
              }`}
            >
              <span>🏠 Home</span>
            </Link>

            <Link
              href="/sports?status=LIVE"
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition"
            >
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>Live</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#95D600] text-black text-[10px] font-black">
                106
              </span>
            </Link>

            <Link
              href="/sports?boost=SUPER"
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition"
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>777 Super Odds</span>
            </Link>

            <Link
              href="/sports"
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Tournaments</span>
            </Link>

            <Link
              href="/casino/wheel"
              className="flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Spin to Win</span>
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black uppercase">
                HOT
              </span>
            </Link>

            <Link
              href="/casino/goti"
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>24 Goti</span>
            </Link>

            <Link
              href="/casino/aviator"
              className="flex items-center space-x-1.5 text-gray-300 hover:text-white transition"
            >
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>Aviator</span>
            </Link>
          </div>

          {/* Right: Quick Admin Link */}
          <Link
            href="/admin"
            className="hidden lg:flex items-center space-x-1 text-gray-400 hover:text-amber-400 transition font-mono text-[11px]"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
