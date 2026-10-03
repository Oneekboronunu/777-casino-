"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  Trophy,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle,
  Plus,
  Minus,
  Zap,
  Flame,
  Settings2,
  Sliders,
  Globe,
  Lock,
  Unlock,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import { useAdminConfigStore, GameRigSettings } from "@/lib/store/useAdminConfigStore";
import sound from "@/lib/sound";

export default function AdminPage() {
  const { user, showNotification } = useUserStore();
  const { settings, updateSettings, resetToDefaults } = useAdminConfigStore();

  // Admin Access Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"GAMES_RIG" | "WORLDWIDE" | "PLAYERS" | "SPORTS" | "TRANSACTIONS">("GAMES_RIG");

  const [metrics, setMetrics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Score editing modal state
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [homeScoreInput, setHomeScoreInput] = useState<string>("");
  const [awayScoreInput, setAwayScoreInput] = useState<string>("");
  const [liveMinuteInput, setLiveMinuteInput] = useState<string>("");
  const [liveSummaryInput, setLiveSummaryInput] = useState<string>("");

  useEffect(() => {
    // Check if user is already admin or if PIN was unlocked in session
    if (user?.role === "ADMIN" || sessionStorage.getItem("admin_unlocked") === "true") {
      setIsAuthenticated(true);
    }
    fetchAdminData();
    fetchMatches();
  }, [user]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "777" || pinInput === "admin123" || pinInput === "0000") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_unlocked", "true");
      sound.playWin();
      showNotification("Master Admin Panel Unlocked!", "SUCCESS");
    } else {
      sound.playCrash();
      showNotification("Incorrect Master PIN (Hint: 777)", "ERROR");
    }
  };

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/overview");
      const data = await res.json();
      if (res.ok) {
        setMetrics(data.metrics);
        setUsersList(data.users || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch("/api/sports/matches");
      const data = await res.json();
      if (res.ok) {
        setMatches(data.matches || []);
      }
    } catch {
      // ignore
    }
  };

  const handleAdjustBalance = async (userId: string, amount: number) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "ADJUST_BALANCE",
          amount,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        sound.playWin();
        showNotification(`Balance adjusted by ${amount >= 0 ? "+" : ""}৳${amount.toLocaleString()}`, "SUCCESS");
        fetchAdminData();
      } else {
        showNotification(data.error || "Adjustment failed", "ERROR");
      }
    } catch {
      showNotification("Error adjusting balance", "ERROR");
    }
  };

  const handleSaveScore = async () => {
    if (!selectedMatch) return;
    try {
      const res = await fetch("/api/admin/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_SCORE",
          matchId: selectedMatch.id,
          homeScore: homeScoreInput,
          awayScore: awayScoreInput,
          liveMinute: liveMinuteInput,
          liveSummary: liveSummaryInput,
        }),
      });

      if (res.ok) {
        sound.playWin();
        showNotification("Match score and live status updated!", "SUCCESS");
        setSelectedMatch(null);
        fetchMatches();
      }
    } catch {
      showNotification("Error updating score", "ERROR");
    }
  };

  // Worldwide Calculations
  const baseTurnover = (metrics?.totalTurnover || 18450000) * (settings.globalWorldwideTurnoverMultiplier || 1.0);
  const baseGGR = baseTurnover * ((settings.globalHouseEdgePercent || 8) / 100);
  const worldwideUSD = Math.round(baseTurnover / 120);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111827] border-2 border-[#BA2649] rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#BA2649]/20 border-2 border-[#BA2649] flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8 text-[#FFDE59]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-wide">MASTER ADMIN ACCESS</h2>
            <p className="text-xs text-gray-400 mt-1">
              777 Enterprise Casino & Game Algorithm Suite
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Enter Master PIN or Password
              </label>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Default PIN: 777"
                className="w-full bg-[#0B0F1A] border-2 border-[#23334E] focus:border-[#BA2649] rounded-2xl px-4 py-3.5 text-center text-xl font-mono text-white tracking-widest outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 btn-burgundy text-white font-black rounded-xl shadow-retro uppercase tracking-wider text-sm transition"
            >
              Unlock Control Center
            </button>
          </form>
          <div className="text-[11px] text-gray-500">
            Quick Master Access Code: <span className="font-mono text-[#FFDE59] font-bold">777</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header & Live Indicator */}
      <div className="bg-[#111827] border border-[#23334E] rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#BA2649] to-[#8C1430] flex items-center justify-center shadow-lg border border-[#FFDE59]/30">
            <Shield className="w-6 h-6 text-[#FFDE59]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-white tracking-wide">
                777 GOD-MODE ADMIN SUITE
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-[10px] font-bold animate-pulse">
                ● LIVE ENGINE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Real-time Game Algorithm Rigging, Worldwide Financials & Sportsbook Management
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              fetchAdminData();
              fetchMatches();
              sound.playChipClick();
              showNotification("Data refreshed from database", "INFO");
            }}
            className="px-4 py-2 bg-[#151F32] hover:bg-[#1C283F] border border-[#23334E] text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FFDE59]" />
            <span>Sync DB</span>
          </button>
          <button
            onClick={() => {
              resetToDefaults();
              sound.playWin();
              showNotification("All game rig settings reset to factory defaults", "INFO");
            }}
            className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Rig</span>
          </button>
          <Link
            href="/"
            className="px-4 py-2 btn-burgundy text-white font-black text-xs rounded-xl shadow-retro uppercase tracking-wider"
          >
            Go to Site
          </Link>
        </div>
      </div>

      {/* 2. Worldwide Real-Time Financials Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Worldwide Total Wagers */}
        <div className="p-5 bg-gradient-to-br from-[#131b2c] to-[#0d1320] border border-[#23334E] rounded-2xl space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center space-x-1.5 font-bold uppercase text-[11px] tracking-wider text-gray-300">
              <Globe className="w-3.5 h-3.5 text-[#FFDE59]" />
              <span>Worldwide Turnover</span>
            </span>
            <span className="text-[10px] text-[#10B981] font-mono">Live Ticker</span>
          </div>
          <div className="text-2xl font-black font-mono text-[#FFDE59]">
            ৳{Math.round(baseTurnover).toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">
            ≈ ${worldwideUSD.toLocaleString()} USD across all nodes
          </div>
        </div>

        {/* Total Platform GGR */}
        <div className="p-5 bg-gradient-to-br from-[#1a1420] to-[#0d1320] border border-[#23334E] rounded-2xl space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center space-x-1.5 font-bold uppercase text-[11px] tracking-wider text-gray-300">
              <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
              <span>House Profit (GGR)</span>
            </span>
            <span className="text-[10px] text-[#FFDE59] font-bold bg-[#FFDE59]/10 px-2 py-0.5 rounded">
              {settings.globalHouseEdgePercent}% Margin
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-[#10B981]">
            ৳{Math.round(baseGGR).toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">
            Net Casino & Sportsbook yield
          </div>
        </div>

        {/* Total Real Deposits */}
        <div className="p-5 bg-gradient-to-br from-[#121c25] to-[#0d1320] border border-[#23334E] rounded-2xl space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center space-x-1.5 font-bold uppercase text-[11px] tracking-wider text-gray-300">
              <ArrowDownLeft className="w-3.5 h-3.5 text-[#6DB1FF]" />
              <span>Total Deposits</span>
            </span>
            <span className="text-[10px] text-[#10B981] font-bold">100% Instant</span>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            ৳{(metrics?.totalDeposits || 2450000).toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">
            bKash, Nagad, Rocket & Bank
          </div>
        </div>

        {/* Global Active Players */}
        <div className="p-5 bg-gradient-to-br from-[#20151c] to-[#0d1320] border border-[#23334E] rounded-2xl space-y-1.5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center space-x-1.5 font-bold uppercase text-[11px] tracking-wider text-gray-300">
              <Users className="w-3.5 h-3.5 text-[#FF65A5]" />
              <span>Active Players Online</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          </div>
          <div className="text-2xl font-black font-mono text-[#FF65A5]">
            {(settings.worldwideActivePlayersCount || 1842).toLocaleString()} Active
          </div>
          <div className="text-[11px] text-gray-400">
            {metrics?.userCount || 4} Registered in DB
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#23334E] pb-3">
        {[
          { id: "GAMES_RIG", label: "🎮 Game Rig & Win Rates", desc: "Aviator, Carrom, Dice, Roulette, CoinFlip" },
          { id: "WORLDWIDE", label: "🌍 Global Volume Controller", desc: "Turnover Multiplier & House Margin" },
          { id: "PLAYERS", label: "👥 Player Ledger & User Rigging", desc: "Balances, VIP Tiers, Streak Overrides" },
          { id: "SPORTS", label: "🏏 Sportsbook Score Editor", desc: "IPL, BPL & UCL Live Settlement" },
          { id: "TRANSACTIONS", label: "💳 Financial Ledger", desc: "Recent Deposits & Withdrawals" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              sound.playChipClick();
            }}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center space-x-2 ${
              activeTab === tab.id
                ? "bg-[#BA2649] text-white shadow-retro"
                : "bg-[#111827] text-gray-400 hover:text-white border border-[#23334E]"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ==================== TAB 1: GAME RIG & ALGORITHM CONTROLLER ==================== */}
      {activeTab === "GAMES_RIG" && (
        <div className="space-y-6">
          <div className="p-4 bg-[#BA2649]/10 border border-[#BA2649]/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SlidersHorizontal className="w-5 h-5 text-[#FFDE59]" />
              <div className="text-xs">
                <span className="font-black text-white uppercase tracking-wider block">
                  REAL-TIME ALGORITHM CONTROL ACTIVE
                </span>
                <span className="text-gray-300 text-[11px]">
                  Any changes saved below instantly apply to all player rounds across the website.
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#FFDE59] bg-[#BA2649] px-3 py-1 rounded-lg uppercase">
              Live Override
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. AVIATOR CRASH CONTROLLER */}
            <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#23334E]/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-black text-white uppercase tracking-wide">
                    Aviator Crash Controller
                  </h3>
                </div>
                <span className="text-xs font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30">
                  Crash Point Engine
                </span>
              </div>

              {/* Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Flight Algorithm Mode
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "HOUSE_PROFIT", label: "House Profit (Rigged)", desc: "Frequent crashes < 1.20x" },
                    { id: "FAIR", label: "Natural Fair (RNG)", desc: "Standard random distribution" },
                    { id: "FORCE_NEXT_CRASH", label: "Force Exact Multiplier", desc: "Custom Target Crash Point" },
                    { id: "MEGA_WIN_EVENT", label: "Mega Flight Event", desc: "Allow 50x - 150x skyrocket" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        updateSettings({ aviatorMode: m.id as any });
                        sound.playChipClick();
                        showNotification(`Aviator mode set to ${m.label}`, "SUCCESS");
                      }}
                      className={`p-3 rounded-xl border text-left transition ${
                        settings.aviatorMode === m.id
                          ? "border-[#BA2649] bg-[#BA2649]/20 text-white font-bold"
                          : "border-[#23334E] bg-[#151F32] text-gray-400 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-bold">{m.label}</div>
                      <div className="text-[10px] text-gray-400">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Crash Under 1.20x Chance Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-300">Instant Crash Chance (&lt; 1.20x)</span>
                  <span className="font-mono font-bold text-[#FFDE59] text-sm">
                    {settings.aviatorHouseCrashUnder120Chance}%
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={80}
                  step={5}
                  value={settings.aviatorHouseCrashUnder120Chance}
                  onChange={(e) => updateSettings({ aviatorHouseCrashUnder120Chance: Number(e.target.value) })}
                  className="w-full accent-[#BA2649] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>5% (Gentle)</span>
                  <span>40% (High Profit)</span>
                  <span>80% (Hard Rig)</span>
                </div>
              </div>

              {/* Forced Next Multiplier Input */}
              {settings.aviatorMode === "FORCE_NEXT_CRASH" && (
                <div className="p-3 bg-[#BA2649]/15 border border-[#BA2649]/40 rounded-xl space-y-2">
                  <label className="text-xs font-bold text-white block">
                    Target Exact Next Multiplier (e.g. 1.05 or 10.00):
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step={0.01}
                      min={1.01}
                      max={1000}
                      value={settings.aviatorForceNextMultiplier}
                      onChange={(e) => updateSettings({ aviatorForceNextMultiplier: parseFloat(e.target.value) || 1.05 })}
                      className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-sm text-white font-mono font-bold outline-none"
                    />
                    <button
                      onClick={() => showNotification(`Forced Next Crash set to ${settings.aviatorForceNextMultiplier}x`, "SUCCESS")}
                      className="px-4 py-2 bg-[#BA2649] text-white font-bold text-xs rounded-xl"
                    >
                      Set
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. EUROPEAN ROULETTE CONTROLLER */}
            <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#23334E]/60 pb-3">
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-5 h-5 text-[#FFDE59]" />
                  <h3 className="text-base font-black text-white uppercase tracking-wide">
                    Roulette 3D Controller
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#FFDE59] bg-[#FFDE59]/10 px-2 py-0.5 rounded border border-[#FFDE59]/30">
                  Wheel Physics & Magnet
                </span>
              </div>

              {/* Magnet Ball Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-[#151F32] border border-[#23334E] rounded-xl">
                <div>
                  <div className="text-xs font-bold text-white">Magnet Ball Diversion</div>
                  <div className="text-[11px] text-gray-400">
                    Deflects ball away from high-stake player chips into empty numbers
                  </div>
                </div>
                <button
                  onClick={() => {
                    updateSettings({ rouletteMagnetMode: !settings.rouletteMagnetMode });
                    sound.playChipClick();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition ${
                    settings.rouletteMagnetMode
                      ? "bg-[#10B981] text-black"
                      : "bg-[#23334E] text-gray-400"
                  }`}
                >
                  {settings.rouletteMagnetMode ? "ENABLED" : "DISABLED"}
                </button>
              </div>

              {/* House Advantage Bias */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-300">House Deflection Bias</span>
                  <span className="font-mono font-bold text-[#FFDE59] text-sm">
                    {settings.rouletteHouseAdvantageBias}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={settings.rouletteHouseAdvantageBias}
                  onChange={(e) => updateSettings({ rouletteHouseAdvantageBias: Number(e.target.value) })}
                  className="w-full accent-[#BA2649] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>0% (Pure Random)</span>
                  <span>30% (Recommended)</span>
                  <span>60% (Max House Cut)</span>
                </div>
              </div>

              {/* Green 0 Zero Boost */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-300">Green Zero (0) Hit Probability Boost</span>
                  <span className="font-mono font-bold text-[#10B981] text-sm">
                    +{settings.rouletteZeroFrequencyBoost}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={2}
                  value={settings.rouletteZeroFrequencyBoost}
                  onChange={(e) => updateSettings({ rouletteZeroFrequencyBoost: Number(e.target.value) })}
                  className="w-full accent-[#10B981] cursor-pointer"
                />
              </div>
            </div>

            {/* 3. PROVABLY FAIR DICE CONTROLLER */}
            <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#23334E]/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-[#10B981]" />
                  <h3 className="text-base font-black text-white uppercase tracking-wide">
                    Dice 0-100 Algorithm Controller
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">
                  Streak & Margin Rig
                </span>
              </div>

              {/* Max Consecutive Win Streak Limiter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-300">Max Allowed Consecutive Win Streak</span>
                  <span className="font-mono font-bold text-red-400 text-sm">
                    Max {settings.diceMaxConsecutiveWins} Wins
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={settings.diceMaxConsecutiveWins}
                  onChange={(e) => updateSettings({ diceMaxConsecutiveWins: Number(e.target.value) })}
                  className="w-full accent-[#BA2649] cursor-pointer"
                />
                <div className="text-[10px] text-gray-400">
                  Player automatically loses on roll #{settings.diceMaxConsecutiveWins + 1} to prevent martingale abuse.
                </div>
              </div>

              {/* House Win Bias Offset */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-300">House Edge Bias Offset</span>
                  <span className="font-mono font-bold text-[#FFDE59] text-sm">
                    +{settings.diceHouseEdgeOffset}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={settings.diceHouseEdgeOffset}
                  onChange={(e) => updateSettings({ diceHouseEdgeOffset: Number(e.target.value) })}
                  className="w-full accent-[#BA2649] cursor-pointer"
                />
              </div>
            </div>

            {/* 4. COIN FLIP STREAK CONTROLLER */}
            <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#23334E]/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-[#FFDE59]" />
                  <h3 className="text-base font-black text-white uppercase tracking-wide">
                    Coin Flip Streak Controller
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#FFDE59] bg-[#FFDE59]/10 px-2 py-0.5 rounded border border-[#FFDE59]/30">
                  Multi-Streak Control
                </span>
              </div>

              {/* Force Outcome */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Flip Outcome Mode
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: "FAIR", label: "Natural (50/50)" },
                    { id: "FORCE_WIN", label: "Force Win (100%)" },
                    { id: "FORCE_LOSS", label: "Force Loss (0%)" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        updateSettings({ coinFlipForceOutcome: m.id as any });
                        sound.playChipClick();
                        showNotification(`Coin Flip mode: ${m.label}`, "SUCCESS");
                      }}
                      className={`p-2.5 rounded-xl border text-center font-bold transition ${
                        settings.coinFlipForceOutcome === m.id
                          ? "border-[#BA2649] bg-[#BA2649] text-white"
                          : "border-[#23334E] bg-[#151F32] text-gray-400 hover:text-white"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Streak */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-300">Max Winning Streak Limit</span>
                  <span className="font-mono font-bold text-red-400 text-sm">
                    {settings.coinFlipMaxStreak} Flips Max
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={settings.coinFlipMaxStreak}
                  onChange={(e) => updateSettings({ coinFlipMaxStreak: Number(e.target.value) })}
                  className="w-full accent-[#BA2649] cursor-pointer"
                />
                <div className="text-[10px] text-gray-400">
                  Caps exponential multiplier scaling (prevents huge cashouts).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: WORLDWIDE VOLUME CONTROLLER ==================== */}
      {activeTab === "WORLDWIDE" && (
        <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-6 shadow-xl max-w-3xl">
          <div className="border-b border-[#23334E]/60 pb-3">
            <h3 className="text-base font-black text-white uppercase tracking-wide flex items-center space-x-2">
              <Globe className="w-5 h-5 text-[#FFDE59]" />
              <span>Worldwide Financial Metric Scaling</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Control the global platform scale, simulated turnover multipliers, and worldwide active player tickers.
            </p>
          </div>

          {/* Global House Edge Percent */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">Target Global House Margin (GGR %)</span>
              <span className="font-mono font-bold text-[#10B981] text-base">
                {settings.globalHouseEdgePercent}%
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={35}
              step={1}
              value={settings.globalHouseEdgePercent}
              onChange={(e) => updateSettings({ globalHouseEdgePercent: Number(e.target.value) })}
              className="w-full accent-[#10B981] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>3% (Player Friendly)</span>
              <span>10% (Industry Standard)</span>
              <span>35% (Aggressive Profit)</span>
            </div>
          </div>

          {/* Turnover Scaling Multiplier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">Worldwide Turnover Multiplier</span>
              <span className="font-mono font-bold text-[#FFDE59] text-base">
                {settings.globalWorldwideTurnoverMultiplier}x
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={10.0}
              step={0.5}
              value={settings.globalWorldwideTurnoverMultiplier}
              onChange={(e) => updateSettings({ globalWorldwideTurnoverMultiplier: Number(e.target.value) })}
              className="w-full accent-[#BA2649] cursor-pointer"
            />
          </div>

          {/* Active Online Players Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">Global Online Players Counter (Simulated Feed)</span>
              <span className="font-mono font-bold text-[#FF65A5] text-base">
                {settings.worldwideActivePlayersCount} Players
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={settings.worldwideActivePlayersCount}
              onChange={(e) => updateSettings({ worldwideActivePlayersCount: Number(e.target.value) })}
              className="w-full accent-[#FF65A5] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* ==================== TAB 3: PLAYERS & INDIVIDUAL RIGGING ==================== */}
      {activeTab === "PLAYERS" && (
        <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#23334E]/60 pb-3">
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wide">
                User Accounts & Balance Adjustment
              </h3>
              <p className="text-xs text-gray-400">Instant manual credit/debit & targeted luck overrides</p>
            </div>
            <span className="text-xs font-bold text-gray-300 bg-[#151F32] px-3 py-1 rounded-lg border border-[#23334E]">
              {usersList.length} Accounts in Database
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-gray-400 uppercase bg-[#0B0F1A] border-b border-[#23334E]">
                <tr>
                  <th className="py-3 px-4">User / Email</th>
                  <th className="py-3 px-4">Role / Tier</th>
                  <th className="py-3 px-4">Real Balance</th>
                  <th className="py-3 px-4">Bonus Balance</th>
                  <th className="py-3 px-4 text-center">Quick Adjust Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23334E]/40">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#151F32]/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] font-mono text-gray-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === "ADMIN" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-[#10B981]/20 text-[#10B981]"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#10B981] text-sm">
                      ৳{u.balance?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#FFDE59]">
                      ৳{u.bonusBalance?.toLocaleString() || 0}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleAdjustBalance(u.id, 1000)}
                          className="px-2.5 py-1 bg-[#10B981]/20 hover:bg-[#10B981] text-[#10B981] hover:text-black font-bold rounded-lg border border-[#10B981]/40 transition text-[11px]"
                        >
                          +1k
                        </button>
                        <button
                          onClick={() => handleAdjustBalance(u.id, 5000)}
                          className="px-2.5 py-1 bg-[#10B981]/20 hover:bg-[#10B981] text-[#10B981] hover:text-black font-bold rounded-lg border border-[#10B981]/40 transition text-[11px]"
                        >
                          +5k
                        </button>
                        <button
                          onClick={() => handleAdjustBalance(u.id, 25000)}
                          className="px-2.5 py-1 bg-[#FFDE59]/20 hover:bg-[#FFDE59] text-[#FFDE59] hover:text-black font-bold rounded-lg border border-[#FFDE59]/40 transition text-[11px]"
                        >
                          +25k
                        </button>
                        <button
                          onClick={() => handleAdjustBalance(u.id, -1000)}
                          className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-bold rounded-lg border border-red-500/40 transition text-[11px]"
                        >
                          -1k
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: SPORTSBOOK MATCH EDITOR ==================== */}
      {activeTab === "SPORTS" && (
        <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#23334E]/60 pb-3">
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wide">
                Live Cricket & Football Match Score Control
              </h3>
              <p className="text-xs text-gray-400">Click any match to update live scores, ball-by-ball summary & minutes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMatch(m);
                  setHomeScoreInput(m.homeScore);
                  setAwayScoreInput(m.awayScore);
                  setLiveMinuteInput(m.liveMinute || "");
                  setLiveSummaryInput(m.liveSummary || "");
                  sound.playChipClick();
                }}
                className="cursor-pointer p-4 bg-[#151F32] hover:bg-[#1A263D] border border-[#23334E] hover:border-[#BA2649] rounded-2xl transition space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-bold">{m.tournament}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    m.status === "LIVE" ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-gray-700 text-gray-300"
                  }`}>
                    {m.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-white">
                  <span>{m.homeTeam} ({m.homeScore})</span>
                  <span className="text-xs text-gray-500">VS</span>
                  <span>{m.awayTeam} ({m.awayScore})</span>
                </div>
                {m.liveSummary && (
                  <div className="text-[11px] text-[#FFDE59] bg-[#0B0F1A] px-2.5 py-1 rounded-lg">
                    {m.liveMinute} • {m.liveSummary}
                  </div>
                )}
                <div className="text-[10px] text-right text-gray-400 underline font-bold">
                  Click to Edit Score & Status →
                </div>
              </div>
            ))}
          </div>

          {/* Edit Score Modal */}
          {selectedMatch && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#111827] border-2 border-[#BA2649] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                <h4 className="text-base font-black text-white">
                  Edit Match: {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">{selectedMatch.homeTeamCode} Score</label>
                    <input
                      type="text"
                      value={homeScoreInput}
                      onChange={(e) => setHomeScoreInput(e.target.value)}
                      className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">{selectedMatch.awayTeamCode} Score</label>
                    <input
                      type="text"
                      value={awayScoreInput}
                      onChange={(e) => setAwayScoreInput(e.target.value)}
                      className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Live Minute / Over (e.g. 14.2 Ov or 68&apos;)</label>
                  <input
                    type="text"
                    value={liveMinuteInput}
                    onChange={(e) => setLiveMinuteInput(e.target.value)}
                    className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Live Commentary Summary</label>
                  <input
                    type="text"
                    value={liveSummaryInput}
                    onChange={(e) => setLiveSummaryInput(e.target.value)}
                    className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="flex-1 py-2.5 bg-[#151F32] text-gray-300 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveScore}
                    className="flex-1 py-2.5 btn-burgundy text-white font-black text-xs rounded-xl shadow-retro"
                  >
                    Save & Broadcast
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 5: TRANSACTIONS LEDGER ==================== */}
      {activeTab === "TRANSACTIONS" && (
        <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-base font-black text-white uppercase tracking-wide">
            Recent System Transactions & Deposits
          </h3>
          <div className="space-y-2">
            {(metrics?.recentTransactions || []).map((t: any) => (
              <div key={t.id} className="p-3 bg-[#151F32] border border-[#23334E] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{t.type} via {t.method}</span>
                  <span className="text-gray-400 ml-2 font-mono">{t.txId ? `TxID: ${t.txId}` : ""}</span>
                </div>
                <div className="font-mono font-bold text-[#10B981]">
                  ৳{t.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
