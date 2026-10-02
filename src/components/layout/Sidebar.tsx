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
  Wallet,
  Crown,
  HelpCircle,
  Activity,
  Award,
  Star,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUserStore();

  const casinoGames = [
    { name: "Aviator Crash", href: "/casino/aviator", icon: Flame, badge: "HOT", color: "text-[#BA2649]" },
    { name: "Carrom Board", href: "/casino/carrom", icon: Layers, badge: "NEW", color: "text-[#FFDE59]" },
    { name: "Roulette 3D", href: "/casino/roulette", icon: Dices, badge: "PRO", color: "text-[#0D9488]" },
    { name: "Fair Dice", href: "/casino/dice", icon: Activity, badge: "99% RTP", color: "text-blue-400" },
    { name: "Coin Flip", href: "/casino/coinflip", icon: Coins, badge: "FAST", color: "text-yellow-400" },
  ];

  const sportsLeagues = [
    { name: "Live In-Play", href: "/sports?status=LIVE", icon: Trophy, badge: "LIVE", color: "text-[#BA2649]" },
    { name: "Cricket Prediction", href: "/sports?sport=CRICKET", icon: Award, badge: "IPL/BPL", color: "text-[#FFDE59]" },
    { name: "Football Markets", href: "/sports?sport=FOOTBALL", icon: Award, badge: "UCL", color: "text-[#0D9488]" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#180E16] border-r border-[#342230] min-h-[calc(100vh-5rem)] p-4 space-y-6 select-none flex-shrink-0">
      {/* 777 Casino Originals */}
      <div className="space-y-1.5">
        <div className="px-3 text-[11px] font-black uppercase tracking-wider text-[#BA2649]">
          777 Casino Games
        </div>
        {casinoGames.map((game) => {
          const isActive = pathname === game.href;
          const Icon = game.icon;
          return (
            <Link
              key={game.href}
              href={game.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? "bg-[#BA2649] text-white shadow-retro"
                  : "text-gray-300 hover:text-white hover:bg-[#251522]"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : game.color}`} />
                <span>{game.name}</span>
              </div>
              {game.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                    isActive
                      ? "bg-[#180E16] text-[#FFDE59]"
                      : game.badge === "HOT" || game.badge === "LIVE"
                      ? "bg-[#BA2649]/30 text-[#FFDE59]"
                      : "bg-[#0D9488]/30 text-[#0D9488]"
                  }`}
                >
                  {game.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Sports Prediction */}
      <div className="space-y-1.5">
        <div className="px-3 text-[11px] font-black uppercase tracking-wider text-[#FFDE59]">
          Sportsbook Markets
        </div>
        {sportsLeagues.map((item) => {
          const isActive = pathname === item.href || (pathname === "/sports" && item.name === "Live In-Play");
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? "bg-[#BA2649] text-white shadow-retro"
                  : "text-gray-300 hover:text-white hover:bg-[#251522]"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : item.color}`} />
                <span>{item.name}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">{item.badge}</span>
            </Link>
          );
        })}
      </div>

      {/* Account & Banking */}
      <div className="space-y-1.5">
        <div className="px-3 text-[11px] font-black uppercase tracking-wider text-gray-400">
          Account & Banking
        </div>
        <Link
          href="/wallet"
          className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
            pathname === "/wallet"
              ? "bg-[#BA2649] text-white shadow-retro"
              : "text-gray-300 hover:text-white hover:bg-[#251522]"
          }`}
        >
          <Wallet className="w-4 h-4 text-[#FFDE59]" />
          <span>Wallet & Banking</span>
        </Link>
        <Link
          href="/account"
          className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
            pathname === "/account"
              ? "bg-[#BA2649] text-white shadow-retro"
              : "text-gray-300 hover:text-white hover:bg-[#251522]"
          }`}
        >
          <Crown className="w-4 h-4 text-[#FFDE59]" />
          <span>VIP Club & Rewards</span>
        </Link>

        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition ${
              pathname === "/admin"
                ? "bg-[#BA2649] text-white"
                : "text-[#FFDE59] hover:bg-[#251522]"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin Controller</span>
          </Link>
        )}
      </div>

      {/* 24/7 VIP Support */}
      <div className="mt-auto pt-4 border-t border-[#342230] space-y-2">
        <div className="p-3 bg-[#120B10] border border-[#342230] rounded-xl">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-white mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>24/7 Vegas VIP Support</span>
          </div>
          <div className="text-[10px] text-gray-400">
            Instant bKash, Nagad & Rocket payouts. Licensed & Provably Fair.
          </div>
        </div>
      </div>
    </aside>
  );
}
