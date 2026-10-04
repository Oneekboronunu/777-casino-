"use client";

import React, { useState } from "react";
import { X, ShieldCheck, User, Lock, Mail, Phone, ArrowRight, Sparkles, Flame, CheckCircle2 } from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import { signInWithGoogle } from "@/lib/firebase";
import sound from "@/lib/sound";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, fetchUser, showNotification } =
    useUserStore();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("WELCOME777");
  const [loading, setLoading] = useState(false);
  const [firebaseLoading, setFirebaseLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleAuth = async () => {
    setFirebaseLoading(true);
    try {
      const { user: fbUser, error } = await signInWithGoogle();
      if (error) {
        showNotification(error, "ERROR");
      } else if (fbUser) {
        sound.playWin();
        showNotification(`🔥 Firebase Connected! Logged in as ${fbUser.displayName || fbUser.email}`, "SUCCESS");
        await fetchUser();
        closeAuthModal();
      }
    } catch {
      showNotification("Firebase Auth initialization error", "ERROR");
    } finally {
      setFirebaseLoading(false);
    }
  };

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

  const [registeredSuccessMsg, setRegisteredSuccessMsg] = useState<string | null>(null);

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
      if (res.ok) {
        sound.playWin();
        setRegisteredSuccessMsg(`Registration received for ${name}! Details sent to Admin (yasinworks925@gmail.com). Once approved, your ৳2,000 bonus will be active.`);
        showNotification("Account created! Pending Admin approval.", "SUCCESS");
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
      <div className="relative w-full max-w-md bg-[#111827] border border-[#23334E] rounded-2xl shadow-2xl overflow-hidden my-8">
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

        {/* Firebase Live Badge */}
        <div className="bg-[#BA2649]/10 border-b border-[#BA2649]/20 px-6 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-[#FFDE59]">
            <Flame className="w-3.5 h-3.5 text-[#BA2649]" />
            <span className="font-bold">Firebase Realtime Sync: Active</span>
          </div>
          <span className="text-[10px] text-green-400 font-mono">CONNECTED</span>
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

              {/* Google Firebase Login Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={firebaseLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 border border-gray-300 shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.41 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.59 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{firebaseLoading ? "Connecting Firebase..." : "Continue with Google (Firebase)"}</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#23334E]"></div>
                <span className="flex-shrink mx-3 text-[11px] text-gray-500 uppercase font-semibold">Or with credentials</span>
                <div className="flex-grow border-t border-[#23334E]"></div>
              </div>
            </div>
          )}

          {registeredSuccessMsg ? (
            <div className="p-5 bg-[#10B981]/15 border-2 border-[#10B981]/40 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-white">Application Received!</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {registeredSuccessMsg}
              </p>
              <div className="p-2.5 bg-[#0B0F1A] rounded-xl border border-[#23334E] text-[11px] text-[#FFDE59] font-mono">
                Admin Notification Sent to: yasinworks925@gmail.com
              </div>
              <button
                type="button"
                onClick={() => {
                  setRegisteredSuccessMsg(null);
                  openAuthModal("LOGIN");
                }}
                className="btn-burgundy w-full py-2.5 text-xs font-black uppercase tracking-wider rounded-xl"
              >
                Go to Sign In
              </button>
            </div>
          ) : authModalMode === "LOGIN" ? (
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
            <span>18+ | Fair Play Certified | Firebase Realtime Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
