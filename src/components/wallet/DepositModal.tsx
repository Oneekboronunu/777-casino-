"use client";

import React, { useState } from "react";
import { X, CheckCircle, Copy, ShieldCheck, Gift, ArrowRight } from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

const PAYMENT_METHODS = [
  {
    id: "bKash",
    name: "bKash Personal",
    logoColor: "#E2136E",
    number: "01788-992211",
    type: "Personal Send Money",
    instructions: "Go to your bKash App > Send Money > Enter Number > Enter Amount > Enter Reference 'AURA' > Copy TrxID.",
  },
  {
    id: "Nagad",
    name: "Nagad Personal",
    logoColor: "#F7931E",
    number: "01899-334422",
    type: "Personal Send Money",
    instructions: "Go to Nagad App > Send Money > Enter Number > Enter Amount > Confirm PIN > Copy 8-digit TxID.",
  },
  {
    id: "Rocket",
    name: "Rocket",
    logoColor: "#8C3494",
    number: "01911-556677-4",
    type: "Personal Transfer",
    instructions: "Dial *322# or use Rocket App > Send Money > Enter Rocket Number > Complete Transfer > Enter TxID.",
  },
  {
    id: "Bank",
    name: "City Bank Transfer",
    logoColor: "#0D5CAB",
    number: "1102938491001",
    type: "Instant Bank Transfer",
    instructions: "Transfer to A/C: 1102938491001 (Aura Royal Ltd, City Bank Principal Branch) > Submit TxID / Ref.",
  },
];

const PRESETS = [500, 1000, 2500, 5000, 10000, 25000];

export default function DepositModal() {
  const { isDepositModalOpen, setIsDepositModalOpen, updateBalance, showNotification } = useUserStore();
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [amount, setAmount] = useState<number>(2500);
  const [txId, setTxId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [applyBonus, setApplyBonus] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  if (!isDepositModalOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.playChipClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txId.trim()) {
      showNotification("Please enter your Transaction ID (TxID)", "ERROR");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          method: selectedMethod.id,
          txId: txId.trim(),
          accountNumber: accountNumber.trim() || "017XXXXXXXX",
          applyBonus,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        sound.playWin();
        updateBalance(amount);
        setSuccessData(data);
        showNotification(`৳${amount.toLocaleString()} credited to your balance instantly!`, "SUCCESS");
      } else {
        showNotification(data.error || "Deposit failed", "ERROR");
      }
    } catch {
      showNotification("Network error processing deposit", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsDepositModalOpen(false);
    setSuccessData(null);
    setTxId("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#111827] border border-[#23334E] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23334E] bg-[#0E1523]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-wide">Instant Deposit (Local & Bank)</h3>
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
            <h4 className="text-2xl font-bold text-white">Deposit Confirmed!</h4>
            <p className="text-sm text-gray-300">
              ৳{amount.toLocaleString()} has been added to your cash balance with instant verification.
            </p>
            {applyBonus && (
              <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl text-xs text-[#EBD07B]">
                🎁 50% Reload Bonus of ৳{(amount * 0.5).toLocaleString()} credited to your Bonus Wallet!
              </div>
            )}
            <button
              onClick={handleClose}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B0F1A] font-bold rounded-xl transition shadow-gold"
            >
              Back to Games
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Select Deposit Method
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {PAYMENT_METHODS.map((m) => {
                  const isSelected = selectedMethod.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMethod(m);
                        sound.playChipClick();
                      }}
                      className={`flex items-center p-3 rounded-xl border text-left transition ${
                        isSelected
                          ? "border-[#D4AF37] bg-[#D4AF37]/10 text-white"
                          : "border-[#23334E] bg-[#151F32] text-gray-300 hover:border-gray-600"
                      }`}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full mr-2.5 flex-shrink-0"
                        style={{ backgroundColor: m.logoColor }}
                      />
                      <div>
                        <div className="text-sm font-bold">{m.name}</div>
                        <div className="text-[11px] text-gray-400">{m.type}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Details Box */}
            <div className="p-4 bg-[#0B0F1A] border border-[#23334E] rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Official {selectedMethod.name} Number:</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-medium">
                  Active Agent
                </span>
              </div>
              <div className="flex items-center justify-between bg-[#151F32] px-3.5 py-2.5 rounded-lg border border-[#23334E]">
                <span className="font-mono text-base font-bold text-white tracking-wider">
                  {selectedMethod.number}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedMethod.number)}
                  className="flex items-center space-x-1 text-xs text-[#D4AF37] hover:text-white px-2 py-1 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/30 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {selectedMethod.instructions}
              </p>
            </div>

            {/* Preset Amounts */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Deposit Amount (BDT ৳)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2.5">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setAmount(p);
                      sound.playChipClick();
                    }}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      amount === p
                        ? "border-[#D4AF37] bg-[#D4AF37] text-[#0B0F1A]"
                        : "border-[#23334E] bg-[#151F32] text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    ৳{p.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl pl-8 pr-4 py-2.5 text-white font-semibold focus:outline-none focus:border-[#D4AF37]"
                  placeholder="Enter custom amount (min ৳100)"
                />
              </div>
            </div>

            {/* Sender Number & Transaction ID */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Your Phone / A/C
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 01711223344"
                  className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Transaction ID (TxID) *
                </label>
                <input
                  type="text"
                  required
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                  placeholder="e.g. 9J88AB12C"
                  className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-gray-500 font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Bonus Toggle */}
            <div
              onClick={() => setApplyBonus(!applyBonus)}
              className="flex items-center justify-between p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl cursor-pointer hover:bg-[#D4AF37]/10 transition"
            >
              <div className="flex items-center space-x-2.5">
                <Gift className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <div className="text-xs font-bold text-white">Claim 50% Reload Bonus</div>
                  <div className="text-[11px] text-[#EBD07B]">Get extra ৳{(amount * 0.5).toLocaleString()} bonus</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={applyBonus}
                onChange={() => {}}
                className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-[#0B0F1A] font-extrabold rounded-xl transition shadow-gold flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Deposit...</span>
              ) : (
                <>
                  <span>Deposit ৳{amount.toLocaleString()} Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Instant auto-approval enabled for localhost demo test</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
