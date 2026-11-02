"use client";

import React from "react";
import { Crown, Sparkles, Shield, Award, Star, Check } from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";

export default function VIPPage() {
  const { user } = useUserStore();

  const tiers = [
    {
      name: "Bronze Arcade",
      pointsNeeded: "0 PTS",
      perks: ["10,000 Starting Points", "Daily Drop +1,000 PTS", "Access to Classic Slots"],
      badgeColor: "bg-amber-700",
    },
    {
      name: "Silver Pro",
      pointsNeeded: "25,000 PTS",
      perks: ["Daily Drop +2,500 PTS", "Custom Animated Avatars", "High Limit Blackjack Tables"],
      badgeColor: "bg-slate-400",
    },
    {
      name: "Gold Champion",
      pointsNeeded: "100,000 PTS",
      perks: ["Daily Drop +5,000 PTS", "Exclusive Golden Frames", "Priority VIP Slot Tournaments"],
      badgeColor: "bg-amber-500",
      featured: true,
    },
    {
      name: "Diamond Legend",
      pointsNeeded: "500,000 PTS",
      perks: ["Unlimited Daily Refills", "Diamond Neon Profile", "Custom Sound Themes"],
      badgeColor: "bg-cyan-500",
    },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6 select-none">
      {/* Header */}
      <div className="bg-[#FFF6D4] border-2 border-[#EADBBE] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#C33355] text-white flex items-center justify-center">
            <Crown className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#40243B] tracking-tight">
              VIP Arcade Lounge
            </h1>
            <p className="text-xs text-gray-600 font-semibold">
              Freeplay prestige tiers, avatar badges & daily point multipliers
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-[#91D2BC]/40 border border-[#7ABEA9] text-center">
          <div className="text-[10px] uppercase font-black text-gray-700">Your Current Tier</div>
          <div className="text-base font-black text-[#C33355]">Gold Champion Tier</div>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-3xl p-6 flex flex-col justify-between space-y-4 border-2 transition ${
              tier.featured
                ? "bg-[#FFF6D4] border-[#C33355] shadow-xl scale-[1.02]"
                : "bg-white/80 border-[#DECF9E] shadow-sm"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-white text-[10px] font-black uppercase tracking-wider ${tier.badgeColor}`}>
                  {tier.name}
                </span>
                <span className="text-[11px] font-mono font-bold text-gray-600">
                  {tier.pointsNeeded}
                </span>
              </div>

              <h3 className="text-lg font-black text-[#40243B]">{tier.name}</h3>

              <div className="pt-2 space-y-2">
                {tier.perks.map((perk, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-gray-700 font-semibold">
                    <Check className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#DECF9E]/60 text-center">
              <span className="text-[10px] font-black uppercase text-[#C33355]">
                Free Lifetime Status
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
