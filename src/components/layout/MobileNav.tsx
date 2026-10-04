"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Dices, Trophy, Wallet, Home, Plus } from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

export default function MobileNav() {
  const pathname = usePathname();
  const { user, setIsDepositModalOpen, openAuthModal } = useUserStore();

  const handleDepositClick = () => {
    sound.playChipClick();
    if (user) {
      setIsDepositModalOpen(true);
    } else {
      openAuthModal("LOGIN");
    }
  };

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Aviator",
      href: "/casino/aviator",
      icon: Flame,
      isActive: pathname.includes("aviator"),
      badge: "HOT",
    },
    {
      label: "Deposit",
      isAction: true,
      onClick: handleDepositClick,
      icon: Plus,
    },
    {
      label: "Roulette",
      href: "/casino/roulette",
      icon: Dices,
      isActive: pathname.includes("roulette"),
    },
    {
      label: "Sports",
      href: "/sports",
      icon: Trophy,
      isActive: pathname.startsWith("/sports"),
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#140C12]/95 backdrop-blur-md border-t border-[#342230] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item, idx) => {
          if (item.isAction) {
            return (
              <button
                key="deposit-action"
                onClick={item.onClick}
                className="flex flex-col items-center -mt-5 group focus:outline-none"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#BA2649] to-[#E11D48] text-white flex items-center justify-center shadow-lg border-2 border-[#FEF9E7] active:scale-95 transition-transform">
                  <Plus className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="text-[10px] font-black text-[#FFDE59] mt-0.5 uppercase tracking-wider">
                  Deposit
                </span>
              </button>
            );
          }

          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
                isActive ? "text-[#FFDE59]" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "text-[#FFDE59]" : "text-gray-400"}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2.5 px-1 py-0.2 bg-[#BA2649] text-[8px] font-black text-white rounded-full leading-none scale-75">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold mt-0.5 leading-none">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#BA2649] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
