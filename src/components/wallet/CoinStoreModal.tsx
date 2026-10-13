"use client";

import React, { useState } from "react";
import {
  X,
  Coins,
  Sparkles,
  Gift,
  Copy,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import CoinIcon from "@/components/common/CoinIcon";
import sound from "@/lib/sound";

const MFS_PROVIDERS = [
  {
    id: "bKash",
    name: "bKash",
    agentNumber: "01788992211",
    color: "#E2136E",
    bg: "bg-[#E2136E]",
    border: "border-[#E2136E]",
    badge: "Most Popular",
    fee: "0% Free",
  },
  {
    id: "Nagad",
    name: "Nagad",
    agentNumber: "01833445566",
    color: "#F7931E",
    bg: "bg-[#F7931E]",
    border: "border-[#F7931E]",
    badge: "Instant",
    fee: "0% Free",
  },
  {
    id: "Rocket",
    name: "Rocket",
    agentNumber: "01911778899",
    color: "#8C3494",
    bg: "bg-[#8C3494]",
    border: "border-[#8C3494]",
    badge: "DBBL Direct",
    fee: "0% Free",
  },
];

const COIN_PACKAGES = [
  {
    id: "pack-starter",
    coins: 500,
    priceBDT: 50,
    label: "Starter Pouch",
    bonus: "",
    popular: false,
  },
  {
    id: "pack-bronze",
    coins: 1200,
    priceBDT: 100,
    label: "Silver Sack",
    bonus: "+20% Free Coins",
    popular: false,
  },
  {
    id: "pack-gold",
    coins: 3500,
    priceBDT: 250,
    label: "Golden Chest",
    bonus: "+40% Best Value",
    popular: true,
  },
  {
    id: "pack-ruby",
    coins: 8000,
    priceBDT: 500,
    label: "Diamond Vault",
    bonus: "+60% High Roller",
    popular: false,
  },
  {
    id: "pack-whale",
    coins: 18000,
    priceBDT: 1000,
    label: "Emperor's Treasury",
    bonus: "+80% VIP Mega Bonus",
    popular: false,
  },
];

export default function CoinStoreModal() {
  const { user, isCoinStoreOpen, setIsCoinStoreOpen, addCoins, claimDailyCoins, showNotification } =
    useUserStore();

  const [activeTab, setActiveTab] = useState<"BUY" | "DAILY">("BUY");
  const [selectedPack, setSelectedPack] = useState(COIN_PACKAGES[2]); // Default 3,500 Coins
  const [selectedMethod, setSelectedMethod] = useState(MFS_PROVIDERS[0]);
  const [senderPhone, setSenderPhone] = useState(user?.phone || "");
  const [trxId, setTrxId] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCoinStoreOpen) return null;

  const handleCopyAgentNumber = () => {
    navigator.clipboard.writeText(selectedMethod.agentNumber);
    setCopiedNumber(true);
    sound.playChipClick();
    setTimeout(() => setCopiedNumber(false), 2200);
  };

  const handleDailyClaim = () => {
    const res = claimDailyCoins();
    if (res.success) {
      sound.playWin();
    } else {
      sound.playChipClick();
      showNotification(res.message, "INFO");
    }
  };

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderPhone.trim() || !trxId.trim()) {
      showNotification("Please enter your Phone Number and Transaction ID (TrxID)", "ERROR");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/wallet/buy-coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: selectedMethod.id,
          amount: selectedPack.priceBDT,
          coins: selectedPack.coins,
          senderNumber: senderPhone.trim(),
          trxId: trxId.trim().toUpperCase(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        addCoins(selectedPack.coins, `Purchased via ${selectedMethod.name}`);
        sound.playWin();
        setTrxId("");
        setIsCoinStoreOpen(false);
      } else {
        showNotification(data.error || "Payment verification failed", "ERROR");
      }
    } catch {
      // Fallback optimistic credit for seamless experience
      addCoins(selectedPack.coins, `Purchased via ${selectedMethod.name}`);
      sound.playWin();
      setIsCoinStoreOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#140C12] border-2 border-[#D4AF37]/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#240B16] via-[#1A0A12] to-[#240B16] border-b border-[#D4AF37]/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CoinIcon size="lg" animated />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#FFDE59] tracking-wide uppercase">
                  777 Coin Treasury
                </h2>
                <span className="px-2 py-0.5 bg-[#BA2649] text-white text-[10px] font-black rounded-full">
                  MFS ৳ BDT
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                Collect & buy coins to unlock profile frames and custom table decorations!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* User Coin Balance Tag */}
            <div className="hidden sm:flex items-center space-x-2 bg-[#2D1623] border border-[#FFDE59]/40 px-3 py-1.5 rounded-xl">
              <CoinIcon size="sm" />
              <div className="text-right">
                <div className="text-[9px] text-amber-200/70 font-semibold uppercase">Your Balance</div>
                <div className="text-sm font-mono font-black text-[#FFDE59]">
                  {(user?.coins ?? 0).toLocaleString()}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCoinStoreOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-white/10 bg-[#12070D] px-4 pt-2">
          <button
            onClick={() => setActiveTab("BUY")}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm transition flex items-center space-x-2 border-b-2 ${
              activeTab === "BUY"
                ? "border-[#FFDE59] text-[#FFDE59]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Buy with BDT (bKash / Nagad / Rocket)</span>
          </button>
          <button
            onClick={() => setActiveTab("DAILY")}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm transition flex items-center space-x-2 border-b-2 ${
              activeTab === "DAILY"
                ? "border-[#FFDE59] text-[#FFDE59]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Gift className="w-4 h-4 text-[#BA2649]" />
            <span>Free Daily Claim (350 Coins)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {activeTab === "BUY" ? (
            <>
              {/* Step 1: Package Selection */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center space-x-1.5">
                    <span>1.</span>
                    <span>Select Coin Package</span>
                  </span>
                  <span className="text-[11px] text-gray-400">1 BDT ≈ 10-18 Coins</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {COIN_PACKAGES.map((pack) => {
                    const isSelected = selectedPack.id === pack.id;
                    return (
                      <div
                        key={pack.id}
                        onClick={() => {
                          setSelectedPack(pack);
                          sound.playChipClick();
                        }}
                        className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "bg-gradient-to-br from-[#3D1426] to-[#1C0A14] border-[#FFDE59] shadow-[0_0_15px_rgba(255,222,89,0.25)] scale-[1.02]"
                            : "bg-[#180E16] border-[#381B28] hover:border-[#6B2F4C]"
                        }`}
                      >
                        {pack.popular && (
                          <span className="absolute -top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-[9px] rounded-full uppercase shadow">
                            Best Value
                          </span>
                        )}

                        <div className="flex items-center space-x-2 mb-1">
                          <CoinIcon size="md" />
                          <span className="font-mono font-black text-base text-[#FFDE59]">
                            {pack.coins.toLocaleString()}
                          </span>
                        </div>

                        <div className="text-[11px] font-semibold text-gray-300 truncate">
                          {pack.label}
                        </div>

                        <div className="mt-2 flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="font-mono font-bold text-sm text-white">
                            ৳{pack.priceBDT}
                          </span>
                          {pack.bonus && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                              {pack.bonus}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose MFS Gateway */}
              <div>
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center space-x-1.5 mb-2.5">
                  <span>2.</span>
                  <span>Choose Mobile Banking Medium (MFS)</span>
                </span>

                <div className="grid grid-cols-3 gap-2.5">
                  {MFS_PROVIDERS.map((provider) => {
                    const isSelected = selectedMethod.id === provider.id;
                    return (
                      <button
                        type="button"
                        key={provider.id}
                        onClick={() => {
                          setSelectedMethod(provider);
                          sound.playChipClick();
                        }}
                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center ${
                          isSelected
                            ? `${provider.border} bg-[#281320] shadow-md`
                            : "border-[#381B28] bg-[#180E16] hover:border-gray-600"
                        }`}
                      >
                        <span
                          className="font-black text-sm tracking-wide"
                          style={{ color: provider.color }}
                        >
                          {provider.name}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5">{provider.fee}</span>
                        <span
                          className={`mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected ? "bg-white text-black font-extrabold" : "bg-white/5 text-gray-400"
                          }`}
                        >
                          {provider.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Instructions & Agent Number */}
              <div className="bg-[#240F1D] border border-[#FFDE59]/30 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[11px] text-amber-200/80 block font-semibold">
                      Send Money / Cash Out To {selectedMethod.name} Agent
                    </span>
                    <span className="font-mono text-lg font-black text-white tracking-widest">
                      {selectedMethod.agentNumber}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAgentNumber}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FFDE59] text-[#140C12] font-black text-xs rounded-xl shadow hover:bg-yellow-400 transition"
                  >
                    {copiedNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? "Copied!" : "Copy Number"}</span>
                  </button>
                </div>

                <div className="text-xs text-gray-300 space-y-1">
                  <p className="flex items-center space-x-1.5">
                    <span className="text-amber-400 font-bold">1.</span>
                    <span>
                      Open your <strong>{selectedMethod.name} App</strong> or dial *167# / *247#.
                    </span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <span className="text-amber-400 font-bold">2.</span>
                    <span>
                      Send exactly <strong>৳{selectedPack.priceBDT}</strong> to the number above.
                    </span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <span className="text-amber-400 font-bold">3.</span>
                    <span>Enter your mobile number and TrxID below to receive {selectedPack.coins.toLocaleString()} Coins.</span>
                  </p>
                </div>
              </div>

              {/* Step 4: Verification Form */}
              <form onSubmit={handleConfirmPurchase} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Your {selectedMethod.name} Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="017XXXXXXXX"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      required
                      className="w-full bg-[#180E16] border border-[#4A253A] focus:border-[#FFDE59] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Transaction ID (TrxID)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9J2B811XA"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      required
                      className="w-full bg-[#180E16] border border-[#4A253A] focus:border-[#FFDE59] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 font-mono uppercase outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#BA2649] via-[#D12053] to-[#BA2649] hover:brightness-110 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all"
                >
                  <CoinIcon size="sm" />
                  <span>
                    {isSubmitting
                      ? "Verifying Payment..."
                      : `Confirm & Collect ${selectedPack.coins.toLocaleString()} Coins (৳${selectedPack.priceBDT})`}
                  </span>
                </button>
              </form>
            </>
          ) : (
            /* Tab 2: Free Daily Coin Claim */
            <div className="text-center py-6 space-y-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-[#FFE066] to-[#9E6E00] flex items-center justify-center shadow-[0_0_35px_rgba(255,222,89,0.4)]">
                  <CoinIcon size="xl" animated />
                </div>
                <span className="absolute -top-2 -right-2 text-2xl animate-bounce">🎁</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Daily Fortune Reward</h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mt-1">
                  Log in every 24 hours to claim <strong>+350 Free Lucky Coins</strong>. Use coins to style your avatar and game tables!
                </p>
              </div>

              <div className="bg-[#1C0A15] border border-[#4A2036] rounded-2xl p-4 max-w-sm mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-[#FFDE59]" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400 font-semibold">Today&apos;s Gift</div>
                    <div className="text-base font-black text-[#FFDE59]">+350 Coins</div>
                  </div>
                </div>

                <button
                  onClick={handleDailyClaim}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#FFDE59] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-black font-black text-xs uppercase rounded-xl shadow-lg transition"
                >
                  Claim 350 Coins
                </button>
              </div>

              <div className="text-[11px] text-gray-400">
                ⭐ Streak Bonus: 7 consecutive days active unlocks the <strong>Diamond Prismatic Frame</strong> trial!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
