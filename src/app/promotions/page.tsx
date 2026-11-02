"use client";

import React, { useState } from "react";
import { Gift, Sparkles, CheckCircle2, Coins, ArrowRight, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

export default function PromotionsPage() {
  const { addFreePlayPoints } = useArcadeStore();
  const { addCoins, showNotification } = useUserStore();
  const [claimedPromos, setClaimedPromos] = useState<Record<string, boolean>>({});

  const promos = [
    {
      id: "promo-welcome",
      title: "Welcome to Retro Arcade: Starter Grant",
      points: 10000,
      tag: "ONE-TIME REWARD",
      desc: "Instant +10,000 FreePlay points to test all arcade slots, roulette wheels, and table games.",
      color: "from-amber-500 to-yellow-600",
    },
    {
      id: "promo-daily",
      title: "Daily Arcade Drop (24-Hour Refill)",
      points: 2500,
      tag: "RECURRING DAILY",
      desc: "Claim +2,500 FreePlay points every single day to keep your spin streaks running high.",
      color: "from-[#0D9488] to-teal-700",
    },
    {
      id: "promo-weekend",
      title: "Weekend High Roller Boost",
      points: 5000,
      tag: "WEEKEND SPECIAL",
      desc: "Double your maximum bet limits and collect a +5,000 point weekend celebration boost.",
      color: "from-[#C33355] to-rose-700",
    },
    {
      id: "promo-vip",
      title: "VIP Arcade Club Pass",
      points: 15000,
      tag: "VIP EXCLUSIVE",
      desc: "Unlock gold border cards, custom sound effects, and VIP-only game rooms with +15,000 points.",
      color: "from-purple-600 to-indigo-800",
    },
  ];

  const handleClaim = (promoId: string, pts: number) => {
    sound.playWin();
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#91D2BC", "#FFE58B", "#C33355", "#0D9488"],
      });
    } catch {}

    addFreePlayPoints(pts);
    addCoins(pts, `Claimed Promo: ${promoId}`);
    setClaimedPromos((prev) => ({ ...prev, [promoId]: true }));
    showNotification(`Successfully claimed +${pts.toLocaleString()} Points!`, "SUCCESS");
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6 select-none">
      {/* Header */}
      <div className="bg-[#FFF6D4] border-2 border-[#EADBBE] rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C33355] text-white flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#40243B] tracking-tight">
              Arcade Promotions
            </h1>
            <p className="text-xs text-gray-600 font-semibold">
              Free bonus point packages • Zero real money required
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#E5F5ED] border border-[#91D2BC] text-[#40243B] text-xs font-bold hidden sm:flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Free Entertainment</span>
        </div>
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promos.map((promo) => {
          const isClaimed = claimedPromos[promo.id];
          return (
            <div
              key={promo.id}
              className="bg-[#FFF6D4] border-2 border-[#EADBBE] rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#91D2BC] text-[#40243B] text-[10px] font-black uppercase tracking-wider">
                    {promo.tag}
                  </span>
                  <div className="flex items-center space-x-1 font-mono font-black text-[#C33355] text-sm">
                    <Coins className="w-4 h-4" />
                    <span>+{promo.points.toLocaleString()} PTS</span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-[#40243B]">
                  {promo.title}
                </h3>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  {promo.desc}
                </p>
              </div>

              <button
                onClick={() => handleClaim(promo.id, promo.points)}
                disabled={isClaimed}
                className={`w-full py-3 rounded-full font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-sm ${
                  isClaimed
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-[#C33355] hover:bg-[#AA2443] text-white active:scale-95"
                }`}
              >
                {isClaimed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bonus Claimed</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Claim +{promo.points.toLocaleString()} Free Points</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
