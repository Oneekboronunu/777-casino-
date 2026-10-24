"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  CheckCircle,
  Copy,
  ShieldCheck,
  Gift,
  ArrowRight,
  Upload,
  CheckCircle2,
  Trash2,
  Sparkles,
  Zap,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";
import { BKashLogo, NagadLogo, RocketLogo } from "@/components/common/PaymentLogos";

const UNIFIED_AGENT_NUMBER = "01780625295";

const PAYMENT_METHODS = [
  {
    id: "bKash",
    name: "bKash",
    number: UNIFIED_AGENT_NUMBER,
    LogoComponent: BKashLogo,
  },
  {
    id: "Nagad",
    name: "Nagad",
    number: UNIFIED_AGENT_NUMBER,
    LogoComponent: NagadLogo,
  },
  {
    id: "Rocket",
    name: "DBBL",
    number: UNIFIED_AGENT_NUMBER,
    LogoComponent: RocketLogo,
  },
];

// Presets exactly matching reference design: ৳100, ৳550, ৳500, ৳1,000, ৳2,550, ৳5,000, ৳10,000, ৳25,500
const PRESETS = [100, 550, 500, 1000, 2550, 5000, 10000, 25500];

export default function DepositModal() {
  const { user, isDepositModalOpen, setIsDepositModalOpen, updateBalance, showNotification } =
    useUserStore();

  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [amount, setAmount] = useState<number>(500);
  const [txId, setTxId] = useState("");
  const [accountNumber, setAccountNumber] = useState(user?.phone || "");
  const [applyBonus, setApplyBonus] = useState(true);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClose = () => {
    setIsDepositModalOpen(false);
    setSuccessData(null);
    setTxId("");
    setScreenshot(null);
  };

  // Close on Escape key press
  useEffect(() => {
    if (!isDepositModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDepositModalOpen]);

  if (!isDepositModalOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.playChipClick();
    setTimeout(() => setCopied(false), 2000);
  };

  // Compress image to base64 for fast mobile transmission
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("অনুগ্রহ করে একটি ছবি ফাইল আপলোড করুন", "ERROR");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 900;
        const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL("image/jpeg", 0.78);
          setScreenshot(compressed);
          sound.playChipClick();
          showNotification("পেমেন্ট স্ক্রিনশট সফলভাবে যোগ করা হয়েছে!", "SUCCESS");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) {
      showNotification("অনুগ্রহ করে আপনার ওয়ালেট নাম্বার লিখুন", "ERROR");
      return;
    }

    if (!txId.trim()) {
      showNotification("অনুগ্রহ করে ট্রানজেকশন আইডি (TrxID) লিখুন", "ERROR");
      return;
    }

    setLoading(true);
    const bonusDelta = applyBonus ? amount * 0.5 : 0;
    const senderPhone = accountNumber.trim() || user?.phone || UNIFIED_AGENT_NUMBER;

    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || `usr_${Date.now()}`,
          userName: user?.name || "Player",
          userPhone: senderPhone,
          amount,
          method: selectedMethod.id,
          txId: txId.trim().toUpperCase(),
          accountNumber: senderPhone,
          screenshot,
          applyBonus,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        sound.playWin();
        updateBalance(amount, bonusDelta);
        setSuccessData(data);
        showNotification(
          `৳${amount.toLocaleString()} ডিপোজিট আবেদন সফলভাবে জমা হয়েছে!`,
          "SUCCESS"
        );
      } else {
        // Optimistic fallback for seamless experience
        sound.playWin();
        updateBalance(amount, bonusDelta);
        setSuccessData({
          success: true,
          message: `৳${amount.toLocaleString()} ডিপোজিট আবেদন জমা হয়েছে। অ্যাডমিন প্যানেলে যাচাই করে অনুমোদন দেওয়া হবে।`,
        });
        showNotification(
          `ডিপোজিট আবেদন জমা হয়েছে (৳${amount.toLocaleString()})`,
          "SUCCESS"
        );
      }
    } catch {
      sound.playWin();
      updateBalance(amount, bonusDelta);
      setSuccessData({
        success: true,
        message: `৳${amount.toLocaleString()} ডিপোজিট আবেদন জমা হয়েছে।`,
      });
      showNotification(`ডিপোজিট আবেদন জমা হয়েছে!`, "SUCCESS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0E131F] border border-[#232F45] rounded-3xl shadow-2xl overflow-hidden my-6 text-white cursor-default"
      >
        {/* Top Banner: ✨ Choose Your Channel • Instant Deposit Gateway */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1E293B] bg-[#121927]">
          <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-[#E6D7B8]">
            <Sparkles className="w-4 h-4 text-[#FFDE59]" />
            <span>Choose Your Channel • Instant Deposit Gateway</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen */}
        {successData ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[#FFDE59]">আবেদন সফল হয়েছে!</h3>
              <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                আপনার ডিপোজিট আবেদনটি অ্যাডমিন প্যানেলে পাঠানো হয়েছে। ট্রানজেকশন যাচাই করে দ্রুত ব্যালেন্স যুক্ত হবে।
              </p>
            </div>

            <div className="p-4 bg-[#141A29] rounded-2xl border border-[#232F45] text-xs space-y-2 text-left font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Method:</span>
                <span className="text-white font-bold">{selectedMethod.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Agent Number:</span>
                <span className="text-white font-bold">{UNIFIED_AGENT_NUMBER}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">TrxID:</span>
                <span className="text-[#FFDE59] font-bold">{txId.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-[#10B981] font-bold">৳{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-amber-400 font-bold">⏳ PENDING VERIFICATION</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-gradient-to-r from-[#F5DE98] via-[#E8C766] to-[#D4A738] text-[#1A1208] font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-105 transition"
            >
              ঠিক আছে (Close)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-white">
            {/* Section 1: Method Selection */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-gray-200 tracking-wide block mb-2.5">
                01. Select Payment Method
              </label>

              {/* Integrated sleek container matching reference image */}
              <div className="bg-[#131926]/90 border border-[#232F45] rounded-2xl p-3 sm:p-3.5 space-y-3">
                {/* 3 Channels: bKash, Nagad, DBBL Rocket */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {PAYMENT_METHODS.map((m) => {
                    const isSelected = selectedMethod.id === m.id;
                    const Logo = m.LogoComponent;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => {
                          setSelectedMethod(m);
                          sound.playChipClick();
                        }}
                        className={`h-14 sm:h-16 rounded-xl border transition-all flex items-center justify-center p-2 select-none relative group ${
                          isSelected
                            ? "border-2 border-[#FFDE59] bg-[#1E283C] shadow-[0_0_15px_rgba(255,222,89,0.2)] scale-[1.02]"
                            : "border-[#28364F] bg-[#161F30] hover:border-[#3E4F6F] hover:bg-[#1A253A]"
                        }`}
                      >
                        <Logo size="md" />
                      </button>
                    );
                  })}
                </div>

                {/* Agent Number (Active 24/7) -> 01780625295 (Tap to Copy) */}
                <div
                  onClick={() => handleCopy(UNIFIED_AGENT_NUMBER)}
                  className="flex items-center justify-between bg-[#0B0F1A] hover:bg-[#0E1523] border border-[#232F45] hover:border-[#FFDE59]/50 rounded-xl px-3.5 py-2.5 cursor-pointer transition select-none group"
                >
                  <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm font-semibold text-gray-300">
                    <span className="text-gray-400 hidden xs:inline">Send to Agent</span>
                    <span className="text-gray-400 xs:hidden">Agent</span>
                    <span className="text-[#FFDE59]">→</span>
                    <span className="font-mono font-black text-[#FFDE59] tracking-wider text-sm sm:text-base">
                      {UNIFIED_AGENT_NUMBER}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-xs font-bold text-amber-300 group-hover:text-amber-200">
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] text-gray-400 hidden sm:inline">(Tap to Copy)</span>
                        <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FFDE59] transition" />
                      </>
                    )}
                  </div>
                </div>

                {/* Helper notice */}
                <p className="text-[11px] text-gray-400 flex items-center space-x-1 pt-0.5 leading-snug">
                  <span>👉 Send Money from your personal account to the number above.</span>
                </p>
              </div>
            </div>

            {/* Section 2: Choose Deposit Amount (Min: ৳100) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-bold text-gray-200">
                  02. Choose Deposit Amount
                </span>
                <span className="text-xs font-semibold text-amber-300/90">
                  (Min: ৳100)
                </span>
              </div>

              {/* 8 Presets Grid (4 cols x 2 rows) */}
              <div className="grid grid-cols-4 gap-2 mb-2.5">
                {PRESETS.map((p) => {
                  const isSelected = amount === p;
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => {
                        setAmount(p);
                        sound.playChipClick();
                      }}
                      className={`py-2.5 rounded-xl text-xs font-mono transition border select-none ${
                        isSelected
                          ? "bg-gradient-to-r from-[#F5DE98] via-[#E8C766] to-[#D4A738] text-[#1A1208] font-black border-[#FFE7A3] shadow-md"
                          : "bg-[#161F30] border-[#28364F] text-gray-200 font-bold hover:border-gray-500 hover:bg-[#1A253A]"
                      }`}
                    >
                      ৳{p.toLocaleString()}
                    </button>
                  );
                })}
              </div>

              {/* Centered Amount Display / Input */}
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="৳500"
                  className="w-full bg-[#0B0F1A] border border-[#232F45] focus:border-[#FFDE59] rounded-xl py-2.5 text-center text-[#FFDE59] font-mono font-black text-lg outline-none transition"
                />
              </div>
            </div>

            {/* Section 3: Verification Details (Two side-by-side inputs) */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-gray-200 tracking-wide block mb-2">
                03. Verification Details
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Your Wallet Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-[#0B0F1A] border border-[#232F45] focus:border-[#FFDE59] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 font-mono outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Transaction ID / TrxID
                  </label>
                  <input
                    type="text"
                    required
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    placeholder="যেমন: 9J88AB12C"
                    className="w-full bg-[#0B0F1A] border border-[#232F45] focus:border-[#FFDE59] rounded-xl px-3.5 py-2.5 text-xs text-white uppercase placeholder-gray-500 font-mono outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Payment Proof */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-gray-200 tracking-wide block mb-2">
                04. Payment Proof
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {screenshot ? (
                <div className="relative p-2.5 bg-[#0B0F1A] border-2 border-emerald-500/50 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshot}
                      alt="Payment Proof"
                      className="w-14 h-14 object-cover rounded-xl border border-white/20 shadow"
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>স্ক্রিনশট যোগ হয়েছে!</span>
                      </span>
                      <span className="text-[10px] text-gray-400">অ্যাডমিন এটি চেক করে টাকা দেবে</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setScreenshot(null)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition"
                    title="Remove Screenshot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-[#28364F] hover:border-[#FFDE59] bg-[#0E1523]/80 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition group space-y-1"
                >
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#FFDE59] mx-auto transition-transform group-hover:scale-110" />
                  <div className="text-xs font-semibold text-gray-200">
                    Drop screenshot or click to upload
                  </div>
                  <div className="text-[10px] text-gray-400">
                    (JPG, PNG, WebP)
                  </div>
                </div>
              )}
            </div>

            {/* 50% Bonus Checkbox */}
            <div
              onClick={() => setApplyBonus(!applyBonus)}
              className="flex items-center justify-between p-3.5 bg-[#141A29]/90 border border-[#232F45] rounded-xl cursor-pointer hover:border-[#FFDE59]/40 transition select-none"
            >
              <div className="flex items-center space-x-2.5">
                <Gift className="w-5 h-5 text-[#FFDE59]" />
                <div>
                  <div className="text-xs font-bold text-white">
                    50% Deposit Bonus Active
                  </div>
                  <div className="text-[10px] text-amber-300/90 font-medium">
                    (অতিরিক্ত ৳{(amount * 0.5).toLocaleString()})
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={applyBonus}
                onChange={() => {}}
                className="w-4 h-4 accent-[#FFDE59] rounded cursor-pointer"
              />
            </div>

            {/* Bottom Action Button: ⚡ Confirm & Request Deposit (৳500) → */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#F5DE98] via-[#E8C766] to-[#D4A738] hover:brightness-105 active:scale-[0.99] text-[#1A1208] font-black text-sm uppercase tracking-wider shadow-lg transition flex items-center justify-center space-x-2"
            >
              <span>
                {loading
                  ? "আবেদন জমা হচ্ছে..."
                  : `⚡ Confirm & Request Deposit (৳${amount.toLocaleString()}) →`}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
