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
  Copy,
  Image as ImageIcon,
  Check,
  X,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import { useAdminConfigStore, GameRigSettings } from "@/lib/store/useAdminConfigStore";
import sound from "@/lib/sound";
import CoinIcon from "@/components/common/CoinIcon";

export default function AdminPage() {
  const { user, showNotification } = useUserStore();
  const { settings, updateSettings, resetToDefaults } = useAdminConfigStore();

  // Admin Access Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "DEPOSITS" | "PLAYERS" | "GAMES_RIG" | "WORLDWIDE" | "SPORTS" | "TRANSACTIONS"
  >("DEPOSITS");

  const [metrics, setMetrics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [depositRequests, setDepositRequests] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Modal States
  const [depositFilter, setDepositFilter] = useState<"ALL" | "PENDING" | "COMPLETED" | "REJECTED">("ALL");
  const [playerSearch, setPlayerSearch] = useState<string>("");
  const [selectedScreenshotDeposit, setSelectedScreenshotDeposit] = useState<any | null>(null);

  // Custom Credit Inputs
  const [customAmounts, setCustomAmounts] = useState<{ [id: string]: string }>({});
  const [customCoins, setCustomCoins] = useState<{ [id: string]: string }>({});

  // Score editing modal state
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [homeScoreInput, setHomeScoreInput] = useState<string>("");
  const [awayScoreInput, setAwayScoreInput] = useState<string>("");
  const [liveMinuteInput, setLiveMinuteInput] = useState<string>("");
  const [liveSummaryInput, setLiveSummaryInput] = useState<string>("");

  useEffect(() => {
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
        setDepositRequests(data.depositRequests || []);
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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    sound.playChipClick();
    showNotification(`${label} কপি করা হয়েছে: ${text}`, "SUCCESS");
  };

  // Deposit Approval (Cash or Coins)
  const handleApproveDeposit = async (dep: any, creditType: "CASH" | "COINS", customVal?: number) => {
    try {
      const creditCash = creditType === "CASH" ? (customVal !== undefined ? customVal : dep.amount) : 0;
      const creditCoins = creditType === "COINS" ? (customVal !== undefined ? customVal : dep.amount * 10) : 0;

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE_DEPOSIT",
          depositId: dep.id,
          userId: dep.userId,
          amount: creditCash,
          coins: creditCoins,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        sound.playWin();
        showNotification(
          data.message || `ডিপোজিট সফলভাবে অনুমোদিত! ৳${creditCash.toLocaleString()} যোগ হয়েছে।`,
          "SUCCESS"
        );
        fetchAdminData();
        if (selectedScreenshotDeposit?.id === dep.id) {
          setSelectedScreenshotDeposit(null);
        }
      } else {
        showNotification(data.error || "অনুমোদন ব্যর্থ হয়েছে", "ERROR");
      }
    } catch {
      showNotification("ডিপোজিট অনুমোদনে ত্রুটি হয়েছে", "ERROR");
    }
  };

  const handleRejectDeposit = async (depId: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT_DEPOSIT",
          depositId: depId,
        }),
      });

      if (res.ok) {
        sound.playCrash();
        showNotification("ডিপোজিট আবেদন বাতিল করা হয়েছে", "INFO");
        fetchAdminData();
        if (selectedScreenshotDeposit?.id === depId) {
          setSelectedScreenshotDeposit(null);
        }
      }
    } catch {
      showNotification("Error rejecting deposit", "ERROR");
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
        showNotification(`ক্যাশ ব্যালেন্স আপডেট হয়েছে: ${amount >= 0 ? "+" : ""}৳${amount.toLocaleString()}`, "SUCCESS");
        fetchAdminData();
      } else {
        showNotification(data.error || "Adjustment failed", "ERROR");
      }
    } catch {
      showNotification("Error adjusting balance", "ERROR");
    }
  };

  const handleAdjustCoins = async (userId: string, coins: number) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "ADJUST_COINS",
          coins,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        sound.playWin();
        showNotification(`কয়েন আপডেট হয়েছে: ${coins >= 0 ? "+" : ""}${coins.toLocaleString()} Coins`, "SUCCESS");
        fetchAdminData();
      } else {
        showNotification(data.error || "Coins adjustment failed", "ERROR");
      }
    } catch {
      showNotification("Error adjusting coins", "ERROR");
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

  // Filtered deposits
  const filteredDeposits = depositRequests.filter((d) => {
    if (depositFilter === "ALL") return true;
    return d.status === depositFilter;
  });

  const pendingDepositsCount = depositRequests.filter((d) => d.status === "PENDING").length;

  // Filtered players
  const filteredUsers = usersList.filter((u) => {
    if (!playerSearch.trim()) return true;
    const query = playerSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(query) ||
      u.phone?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.id?.toLowerCase().includes(query)
    );
  });

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
              777 Enterprise Casino & Deposit Controller
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-white font-sans">
      {/* 1. Header Bar */}
      <div className="bg-[#111827] border border-[#23334E] rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#BA2649] to-[#8C1430] flex items-center justify-center shadow-lg border border-[#FFDE59]/30">
            <Shield className="w-6 h-6 text-[#FFDE59]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-white tracking-wide">
                777 MASTER ADMIN CONTROL
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-[10px] font-bold animate-pulse">
                ● LIVE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Agent Number: <span className="font-mono font-bold text-[#FFDE59]">01780625295</span> (bKash / Nagad / Rocket)
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
            <span>Sync Live DB</span>
          </button>
          <Link
            href="/"
            className="px-4 py-2 btn-burgundy text-white font-black text-xs rounded-xl shadow-retro uppercase tracking-wider"
          >
            Go to Site
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Deposits Card */}
        <div
          onClick={() => setActiveTab("DEPOSITS")}
          className={`p-5 rounded-2xl border cursor-pointer transition shadow-lg ${
            pendingDepositsCount > 0
              ? "bg-gradient-to-br from-[#3D1426] to-[#1C0A14] border-[#FFDE59] shadow-[0_0_15px_rgba(255,222,89,0.25)]"
              : "bg-[#111827] border-[#23334E]"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-bold uppercase text-[11px] tracking-wider text-amber-300 flex items-center space-x-1.5">
              <span>💰</span>
              <span>Pending Deposits</span>
            </span>
            {pendingDepositsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          <div className="text-3xl font-black font-mono text-[#FFDE59]">
            {pendingDepositsCount} Requests
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Click to review TrxID & Screenshot
          </div>
        </div>

        {/* Total Users */}
        <div
          onClick={() => setActiveTab("PLAYERS")}
          className="p-5 bg-gradient-to-br from-[#131b2c] to-[#0d1320] border border-[#23334E] rounded-2xl space-y-1 shadow-lg cursor-pointer hover:border-gray-500 transition"
        >
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-bold uppercase text-[11px] tracking-wider text-gray-300 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Registered Players</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">Auto-Saved</span>
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {usersList.length} Players
          </div>
          <div className="text-[11px] text-gray-400">
            Instant balance & coin adjustment
          </div>
        </div>

        {/* Turnover */}
        <div className="p-5 bg-[#111827] border border-[#23334E] rounded-2xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-bold uppercase text-[11px] tracking-wider text-gray-300 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-[#FFDE59]" />
              <span>Turnover Volume</span>
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-[#FFDE59]">
            ৳{Math.round(baseTurnover).toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400">
            Live betting & casino action
          </div>
        </div>

        {/* Agent Info */}
        <div className="p-5 bg-[#1C0F17] border border-[#BA2649]/40 rounded-2xl space-y-1 shadow-lg">
          <div className="text-xs text-amber-200/90 font-bold uppercase tracking-wider mb-1">
            Official Agent (All-in-One)
          </div>
          <div className="text-xl font-black font-mono text-[#FFDE59] tracking-wider flex items-center justify-between">
            <span>01780625295</span>
            <button
              onClick={() => handleCopy("01780625295", "Agent Number")}
              className="p-1.5 bg-[#BA2649] text-white rounded-lg text-[10px] uppercase font-black"
            >
              Copy
            </button>
          </div>
          <div className="text-[10px] text-gray-300">
            bKash, Rocket, Nagad সব এই নাম্বারে
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#23334E] pb-3">
        {[
          {
            id: "DEPOSITS",
            label: `💰 Deposit Requests (${pendingDepositsCount} PENDING)`,
            highlight: pendingDepositsCount > 0,
          },
          { id: "PLAYERS", label: "👥 Player Accounts & Balance" },
          { id: "GAMES_RIG", label: "🎮 Game Rig & Win Rates" },
          { id: "WORLDWIDE", label: "🌍 Global Volume Controller" },
          { id: "SPORTS", label: "🏏 Sportsbook Score Editor" },
          { id: "TRANSACTIONS", label: "💳 Financial Ledger" },
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
                : tab.highlight
                ? "bg-[#3D1426] text-[#FFDE59] border border-[#FFDE59]/50 animate-pulse"
                : "bg-[#111827] text-gray-400 hover:text-white border border-[#23334E]"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ==================== TAB: DEPOSIT REQUESTS (USER SCREENSHOT & TRXID) ==================== */}
      {activeTab === "DEPOSITS" && (
        <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#23334E]/60 pb-4">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wide flex items-center space-x-2">
                <span>ডিপোজিট আবেদন ও স্ক্রিনশট ভেরিফিকেশন</span>
                {pendingDepositsCount > 0 && (
                  <span className="px-2.5 py-0.5 bg-[#BA2649] text-white text-[10px] font-black rounded-full">
                    {pendingDepositsCount} New
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                প্লেয়ারদের পাঠানো TrxID এবং পেমেন্ট স্ক্রিনশট দেখে এক ক্লিকে একাউন্টে টাকা বা কয়েন যোগ করুন।
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1.5 bg-[#0B0F1A] p-1.5 rounded-2xl border border-[#23334E]">
              {(["ALL", "PENDING", "COMPLETED", "REJECTED"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setDepositFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    depositFilter === f
                      ? "bg-[#BA2649] text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {f === "ALL" ? "All" : f}
                </button>
              ))}
            </div>
          </div>

          {/* Deposit Requests Grid / List */}
          {filteredDeposits.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <span className="text-3xl">📭</span>
              <p className="text-xs text-gray-400 font-bold">কোন ডিপোজিট আবেদন পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDeposits.map((dep) => {
                const isPending = dep.status === "PENDING";
                const customCashVal = customAmounts[dep.id] ? parseFloat(customAmounts[dep.id]) : undefined;
                const customCoinVal = customCoins[dep.id] ? parseInt(customCoins[dep.id], 10) : undefined;

                return (
                  <div
                    key={dep.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                      isPending
                        ? "bg-[#180E16] border-[#FFDE59]/50 shadow-[0_0_15px_rgba(255,222,89,0.15)]"
                        : "bg-[#111827] border-[#23334E]"
                    }`}
                  >
                    {/* Left: Player info & Amount */}
                    <div className="flex items-start space-x-3.5">
                      {/* Screenshot Thumbnail */}
                      {dep.screenshot ? (
                        <div
                          onClick={() => setSelectedScreenshotDeposit(dep)}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-500/60 cursor-pointer hover:scale-105 transition shadow flex-shrink-0 group"
                          title="Click to view full screenshot"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={dep.screenshot}
                            alt="Payment Proof"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-[#0B0F1A] border border-[#23334E] flex flex-col items-center justify-center text-gray-500 flex-shrink-0 text-[10px]">
                          <ImageIcon className="w-5 h-5 mb-0.5" />
                          <span>No Image</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{dep.userName || "Player"}</span>
                          <span className="px-2 py-0.5 bg-[#BA2649]/20 border border-[#BA2649]/40 text-[#FFDE59] text-[10px] font-black rounded uppercase">
                            {dep.method}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                              dep.status === "COMPLETED"
                                ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40"
                                : dep.status === "REJECTED"
                                ? "bg-red-900/60 text-red-300 border border-red-500/40"
                                : "bg-yellow-900/60 text-yellow-300 border border-yellow-500/40 animate-pulse"
                            }`}
                          >
                            {dep.status}
                          </span>
                        </div>

                        {/* Phone Number with Copy */}
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-gray-400">Phone:</span>
                          <span className="font-mono font-bold text-white">{dep.userPhone || dep.accountNumber}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(dep.userPhone || dep.accountNumber, "Phone Number")}
                            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-[#FFDE59] transition"
                            title="Copy Phone Number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Transaction ID with Copy */}
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-gray-400">TrxID:</span>
                          <span className="font-mono font-black text-[#FFDE59] tracking-wider">{dep.txId}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(dep.txId, "Transaction ID")}
                            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-[#FFDE59] transition"
                            title="Copy TrxID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Amount */}
                    <div className="p-3 bg-[#0B0F1A] border border-[#23334E] rounded-2xl text-center min-w-[130px]">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Sent Amount</span>
                      <span className="text-xl font-mono font-black text-[#10B981]">
                        ৳{dep.amount?.toLocaleString()}
                      </span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                      {isPending ? (
                        <>
                          {/* Approve as Cash */}
                          <button
                            onClick={() => handleApproveDeposit(dep, "CASH", customCashVal)}
                            className="px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center space-x-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>
                              {customCashVal !== undefined
                                ? `Add ৳${customCashVal.toLocaleString()} Cash`
                                : `Approve ৳${dep.amount.toLocaleString()} Cash`}
                            </span>
                          </button>

                          {/* Approve as Coins */}
                          <button
                            onClick={() => handleApproveDeposit(dep, "COINS", customCoinVal)}
                            className="px-3.5 py-2.5 bg-gradient-to-r from-[#FFDE59] to-amber-500 hover:brightness-105 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center space-x-1"
                          >
                            <CoinIcon size="xs" />
                            <span>
                              {customCoinVal !== undefined
                                ? `+${customCoinVal.toLocaleString()} Coins`
                                : `+${(dep.amount * 10).toLocaleString()} Coins`}
                            </span>
                          </button>

                          {/* Reject */}
                          <button
                            onClick={() => handleRejectDeposit(dep.id)}
                            className="px-3 py-2 bg-red-950/40 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-xs rounded-xl transition"
                          >
                            ✕ Reject
                          </button>
                        </>
                      ) : (
                        <div className="text-xs text-gray-400 font-mono">
                          {dep.status === "COMPLETED" ? (
                            <span className="text-emerald-400 font-bold flex items-center space-x-1">
                              <Check className="w-4 h-4" />
                              <span>Approved & Credited</span>
                            </span>
                          ) : (
                            <span className="text-red-400 font-bold flex items-center space-x-1">
                              <X className="w-4 h-4" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Full-Screen Screenshot Lightbox Modal */}
      {selectedScreenshotDeposit && (
        <div
          onClick={() => setSelectedScreenshotDeposit(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-150 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-[#111827] border-2 border-[#FFDE59] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col cursor-default"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="text-base font-black text-[#FFDE59]">
                  পেমেন্ট স্ক্রিনশট যাচাই: {selectedScreenshotDeposit.userName} ({selectedScreenshotDeposit.method})
                </h4>
                <p className="text-xs text-gray-400 font-mono">
                  Amount: ৳{selectedScreenshotDeposit.amount?.toLocaleString()} | TrxID: {selectedScreenshotDeposit.txId}
                </p>
              </div>
              <button
                onClick={() => setSelectedScreenshotDeposit(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview Container */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-black/50 rounded-2xl p-2 border border-white/5 min-h-[300px]">
              {selectedScreenshotDeposit.screenshot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedScreenshotDeposit.screenshot}
                  alt="Full Payment Proof"
                  className="max-h-[60vh] w-auto object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <div className="text-gray-500 text-xs">No screenshot available</div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleCopy(selectedScreenshotDeposit.txId, "Transaction ID")}
                  className="px-3 py-1.5 bg-[#151F32] hover:bg-[#1E2C47] text-white text-xs font-mono font-bold rounded-xl border border-white/10 flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5 text-[#FFDE59]" />
                  <span>Copy TrxID ({selectedScreenshotDeposit.txId})</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedScreenshotDeposit.userPhone, "Phone Number")}
                  className="px-3 py-1.5 bg-[#151F32] hover:bg-[#1E2C47] text-white text-xs font-mono font-bold rounded-xl border border-white/10 flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Copy Phone</span>
                </button>
              </div>

              {selectedScreenshotDeposit.status === "PENDING" && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApproveDeposit(selectedScreenshotDeposit, "CASH")}
                    className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-black font-black text-xs uppercase rounded-xl shadow"
                  >
                    ✓ Approve Cash (+৳{selectedScreenshotDeposit.amount?.toLocaleString()})
                  </button>
                  <button
                    onClick={() => handleApproveDeposit(selectedScreenshotDeposit, "COINS")}
                    className="px-3 py-2 bg-[#FFDE59] hover:bg-yellow-400 text-black font-black text-xs uppercase rounded-xl shadow"
                  >
                    🪙 Approve Coins
                  </button>
                  <button
                    onClick={() => handleRejectDeposit(selectedScreenshotDeposit.id)}
                    className="px-3 py-2 bg-red-950 hover:bg-red-900 text-red-300 font-bold text-xs rounded-xl border border-red-500/40"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB: PLAYERS & USERS LEDGER ==================== */}
      {activeTab === "PLAYERS" && (
        <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#23334E]/60 pb-3">
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wide">
                User Accounts & Balance Management
              </h3>
              <p className="text-xs text-gray-400">
                Newly registered users show up here immediately with phone, cash, and coin balances
              </p>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="নাম বা ফোন নাম্বার দিয়ে খুঁজুন..."
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                className="bg-[#0B0F1A] border border-[#23334E] focus:border-[#FFDE59] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 outline-none w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-gray-400 uppercase bg-[#0B0F1A] border-b border-[#23334E]">
                <tr>
                  <th className="py-3 px-4">Player / Name</th>
                  <th className="py-3 px-4">bKash / WhatsApp Phone</th>
                  <th className="py-3 px-4">Cash Balance</th>
                  <th className="py-3 px-4">Coins Balance</th>
                  <th className="py-3 px-4">Coupon</th>
                  <th className="py-3 px-4 text-center">Add Cash (৳)</th>
                  <th className="py-3 px-4 text-center">Add Coins (🪙)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23334E]/40">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#151F32]/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{u.id}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#FFDE59]">
                      <div className="flex items-center space-x-1.5">
                        <span>{u.phone || "No Phone"}</span>
                        {u.phone && (
                          <button
                            onClick={() => handleCopy(u.phone, "Phone Number")}
                            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition"
                            title="Copy Phone"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#10B981] text-sm">
                      ৳{(u.balance ?? 2000).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                      🪙 {(u.coins ?? 1500).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {u.couponCode ? (
                        <span className="px-2 py-0.5 bg-purple-900/40 text-purple-300 border border-purple-500/30 rounded text-[10px] font-mono font-bold">
                          {u.couponCode}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleAdjustBalance(u.id, 1000)}
                          className="px-2 py-1 bg-[#10B981]/20 hover:bg-[#10B981] text-[#10B981] hover:text-black font-bold rounded-lg border border-[#10B981]/40 text-[10px]"
                        >
                          +1k
                        </button>
                        <button
                          onClick={() => handleAdjustBalance(u.id, 5000)}
                          className="px-2 py-1 bg-[#10B981]/20 hover:bg-[#10B981] text-[#10B981] hover:text-black font-bold rounded-lg border border-[#10B981]/40 text-[10px]"
                        >
                          +5k
                        </button>
                        <button
                          onClick={() => handleAdjustBalance(u.id, -1000)}
                          className="px-1.5 py-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-bold rounded-lg border border-red-500/40 text-[10px]"
                        >
                          -1k
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleAdjustCoins(u.id, 5000)}
                          className="px-2 py-1 bg-[#FFDE59]/20 hover:bg-[#FFDE59] text-[#FFDE59] hover:text-black font-bold rounded-lg border border-[#FFDE59]/40 text-[10px]"
                        >
                          +5k Coins
                        </button>
                        <button
                          onClick={() => handleAdjustCoins(u.id, 20000)}
                          className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white font-bold rounded-lg border border-purple-500/40 text-[10px]"
                        >
                          +20k Coins
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

      {/* ==================== TAB: GAME RIG & ALGORITHM CONTROLLER ==================== */}
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

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-bold">House Edge Rig</span>
                  <span className="text-red-400 font-mono font-black">{settings.globalHouseEdgePercent}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={settings.globalHouseEdgePercent}
                  onChange={(e) =>
                    updateSettings({ globalHouseEdgePercent: Number(e.target.value) })
                  }
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-bold">Early Crash Probability (&lt; 1.20x)</span>
                  <span className="text-red-400 font-mono font-black">{settings.aviatorHouseCrashUnder120Chance}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={settings.aviatorHouseCrashUnder120Chance}
                  onChange={(e) =>
                    updateSettings({ aviatorHouseCrashUnder120Chance: Number(e.target.value) })
                  }
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 2. ROULETTE 3D CONTROLLER */}
            <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#23334E]/60 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  <h3 className="text-base font-black text-white uppercase tracking-wide">
                    European Roulette Rig
                  </h3>
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-950/40 px-2 py-0.5 rounded border border-green-500/30">
                  Physics Deviation
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-bold">Green Zero (0) Land Chance</span>
                  <span className="text-green-400 font-mono font-black">{settings.rouletteZeroFrequencyBoost}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={settings.rouletteZeroFrequencyBoost}
                  onChange={(e) =>
                    updateSettings({ rouletteZeroFrequencyBoost: Number(e.target.value) })
                  }
                  className="w-full accent-green-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB: WORLDWIDE CONTROLLER ==================== */}
      {activeTab === "WORLDWIDE" && (
        <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-6 shadow-xl">
          <div className="border-b border-[#23334E]/60 pb-4">
            <h3 className="text-base font-black text-white uppercase tracking-wide">
              Global Platform Turnover & Online Multiplier
            </h3>
            <p className="text-xs text-gray-400">Control visual public tickers displayed across leaderboards</p>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300 font-bold">Active Online Player Count Ticker</span>
              <span className="text-[#FF65A5] font-mono font-black">
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

      {/* ==================== TAB: SPORTSBOOK MATCH EDITOR ==================== */}
      {activeTab === "SPORTS" && (
        <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-4 shadow-xl">
          <div className="border-b border-[#23334E]/60 pb-3">
            <h3 className="text-base font-black text-white uppercase tracking-wide">
              Live Cricket & Football Match Score Control
            </h3>
            <p className="text-xs text-gray-400">Click any match to update live scores, ball-by-ball summary & minutes</p>
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
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.status === "LIVE" ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-white">
                  <span>{m.homeTeam} ({m.homeScore})</span>
                  <span className="text-xs text-gray-500">VS</span>
                  <span>{m.awayTeam} ({m.awayScore})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB: TRANSACTIONS LEDGER ==================== */}
      {activeTab === "TRANSACTIONS" && (
        <div className="p-6 bg-[#111827] border border-[#23334E] rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-base font-black text-white uppercase tracking-wide">
            Recent System Transactions
          </h3>
          <div className="space-y-2">
            {(metrics?.recentTransactions || []).map((t: any) => (
              <div
                key={t.id}
                className="p-3 bg-[#151F32] border border-[#23334E] rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white">{t.type} via {t.method}</span>
                  <span className="text-gray-400 ml-2 font-mono">{t.txId ? `TxID: ${t.txId}` : ""}</span>
                </div>
                <div className="font-mono font-bold text-[#10B981]">
                  ৳{t.amount?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
