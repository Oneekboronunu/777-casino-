"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Crown,
  Share2,
  Copy,
  Shield,
  Receipt,
  Flame,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

export default function AccountPage() {
  const { user, showNotification } = useUserStore();
  const [activeTab, setActiveTab] = useState<"PROFILE" | "HISTORY" | "REFERRAL" | "RESPONSIBLE">("PROFILE");
  const [copied, setCopied] = useState(false);
  const [depositLimit, setDepositLimit] = useState<number>(50000);
  const [lossLimit, setLossLimit] = useState<number>(20000);
  const [bets, setBets] = useState<any[]>([]);

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    try {
      const res = await fetch("/api/sports/user-bets");
      const data = await res.json();
      if (res.ok) {
        setBets(data.bets || []);
      }
    } catch {
      // ignore
    }
  };

  const handleCopyReferral = () => {
    const code = user?.referralCode || "AURA777";
    const url = `${window.location.origin}?ref=${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    sound.playChipClick();
    showNotification("Referral link copied to clipboard!", "SUCCESS");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveLimits = () => {
    sound.playWin();
    showNotification(`Responsible gambling limits updated: ৳${depositLimit.toLocaleString()}/day`, "SUCCESS");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Account Hero Card */}
      <div className="bg-[#111827] border border-[#23334E] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#997A1E] flex items-center justify-center font-black text-2xl text-[#0B0F1A] shadow-gold">
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-white">{user?.name || "VIP Player"}</h1>
              <span className="px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-black rounded">
                {user?.role || "USER"} TIER
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email || "player@auracasino.com"}</p>
          </div>
        </div>

        {/* Quick Balance Summary */}
        <div className="flex items-center space-x-4 text-center md:text-right">
          <div className="p-3 bg-[#0B0F1A] border border-[#23334E] rounded-xl">
            <span className="text-[10px] text-gray-400 block">Withdrawable Cash</span>
            <span className="text-lg font-mono font-bold text-[#10B981]">
              ৳{user?.balance?.toLocaleString() || "0"}
            </span>
          </div>
          <div className="p-3 bg-[#0B0F1A] border border-[#23334E] rounded-xl">
            <span className="text-[10px] text-gray-400 block">Bonus Wallet</span>
            <span className="text-lg font-mono font-bold text-[#D4AF37]">
              ৳{user?.bonusBalance?.toLocaleString() || "0"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 bg-[#111827] p-2 rounded-2xl border border-[#23334E]">
        {[
          { id: "PROFILE", label: "Profile Details", icon: User },
          { id: "HISTORY", label: "Betting Tickets", icon: Receipt },
          { id: "REFERRAL", label: "Referral Program (+৳1,000)", icon: Share2 },
          { id: "RESPONSIBLE", label: "Responsible Gaming", icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                sound.playChipClick();
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 flex-shrink-0 ${
                isActive
                  ? "bg-[#D4AF37] text-[#0B0F1A] shadow-gold font-extrabold"
                  : "bg-[#151F32] text-gray-300 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "PROFILE" && (
        <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-[#23334E]/60 pb-3">
            Personal Information & Security
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#0B0F1A] border border-[#23334E] rounded-xl">
              <span className="text-gray-400 block text-[10px]">Full Name</span>
              <span className="text-sm font-bold text-white">{user?.name}</span>
            </div>
            <div className="p-3.5 bg-[#0B0F1A] border border-[#23334E] rounded-xl">
              <span className="text-gray-400 block text-[10px]">Primary Email</span>
              <span className="text-sm font-bold text-white">{user?.email}</span>
            </div>
            <div className="p-3.5 bg-[#0B0F1A] border border-[#23334E] rounded-xl">
              <span className="text-gray-400 block text-[10px]">Account Currency</span>
              <span className="text-sm font-bold text-white">BDT (Bangladeshi Taka ৳)</span>
            </div>
            <div className="p-3.5 bg-[#0B0F1A] border border-[#23334E] rounded-xl">
              <span className="text-gray-400 block text-[10px]">KYC Verification Status</span>
              <span className="text-sm font-bold text-[#10B981]">Instant VIP Verified</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "HISTORY" && (
        <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-[#23334E]/60 pb-3">
            Sportsbook & Casino Betting History
          </h2>
          {bets.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">
              No betting tickets found yet.
            </div>
          ) : (
            <div className="space-y-3">
              {bets.map((bet) => (
                <div
                  key={bet.id}
                  className="p-4 bg-[#0B0F1A] border border-[#23334E] rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-gray-400">Ticket #{bet.id.slice(-6)}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        bet.status === "WON"
                          ? "bg-[#10B981]/20 text-[#10B981]"
                          : bet.status === "CASHED_OUT"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {bet.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {bet.items.map((it: any) => (
                      <div key={it.id} className="flex justify-between text-gray-300">
                        <span>
                          {it.outcomeName} ({it.matchName})
                        </span>
                        <span className="text-[#D4AF37] font-mono">@{it.odds.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#23334E] flex justify-between font-mono font-bold">
                    <span className="text-gray-400">Stake: ৳{bet.stake.toLocaleString()}</span>
                    <span className="text-[#10B981]">
                      Payout: ৳{bet.potentialPayout.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "REFERRAL" && (
        <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">VIP Referral Affiliate System</h2>
            <p className="text-xs text-gray-400 mt-1">
              Share your link and earn ৳1,000 instant bonus cash for every friend who deposits!
            </p>
          </div>

          <div className="p-4 bg-[#0B0F1A] border border-[#23334E] rounded-2xl space-y-3">
            <span className="text-xs text-gray-400">Your Exclusive Referral Link:</span>
            <div className="flex items-center justify-between bg-[#151F32] p-3 rounded-xl border border-[#23334E]">
              <span className="font-mono text-xs text-white truncate max-w-[300px]">
                https://auracasino.local?ref={user?.referralCode || "AURA777"}
              </span>
              <button
                onClick={handleCopyReferral}
                className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B0F1A] font-bold text-xs rounded-lg transition flex items-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-[#0B0F1A] border border-[#23334E] rounded-xl">
              <span className="text-xs text-gray-400">Total Referred</span>
              <div className="text-2xl font-mono font-bold text-white mt-1">14 Friends</div>
            </div>
            <div className="p-4 bg-[#0B0F1A] border border-[#23334E] rounded-xl">
              <span className="text-xs text-gray-400">Earned Commissions</span>
              <div className="text-2xl font-mono font-bold text-[#10B981] mt-1">৳14,000</div>
            </div>
            <div className="p-4 bg-[#0B0F1A] border border-[#23334E] rounded-xl">
              <span className="text-xs text-gray-400">Commission Rate</span>
              <div className="text-2xl font-mono font-bold text-[#D4AF37] mt-1">30% Revenue Share</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "RESPONSIBLE" && (
        <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">Responsible Gambling Tools</h2>
            <p className="text-xs text-gray-400 mt-1">
              Set personal daily limits to ensure entertaining and responsible gameplay.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white">Daily Deposit Limit (৳)</label>
              <input
                type="number"
                value={depositLimit}
                onChange={(e) => setDepositLimit(Number(e.target.value))}
                className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white">Daily Loss Threshold (৳)</label>
              <input
                type="number"
                value={lossLimit}
                onChange={(e) => setLossLimit(Number(e.target.value))}
                className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <button
            onClick={handleSaveLimits}
            className="px-6 py-3 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B0F1A] font-extrabold text-xs rounded-xl transition shadow-gold"
          >
            Save Protection Limits
          </button>
        </div>
      )}
    </div>
  );
}
