"use client";

import React, { useState } from "react";
import { X, ShieldCheck, User, Lock, Mail, Phone, Sparkles } from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, showNotification } =
    useUserStore();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("WELCOME777");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (identifier?: string, pass?: string) => {
    const targetIdentifier = identifier || emailOrPhone;
    const targetPass = pass || password;

    if (!targetIdentifier || !targetPass) {
      showNotification("Please enter your email/phone and password", "ERROR");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: targetIdentifier,
          password: targetPass,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        sound.playWin();
        useUserStore.getState().setUser(data.user);
        showNotification(`Welcome back, ${data.user.name}! Signed in successfully.`, "SUCCESS");
        closeAuthModal();
      } else {
        sound.playCrash();
        showNotification(data.error || "Failed to sign in", "ERROR");
      }
    } catch {
      showNotification("Failed to connect to authentication server", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !emailOrPhone || !password) {
      showNotification("Please fill in all required fields", "ERROR");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: emailOrPhone.includes("@") ? emailOrPhone : `${emailOrPhone}@user.local`,
          phone: !emailOrPhone.includes("@") ? emailOrPhone : null,
          password,
          referralCode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        sound.playWin();
        useUserStore.getState().setUser(data.user);
        showNotification(`Welcome to 777 Casino, ${data.user.name}! ৳2,000 Bonus has been credited.`, "SUCCESS");
        closeAuthModal();
      } else {
        showNotification(data.error || "Registration failed", "ERROR");
      }
    } catch {
      showNotification("Error during registration", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#111827] border border-[#23334E] rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#23334E] bg-[#0E1523]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#BA2649] animate-pulse" />
            <h3 className="text-base font-bold text-white tracking-wide">
              {authModalMode === "LOGIN" ? "Sign In to 777 Casino" : "Create 777 Casino Account"}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1C273D] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 m-6 mb-4 bg-[#0B0F1A] rounded-xl border border-[#23334E]">
          <button
            type="button"
            onClick={() => {
              openAuthModal("LOGIN");
              sound.playChipClick();
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              authModalMode === "LOGIN"
                ? "bg-[#BA2649] text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              openAuthModal("REGISTER");
              sound.playChipClick();
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              authModalMode === "REGISTER"
                ? "bg-[#BA2649] text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Register (+৳2,000 Bonus)
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Quick Demo Login Presets */}
          {authModalMode === "LOGIN" && (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>1-Click VIP Demo Accounts</span>
                <span className="text-[#FFDE59]">Instant Play</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleLogin("player@auracasino.com", "demo123")}
                  className="p-2.5 bg-[#151F32] hover:bg-[#1A253C] border border-[#23334E] hover:border-[#BA2649] rounded-xl text-left transition flex flex-col justify-center"
                >
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFDE59]" />
                    <span>Demo Player</span>
                  </div>
                  <div className="text-[10px] text-[#10B981] font-mono mt-0.5">৳24,500 Balance</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleLogin("admin@auracasino.com", "admin123")}
                  className="p-2.5 bg-[#151F32] hover:bg-[#1A253C] border border-[#23334E] hover:border-[#BA2649] rounded-xl text-left transition flex flex-col justify-center"
                >
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#BA2649]" />
                    <span>Grand Admin</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">Full Admin Panel</div>
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#23334E]"></div>
                <span className="flex-shrink mx-3 text-[11px] text-gray-500 uppercase font-semibold">Or with credentials</span>
                <div className="flex-grow border-t border-[#23334E]"></div>
              </div>
            </div>
          )}

          {authModalMode === "LOGIN" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1.5">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="player@auracasino.com or 017XXXXXXXX"
                    className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#BA2649]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#BA2649]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-burgundy w-full py-3.5 uppercase tracking-wider text-xs font-black shadow-retro"
              >
                {loading ? <span>Authenticating...</span> : <span>Sign In to Play</span>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shakib Ahmed"
                    className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#BA2649]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Email / Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX or email"
                    className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#BA2649]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#BA2649]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">
                  Promocode / Referral Code
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="e.g. WELCOME777"
                  className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3.5 py-2.5 text-xs text-[#FFDE59] uppercase font-mono font-bold focus:outline-none focus:border-[#BA2649]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-burgundy w-full py-3.5 uppercase tracking-wider text-xs font-black shadow-retro"
              >
                {loading ? <span>Creating Account...</span> : <span>Create Account & Claim ৳2,000</span>}
              </button>
            </form>
          )}

          <div className="text-center text-[11px] text-gray-400 flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>18+ | Fair Play Certified | Instant Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
