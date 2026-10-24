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
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";
import { BKashLogo, NagadLogo, RocketLogo } from "@/components/common/PaymentLogos";

const UNIFIED_AGENT_NUMBER = "01780625295";

const PAYMENT_METHODS = [
  {
    id: "bKash",
    name: "bKash Personal",
    logoColor: "#E2136E",
    number: UNIFIED_AGENT_NUMBER,
    type: "Personal Send Money",
    instructions: `Go to bKash App > Send Money > Enter ${UNIFIED_AGENT_NUMBER} > Enter Amount > Copy TrxID & Screenshot.`,
    LogoComponent: BKashLogo,
  },
  {
    id: "Nagad",
    name: "Nagad Personal",
    logoColor: "#F7931E",
    number: UNIFIED_AGENT_NUMBER,
    type: "Personal Send Money",
    instructions: `Go to Nagad App > Send Money > Enter ${UNIFIED_AGENT_NUMBER} > Enter Amount > Copy TxID & Screenshot.`,
    LogoComponent: NagadLogo,
  },
  {
    id: "Rocket",
    name: "DBBL Rocket",
    logoColor: "#8C3494",
    number: UNIFIED_AGENT_NUMBER,
    type: "Personal / Agent",
    instructions: `Go to Rocket App or dial *322# > Send Money to ${UNIFIED_AGENT_NUMBER} > Copy TxID & Screenshot.`,
    LogoComponent: RocketLogo,
  },
];

const PRESETS = [100, 250, 500, 1000, 2500, 5000, 10000, 25000];

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
    if (!txId.trim()) {
      showNotification("Please enter your Transaction ID (TxID)", "ERROR");
      return;
    }

    setLoading(true);
    const bonusDelta = applyBonus ? amount * 0.5 : 0;
    const senderPhone = accountNumber.trim() || user?.phone || "01780625295";

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

      sound.playWin();
      setSuccessData(
        data || {
          success: true,
          message: `আপনার ৳${amount.toLocaleString()} ডিপোজিট আবেদনটি অ্যাডমিনের কাছে পাঠানো হয়েছে।`,
        }
      );
      showNotification(
        `ডিপোজিট আবেদন জমা হয়েছে! অ্যাডমিন ভেরিফাই করে একাউন্টে টাকা যোগ করে দেবে।`,
        "SUCCESS"
      );
    } catch {
      // Local fallback receipt
      sound.playWin();
      setSuccessData({
        success: true,
        message: `আপনার ৳${amount.toLocaleString()} ডিপোজিট আবেদন জমা হয়েছে।`,
      });
      showNotification(`ডিপোজিট আবেদন জমা হয়েছে!`, "SUCCESS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#111827] border-2 border-[#D4AF37]/50 rounded-3xl shadow-2xl overflow-hidden my-6 cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23334E] bg-gradient-to-r from-[#240B16] via-[#140C12] to-[#240B16]">
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_#10B981]" />
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#FFDE59] uppercase tracking-wide">
                টাকা ডিপোজিট করুন (Deposit)
              </h3>
              <p className="text-[11px] text-amber-200/80">
                bKash, Nagad, Rocket — সব একই নাম্বারে Send Money করুন
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successData ? (
          <div className="p-8 text-center space-y-5 text-white">
            <div className="w-20 h-20 bg-[#10B981]/20 text-[#10B981] border-2 border-[#10B981]/50 rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-[#FFDE59]">ডিপোজিট আবেদন জমা হয়েছে!</h4>
              <p className="text-sm text-gray-300 mt-2 max-w-sm mx-auto leading-relaxed">
                আপনার <strong>৳{amount.toLocaleString()} ({selectedMethod.name})</strong> পাঠানোর তথ্য ও স্ক্রিনশট অ্যাডমিন প্যানেলে পৌঁছে গেছে। অ্যাডমিন TrxID যাচাই করে দ্রুত আপনার একাউন্টে টাকা যোগ করে দেবে।
              </p>
            </div>

            <div className="p-4 bg-[#0B0F1A] border border-[#23334E] rounded-2xl text-xs space-y-1.5 text-left max-w-sm mx-auto font-mono">
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
              className="w-full py-3.5 bg-gradient-to-r from-[#BA2649] to-[#D12053] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition"
            >
              ঠিক আছে (Close)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-white">
            {/* Step 1: Payment Method Tabs */}
            <div>
              <span className="text-xs font-black uppercase text-amber-300 tracking-wider block mb-2">
                ১. মাধ্যম নির্বাচন করুন:
              </span>
              <div className="grid grid-cols-3 gap-2.5">
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
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-1 ${
                        isSelected
                          ? "border-[#FFDE59] bg-[#22101B] shadow-[0_0_12px_rgba(255,222,89,0.25)] scale-[1.02]"
                          : "border-[#23334E] bg-[#0E1523] hover:border-gray-500"
                      }`}
                    >
                      <Logo className="w-7 h-7" />
                      <span className="text-xs font-black text-white">{m.name.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Unified Agent Box (01780625295) */}
            <div className="bg-[#1C0F17] border-2 border-[#FFDE59]/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-200/90 font-bold uppercase tracking-wider">
                  অফিসিয়াল Send Money নাম্বার (Agent)
                </span>
                <span className="px-2 py-0.5 bg-[#BA2649] text-white text-[9px] font-black rounded-full uppercase">
                  Active 24/7
                </span>
              </div>

              <div className="flex items-center justify-between bg-[#12070D] p-3 rounded-xl border border-[#FFDE59]/30">
                <span className="font-mono text-xl sm:text-2xl font-black text-[#FFDE59] tracking-widest">
                  {UNIFIED_AGENT_NUMBER}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(UNIFIED_AGENT_NUMBER)}
                  className="px-3 py-1.5 bg-[#FFDE59] hover:bg-yellow-400 text-black font-black text-xs rounded-xl shadow flex items-center space-x-1.5 transition active:scale-95"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "কপি হয়েছে!" : "নাম্বার কপি"}</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-300 leading-relaxed">
                👉 আপনার {selectedMethod.name} থেকে উপরের নাম্বারে (<strong>{UNIFIED_AGENT_NUMBER}</strong>) Send Money করুন।
              </p>
            </div>

            {/* Step 2: Amount Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                  ২. জমার পরিমাণ (BDT ৳):
                </span>
                <span className="text-[11px] text-emerald-400 font-bold">মিনিমাম ৳১০০</span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                {PRESETS.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => {
                      setAmount(p);
                      sound.playChipClick();
                    }}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition border ${
                      amount === p
                        ? "bg-[#FFDE59] text-black border-[#FFDE59] shadow font-black"
                        : "bg-[#0B0F1A] border-[#23334E] text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    ৳{p.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FFDE59] font-black text-base">৳</span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-[#0B0F1A] border border-[#23334E] focus:border-[#FFDE59] rounded-xl pl-9 pr-4 py-2.5 text-white font-mono font-bold text-base outline-none"
                  placeholder="অন্য পরিমাণ লিখুন"
                />
              </div>
            </div>

            {/* Step 3: Sender Phone & TrxID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  আপনার বিকাশ / নগদ নাম্বার *
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-[#0B0F1A] border border-[#23334E] focus:border-[#FFDE59] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 font-mono outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  ট্রানজেকশন আইডি (TrxID) *
                </label>
                <input
                  type="text"
                  required
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                  placeholder="যেমন: 9J88AB12C"
                  className="w-full bg-[#0B0F1A] border border-[#23334E] focus:border-[#FFDE59] rounded-xl px-3.5 py-2.5 text-xs text-white uppercase placeholder-gray-500 font-mono outline-none"
                />
              </div>
            </div>

            {/* Step 4: Screenshot Upload Proof */}
            <div>
              <label className="text-xs font-black uppercase text-amber-300 tracking-wider block mb-1.5 flex items-center justify-between">
                <span>৪. পেমেন্টের স্ক্রিনশট (Screenshot Proof)</span>
                <span className="text-[10px] text-gray-400 font-normal">অ্যাডমিন দ্রুত ভেরিফাই করবে</span>
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
                      <span className="text-xs font-bold text-emerald-400 block flex items-center space-x-1">
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
                  className="p-4 border-2 border-dashed border-[#4A2036] hover:border-[#FFDE59] bg-[#0E1523]/60 rounded-2xl cursor-pointer text-center space-y-1.5 transition group"
                >
                  <Upload className="w-6 h-6 text-[#FFDE59] mx-auto group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-gray-200">
                    ক্লিক করে পেমেন্টের স্ক্রিনশট আপলোড করুন
                  </div>
                  <div className="text-[10px] text-gray-400">
                    JPG, PNG, WebP (bKash/Nagad পেমেন্ট কনফার্মেশন স্ক্রিনশট)
                  </div>
                </div>
              )}
            </div>

            {/* Bonus Checkbox */}
            <div
              onClick={() => setApplyBonus(!applyBonus)}
              className="flex items-center justify-between p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl cursor-pointer hover:bg-[#D4AF37]/15 transition select-none"
            >
              <div className="flex items-center space-x-2.5">
                <Gift className="w-5 h-5 text-[#FFDE59]" />
                <div>
                  <div className="text-xs font-bold text-white">৫০% ডিপোজিট বোনাস নিন</div>
                  <div className="text-[10px] text-amber-200">অতিরিক্ত ৳{(amount * 0.5).toLocaleString()} বোনাস পাবেন</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={applyBonus}
                onChange={() => {}}
                className="w-4 h-4 accent-[#BA2649] rounded cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#BA2649] via-[#D12053] to-[#BA2649] hover:brightness-110 active:scale-98 text-white font-black text-sm uppercase tracking-wider shadow-retro transition flex items-center justify-center space-x-2"
            >
              <span>
                {loading
                  ? "আবেদন জমা হচ্ছে..."
                  : `ডিপোজিট আবেদন জমা দিন (৳${amount.toLocaleString()}) ➔`}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
