"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Radio,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Trophy,
  Activity,
  CheckCircle2,
  XCircle,
  Zap,
  Info,
  ChevronRight,
  RefreshCw,
  Flame,
  BarChart3,
  Sliders,
  DollarSign,
  Maximize2,
} from "lucide-react";
import sound from "@/lib/sound";
import { useUserStore } from "@/lib/store/useUserStore";

export interface FlashscoreMatch {
  id: string;
  sport: "CRICKET" | "FOOTBALL" | "TENNIS" | "BASKETBALL" | "KABADDI";
  leagueFlag: string;
  leagueCountry: string;
  leagueName: string;
  status: "LIVE" | "UPCOMING" | "FINISHED";
  timeLabel: string;
  isPinned?: boolean;
  team1: {
    name: string;
    flag: string;
    score: string;
    oversOrSub?: string;
  };
  team2: {
    name: string;
    flag: string;
    score: string;
    oversOrSub?: string;
  };
  odds1: number;
  oddsX?: number;
  odds2: number;
  oddsTrend1?: "UP" | "DOWN";
  oddsTrend2?: "UP" | "DOWN";
  // Probabilities for the vertical meter
  probTeam1: number; // e.g. 67%
  probDraw?: number; // e.g. 8%
  probTeam2: number; // e.g. 25%
  probTrendTeam1: number; // +3.2%
  probTrendTeam2: number; // -3.2%
  situationText: string;
  currentOverOrMinute?: string[];
  battersOrScorers?: string[];
  venue?: string;
}

export interface TradePosition {
  id: string;
  matchId: string;
  matchTitle: string;
  outcomeName: string;
  type: "BUY_LONG" | "SELL_SHORT";
  stake: number;
  entryPrice: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPnL: number;
  pnlPercentage: number;
  createdAt: string;
}

const INITIAL_MATCHES: FlashscoreMatch[] = [
  {
    id: "fs-cri-1",
    sport: "CRICKET",
    leagueFlag: "🇧🇩",
    leagueCountry: "INTERNATIONAL",
    leagueName: "BANGLADESH TOUR OF WEST INDIES 2026 • 2ND ODI",
    status: "LIVE",
    timeLabel: "37.4 ov",
    isPinned: true,
    team1: {
      name: "Bangladesh",
      flag: "🇧🇩",
      score: "226/4",
      oversOrSub: "Target: 273 (Req. 47 off 74)",
    },
    team2: {
      name: "West Indies",
      flag: "🌴",
      score: "272",
      oversOrSub: "50.0 ov (All Out)",
    },
    odds1: 1.54,
    oddsTrend1: "DOWN",
    odds2: 2.42,
    oddsTrend2: "UP",
    probTeam1: 68,
    probDraw: 4,
    probTeam2: 28,
    probTrendTeam1: 3.8,
    probTrendTeam2: -3.8,
    situationText: "BAN needs 47 runs in 74 balls • Required Run Rate: 3.81 • 6 wickets in hand",
    currentOverOrMinute: ["1", "4", "0", "6", "1", "2"],
    battersOrScorers: ["Shakib Al Hasan: 74* (60b)", "Litton Das: 52* (46b)"],
    venue: "Providence Stadium, Guyana",
  },
  {
    id: "fs-soc-1",
    sport: "FOOTBALL",
    leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    leagueCountry: "ENGLAND",
    leagueName: "PREMIER LEAGUE • MATCHDAY 28",
    status: "LIVE",
    timeLabel: "84'",
    isPinned: true,
    team1: {
      name: "Arsenal",
      flag: "🔴",
      score: "2",
      oversOrSub: "Saka 34', Havertz 68'",
    },
    team2: {
      name: "Chelsea",
      flag: "🔵",
      score: "1",
      oversOrSub: "Palmer 51'",
    },
    odds1: 1.25,
    oddsTrend1: "DOWN",
    oddsX: 5.5,
    odds2: 12.0,
    oddsTrend2: "UP",
    probTeam1: 82,
    probDraw: 13,
    probTeam2: 5,
    probTrendTeam1: 4.5,
    probTrendTeam2: -4.5,
    situationText: "84' • Arsenal controlling possession (64%) • Corner to Chelsea",
    currentOverOrMinute: ["Goal", "Corner", "Sub", "Foul", "Shot"],
    battersOrScorers: ["Shots on Target: Arsenal 7 - 3 Chelsea", "xG: Arsenal 2.14 - 0.88 Chelsea"],
    venue: "Emirates Stadium, London",
  },
  {
    id: "fs-cri-2",
    sport: "CRICKET",
    leagueFlag: "🇧🇩",
    leagueCountry: "BANGLADESH",
    leagueName: "BPL TWENTY20 • QUALIFIER 1",
    status: "LIVE",
    timeLabel: "18.2 ov",
    team1: {
      name: "Fortune Barishal",
      flag: "🐅",
      score: "186/5",
      oversOrSub: "18.2 ov",
    },
    team2: {
      name: "Comilla Victorians",
      flag: "🦁",
      score: "Yet to Bat",
      oversOrSub: "Target: 187 proj.",
    },
    odds1: 1.68,
    oddsTrend1: "UP",
    odds2: 2.15,
    oddsTrend2: "DOWN",
    probTeam1: 58,
    probDraw: 2,
    probTeam2: 40,
    probTrendTeam1: 1.5,
    probTrendTeam2: -1.5,
    situationText: "Tamim Iqbal 84* (52) • Big hitting in death overs",
    currentOverOrMinute: ["6", "1", "4", "W", "2"],
    battersOrScorers: ["Tamim Iqbal: 84* (52b)", "Mushfiqur Rahim: 28 (16b)"],
    venue: "Sher-e-Bangla National Cricket Stadium, Mirpur",
  },
  {
    id: "fs-soc-2",
    sport: "FOOTBALL",
    leagueFlag: "🇪🇸",
    leagueCountry: "SPAIN",
    leagueName: "LA LIGA • EL CLASICO",
    status: "LIVE",
    timeLabel: "72'",
    team1: {
      name: "Real Madrid",
      flag: "⚪",
      score: "1",
      oversOrSub: "Vinicius Jr 28'",
    },
    team2: {
      name: "Barcelona",
      flag: "🔵🔴",
      score: "1",
      oversOrSub: "Yamal 58'",
    },
    odds1: 2.2,
    oddsX: 2.8,
    odds2: 3.4,
    probTeam1: 44,
    probDraw: 36,
    probTeam2: 20,
    probTrendTeam1: 2.0,
    probTrendTeam2: -2.0,
    situationText: "72' • Real Madrid pressing • Bellingham shot saved by Ter Stegen",
    battersOrScorers: ["Possession: Real Madrid 48% - 52% Barcelona", "Yellow Cards: 2 - 3"],
    venue: "Santiago Bernabéu, Madrid",
  },
  {
    id: "fs-ten-1",
    sport: "TENNIS",
    leagueFlag: "🇦🇺",
    leagueCountry: "ATP",
    leagueName: "AUSTRALIAN OPEN • MEN'S FINAL",
    status: "LIVE",
    timeLabel: "Set 3 (1-1)",
    team1: {
      name: "Novak Djokovic",
      flag: "🇷🇸",
      score: "6 4 4",
      oversOrSub: "Games: 4 - 3 (30-15)",
    },
    team2: {
      name: "Carlos Alcaraz",
      flag: "🇪🇸",
      score: "4 6 3",
      oversOrSub: "Serving",
    },
    odds1: 1.82,
    odds2: 1.98,
    probTeam1: 54,
    probTeam2: 46,
    probTrendTeam1: 2.5,
    probTrendTeam2: -2.5,
    situationText: "Djokovic holds break point in 8th game of Set 3",
    venue: "Rod Laver Arena, Melbourne",
  },
  {
    id: "fs-bas-1",
    sport: "BASKETBALL",
    leagueFlag: "🇺🇸",
    leagueCountry: "NBA",
    leagueName: "NBA REGULAR SEASON",
    status: "LIVE",
    timeLabel: "Q4 03:22",
    team1: {
      name: "Los Angeles Lakers",
      flag: "🟡",
      score: "108",
      oversOrSub: "LeBron 28pts 8reb",
    },
    team2: {
      name: "Golden State Warriors",
      flag: "🔵",
      score: "104",
      oversOrSub: "Curry 32pts 7ast",
    },
    odds1: 1.45,
    odds2: 2.75,
    probTeam1: 72,
    probTeam2: 28,
    probTrendTeam1: 5.2,
    probTrendTeam2: -5.2,
    situationText: "Lakers lead by 4 with 3:22 remaining in 4th Quarter",
    venue: "Crypto.com Arena, Los Angeles",
  },
  {
    id: "fs-kab-1",
    sport: "KABADDI",
    leagueFlag: "🇮🇳",
    leagueCountry: "INDIA",
    leagueName: "PRO KABADDI LEAGUE 2026",
    status: "LIVE",
    timeLabel: "2nd Half 34'",
    team1: {
      name: "Bengal Warriors",
      flag: "🐅",
      score: "32",
      oversOrSub: "All-Out Inflicted: 1",
    },
    team2: {
      name: "Patna Pirates",
      flag: "🏴‍☠️",
      score: "29",
      oversOrSub: "Super Raids: 2",
    },
    odds1: 1.62,
    odds2: 2.25,
    probTeam1: 62,
    probTeam2: 38,
    probTrendTeam1: 3.0,
    probTrendTeam2: -3.0,
    situationText: "Maninder Singh raid successful with 2 touch points",
    venue: "Netaji Indoor Stadium, Kolkata",
  },
  {
    id: "fs-cri-up1",
    sport: "CRICKET",
    leagueFlag: "🌐",
    leagueCountry: "ICC",
    leagueName: "ICC CHAMPIONS TROPHY 2026 • GROUP A",
    status: "UPCOMING",
    timeLabel: "Tomorrow 14:30",
    team1: {
      name: "India",
      flag: "🇮🇳",
      score: "-",
      oversOrSub: "Squad Confirmed",
    },
    team2: {
      name: "Pakistan",
      flag: "🇵🇰",
      score: "-",
      oversOrSub: "Squad Confirmed",
    },
    odds1: 1.58,
    odds2: 2.38,
    probTeam1: 64,
    probDraw: 2,
    probTeam2: 34,
    probTrendTeam1: 0,
    probTrendTeam2: 0,
    situationText: "Pitch Report: Batting friendly pitch with slight turn under lights",
    venue: "Dubai International Cricket Stadium",
  },
];

export default function FlashscoreSportsView() {
  const { user, updateBalance, showNotification, openAuthModal } = useUserStore();

  const [matches, setMatches] = useState<FlashscoreMatch[]>(INITIAL_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<FlashscoreMatch>(INITIAL_MATCHES[0]);
  const [activeSportFilter, setActiveSportFilter] = useState<string>("ALL");
  const [activeStatusFilter, setActiveStatusFilter] = useState<"ALL" | "LIVE" | "UPCOMING" | "FINISHED">("LIVE");

  // Trading States
  const [tradeOutcome, setTradeOutcome] = useState<"TEAM1" | "DRAW" | "TEAM2">("TEAM1");
  const [tradeDirection, setTradeDirection] = useState<"BUY_LONG" | "SELL_SHORT">("BUY_LONG");
  const [tradeStake, setTradeStake] = useState<number>(500);
  const [tradePositions, setTradePositions] = useState<TradePosition[]>([
    {
      id: "pos-1",
      matchId: "fs-cri-1",
      matchTitle: "Bangladesh vs West Indies",
      outcomeName: "Bangladesh (Win)",
      type: "BUY_LONG",
      stake: 1000,
      entryPrice: 1.62,
      currentPrice: 1.54,
      currentValue: 1220,
      unrealizedPnL: 220,
      pnlPercentage: 22.0,
      createdAt: "10 mins ago",
    },
  ]);

  // Real-time ticking simulation for scores & probability
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prev) =>
        prev.map((m) => {
          if (m.status !== "LIVE") return m;
          // Random slight shift in probabilities and scores
          const shift = (Math.random() - 0.48) * 1.5;
          const newProb1 = Math.min(95, Math.max(5, Math.round(m.probTeam1 + shift)));
          const newProb2 = Math.min(95, Math.max(5, 100 - newProb1 - (m.probDraw || 0)));

          // Recalculate odds inversely
          const newOdds1 = Math.round((100 / newProb1) * 100) / 100;
          const newOdds2 = Math.round((100 / newProb2) * 100) / 100;

          return {
            ...m,
            probTeam1: newProb1,
            probTeam2: newProb2,
            odds1: newOdds1,
            odds2: newOdds2,
            probTrendTeam1: Math.round(shift * 10) / 10,
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Sync selected match with live ticks
  useEffect(() => {
    const updated = matches.find((m) => m.id === selectedMatch.id);
    if (updated) {
      setSelectedMatch(updated);
    }
  }, [matches, selectedMatch.id]);

  // Dynamic values based on selected trading side
  const currentSelectedPrice =
    tradeOutcome === "TEAM1"
      ? selectedMatch.odds1
      : tradeOutcome === "TEAM2"
      ? selectedMatch.odds2
      : selectedMatch.oddsX || 3.5;

  const currentOutcomeName =
    tradeOutcome === "TEAM1"
      ? `${selectedMatch.team1.name} (Win)`
      : tradeOutcome === "TEAM2"
      ? `${selectedMatch.team2.name} (Win)`
      : "Draw / Tie";

  const potentialGrossReturn =
    tradeDirection === "BUY_LONG"
      ? Math.round(tradeStake * currentSelectedPrice)
      : Math.round(tradeStake * (currentSelectedPrice * 0.85));

  const potentialProfit = potentialGrossReturn - tradeStake;
  const impliedProb = Math.round((1 / currentSelectedPrice) * 100);

  // Submit Trade
  const handleExecuteTrade = () => {
    sound.playChipClick();
    if (!user) {
      openAuthModal("LOGIN");
      return;
    }

    if (user.balance < tradeStake) {
      showNotification("Insufficient balance in your wallet. Please Deposit.", "ERROR");
      return;
    }

    updateBalance(-tradeStake);
    sound.playBetPlaced();

    const newPosition: TradePosition = {
      id: `trade-${Date.now()}`,
      matchId: selectedMatch.id,
      matchTitle: `${selectedMatch.team1.name} vs ${selectedMatch.team2.name}`,
      outcomeName: currentOutcomeName,
      type: tradeDirection,
      stake: tradeStake,
      entryPrice: currentSelectedPrice,
      currentPrice: currentSelectedPrice,
      currentValue: tradeStake,
      unrealizedPnL: 0,
      pnlPercentage: 0,
      createdAt: "Just now",
    };

    setTradePositions((prev) => [newPosition, ...prev]);
    showNotification(
      `Trade Executed! ${tradeDirection === "BUY_LONG" ? "BOUGHT" : "SOLD"} ৳${tradeStake.toLocaleString()} of ${currentOutcomeName} @ ${currentSelectedPrice.toFixed(2)}`,
      "SUCCESS"
    );
  };

  // Instant Cashout / Close Trade
  const handleCashoutPosition = (posId: string) => {
    sound.playChipClick();
    const pos = tradePositions.find((p) => p.id === posId);
    if (!pos) return;

    // Calculate payout
    const cashoutPayout = Math.max(10, pos.currentValue);
    updateBalance(cashoutPayout);
    sound.playWin();

    setTradePositions((prev) => prev.filter((p) => p.id !== posId));
    showNotification(
      `Closed Position! Payout of ৳${cashoutPayout.toLocaleString()} credited to your wallet (P&L: ৳${pos.unrealizedPnL >= 0 ? "+" : ""}${pos.unrealizedPnL.toLocaleString()})`,
      "SUCCESS"
    );
  };

  const filteredMatches = matches.filter((m) => {
    if (activeSportFilter !== "ALL" && m.sport !== activeSportFilter) return false;
    if (activeStatusFilter !== "ALL" && m.status !== activeStatusFilter) return false;
    return true;
  });

  return (
    <div className="w-full bg-[#0B0F15] text-gray-200 min-h-screen pb-16 font-sans select-none">
      {/* ========================================================
          1. FLASHSCORE TOP BRANDING & SPORT NAV BAR
          ======================================================== */}
      <div className="w-full bg-[#111722] border-b border-[#1A2536] sticky top-28 z-30 shadow-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Flashscore Row */}
          <div className="h-14 flex items-center justify-between border-b border-[#1A2434] overflow-x-auto scrollbar-none">
            {/* Logo Badge */}
            <div className="flex items-center space-x-3 shrink-0 mr-4">
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-red-600 text-white font-black text-sm tracking-wider uppercase shadow-md shadow-red-600/30">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>FLASHSCORE</span>
                <span className="text-[10px] bg-black/40 px-1 py-0.2 rounded font-mono">LIVE</span>
              </div>
              <span className="text-xs text-gray-400 hidden md:inline font-semibold">
                Real-Time All Sports & Probabilities
              </span>
            </div>

            {/* Sports Tabs (Flashscore.in style) */}
            <div className="flex items-center space-x-2">
              {[
                { id: "ALL", label: "All Sports", icon: "🔥", count: 142 },
                { id: "CRICKET", label: "Cricket", icon: "🏏", count: 18 },
                { id: "FOOTBALL", label: "Football", icon: "⚽", count: 48 },
                { id: "TENNIS", label: "Tennis", icon: "🎾", count: 14 },
                { id: "BASKETBALL", label: "Basketball", icon: "🏀", count: 10 },
                { id: "KABADDI", label: "Kabaddi", icon: "🤼", count: 6 },
              ].map((s) => {
                const isActive = activeSportFilter === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      sound.playChipClick();
                      setActiveSportFilter(s.id);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      isActive
                        ? "bg-[#95D600] text-black font-black shadow-[0_0_12px_rgba(149,214,0,0.35)]"
                        : "text-gray-300 hover:text-white hover:bg-[#1A2332]"
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? "bg-black/25 text-black font-black" : "bg-white/5 text-gray-400"
                      }`}
                    >
                      {s.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Status Count */}
            <div className="hidden lg:flex items-center space-x-3 text-xs text-gray-400 font-mono shrink-0 ml-4">
              <span className="flex items-center space-x-1 text-red-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>28 Matches Live</span>
              </span>
            </div>
          </div>

          {/* Sub-Filters Row (LIVE / ALL / SCHEDULED / FINISHED) */}
          <div className="py-2.5 flex items-center justify-between overflow-x-auto scrollbar-none text-xs">
            <div className="flex items-center space-x-2">
              {(["LIVE", "ALL", "UPCOMING", "FINISHED"] as const).map((filter) => {
                const isActive = activeStatusFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => {
                      sound.playChipClick();
                      setActiveStatusFilter(filter);
                    }}
                    className={`px-3 py-1 rounded-lg font-black uppercase tracking-wider text-[11px] transition ${
                      isActive
                        ? "bg-white text-black"
                        : "bg-[#161F2C] text-gray-400 hover:text-white hover:bg-[#1E2B3D]"
                    }`}
                  >
                    {filter === "LIVE" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />}
                    {filter}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-3 text-gray-400 text-[11px] font-bold">
              <span>Today, {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              <span className="text-[#95D600] flex items-center space-x-1">
                <RefreshCw className="w-3 h-3 animate-spin text-[#95D600]" />
                <span>Live Feed Active</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 space-y-6">
        {/* ========================================================
            2. FEATURED LIVE MATCH SHOWCASE + VERTICAL PROBABILITY BAR
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Selected Match Live HUD (8 Cols) */}
          <div className="lg:col-span-7 bg-[#121824] border border-[#1E2838] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs pb-3 border-b border-white/5">
                <div className="flex items-center space-x-2 text-gray-400 font-bold">
                  <span>{selectedMatch.leagueFlag}</span>
                  <span className="text-white font-extrabold">{selectedMatch.leagueName}</span>
                </div>
                <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-[11px] font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>{selectedMatch.timeLabel}</span>
                </div>
              </div>

              {/* Head to Head Teams & Live Scores */}
              <div className="grid grid-cols-2 gap-4 py-5 items-center">
                {/* Team 1 */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{selectedMatch.team1.flag}</span>
                    <h3 className="text-base sm:text-xl font-black text-white truncate">
                      {selectedMatch.team1.name}
                    </h3>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-[#95D600]">
                    {selectedMatch.team1.score}
                  </div>
                  {selectedMatch.team1.oversOrSub && (
                    <div className="text-xs text-gray-400 font-mono font-bold">
                      {selectedMatch.team1.oversOrSub}
                    </div>
                  )}
                </div>

                {/* Team 2 */}
                <div className="space-y-1 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <h3 className="text-base sm:text-xl font-black text-white truncate">
                      {selectedMatch.team2.name}
                    </h3>
                    <span className="text-2xl">{selectedMatch.team2.flag}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-gray-200">
                    {selectedMatch.team2.score}
                  </div>
                  {selectedMatch.team2.oversOrSub && (
                    <div className="text-xs text-gray-400 font-mono font-bold">
                      {selectedMatch.team2.oversOrSub}
                    </div>
                  )}
                </div>
              </div>

              {/* Match Situation Ticker */}
              <div className="p-3 rounded-2xl bg-[#0B0F16] border border-[#1B2433] flex items-center justify-between text-xs font-semibold text-gray-300">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{selectedMatch.situationText}</span>
                </div>
                {selectedMatch.currentOverOrMinute && (
                  <div className="flex items-center space-x-1 shrink-0 ml-2">
                    {selectedMatch.currentOverOrMinute.map((ball, idx) => (
                      <span
                        key={idx}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-black ${
                          ball === "W"
                            ? "bg-red-600 text-white"
                            : ball === "6"
                            ? "bg-purple-600 text-white"
                            : ball === "4"
                            ? "bg-blue-600 text-white"
                            : "bg-[#182332] text-gray-300"
                        }`}
                      >
                        {ball}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================
                VERTICAL PROBABILITY BARS (UNDER THE LATEST SPORT)
                ======================================================== */}
            <div className="pt-4 border-t border-[#1C2636] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-[#95D600]" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Live Win Probability Meter (AI Engine)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-400">
                  Momentum Trend: <span className="text-[#95D600] font-bold">▲ +{selectedMatch.probTrendTeam1}% (Last 5m)</span>
                </span>
              </div>

              {/* The Vertical Probability Gauge Towers */}
              <div className="bg-[#0A0E15] border border-[#18212E] rounded-2xl p-4 flex items-end justify-around h-52 relative overflow-hidden">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-15 pointer-events-none">
                  <div className="border-b border-dashed border-gray-500 w-full text-[9px] font-mono text-right text-gray-400">100%</div>
                  <div className="border-b border-dashed border-gray-500 w-full text-[9px] font-mono text-right text-gray-400">75%</div>
                  <div className="border-b border-dashed border-gray-500 w-full text-[9px] font-mono text-right text-gray-400">50%</div>
                  <div className="border-b border-dashed border-gray-500 w-full text-[9px] font-mono text-right text-gray-400">25%</div>
                  <div className="border-b border-gray-500 w-full text-[9px] font-mono text-right text-gray-400">0%</div>
                </div>

                {/* Team 1 Probability Column */}
                <div className="flex flex-col items-center space-y-2 z-10 w-24">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono font-black text-[#95D600] animate-bounce">
                      {selectedMatch.probTeam1}%
                    </span>
                    <span className="text-[9px] text-[#95D600] flex items-center font-bold">
                      <ArrowUpRight className="w-3 h-3" /> +{selectedMatch.probTrendTeam1}%
                    </span>
                  </div>

                  {/* Vertical Bar 1 */}
                  <div className="w-12 sm:w-16 bg-[#16202C] rounded-xl overflow-hidden h-32 flex flex-col justify-end p-1 border border-[#213042]">
                    <div
                      style={{ height: `${selectedMatch.probTeam1}%` }}
                      className="w-full bg-gradient-to-t from-[#6E9E00] to-[#95D600] rounded-lg shadow-[0_0_15px_rgba(149,214,0,0.5)] transition-all duration-700"
                    />
                  </div>

                  <span className="text-[11px] font-black text-white truncate max-w-[90px] text-center">
                    {selectedMatch.team1.name}
                  </span>
                </div>

                {/* Draw / Tie Column (if applicable) */}
                {selectedMatch.probDraw !== undefined && (
                  <div className="flex flex-col items-center space-y-2 z-10 w-20">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-mono font-black text-amber-400">
                        {selectedMatch.probDraw}%
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold">Tie</span>
                    </div>

                    {/* Vertical Bar Draw */}
                    <div className="w-10 sm:w-12 bg-[#16202C] rounded-xl overflow-hidden h-32 flex flex-col justify-end p-1 border border-[#213042]">
                      <div
                        style={{ height: `${selectedMatch.probDraw * 2}%` }}
                        className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-lg shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all duration-700"
                      />
                    </div>

                    <span className="text-[11px] font-bold text-gray-400">Draw</span>
                  </div>
                )}

                {/* Team 2 Probability Column */}
                <div className="flex flex-col items-center space-y-2 z-10 w-24">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono font-black text-rose-400">
                      {selectedMatch.probTeam2}%
                    </span>
                    <span className="text-[9px] text-rose-400 flex items-center font-bold">
                      <ArrowDownRight className="w-3 h-3" /> {selectedMatch.probTrendTeam2}%
                    </span>
                  </div>

                  {/* Vertical Bar 2 */}
                  <div className="w-12 sm:w-16 bg-[#16202C] rounded-xl overflow-hidden h-32 flex flex-col justify-end p-1 border border-[#213042]">
                    <div
                      style={{ height: `${selectedMatch.probTeam2}%` }}
                      className="w-full bg-gradient-to-t from-red-700 to-rose-500 rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all duration-700"
                    />
                  </div>

                  <span className="text-[11px] font-black text-white truncate max-w-[90px] text-center">
                    {selectedMatch.team2.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              3. SIMPLE TRADING-LIKE BETTING SYSTEM (5 Cols)
              ======================================================== */}
          <div className="lg:col-span-5 bg-[#121824] border border-[#1E2838] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-4">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#95D600]" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Quick Exchange & Sports Trading
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-[#1E2838] px-2 py-0.5 rounded text-gray-300">
                  Instant P&L Settlement
                </span>
              </div>

              {/* Asset Selector (Which outcome to trade) */}
              <div className="pt-3 space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Select Contract / Outcome:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      sound.playChipClick();
                      setTradeOutcome("TEAM1");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      tradeOutcome === "TEAM1"
                        ? "border-[#95D600] bg-[#17231B] text-white"
                        : "border-[#1D2736] bg-[#0E131C] text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="text-[11px] font-bold truncate">{selectedMatch.team1.name}</span>
                    <span className="text-sm font-mono font-black text-[#95D600]">
                      ৳{selectedMatch.odds1.toFixed(2)}
                    </span>
                  </button>

                  {selectedMatch.oddsX && (
                    <button
                      onClick={() => {
                        sound.playChipClick();
                        setTradeOutcome("DRAW");
                      }}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        tradeOutcome === "DRAW"
                          ? "border-amber-400 bg-[#241E14] text-white"
                          : "border-[#1D2736] bg-[#0E131C] text-gray-400 hover:text-white"
                      }`}
                    >
                      <span className="text-[11px] font-bold">Draw</span>
                      <span className="text-sm font-mono font-black text-amber-400">
                        ৳{selectedMatch.oddsX.toFixed(2)}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      sound.playChipClick();
                      setTradeOutcome("TEAM2");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      tradeOutcome === "TEAM2"
                        ? "border-rose-500 bg-[#251419] text-white"
                        : "border-[#1D2736] bg-[#0E131C] text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="text-[11px] font-bold truncate">{selectedMatch.team2.name}</span>
                    <span className="text-sm font-mono font-black text-rose-400">
                      ৳{selectedMatch.odds2.toFixed(2)}
                    </span>
                  </button>
                </div>
              </div>

              {/* Trade Direction (BUY / LONG vs SELL / SHORT) */}
              <div className="pt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      sound.playChipClick();
                      setTradeDirection("BUY_LONG");
                    }}
                    className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center space-x-1.5 ${
                      tradeDirection === "BUY_LONG"
                        ? "bg-[#95D600] text-black shadow-[0_0_12px_rgba(149,214,0,0.35)]"
                        : "bg-[#141B26] text-gray-400 hover:text-white border border-[#1E2938]"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>BUY / LONG</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playChipClick();
                      setTradeDirection("SELL_SHORT");
                    }}
                    className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center space-x-1.5 ${
                      tradeDirection === "SELL_SHORT"
                        ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                        : "bg-[#141B26] text-gray-400 hover:text-white border border-[#1E2938]"
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>SELL / SHORT</span>
                  </button>
                </div>
              </div>

              {/* Stake Amount Selector */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-400">Trade Size (BDT ৳):</span>
                  <span className="font-mono text-gray-300">
                    Wallet: <span className="text-[#95D600] font-black">৳{user ? user.balance.toLocaleString() : "0"}</span>
                  </span>
                </div>

                <div className="flex items-center bg-[#0B0F16] border border-[#1E2938] rounded-xl px-3 py-2">
                  <span className="text-gray-400 font-mono font-black mr-2">৳</span>
                  <input
                    type="number"
                    value={tradeStake}
                    onChange={(e) => setTradeStake(Math.max(50, Number(e.target.value)))}
                    className="w-full bg-transparent text-white font-mono font-black text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[200, 500, 1000, 2500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        sound.playChipClick();
                        setTradeStake(amt);
                      }}
                      className={`py-1 rounded-lg text-[10px] font-mono font-black transition ${
                        tradeStake === amt
                          ? "bg-[#95D600] text-black"
                          : "bg-[#161F2C] text-gray-400 hover:text-white hover:bg-[#1E2A3B]"
                      }`}
                    >
                      +৳{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trade Summary & Returns Calculator */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#090D14] border border-[#192330] space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Price / Odds:</span>
                  <span className="text-white font-bold">{currentSelectedPrice.toFixed(2)} ({impliedProb}% Implied)</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Est. Gross Return:</span>
                  <span className="text-white font-bold">৳{potentialGrossReturn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-white/5 font-bold">
                  <span className="text-gray-300">Est. Net Profit:</span>
                  <span className="text-[#95D600]">+৳{potentialProfit.toLocaleString()} (+{Math.round((potentialProfit / tradeStake) * 100)}%)</span>
                </div>
              </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecuteTrade}
              className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-lg ${
                tradeDirection === "BUY_LONG"
                  ? "bg-[#95D600] hover:bg-[#85c200] text-black shadow-[0_0_15px_rgba(149,214,0,0.4)]"
                  : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              }`}
            >
              ⚡ Confirm & Execute Trade (৳{tradeStake.toLocaleString()})
            </button>
          </div>
        </div>

        {/* ========================================================
            4. ACTIVE TRADING POSITIONS (Cashout & Live P&L)
            ======================================================== */}
        {tradePositions.length > 0 && (
          <div className="bg-[#121824] border border-[#1E2838] rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#95D600]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Your Active Open Positions ({tradePositions.length})
                </h3>
              </div>
              <span className="text-[11px] text-gray-400">
                Positions update tick-by-tick • Instant Cashout available
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1C2636] text-gray-400 text-[10px] uppercase">
                    <th className="pb-2">Market & Contract</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Stake</th>
                    <th className="pb-2">Entry Price</th>
                    <th className="pb-2">Current Value</th>
                    <th className="pb-2">Unrealized P&L</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2433]">
                  {tradePositions.map((pos) => (
                    <tr key={pos.id} className="hover:bg-[#151D2A] transition">
                      <td className="py-3">
                        <div className="font-sans font-bold text-white">{pos.matchTitle}</div>
                        <div className="text-[11px] text-gray-400">{pos.outcomeName}</div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            pos.type === "BUY_LONG"
                              ? "bg-[#95D600]/20 text-[#95D600] border border-[#95D600]/40"
                              : "bg-red-600/20 text-red-400 border border-red-600/40"
                          }`}
                        >
                          {pos.type === "BUY_LONG" ? "LONG" : "SHORT"}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-gray-300">৳{pos.stake.toLocaleString()}</td>
                      <td className="py-3 text-gray-400">{pos.entryPrice.toFixed(2)}</td>
                      <td className="py-3 font-black text-white">৳{pos.currentValue.toLocaleString()}</td>
                      <td className="py-3">
                        <span
                          className={`font-black ${
                            pos.unrealizedPnL >= 0 ? "text-[#95D600]" : "text-red-400"
                          }`}
                        >
                          {pos.unrealizedPnL >= 0 ? "+" : ""}৳{pos.unrealizedPnL.toLocaleString()} (+{pos.pnlPercentage}%)
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleCashoutPosition(pos.id)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-sans font-black text-[11px] transition shadow-md active:scale-95 border border-amber-500/40"
                        >
                          ⚡ Cashout (৳{pos.currentValue.toLocaleString()})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            5. FLASHSCORE.IN LIVE MATCH MATRIX & FIXTURES FEED
            ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-black text-white tracking-wide uppercase">
                Flashscore Live Match Center
              </h2>
            </div>
            <span className="text-xs text-gray-400">Click any match to load trading console</span>
          </div>

          <div className="bg-[#101622] border border-[#1B2534] rounded-3xl overflow-hidden shadow-2xl">
            {/* Table Headers */}
            <div className="bg-[#0C111A] px-4 py-2.5 border-b border-[#18212D] flex items-center justify-between text-[11px] font-bold text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="w-5 text-center">★</span>
                <span>Time / Status</span>
                <span>Match Details</span>
              </div>
              <div className="flex items-center space-x-12 pr-4">
                <span>Score</span>
                <span>Odds 1</span>
                <span>Draw (X)</span>
                <span>Odds 2</span>
                <span>Trade</span>
              </div>
            </div>

            {/* Matches List */}
            <div className="divide-y divide-[#17212E]">
              {filteredMatches.map((m) => {
                const isSelected = selectedMatch.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      sound.playChipClick();
                      setSelectedMatch(m);
                    }}
                    className={`px-4 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 cursor-pointer transition ${
                      isSelected
                        ? "bg-[#182332] border-l-4 border-l-[#95D600]"
                        : "hover:bg-[#131B27]"
                    }`}
                  >
                    {/* Left: Star, Status, and Teams */}
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playChipClick();
                        }}
                        className="text-gray-500 hover:text-amber-400 transition"
                      >
                        <Star className={`w-4 h-4 ${m.isPinned ? "text-amber-400 fill-amber-400" : ""}`} />
                      </button>

                      {/* Status / Time */}
                      <div className="w-20 shrink-0 font-mono text-xs">
                        {m.status === "LIVE" ? (
                          <div className="flex items-center space-x-1 text-red-500 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <span>{m.timeLabel}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-medium">{m.timeLabel}</span>
                        )}
                      </div>

                      {/* Teams & League */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-gray-400 font-semibold truncate flex items-center space-x-1">
                          <span>{m.leagueFlag}</span>
                          <span>{m.leagueName}</span>
                        </div>
                        <div className="text-xs sm:text-sm font-black text-white truncate flex items-center space-x-2 mt-0.5">
                          <span>{m.team1.flag} {m.team1.name}</span>
                          <span className="text-gray-500 font-normal">vs</span>
                          <span>{m.team2.flag} {m.team2.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Scores, Odds, and Trade Button */}
                    <div className="flex items-center space-x-3 sm:space-x-5 self-end md:self-auto shrink-0">
                      {/* Scores */}
                      <div className="text-right font-mono text-xs sm:text-sm font-black text-white w-24">
                        <div className="text-[#95D600]">{m.team1.score}</div>
                        <div className="text-gray-300">{m.team2.score}</div>
                      </div>

                      {/* Odds 1 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMatch(m);
                          setTradeOutcome("TEAM1");
                          sound.playChipClick();
                        }}
                        className="w-14 sm:w-16 py-1.5 rounded-lg bg-[#141C28] hover:bg-[#95D600] hover:text-black border border-[#212E40] text-gray-200 text-xs font-mono font-black transition flex items-center justify-center space-x-1"
                      >
                        <span>{m.odds1.toFixed(2)}</span>
                        {m.oddsTrend1 === "UP" ? (
                          <ArrowUpRight className="w-3 h-3 text-[#95D600]" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-red-400" />
                        )}
                      </button>

                      {/* Odds Draw */}
                      {m.oddsX ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMatch(m);
                            setTradeOutcome("DRAW");
                            sound.playChipClick();
                          }}
                          className="w-12 sm:w-14 py-1.5 rounded-lg bg-[#141C28] hover:bg-amber-400 hover:text-black border border-[#212E40] text-gray-300 text-xs font-mono font-bold transition text-center"
                        >
                          {m.oddsX.toFixed(2)}
                        </button>
                      ) : (
                        <div className="w-12 sm:w-14 text-center text-gray-600 font-mono text-xs">-</div>
                      )}

                      {/* Odds 2 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMatch(m);
                          setTradeOutcome("TEAM2");
                          sound.playChipClick();
                        }}
                        className="w-14 sm:w-16 py-1.5 rounded-lg bg-[#141C28] hover:bg-rose-500 hover:text-white border border-[#212E40] text-gray-200 text-xs font-mono font-black transition flex items-center justify-center space-x-1"
                      >
                        <span>{m.odds2.toFixed(2)}</span>
                        {m.oddsTrend2 === "UP" ? (
                          <ArrowUpRight className="w-3 h-3 text-[#95D600]" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-red-400" />
                        )}
                      </button>

                      {/* Trade Pill */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMatch(m);
                          sound.playChipClick();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#95D600] text-black font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#85c200] transition active:scale-95"
                      >
                        Trade
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
