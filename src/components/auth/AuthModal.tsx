"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Eye, EyeOff, ShieldCheck, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useUserStore } from "@/lib/store/useUserStore";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import sound from "@/lib/sound";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, showNotification, setUser } = useUserStore();
  const { addFreePlayPoints, setIsHelpModalOpen } = useArcadeStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoginMode, setIsLoginMode] = useState(false);

  // Step 1: Personal Details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dobDay, setDobDay] = useState("15");
  const [dobMonth, setDobMonth] = useState("June");
  const [dobYear, setDobYear] = useState("1998");
  const [country, setCountry] = useState("Bangladesh");
  const [nationality, setNationality] = useState("Bangladeshi");
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Step 2: Account Details
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("What was your first childhood pet's name?");
  const [securityAnswer, setSecurityAnswer] = useState("");

  // Step 3: Address & Bonus
  const [city, setCity] = useState("Dhaka");
  const [phone, setPhone] = useState("+880 1");
  const [promocode, setPromocode] = useState("Welcome777");

  // Login Mode State
  const [loginEmailOrUser, setLoginEmailOrUser] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    if (!isAuthModalOpen) return;
    setIsLoginMode(authModalMode === "LOGIN");
    setStep(1);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, authModalMode, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  // Handle Step 1 Next
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      showNotification("Please enter your First Name", "ERROR");
      return;
    }
    if (!lastName.trim()) {
      showNotification("Please enter your Last Name", "ERROR");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      showNotification("Please enter a valid Email address", "ERROR");
      return;
    }
    if (!acceptedTerms) {
      showNotification("Please accept the Terms and Conditions to proceed", "ERROR");
      return;
    }

    sound.playChipClick();
    if (!username) {
      setUsername(`${firstName.trim().toLowerCase()}_${lastName.slice(0, 1).toLowerCase()}`);
    }
    setStep(2);
  };

  // Handle Step 2 Next
  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username.trim().length < 3) {
      showNotification("Please choose a Username with at least 3 characters", "ERROR");
      return;
    }
    if (!password.trim() || password.trim().length < 6) {
      showNotification("Password must be at least 6 characters long", "ERROR");
      return;
    }

    sound.playChipClick();
    setStep(3);
  };

  // Handle Step 3 Final Submit
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWin();

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#C33355", "#FFE066", "#0D9488", "#FFFFFF"],
      });
    } catch {}

    const newUser = {
      id: `usr_${Date.now()}`,
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      phone: phone.trim(),
      role: "USER" as const,
      balance: 200,
      bonusBalance: 200,
      currency: "USD",
      coins: 15000,
      equippedFrame: "frame-classic",
      equippedGameSkin: "skin-felt-green",
      inventory: ["frame-classic", "skin-felt-green"],
    };

    setUser(newUser);
    addFreePlayPoints(15000);
    showNotification(
      `Welcome to 777 Retro Arcade, ${firstName}! Your account is ready with 15,000 FreePlay PTS & Promocode Welcome777.`,
      "SUCCESS"
    );
    closeAuthModal();
  };

  // Handle Direct Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrUser.trim()) {
      showNotification("Please enter your Username or Email", "ERROR");
      return;
    }
    sound.playWin();

    const loggedInUser = {
      id: `usr_${Date.now()}`,
      name: loginEmailOrUser.split("@")[0],
      email: loginEmailOrUser.includes("@") ? loginEmailOrUser : `${loginEmailOrUser}@777arcade.com`,
      role: "USER" as const,
      balance: 500,
      bonusBalance: 250,
      currency: "USD",
      coins: 15000,
      equippedFrame: "frame-classic",
      equippedGameSkin: "skin-felt-green",
      inventory: ["frame-classic", "skin-felt-green"],
    };

    setUser(loggedInUser);
    showNotification(`Welcome back, ${loggedInUser.name}!`, "SUCCESS");
    closeAuthModal();
  };

  const countries = [
    "Bangladesh",
    "United Kingdom",
    "Canada",
    "United States",
    "Australia",
    "Germany",
    "Sweden",
    "Netherlands",
    "Japan",
    "India",
  ];

  const nationalities = [
    "Bangladeshi",
    "British",
    "Canadian",
    "American",
    "Australian",
    "German",
    "Swedish",
    "Dutch",
    "Japanese",
    "Indian",
  ];

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 70 }, (_, i) => String(2006 - i));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none overflow-y-auto animate-in fade-in duration-200">
      
      {/* Outer Modal Container with Vintage Border */}
      <div className="relative w-full max-w-[960px] bg-[#CFEAE0] border-2 border-[#76B7A2] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden my-auto text-[#1F4E42]">
        
        {/* Floating Circular Close Button in Top-Right (Exact match to screenshot) */}
        <button
          onClick={() => {
            sound.playChipClick();
            closeAuthModal();
          }}
          className="absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full bg-[#EAF7F1] hover:bg-white border border-[#76B7A2] text-[#1F4E42] flex items-center justify-center shadow-md transition transform hover:scale-110 active:scale-95"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 2-Column Composition: Main Form (~75%) + Vintage Banner (~25%) */}
        <div className="flex flex-col md:flex-row min-h-[500px]">
          
          {/* ========================================================
              LEFT: AUTHENTIC 3-STEP REGISTRATION FORM (Matching Screenshot)
              ======================================================== */}
          <div className="relative flex-1 p-5 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#E2F4EC] via-[#CFEAE0] to-[#C1E2D6] overflow-hidden">
            
            {/* Subtle vintage watermark wallpaper */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(255,255,255,0.4),transparent_60%)] pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 text-9xl text-white/10 font-black pointer-events-none select-none">
              777
            </div>

            {/* TOP BAR: 777 Retro Logo (Left) + English / Help Pill (Right) */}
            <div className="relative z-10 flex items-center justify-between pb-3">
              {/* Retro 3D 777 Logo Badge */}
              <div className="flex items-center space-x-2">
                <div className="logo-777-badge px-3.5 py-1 rounded-2xl flex items-center justify-center shadow-md transform -rotate-1">
                  <span className="logo-777-text text-2xl font-black tracking-wider leading-none">
                    777
                  </span>
                </div>
              </div>

              {/* Language & Help Pill Box (Matching screenshot!) */}
              <div className="flex items-center space-x-2 bg-[#FFF6D4] border border-[#DECF9E] rounded-md px-3 py-1 shadow-xs text-xs font-bold text-[#40243B]">
                <span className="flex items-center space-x-1 cursor-pointer hover:opacity-80">
                  <span>🇬🇧</span>
                  <span className="text-[11px]">English</span>
                </span>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => setIsHelpModalOpen(true)}
                  className="text-[11px] hover:text-[#C33355] transition"
                >
                  Help
                </button>
              </div>
            </div>

            {/* If in Login Mode */}
            {isLoginMode ? (
              <div className="relative z-10 py-6 max-w-md mx-auto w-full space-y-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h2 className="text-2xl font-black text-[#1F4E42]">Log In to Your 777 Account</h2>
                  <p className="text-xs text-gray-600">Enter your credentials to continue your free arcade play</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-[#1F4E42]">Username or Email</label>
                    <input
                      type="text"
                      value={loginEmailOrUser}
                      onChange={(e) => setLoginEmailOrUser(e.target.value)}
                      placeholder="player_one or user@domain.com"
                      className="w-full px-4 py-2.5 rounded-full bg-[#EAF7F1] border-1.5 border-dashed border-[#8EBFA9] text-xs font-semibold text-[#1F4E42] placeholder-[#1F4E42]/50 outline-none focus:border-[#1F4E42] transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-[#1F4E42]">Password</label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-full bg-[#EAF7F1] border-1.5 border-dashed border-[#8EBFA9] text-xs font-semibold text-[#1F4E42] placeholder-[#1F4E42]/50 outline-none focus:border-[#1F4E42] transition"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playChipClick();
                        setIsLoginMode(false);
                        setStep(1);
                      }}
                      className="text-xs font-bold text-[#C33355] hover:underline"
                    >
                      Don't have an account? Sign Up
                    </button>

                    <button
                      type="submit"
                      className="px-8 py-2.5 rounded-lg bg-[#5C1D2E] hover:bg-[#48101E] text-white font-black text-xs uppercase tracking-wider transition shadow-md active:scale-95"
                    >
                      LOG IN
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* 3-STEP REGISTRATION FLOW */
              <div className="relative z-10 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Stepper Progress Bar (Step 1, 2, 3 with Golden Downward Ribbon Tag) */}
                <div className="relative pt-2 pb-1">
                  <div className="relative flex items-center justify-between">
                    {/* Connecting Green Horizontal Line */}
                    <div className="absolute top-4 left-4 right-16 h-0.5 bg-[#8ABEA9] -z-0" />

                    {/* Step Numbers Container */}
                    <div className="relative z-10 flex items-center space-x-12">
                      {/* Step 1 Tag */}
                      <div className="relative flex flex-col items-center">
                        {step === 1 ? (
                          /* Downward-pointing Golden Ribbon Tag (Exact match!) */
                          <div
                            className="w-7 h-9 bg-gradient-to-b from-[#FFB800] via-[#F5A623] to-[#E29512] flex items-center justify-center text-white font-black text-sm shadow-md"
                            style={{
                              clipPath: "polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)",
                            }}
                          >
                            <span className="-translate-y-1 text-white drop-shadow-xs">1</span>
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#1F4E42] text-white flex items-center justify-center font-black text-xs shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      {/* Step 2 Tag */}
                      <div className="relative flex flex-col items-center">
                        {step === 2 ? (
                          <div
                            className="w-7 h-9 bg-gradient-to-b from-[#FFB800] via-[#F5A623] to-[#E29512] flex items-center justify-center text-white font-black text-sm shadow-md"
                            style={{
                              clipPath: "polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)",
                            }}
                          >
                            <span className="-translate-y-1 text-white drop-shadow-xs">2</span>
                          </div>
                        ) : (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-xs ${
                            step > 2 ? "bg-[#1F4E42] text-white" : "bg-[#6FA996] text-white"
                          }`}>
                            {step > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
                          </div>
                        )}
                      </div>

                      {/* Step 3 Tag */}
                      <div className="relative flex flex-col items-center">
                        {step === 3 ? (
                          <div
                            className="w-7 h-9 bg-gradient-to-b from-[#FFB800] via-[#F5A623] to-[#E29512] flex items-center justify-center text-white font-black text-sm shadow-md"
                            style={{
                              clipPath: "polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)",
                            }}
                          >
                            <span className="-translate-y-1 text-white drop-shadow-xs">3</span>
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#6FA996] text-white flex items-center justify-center font-black text-xs shadow-xs">
                            3
                          </div>
                        )}
                      </div>
                    </div>

                    {/* *All fields are required. */}
                    <div className="text-[10px] text-[#1F4E42]/80 italic font-semibold">
                      *All fields are required.
                    </div>
                  </div>
                </div>

                {/* ====================================================
                    STEP 1 CONTENT: "Welcome, let's get you started"
                    ==================================================== */}
                {step === 1 && (
                  <form onSubmit={handleStep1Next} className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F4E42] tracking-tight">
                      Welcome, let's get you started
                    </h2>

                    {/* 2-Column Field Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 text-xs">
                      {/* Left: First Name */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#1F4E42]">First Name</label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder=""
                          className="w-full px-4 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none focus:bg-white focus:border-[#1F4E42] transition shadow-inner"
                        />
                      </div>

                      {/* Right: Email */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#1F4E42]">Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder=""
                          className="w-full px-4 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none focus:bg-white focus:border-[#1F4E42] transition shadow-inner"
                        />
                      </div>

                      {/* Left: Last Name */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#1F4E42]">Last Name</label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder=""
                          className="w-full px-4 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none focus:bg-white focus:border-[#1F4E42] transition shadow-inner"
                        />
                      </div>

                      {/* Right: Date of Birth (3 pill dropdowns in a row) */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#1F4E42]">Date of Birth</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <select
                            value={dobDay}
                            onChange={(e) => setDobDay(e.target.value)}
                            className="px-2 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none cursor-pointer focus:bg-white"
                          >
                            <option value="">Day</option>
                            {days.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>

                          <select
                            value={dobMonth}
                            onChange={(e) => setDobMonth(e.target.value)}
                            className="px-2 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none cursor-pointer focus:bg-white"
                          >
                            <option value="">Month</option>
                            {months.map((m) => (
                              <option key={m} value={m}>
                                {m.slice(0, 3)}
                              </option>
                            ))}
                          </select>

                          <select
                            value={dobYear}
                            onChange={(e) => setDobYear(e.target.value)}
                            className="px-2 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none cursor-pointer focus:bg-white"
                          >
                            <option value="">Year</option>
                            {years.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Left: Country of Residence */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#1F4E42]">Country of residence</label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-4 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none cursor-pointer focus:bg-white"
                        >
                          {countries.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Right: Nationality */}
                      <div className="space-y-1">
                        <label className="font-bold text-[#1F4E42]">Nationality</label>
                        <select
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                          className="w-full px-4 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none cursor-pointer focus:bg-white"
                        >
                          {nationalities.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Terms Checkbox (Exact match to screenshot!) */}
                    <div className="pt-2 flex items-start space-x-2.5">
                      <input
                        type="checkbox"
                        id="terms-check"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border border-[#76B7A2] text-[#1F4E42] focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="terms-check" className="text-[11px] text-[#1F4E42] leading-tight cursor-pointer">
                        I'm over 18 years of age and I accept these{" "}
                        <span className="underline font-bold hover:text-[#C33355]">Terms and Conditions</span> and{" "}
                        <span className="underline font-bold hover:text-[#C33355]">Privacy Policy</span>
                      </label>
                    </div>

                    {/* Bottom Console: Already have account (Left) + NEXT (Right) */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          sound.playChipClick();
                          setIsLoginMode(true);
                        }}
                        className="text-xs font-bold text-[#1F4E42]/80 hover:text-[#C33355] transition"
                      >
                        Already registered? <span className="underline font-black">Log in</span>
                      </button>

                      <button
                        type="submit"
                        className="px-8 py-2.5 rounded-lg bg-[#5C1D2E] hover:bg-[#48101E] text-white font-black text-xs uppercase tracking-wider transition shadow-md active:scale-95"
                      >
                        NEXT
                      </button>
                    </div>
                  </form>
                )}

                {/* ====================================================
                    STEP 2 CONTENT: "Create your login details"
                    ==================================================== */}
                {step === 2 && (
                  <form onSubmit={handleStep2Next} className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F4E42] tracking-tight">
                      Create your login credentials
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-[#1F4E42]">Username</label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="e.g. lucky_roller"
                          className="w-full px-4 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none focus:bg-white focus:border-[#1F4E42] transition shadow-inner"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-[#1F4E42]">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full pl-4 pr-9 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none focus:bg-white focus:border-[#1F4E42] transition shadow-inner"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1F4E42]"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-[#1F4E42]">Security Question</label>
                        <select
                          value={securityQuestion}
                          onChange={(e) => setSecurityQuestion(e.target.value)}
                          className="w-full px-4 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none cursor-pointer focus:bg-white"
                        >
                          <option>What was your first childhood pet's name?</option>
                          <option>What city were you born in?</option>
                          <option>What is your favorite arcade game?</option>
                          <option>What was the make of your first car?</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-[#1F4E42]">Security Answer</label>
                        <input
                          type="text"
                          required
                          value={securityAnswer}
                          onChange={(e) => setSecurityAnswer(e.target.value)}
                          placeholder="Your secret answer"
                          className="w-full px-4 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none focus:bg-white focus:border-[#1F4E42] transition shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          sound.playChipClick();
                          setStep(1);
                        }}
                        className="px-6 py-2.5 rounded-lg border border-[#76B7A2] text-[#1F4E42] font-black text-xs uppercase tracking-wider hover:bg-white/60 transition"
                      >
                        BACK
                      </button>

                      <button
                        type="submit"
                        className="px-8 py-2.5 rounded-lg bg-[#5C1D2E] hover:bg-[#48101E] text-white font-black text-xs uppercase tracking-wider transition shadow-md active:scale-95"
                      >
                        NEXT
                      </button>
                    </div>
                  </form>
                )}

                {/* ====================================================
                    STEP 3 CONTENT: "Claim your Welcome Bonus"
                    ==================================================== */}
                {step === 3 && (
                  <form onSubmit={handleFinalSubmit} className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1F4E42] tracking-tight">
                      Almost there! Claim your Welcome Bonus
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-[#1F4E42]">City / Town</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Dhaka"
                          className="w-full px-4 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none focus:bg-white focus:border-[#1F4E42] transition shadow-inner"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-[#1F4E42]">Mobile Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+880 1700-000000"
                          className="w-full px-4 py-2 rounded-full bg-[#D7EFE6] border border-dashed border-[#8FC4B2] text-xs font-semibold text-[#1F4E42] outline-none focus:bg-white focus:border-[#1F4E42] transition shadow-inner"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-[#1F4E42]">Promocode (Pre-Applied)</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={promocode}
                            onChange={(e) => setPromocode(e.target.value)}
                            className="w-full px-4 py-2 rounded-full bg-[#FFF6D4] border-2 border-[#DECF9E] text-xs font-mono font-black text-[#C33355] outline-none shadow-xs"
                          />
                          <span className="px-3 py-1.5 rounded-full bg-emerald-600 text-white font-black text-[10px] shrink-0 uppercase tracking-wider">
                            +$200 BONUS
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#D7EFE6]/80 border border-[#8FC4B2] flex items-center space-x-2.5 text-xs text-[#1F4E42]">
                      <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                      <div>
                        <div className="font-black">100% FreePlay Arcade Entertainment</div>
                        <div className="text-[11px] text-gray-600">
                          Instant grant of 15,000 FreePlay Virtual Points upon joining.
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          sound.playChipClick();
                          setStep(2);
                        }}
                        className="px-6 py-2.5 rounded-lg border border-[#76B7A2] text-[#1F4E42] font-black text-xs uppercase tracking-wider hover:bg-white/60 transition"
                      >
                        BACK
                      </button>

                      <button
                        type="submit"
                        className="px-8 py-2.5 rounded-lg bg-[#5C1D2E] hover:bg-[#48101E] text-white font-black text-xs uppercase tracking-wider transition shadow-md active:scale-95"
                      >
                        CREATE MY ACCOUNT
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT: VERTICAL SEPIA BANNER (Matching Screenshot Exactly)
              "Welcome to the #1 retro Vegas casino experience"
              ======================================================== */}
          <div className="w-full md:w-[28%] bg-gradient-to-b from-[#E6D6BD] via-[#ECDCC5] to-[#DFCCB7] border-t md:border-t-0 md:border-l-2 border-[#CBB89F] p-6 flex flex-col justify-between text-[#4A1F2D] relative overflow-hidden select-none">
            
            {/* Subtle vintage parchment & rollercoaster track watermark */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_top,_rgba(0,0,0,0.2),transparent_70%)] pointer-events-none" />

            {/* Top Text: Script & Serif Typography matching screenshot */}
            <div className="relative z-10 text-center space-y-0.5 pt-2">
              <h3 className="font-serif italic text-2xl sm:text-3xl font-extrabold text-[#741F35] tracking-tight drop-shadow-xs">
                Welcome
              </h3>
              <p className="font-serif italic text-lg sm:text-xl font-bold text-[#741F35]">
                to the
              </p>
              <div className="text-4xl sm:text-5xl font-black text-[#5C1D2E] font-serif leading-none py-1">
                #1
              </div>
              <h4 className="font-serif italic text-xl sm:text-2xl font-black text-[#741F35] tracking-tight">
                retro Vegas
              </h4>
              <h4 className="font-serif uppercase text-lg sm:text-xl font-black text-[#5C1D2E] tracking-wider">
                casino
              </h4>
              <p className="font-serif italic text-base sm:text-lg font-bold text-[#741F35]">
                experience
              </p>
            </div>

            {/* Center: Safer Gambling Shield Badge */}
            <div className="relative z-10 my-4 p-3 rounded-2xl bg-white/50 border border-[#D5C2AA] text-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-[#5C1D2E] text-white flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-[#5C1D2E]">
                SAFER. BETTER. TOGETHER.
              </div>
              <p className="text-[9px] text-gray-700 font-semibold leading-tight">
                Playing responsibly within limits
              </p>
              <div className="text-[9px] font-black text-[#5C1D2E] pt-0.5">
                888+ responsible 🔞
              </div>
            </div>

            {/* Bottom: Classic Vintage Cadillac Roadster Car Front Silhouette */}
            <div className="relative z-10 pt-2 flex flex-col items-center">
              <div className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-transform">
                🚘
              </div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-gray-600 mt-1">
                1950S VEGAS RETRO
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
