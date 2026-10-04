"use client";

import React, { useState, useEffect } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ShieldCheck,
  CreditCard,
  Gift,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";
import { BKashLogo, NagadLogo, RocketLogo, UpayLogo, BankLogo } from "@/components/common/PaymentLogos";

export default function WalletPage() {
  const { user, setIsDepositModalOpen, setIsWithdrawModalOpen } = useUserStore();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wallet/transactions");
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter((t) => {
    if (filter === "ALL") return true;
    return t.type === filter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-[#23334E] p-6 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">WALLET & BANKING</h1>
            <p className="text-xs text-gray-400">Instant bKash, Nagad, Rocket & Bank Transfer Ledger</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setIsDepositModalOpen(true);
              sound.playChipClick();
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-[#0B0F1A] font-extrabold text-xs rounded-xl transition shadow-gold flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Deposit Funds</span>
          </button>
          <button
            onClick={() => {
              setIsWithdrawModalOpen(true);
              sound.playChipClick();
            }}
            className="px-6 py-3 bg-[#151F32] hover:bg-[#1A253C] border border-[#23334E] text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
          >
            <ArrowUpRight className="w-4 h-4 text-[#10B981]" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Balances Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Cash Balance */}
        <div className="p-6 bg-[#111827] border border-[#23334E] rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Real Money Balance</span>
            <CreditCard className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#10B981]">
            ৳{user?.balance?.toLocaleString() || "0"}
          </div>
          <div className="text-[11px] text-gray-500">Available for instant wagering and withdrawal</div>
        </div>

        {/* Bonus Wallet */}
        <div className="p-6 bg-[#111827] border border-[#23334E] rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Bonus Balance</span>
            <Gift className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#D4AF37]">
            ৳{user?.bonusBalance?.toLocaleString() || "0"}
          </div>
          <div className="text-[11px] text-gray-500">Active welcome & reload bonuses</div>
        </div>

        {/* VIP Level */}
        <div className="p-6 bg-[#111827] border border-[#23334E] rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Account Tier</span>
            <ShieldCheck className="w-4 h-4 text-[#E5C158]" />
          </div>
          <div className="text-3xl font-black text-white">
            {user?.role || "USER"} VIP
          </div>
          <div className="text-[11px] text-[#10B981]">0% fees on all local transactions</div>
        </div>
      </div>

      {/* Instant Local Payment Gateways Grid */}
      <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#23334E]/60 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Accepted Payment Gateways</h2>
            <p className="text-xs text-gray-400">Automated 24/7 instant deposit & zero-fee withdrawals</p>
          </div>
          <span className="text-[11px] font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full border border-[#10B981]/30">
            ● 100% Automated Gateway
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
          {/* bKash Card */}
          <div 
            onClick={() => { setIsDepositModalOpen(true); sound.playChipClick(); }}
            className="cursor-pointer p-4 rounded-xl bg-gradient-to-br from-[#1c1322] to-[#141b2b] border border-[#E2136E]/30 hover:border-[#E2136E] transition-all hover:scale-[1.02] shadow-lg flex items-center justify-between group"
          >
            <BKashLogo variant="full" />
            <span className="text-[10px] font-extrabold text-[#FF65A5] bg-[#E2136E]/20 px-2 py-1 rounded-lg border border-[#E2136E]/40 group-hover:bg-[#E2136E] group-hover:text-white transition">
              Deposit
            </span>
          </div>

          {/* Nagad Card */}
          <div 
            onClick={() => { setIsDepositModalOpen(true); sound.playChipClick(); }}
            className="cursor-pointer p-4 rounded-xl bg-gradient-to-br from-[#231713] to-[#141b2b] border border-[#F7931E]/30 hover:border-[#F7931E] transition-all hover:scale-[1.02] shadow-lg flex items-center justify-between group"
          >
            <NagadLogo variant="full" />
            <span className="text-[10px] font-extrabold text-[#FFA842] bg-[#F7931E]/20 px-2 py-1 rounded-lg border border-[#F7931E]/40 group-hover:bg-[#F7931E] group-hover:text-white transition">
              Deposit
            </span>
          </div>

          {/* Rocket Card */}
          <div 
            onClick={() => { setIsDepositModalOpen(true); sound.playChipClick(); }}
            className="cursor-pointer p-4 rounded-xl bg-gradient-to-br from-[#1f1225] to-[#141b2b] border border-[#8C3494]/30 hover:border-[#8C3494] transition-all hover:scale-[1.02] shadow-lg flex items-center justify-between group"
          >
            <RocketLogo variant="full" />
            <span className="text-[10px] font-extrabold text-[#C87BD2] bg-[#8C3494]/20 px-2 py-1 rounded-lg border border-[#8C3494]/40 group-hover:bg-[#8C3494] group-hover:text-white transition">
              Deposit
            </span>
          </div>

          {/* Upay Card */}
          <div 
            onClick={() => { setIsDepositModalOpen(true); sound.playChipClick(); }}
            className="cursor-pointer p-4 rounded-xl bg-gradient-to-br from-[#111e2b] to-[#141b2b] border border-[#FFD200]/30 hover:border-[#FFD200] transition-all hover:scale-[1.02] shadow-lg flex items-center justify-between group"
          >
            <UpayLogo variant="full" />
            <span className="text-[10px] font-extrabold text-[#FFD200] bg-[#FFD200]/20 px-2 py-1 rounded-lg border border-[#FFD200]/40 group-hover:bg-[#FFD200] group-hover:text-black transition">
              Deposit
            </span>
          </div>

          {/* Bank Card */}
          <div 
            onClick={() => { setIsDepositModalOpen(true); sound.playChipClick(); }}
            className="cursor-pointer p-4 rounded-xl bg-gradient-to-br from-[#101b2a] to-[#141b2b] border border-[#0D5CAB]/30 hover:border-[#0D5CAB] transition-all hover:scale-[1.02] shadow-lg flex items-center justify-between group"
          >
            <BankLogo variant="full" />
            <span className="text-[10px] font-extrabold text-[#6DB1FF] bg-[#0D5CAB]/20 px-2 py-1 rounded-lg border border-[#0D5CAB]/40 group-hover:bg-[#0D5CAB] group-hover:text-white transition">
              Wire
            </span>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#23334E]/60 pb-3">
          <h2 className="text-sm font-bold text-white">Transaction History</h2>

          {/* Filter tabs */}
          <div className="flex space-x-1 text-xs">
            {["ALL", "DEPOSIT", "WITHDRAWAL", "BET_WIN", "BONUS_CLAIM"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  sound.playChipClick();
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  filter === f
                    ? "bg-[#D4AF37] text-[#0B0F1A]"
                    : "bg-[#0B0F1A] text-gray-400 hover:text-white"
                }`}
              >
                {f.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading ledger...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-gray-400 uppercase bg-[#0B0F1A] border-b border-[#23334E]">
                <tr>
                  <th className="py-3 px-4">Type / Method</th>
                  <th className="py-3 px-4">Details / TxID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23334E]/40">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-[#151F32]/50 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{t.type.replace("_", " ")}</div>
                      <div className="text-[10px] text-gray-400">{t.method}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      <div>{t.note || "Standard transaction"}</div>
                      {t.txId && (
                        <span className="font-mono text-[10px] text-gray-400">TxID: {t.txId}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span
                        className={
                          t.amount >= 0 ? "text-[#10B981]" : "text-red-400"
                        }
                      >
                        {t.amount >= 0 ? "+" : ""}৳{Math.abs(t.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/20 text-[#10B981]">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400 font-mono text-[11px]">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
