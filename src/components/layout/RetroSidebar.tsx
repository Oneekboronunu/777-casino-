"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Gift,
  Dices,
  Star,
  CircleDot,
  Layers,
  UserCheck,
  Trophy,
  Crown,
  Bell,
  Coins,
  RotateCcw,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import sound from "@/lib/sound";

interface RetroSidebarProps {
  onOpenNotifications?: () => void;
  onOpenFreePlay?: () => void;
  mobileNavOpen?: boolean;
  onCloseMobileNav?: () => void;
}

export default function RetroSidebar({
  onOpenNotifications,
  onOpenFreePlay,
  mobileNavOpen,
  onCloseMobileNav,
}: RetroSidebarProps) {
  const rawPathname = usePathname();
  const pathname = rawPathname || "";
  const { user, openAuthModal, addCoins } = useUserStore();
  const {
    freePlayPoints,
    resetFreePlayPoints,
    setIsNotificationsOpen,
    setIsFreePlayModalOpen,
  } = useArcadeStore();

  const navItems = [
    { id: "promotions", label: "Promotions", href: "/promotions", icon: Gift },
    { id: "home", label: "Home", href: "/", icon: Heart },
    { id: "slots", label: "Slots", href: "/slots", icon: Dices },
    { id: "new", label: "New Games", href: "/new-games", icon: Star },
    { id: "roulette", label: "Roulette", href: "/casino/roulette", icon: CircleDot },
    { id: "blackjack", label: "Blackjack", href: "/blackjack", icon: Layers },
    { id: "live", label: "Live Casino", href: "/live-casino", icon: UserCheck },
    { id: "jackpots", label: "Jackpots", href: "/jackpots", icon: Trophy },
    { id: "vip", label: "VIP", href: "/vip", icon: Crown },
  ];

  const handleResetPoints = () => {
    sound.playWin();
    resetFreePlayPoints();
    addCoins(10000, "Reset FreePlay Points");
  };

  return (
    <aside className="w-[178px] min-h-screen bg-gradient-to-b from-[#91D2BC] via-[#97D6C1] to-[#87CAA4] border-r border-[#7ABEA9] flex flex-col p-3 select-none shrink-0 text-[#40243B]">
      {/* 1. 777 RETRO LOGO */}
      <div className="flex justify-center pt-2 pb-3">
        <Link
          href="/"
          onClick={() => sound.playChipClick()}
          className="group flex flex-col items-center"
        >
          <div className="relative logo-777-badge px-4 py-1.5 rounded-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
            <span className="logo-777-text text-2xl font-black tracking-wider leading-none">
              777
            </span>
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#40243B]/80 uppercase mt-1">
            RETRO ARCADE
          </span>
        </Link>
      </div>

      {/* 2. USER CAPSULE / LOGIN CARD */}
      <div className="bg-[#A4DCB6]/40 border border-[#7DBEA9] rounded-2xl p-2.5 mb-4 shadow-sm flex flex-col items-center space-y-2">
        {/* Diamond Frame Silhouette */}
        <div className="w-12 h-12 flex items-center justify-center relative my-1">
          <div className="w-9 h-9 rotate-45 bg-[#FFF6D4] border-2 border-[#E3D4A8] rounded-md shadow-sm flex items-center justify-center overflow-hidden">
            <div className="-rotate-45 flex flex-col items-center justify-center">
              <span className="text-sm font-black text-[#C33355]">
                {user ? user.name.slice(0, 1).toUpperCase() : "★"}
              </span>
            </div>
          </div>
        </div>

        {/* Login / User Status Pill */}
        {user ? (
          <div className="w-full text-center">
            <div className="text-[11px] font-black text-[#40243B] truncate px-1">
              {user.name}
            </div>
            <div className="text-[10px] font-bold text-[#C33355] flex items-center justify-center space-x-1 mt-0.5">
              <Coins className="w-3 h-3" />
              <span>{(user.coins ?? 15000).toLocaleString()} PTS</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              openAuthModal("LOGIN");
              sound.playChipClick();
            }}
            className="w-full py-1 rounded-full bg-[#EAF7F0] border border-[#C33355] text-[#C33355] font-black text-[11px] uppercase tracking-wider hover:bg-white transition-all shadow-sm active:scale-95"
          >
            LOG IN
          </button>
        )}

        {/* Notifications & FreePlay Dual Action Buttons */}
        <div className="w-full grid grid-cols-2 bg-[#FFF6D4] border border-[#E1D2A4] rounded-xl overflow-hidden divide-x divide-[#E1D2A4] shadow-inner text-[#40243B]">
          <button
            onClick={() => {
              if (onOpenNotifications) onOpenNotifications();
              else setIsNotificationsOpen(true);
              sound.playChipClick();
            }}
            className="py-1.5 flex flex-col items-center justify-center hover:bg-[#FFF0B8] transition group"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5 text-[#40243B] group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-bold tracking-tight mt-0.5 text-gray-700">
              Notifications
            </span>
          </button>

          <button
            onClick={() => {
              if (onOpenFreePlay) onOpenFreePlay();
              else setIsFreePlayModalOpen(true);
              sound.playChipClick();
            }}
            className="py-1.5 flex flex-col items-center justify-center hover:bg-[#FFF0B8] transition group"
            title="FreePlay Points"
          >
            <Gift className="w-3.5 h-3.5 text-[#C33355] group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black tracking-tight mt-0.5 text-[#C33355]">
              FreePlay
            </span>
          </button>
        </div>
      </div>

      {/* 3. VERTICAL NAVIGATION MENU */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => sound.playChipClick()}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-full text-xs font-black transition-all ${
                isActive
                  ? "border-2 border-[#C33355] bg-[#A4DCB6]/50 text-[#C33355] shadow-sm"
                  : "text-[#40243B] hover:bg-[#A4DCB6]/30 hover:text-[#C33355]"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-[#C33355]" : "text-[#40243B]/80"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 4. FREE ENTERTAINMENT NOTICE */}
      <div className="mt-auto pt-3 border-t border-[#7ABEA9] space-y-1.5 text-center">
        <div className="px-1 py-1 rounded-lg bg-[#FFF6D4]/60 text-[9px] font-bold text-[#40243B] leading-tight">
          <span>🎮 100% Free Arcade</span>
          <div className="text-[8px] text-gray-600 font-normal">Virtual Points Only</div>
        </div>

        <button
          onClick={handleResetPoints}
          className="text-[9px] font-bold text-[#C33355] hover:underline flex items-center justify-center space-x-1 mx-auto"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>Reset Free Points</span>
        </button>
      </div>
    </aside>
  );
}
