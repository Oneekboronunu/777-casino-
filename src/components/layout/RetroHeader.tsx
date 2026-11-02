"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  HelpCircle,
  Coins,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import sound from "@/lib/sound";

interface RetroHeaderProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onToggleMobileNav?: () => void;
  onOpenHelp?: () => void;
}

export default function RetroHeader({
  searchQuery: propSearchQuery,
  onSearchChange: propOnSearchChange,
  onToggleMobileNav,
  onOpenHelp,
}: RetroHeaderProps) {
  const { user, openAuthModal, setUser, addCoins, showNotification } = useUserStore();
  const {
    searchQuery: storeSearchQuery,
    setSearchQuery: storeSetSearchQuery,
    freePlayPoints,
    addFreePlayPoints,
    setIsHelpModalOpen,
  } = useArcadeStore();

  const currentSearch = propSearchQuery !== undefined ? propSearchQuery : storeSearchQuery;
  const handleSearchChange = (val: string) => {
    if (propOnSearchChange) propOnSearchChange(val);
    storeSetSearchQuery(val);
  };

  const handleClaimFreeDaily = () => {
    sound.playWin();
    addCoins(1000, "Daily Arcade Bonus");
    addFreePlayPoints(1000);
    showNotification("Claimed 1,000 Daily FreePlay Points!", "SUCCESS");
  };

  return (
    <header className="sticky top-0 z-30 w-full h-14 bg-[#FFF6D4] border-b border-[#E8DCBC] shadow-xs px-4 sm:px-6 flex items-center justify-between select-none">
      {/* LEFT: Search Bar */}
      <div className="flex items-center space-x-3 flex-1 max-w-md">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-1.5 rounded-lg text-[#40243B] hover:bg-[#F2E5C0] transition"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mint Green Pill Search Bar */}
        <div className="relative w-full max-w-sm sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[#40243B]/80" />
          </div>
          <input
            type="text"
            value={currentSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Find Games, Themes, Studios"
            className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#91D2BC] hover:bg-[#86CAB3] focus:bg-[#86CAB3] text-[#40243B] placeholder-[#40243B]/70 text-xs font-semibold outline-none transition-all duration-200 border border-[#7DBEA9]/60 shadow-inner"
          />
        </div>
      </div>

      {/* RIGHT: Actions & Authentication */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Help Button (?) */}
        <button
          onClick={() => {
            if (onOpenHelp) onOpenHelp();
            else setIsHelpModalOpen(true);
            sound.playChipClick();
          }}
          className="w-8 h-8 rounded-lg bg-[#F5ECC4] hover:bg-[#EADBAB] border border-[#DECF9E] text-[#40243B] flex items-center justify-center font-black text-sm shadow-xs transition"
          title="Help & Arcade Information"
        >
          ?
        </button>

        {user ? (
          /* User is logged in: Points Pill & Logout */
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClaimFreeDaily}
              className="px-3 py-1 rounded-full bg-[#E5F5ED] border border-[#91D2BC] text-[#40243B] font-bold text-xs flex items-center space-x-1 hover:bg-[#D4EFE3] transition"
              title="Click to claim Daily Free Points"
            >
              <Coins className="w-3.5 h-3.5 text-[#C33355]" />
              <span className="font-mono font-black text-[#C33355]">
                {(user.coins ?? 15000).toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-600 hidden sm:inline">PTS</span>
            </button>

            <button
              onClick={() => {
                setUser(null);
                sound.playChipClick();
                showNotification("Logged out successfully", "INFO");
              }}
              className="p-1.5 rounded-lg text-gray-500 hover:text-[#C33355] hover:bg-[#F2E5C0] transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Exact Match to Screenshot: Teal SIGN UP + Mint LOG IN */
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                openAuthModal("REGISTER");
                sound.playChipClick();
              }}
              className="px-4 sm:px-5 py-1.5 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-xs uppercase tracking-wider transition shadow-sm active:scale-95"
            >
              SIGN UP
            </button>

            <button
              onClick={() => {
                openAuthModal("LOGIN");
                sound.playChipClick();
              }}
              className="px-4 sm:px-5 py-1.5 rounded-lg bg-[#E6F4EE] hover:bg-white text-[#C33355] border-1.5 border-[#C33355] font-black text-xs uppercase tracking-wider transition shadow-xs active:scale-95"
            >
              LOG IN
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
