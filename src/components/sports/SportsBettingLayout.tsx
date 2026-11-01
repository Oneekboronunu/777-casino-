"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Layers,
  ChevronRight,
  Play,
  Check,
  Trash2,
  Sparkles,
} from "lucide-react";
import sound from "@/lib/sound";
import { useUserStore } from "@/lib/store/useUserStore";

interface MatchItem {
  id: string;
  sport: string;
  leagueFlag: string;
  leagueRegion: string;
  leagueName: string;
  timeLabel: string;
  homeTeam: string;
  awayTeam: string;
  marketsCount: number;
  odds1: number;
  oddsX?: number;
  odds2: number;
}

const SAMPLE_MATCHES: MatchItem[] = [
  {
    id: "m-cricket-1",
    sport: "CRICKET",
    leagueFlag: "🌐",
    leagueRegion: "International Club",
    leagueName: "Friendlies Twenty20",
    timeLabel: "Today 23:00",
    homeTeam: "West Indies A",
    awayTeam: "England Lions",
    marketsCount: 4,
    odds1: 2.03,
    odds2: 1.70,
  },
  {
    id: "m-cricket-2",
    sport: "CRICKET",
    leagueFlag: "🇦🇪",
    leagueRegion: "United Arab Emirates",
    leagueName: "United Arab Emirates D20",
    timeLabel: "Today 20:30",
    homeTeam: "Dubai Capitals",
    awayTeam: "Sharjah Warriors",
    marketsCount: 6,
    odds1: 1.85,
    odds2: 1.95,
  },
  {
    id: "m-football-1",
    sport: "FOOTBALL",
    leagueFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    leagueRegion: "England",
    leagueName: "Premier League",
    timeLabel: "Today 21:00",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    marketsCount: 14,
    odds1: 1.92,
    oddsX: 3.60,
    odds2: 3.85,
  },
  {
    id: "m-cricket-3",
    sport: "CRICKET",
    leagueFlag: "🇧🇩",
    leagueRegion: "Bangladesh",
    leagueName: "BPL Twenty20",
    timeLabel: "Tomorrow 18:30",
    homeTeam: "Fortune Barishal",
    awayTeam: "Comilla Victorians",
    marketsCount: 8,
    odds1: 1.75,
    odds2: 2.08,
  },
  {
    id: "m-football-2",
    sport: "FOOTBALL",
    leagueFlag: "🇪🇸",
    leagueRegion: "Spain",
    leagueName: "La Liga",
    timeLabel: "Tomorrow 22:00",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    marketsCount: 22,
    odds1: 2.15,
    oddsX: 3.50,
    odds2: 3.10,
  },
];

const SPORTS_RAIL = [
  { id: "FOOTBALL", icon: "⚽", label: "Football" },
  { id: "CRICKET", icon: "🏏", label: "Cricket" },
  { id: "BASKETBALL", icon: "🏀", label: "Basketball" },
  { id: "TENNIS", icon: "🎾", label: "Tennis" },
  { id: "VOLLEYBALL", icon: "🏐", label: "Volleyball" },
  { id: "ICE_HOCKEY", icon: "🏒", label: "Ice Hockey" },
  { id: "BOXING", icon: "🥊", label: "Boxing" },
  { id: "DARTS", icon: "🎯", label: "Darts" },
  { id: "CASINO", icon: "🎰", label: "Casino" },
];

export default function SportsBettingLayout() {
  const { user, updateBalance, showNotification, openAuthModal } = useUserStore();

  const [activeSport, setActiveSport] = useState<string>("CRICKET");
  const [viewMode, setViewMode] = useState<"EVENTS" | "LEAGUES">("EVENTS");
  const [timeFilter, setTimeFilter] = useState<string>("TODAY");
  const [betSlipType, setBetSlipType] = useState<"SINGLE" | "COMBINATION" | "SYSTEM">("COMBINATION");

  // Selected Bet Slip Items
  const [selectedBets, setSelectedBets] = useState<
    {
      matchId: string;
      matchName: string;
      pick: string;
      odd: number;
    }[]
  >([]);

  const [stakeAmount, setStakeAmount] = useState<number>(500);

  // Toggle selection
  const handleSelectOdd = (match: MatchItem, pick: string, odd: number) => {
    sound.playChipClick();
    const existingIndex = selectedBets.findIndex(
      (b) => b.matchId === match.id && b.pick === pick
    );

    if (existingIndex !== -1) {
      setSelectedBets(selectedBets.filter((_, idx) => idx !== existingIndex));
    } else {
      // Remove other pick from same match in Single/Combo
      const filtered = selectedBets.filter((b) => b.matchId !== match.id);
      setSelectedBets([
        ...filtered,
        {
          matchId: match.id,
          matchName: `${match.homeTeam} vs ${match.awayTeam}`,
          pick,
          odd,
        },
      ]);
    }
  };

  const isOddSelected = (matchId: string, pick: string) => {
    return selectedBets.some((b) => b.matchId === matchId && b.pick === pick);
  };

  // Odds calculation
  const totalOdds =
    selectedBets.length > 0
      ? Math.round(
          selectedBets.reduce((acc, b) => acc * b.odd, 1) * 100
        ) / 100
      : 1.0;

  const potentialWin = Math.round(stakeAmount * totalOdds);

  // Place Bet
  const handlePlaceBet = () => {
    if (!user) {
      openAuthModal("LOGIN");
      return;
    }

    if (user.balance < stakeAmount) {
      showNotification("Insufficient balance for this bet", "ERROR");
      return;
    }

    updateBalance(-stakeAmount);
    sound.playBetPlaced();
    showNotification(`Bet placed successfully! Potential Win: ৳${potentialWin.toLocaleString()}`, "SUCCESS");
    setSelectedBets([]);
  };

  const filteredMatches = SAMPLE_MATCHES.filter((m) => {
    if (activeSport === "CASINO") return true;
    return m.sport === activeSport;
  });

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] bg-[#090D12] text-gray-200 flex flex-col select-none">
      <div className="w-full max-w-[1600px] mx-auto flex flex-1">
        {/* ========================================================
            COLUMN 1: SLIM SPORTS RAIL (Exact match to left rail in screenshot)
            ======================================================== */}
        <div className="w-14 sm:w-16 bg-[#0D131A] border-r border-[#19232F] flex flex-col items-center py-3 space-y-2 shrink-0">
          {SPORTS_RAIL.map((s) => {
            const isActive = activeSport === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  sound.playChipClick();
                  setActiveSport(s.id);
                }}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all duration-200 relative ${
                  isActive
                    ? "bg-[#95D600] text-black shadow-[0_0_12px_rgba(149,214,0,0.4)] scale-105 font-bold"
                    : "bg-[#141C26] text-gray-400 hover:text-white hover:bg-[#1E2938]"
                }`}
                title={s.label}
              >
                <span>{s.icon}</span>
                {isActive && (
                  <span className="absolute -left-1 w-1 h-5 bg-[#95D600] rounded-r-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================
            COLUMN 2: CENTER MATCH FEED & MARKETS TABLE
            ======================================================== */}
        <div className="flex-1 p-3 sm:p-5 space-y-4 overflow-y-auto">
          {/* Breadcrumb Bar */}
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
            <Link
              href="/"
              className="w-7 h-7 rounded-lg bg-[#141C26] hover:bg-[#1E2938] flex items-center justify-center text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#141C26] border border-[#1E2A38] rounded-xl cursor-pointer hover:border-gray-500 transition">
              <span>{SPORTS_RAIL.find((s) => s.id === activeSport)?.icon}</span>
              <span className="text-white font-extrabold capitalize">
                Home / {activeSport.toLowerCase()}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
            </div>
          </div>

          {/* View Mode Toggle: "Events" vs "All leagues" */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                sound.playChipClick();
                setViewMode("EVENTS");
              }}
              className={`px-5 py-2 rounded-full text-xs font-black transition ${
                viewMode === "EVENTS"
                  ? "bg-[#95D600] text-black shadow-[0_0_12px_rgba(149,214,0,0.3)]"
                  : "bg-[#141C26] text-gray-400 hover:text-white border border-[#1E2A38]"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => {
                sound.playChipClick();
                setViewMode("LEAGUES");
              }}
              className={`px-5 py-2 rounded-full text-xs font-black transition ${
                viewMode === "LEAGUES"
                  ? "bg-[#95D600] text-black shadow-[0_0_12px_rgba(149,214,0,0.3)]"
                  : "bg-[#141C26] text-gray-400 hover:text-white border border-[#1E2A38]"
              }`}
            >
              All leagues
            </button>
          </div>

          {/* Time Filter Tabs: Live, Today, 4h, Tomorrow, Wednesday, Later */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "LIVE", label: "Live" },
              { id: "TODAY", label: "Today" },
              { id: "4H", label: "4 h" },
              { id: "TOMORROW", label: "Tomorrow" },
              { id: "WEDNESDAY", label: "Wednesday" },
              { id: "LATER", label: "Later" },
            ].map((t) => {
              const isSelected = timeFilter === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    sound.playChipClick();
                    setTimeFilter(t.id);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    isSelected
                      ? "bg-[#95D600] text-black font-black shadow-[0_0_8px_rgba(149,214,0,0.3)]"
                      : "bg-[#141C26] text-gray-400 hover:text-white border border-[#1E2A38]"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Matches & Leagues Table */}
          <div className="space-y-4 pt-1">
            {filteredMatches.map((m) => (
              <div
                key={m.id}
                className="bg-[#111721] border border-[#1B2635] rounded-2xl overflow-hidden shadow-lg"
              >
                {/* League Header */}
                <div className="px-4 py-2.5 bg-[#141C26] border-b border-[#1E2A38] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 font-bold text-gray-300">
                    <span className="text-sm">{m.leagueFlag}</span>
                    <span className="text-gray-400">{m.leagueRegion}</span>
                    <span className="text-white font-black">{m.leagueName}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  </div>

                  <div className="hidden sm:flex items-center space-x-12 pr-6 text-[11px] font-bold text-gray-400 uppercase">
                    <span>Winner</span>
                    <div className="flex space-x-8">
                      <span>1</span>
                      {m.oddsX && <span>X</span>}
                      <span>2</span>
                    </div>
                  </div>
                </div>

                {/* Match Card Row */}
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Time, Teams, Markets Link */}
                  <div className="space-y-1.5 flex-1">
                    <div className="text-[11px] text-gray-400 font-mono font-semibold">
                      {m.timeLabel}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-sm font-black text-white hover:text-[#95D600] transition cursor-pointer">
                        {m.homeTeam}
                      </div>
                      <div className="text-sm font-black text-white hover:text-[#95D600] transition cursor-pointer">
                        {m.awayTeam}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 text-[11px] font-bold text-[#95D600] cursor-pointer hover:underline pt-0.5">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>+{m.marketsCount} markets</span>
                    </div>
                  </div>

                  {/* Right: Odds Buttons matching screenshot */}
                  <div className="flex items-center space-x-2">
                    {/* Pick 1 */}
                    <button
                      onClick={() => handleSelectOdd(m, "1", m.odds1)}
                      className={`min-w-[76px] py-3 px-3 rounded-xl font-mono text-sm font-black transition-all text-center border ${
                        isOddSelected(m.id, "1")
                          ? "bg-[#95D600] text-black border-[#95D600] shadow-[0_0_12px_rgba(149,214,0,0.5)] scale-105"
                          : "bg-[#182230] text-white hover:bg-[#202D40] border-[#253448]"
                      }`}
                    >
                      {m.odds1.toFixed(2)}
                    </button>

                    {/* Pick X (Draw - if football) */}
                    {m.oddsX && (
                      <button
                        onClick={() => handleSelectOdd(m, "X", m.oddsX!)}
                        className={`min-w-[76px] py-3 px-3 rounded-xl font-mono text-sm font-black transition-all text-center border ${
                          isOddSelected(m.id, "X")
                            ? "bg-[#95D600] text-black border-[#95D600] shadow-[0_0_12px_rgba(149,214,0,0.5)] scale-105"
                            : "bg-[#182230] text-white hover:bg-[#202D40] border-[#253448]"
                        }`}
                      >
                        {m.oddsX.toFixed(2)}
                      </button>
                    )}

                    {/* Pick 2 */}
                    <button
                      onClick={() => handleSelectOdd(m, "2", m.odds2)}
                      className={`min-w-[76px] py-3 px-3 rounded-xl font-mono text-sm font-black transition-all text-center border ${
                        isOddSelected(m.id, "2")
                          ? "bg-[#95D600] text-black border-[#95D600] shadow-[0_0_12px_rgba(149,214,0,0.5)] scale-105"
                          : "bg-[#182230] text-white hover:bg-[#202D40] border-[#253448]"
                      }`}
                    >
                      {m.odds2.toFixed(2)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            COLUMN 3: BET SLIP PANEL (Exact replica of right column in screenshot)
            ======================================================== */}
        <div className="hidden lg:flex flex-col w-80 xl:w-96 bg-[#111721] border-l border-[#19232F] p-4 space-y-4 shrink-0">
          {/* Header with Bet Count Badge */}
          <div className="flex items-center space-x-2 text-white">
            <span className="text-sm font-black uppercase tracking-wide">
              Bet slip
            </span>
            <span className="w-5 h-5 rounded-full bg-[#1A2534] text-[#95D600] font-mono text-xs font-black flex items-center justify-center border border-[#253448]">
              {selectedBets.length}
            </span>
          </div>

          {/* Mode Selector Tabs: Single, Combination, System */}
          <div className="flex items-center bg-[#151D28] p-1 rounded-full border border-[#212E3F]">
            {(["SINGLE", "COMBINATION", "SYSTEM"] as const).map((mode) => {
              const isActive = betSlipType === mode;
              return (
                <button
                  key={mode}
                  onClick={() => {
                    sound.playChipClick();
                    setBetSlipType(mode);
                  }}
                  className={`flex-1 py-1.5 rounded-full text-xs font-black uppercase transition ${
                    isActive
                      ? "bg-[#95D600] text-black shadow-[0_0_10px_rgba(149,214,0,0.3)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {mode === "COMBINATION" ? "Combination" : mode === "SINGLE" ? "Single" : "System"}
                </button>
              );
            })}
          </div>

          {/* Body Content */}
          {selectedBets.length === 0 ? (
            /* Empty State matching screenshot */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-4">
              {/* Card Stack Graphic Illustration */}
              <div className="w-28 h-20 relative flex items-center justify-center opacity-40">
                <div className="absolute w-24 h-14 bg-[#233246] rounded-xl border border-gray-600 -rotate-6 transform" />
                <div className="absolute w-24 h-14 bg-[#1E2B3C] rounded-xl border border-gray-500 rotate-3 transform shadow-lg" />
                <div className="relative w-24 h-14 bg-[#182332] rounded-xl border border-gray-400 flex flex-col justify-between p-2">
                  <div className="w-10 h-1.5 bg-gray-500 rounded-full" />
                  <div className="flex justify-between items-center">
                    <div className="w-6 h-1 bg-gray-600 rounded-full" />
                    <div className="w-3 h-3 rounded-full bg-[#95D600]" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-black text-white">
                  No combination bet in your bet slip
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
                  With combination bets, get your adrenaline pumping by placing several bets in a single bet slip. Are all your bets winning? You multiply your odds and boost your winnings.
                </p>
              </div>
            </div>
          ) : (
            /* Active Bet List */
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5 max-h-[48vh] overflow-y-auto pr-1">
                {selectedBets.map((b) => (
                  <div
                    key={`${b.matchId}-${b.pick}`}
                    className="p-3 bg-[#151D28] border border-[#212E3F] rounded-xl relative space-y-1"
                  >
                    <button
                      onClick={() =>
                        setSelectedBets(
                          selectedBets.filter(
                            (item) =>
                              !(item.matchId === b.matchId && item.pick === b.pick)
                          )
                        )
                      }
                      className="absolute top-2.5 right-2 text-gray-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-[11px] font-bold text-gray-400 truncate pr-6">
                      {b.matchName}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black text-[#95D600]">
                        Pick: {b.pick}
                      </span>
                      <span className="font-mono text-sm font-black text-white">
                        {b.odd.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stake & Total Payout Calculation */}
              <div className="p-3.5 bg-[#151D28] border border-[#212E3F] rounded-2xl space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-bold">Total Odds:</span>
                  <span className="font-mono font-black text-[#95D600] text-sm">
                    {totalOdds.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-gray-400 font-bold flex justify-between">
                    <span>Stake Amount (BDT):</span>
                    <span className="font-mono text-white">৳{stakeAmount}</span>
                  </div>
                  <input
                    type="number"
                    min={50}
                    step={50}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Math.max(50, parseInt(e.target.value) || 50))}
                    className="w-full px-3 py-2 bg-black/40 border border-[#2B3A4F] rounded-xl text-center font-mono font-black text-amber-300 text-sm focus:outline-none focus:border-[#95D600]"
                  />
                </div>

                <div className="flex justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-gray-300 font-bold">Potential Return:</span>
                  <span className="font-mono font-black text-white text-base">
                    ৳{potentialWin.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handlePlaceBet}
                  className="w-full py-3 rounded-xl bg-[#95D600] hover:bg-[#85c200] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(149,214,0,0.4)] transition active:scale-95"
                >
                  Place Bet (৳{stakeAmount})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
