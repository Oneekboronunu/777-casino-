"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Layers,
  Dices,
  Coins,
  Trophy,
  Shield,
  Activity,
  Award,
  Heart,
  Sparkles,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";

export default function Sidebar() {
  const rawPathname = usePathname();
  const pathname = rawPathname || "";
  const { user } = useUserStore();

  const casinoGames = [
    { name: "Spin to Win", href: "/casino/wheel", icon: Sparkles, badge: "HOT", color: "text-amber-400" },
    { name: "24 Goti (Bead 12)", href: "/casino/goti", icon: Layers, badge: "CLASSIC", color: "text-amber-500" },
    { name: "Aviator Crash", href: "/casino/aviator", icon: Flame, badge: "HOT", color: "text-red-500" },
    { name: "24/7 Hearts", href: "/casino/hearts", icon: Heart, badge: "4P PRO", color: "text-rose-400" },
    { name: "Carrom Board", href: "/casino/carrom", icon: Layers, badge: "NEW", color: "text-amber-300" },
    { name: "Roulette 3D", href: "/casino/roulette", icon: Dices, badge: "PRO", color: "text-[#95D600]" },
    { name: "Fair Dice", href: "/casino/dice", icon: Activity, badge: "99% RTP", color: "text-blue-400" },
    { name: "Coin Flip", href: "/casino/coinflip", icon: Coins, badge: "FAST", color: "text-yellow-400" },
  ];

  const sportsLeagues = [
    { name: "Live In-Play", href: "/sports?status=LIVE", icon: Trophy, badge: "106", color: "text-[#95D600]" },
    { name: "Cricket Markets", href: "/sports?sport=CRICKET", icon: Award, badge: "IPL/BPL", color: "text-amber-400" },
    { name: "Football Markets", href: "/sports?sport=FOOTBALL", icon: Award, badge: "UCL", color: "text-[#95D600]" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-[#0D131A] border-r border-[#19232F] min-h-[calc(100vh-6rem)] p-3 space-y-5 select-none shrink-0">
      {/* 777 Casino Originals */}
      <div className="space-y-1">
        <div className="px-3 text-[11px] font-black uppercase tracking-wider text-gray-400">
          Casino Originals
        </div>
        {casinoGames.map((game) => {
          const isActive = pathname === game.href;
          const Icon = game.icon;
          return (
            <Link
              key={game.href}
              href={game.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? "bg-[#182330] text-[#95D600] border border-[#95D600]/40 shadow-sm"
                  : "text-gray-300 hover:text-white hover:bg-[#141C26]"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-[#95D600]" : game.color}`} />
                <span>{game.name}</span>
              </div>
              {game.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                    isActive
                      ? "bg-[#95D600] text-black"
                      : game.badge === "HOT"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-[#182330] text-gray-400"
                  }`}
                >
                  {game.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Sports Markets */}
      <div className="space-y-1">
        <div className="px-3 text-[11px] font-black uppercase tracking-wider text-gray-400">
          Sports Markets
        </div>
        {sportsLeagues.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? "bg-[#182330] text-[#95D600] border border-[#95D600]/40"
                  : "text-gray-300 hover:text-white hover:bg-[#141C26]"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-[#95D600]" : item.color}`} />
                <span>{item.name}</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-[#95D600]/20 text-[#95D600] border border-[#95D600]/30">
                {item.badge}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Admin Quick Hub */}
      <div className="pt-2 border-t border-[#19232F]">
        <Link
          href="/admin"
          className="flex items-center space-x-2 px-3 py-2 text-xs font-bold text-gray-400 hover:text-amber-400 hover:bg-[#141C26] rounded-xl transition"
        >
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Admin Control Hub</span>
        </Link>
      </div>
    </aside>
  );
}
