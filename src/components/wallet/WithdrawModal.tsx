"use client";

import React, { useState } from "react";
import { X, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";
import { BKashLogo, NagadLogo, RocketLogo, UpayLogo, BankLogo } from "@/components/common/PaymentLogos";

const WITHDRAW_METHODS = [
  { id: "bKash", name: "bKash", logoColor: "#E2136E", fee: "0% Free", LogoComponent: BKashLogo },
  { id: "Nagad", name: "Nagad", logoColor: "#F7931E", fee: "0% Free", LogoComponent: NagadLogo },
  { id: "Rocket", name: "Rocket", logoColor: "#8C3494", fee: "0% Free", LogoComponent: RocketLogo },
  { id: "Upay", name: "Upay", logoColor: "#0D2040", fee: "0% Free", LogoComponent: UpayLogo },
  { id: "Bank", name: "Bank Transfer", logoColor: "#0D5CAB", fee: "0% Free", LogoComponent: BankLogo },
];

export default function WithdrawModal() {
  const { isWithdrawModalOpen, setIsWithdrawModalOpen, user, updateBalance, showNotification } = useUserStore();
  const [selectedMethod, setSelectedMethod] = useState(WITHDRAW_METHODS[0]);
  const [amount, setAmount] = useState<number>(1000);
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  if (!isWithdrawModalOpen) return null;

  const currentBalance = user?.balance || 0;

  const handlePercentage = (pct: number) => {
    const val = Math.floor((currentBalance * pct) / 100);
    setAmount(Math.max(500, val));
    sound.playChipClick();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) {
      showNotification("Please enter recipient account or mobile number", "ERROR");
      return;
    }

    if (amount > currentBalance) {
      showNotification("Withdrawal amount exceeds available balance", "ERROR");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          method: selectedMethod.id,
          accountNumber: accountNumber.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        sound.playWin();
        updateBalance(-amount);
        setSuccessData(data);
        showNotification(`৳${amount.toLocaleString()} withdrawn successfully!`, "SUCCESS");
      } else {
        showNotification(data.error || "Withdrawal failed", "ERROR");
      }
    } catch {
      showNotification("Network error processing withdrawal", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsWithdrawModalOpen(false);
    setSuccessData(null);
    setAccountNumber("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#111827] border border-[#23334E] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23334E] bg-[#0E1523]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <h3 className="text-lg font-bold text-white tracking-wide">Instant Withdrawal</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1C273D] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successData ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#10B981]/20 text-[#10B981] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-white">Withdrawal Processed!</h4>
            <p className="text-sm text-gray-300">
              ৳{amount.toLocaleString()} has been dispatched to {accountNumber} via {selectedMethod.name}.
            </p>
            <div className="p-3 bg-[#151F32] border border-[#23334E] rounded-xl text-xs text-gray-400">
              Reference TxID: <span className="font-mono text-white">WTX{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B0F1A] font-bold rounded-xl transition shadow-gold"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Balance Overview */}
            <div className="p-4 bg-[#0B0F1A] border border-[#23334E] rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400">Withdrawable Cash Balance</div>
                <div className="text-xl font-mono font-extrabold text-[#10B981]">
                  ৳{currentBalance.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Processing Speed</div>
                <div className="text-xs font-semibold text-[#D4AF37]">Instant VIP (1-5 Min)</div>
              </div>
            </div>

            {/* Method Select */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Withdrawal Destination
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {WITHDRAW_METHODS.map((m) => {
                  const isSelected = selectedMethod.id === m.id;
                  const LogoComp = m.LogoComponent;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMethod(m);
                        sound.playChipClick();
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                        isSelected
                          ? "border-[#D4AF37] bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/50 text-white shadow-lg"
                          : "border-[#23334E] bg-[#151F32] text-gray-300 hover:border-gray-500 hover:bg-[#1A263D]"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <LogoComp variant="icon" size="sm" className="flex-shrink-0" />
                        <span className="text-sm font-bold text-white">{m.name}</span>
                      </div>
                      <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/15 px-1.5 py-0.5 rounded border border-[#10B981]/30">{m.fee}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipient Account Number */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                {selectedMethod.name} Account / Phone Number *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 01711223344"
                className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Withdrawal Amount (BDT ৳)
                </label>
                <div className="flex space-x-1.5">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePercentage(pct)}
                      className="px-2 py-0.5 text-[11px] font-semibold bg-[#151F32] border border-[#23334E] hover:border-[#D4AF37] text-gray-300 rounded transition"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                <input
                  type="number"
                  min="500"
                  max={currentBalance}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl pl-8 pr-4 py-2.5 text-white font-semibold focus:outline-none focus:border-[#D4AF37]"
                  placeholder="Min ৳500"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || currentBalance < 500}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-[#0B0F1A] font-extrabold rounded-xl transition shadow-gold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authorizing Transfer...</span>
              ) : (
                <>
                  <span>Confirm Withdraw ৳{amount.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Zero transaction fees | SSL 256-bit Encrypted Payout</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
