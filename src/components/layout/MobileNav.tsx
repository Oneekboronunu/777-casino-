"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Trophy, Home, Plus, Sparkles, Layers } from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

export default function MobileNav() {
  const rawPathname = usePathname();
  const pathname = rawPathname || "";
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
      label: "Sports",
      href: "/sports",
      icon: Trophy,
      isActive: pathname === "/" || pathname.startsWith("/sports"),
    },
    {
      label: "Spin Wheel",
      href: "/casino/wheel",
      icon: Sparkles,
      isActive: pathname.includes("wheel"),
      badge: "HOT",
    },
    {
      label: "Deposit",
      isAction: true,
      onClick: handleDepositClick,
      icon: Plus,
    },
    {
      label: "24 Goti",
      href: "/casino/goti",
      icon: Layers,
      isActive: pathname.includes("goti"),
    },
    {
      label: "Aviator",
      href: "/casino/aviator",
      icon: Flame,
      isActive: pathname.includes("aviator"),
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0D131A] border-t border-[#1A2432] py-1.5 px-3 select-none shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item, index) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center -mt-5 transition transform active:scale-90"
              >
                <div className="w-12 h-12 rounded-full bg-[#95D600] text-black flex items-center justify-center shadow-[0_0_15px_rgba(149,214,0,0.4)] border-2 border-[#0D131A]">
                  <Icon className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="text-[10px] font-black uppercase text-[#95D600] mt-0.5">
                  Deposit
                </span>
              </button>
            );
          }

          return (
            <Link
              key={index}
              href={item.href || "#"}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
                item.isActive ? "text-[#95D600]" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-red-600 text-white text-[8px] font-black rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold mt-0.5 tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
