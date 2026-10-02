"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Trophy, Activity, Zap, ChevronRight } from "lucide-react";
import { useBetSlipStore } from "@/lib/store/useBetSlipStore";

export default function LiveMatchBanner() {
  const { selections, toggleSelection } = useBetSlipStore();

  // Simulated live match state that updates dynamically
  const [cricketRuns, setCricketRuns] = useState(174);
  const [cricketWickets, setCricketWickets] = useState(4);
  const [cricketBalls, setCricketBalls] = useState(3); // 17.3
  const [recentBallEvent, setRecentBallEvent] = useState("FOUR! Beautiful drive through covers by MS Dhoni");

  // Dynamic simulation timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCricketBalls((prevBalls) => {
        let nextBalls = prevBalls + 1;
        let nextOver = 17;
        if (nextBalls >= 6) {
          nextBalls = 0;
          nextOver += 1;
        }

        const events = [
          "1 run taken, good running between wickets",
          "2 runs! Driven down to long-on",
          "FOUR! Smashed over extra cover!",
          "DOT BALL. Excellent yorker from Bumrah",
          "SIX! Massive hit into the top tier!",
          "1 run, pulled towards deep mid-wicket",
        ];

        const pickEvent = events[Math.floor(Math.random() * events.length)];
        setRecentBallEvent(pickEvent);

        if (pickEvent.includes("SIX")) setCricketRuns((r) => r + 6);
        else if (pickEvent.includes("FOUR")) setCricketRuns((r) => r + 4);
        else if (pickEvent.includes("2 runs")) setCricketRuns((r) => r + 2);
        else if (pickEvent.includes("1 run")) setCricketRuns((r) => r + 1);

        return nextBalls;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const cskOdds = 1.62;
  const miOdds = 2.30;

  return (
    <div className="relative bg-gradient-to-r from-[#111827] via-[#151F32] to-[#0E1626] border border-[#23334E] rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
      {/* Background Glow Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-[#EF4444] text-white text-xs font-black rounded-full flex items-center space-x-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>LIVE MATCH IN-PLAY</span>
            </span>
            <span className="text-xs font-bold text-[#D4AF37] px-2.5 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full">
              IPL 2026 EL CLÁSICO
            </span>
          </div>

          <div className="text-xs text-gray-400 font-medium">
            Wankhede Stadium, Mumbai • 2nd Innings
          </div>
        </div>

        {/* Big Scoreboard Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* CSK */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center font-black text-xl text-[#D4AF37] shadow-gold">
              CSK
            </div>
            <div>
              <div className="text-lg font-black text-white">Chennai Super Kings</div>
              <div className="text-2xl font-black font-mono text-[#10B981]">
                {cricketRuns}/{cricketWickets} <span className="text-sm font-normal text-gray-300">(17.{cricketBalls} Ov)</span>
              </div>
            </div>
          </div>

          {/* VS & Target Notice */}
          <div className="text-center py-2 px-4 bg-[#0B0F1A]/80 border border-[#23334E] rounded-2xl space-y-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Target: 190 Runs
            </div>
            <div className="text-sm font-bold text-[#D4AF37]">
              Need {Math.max(1, 190 - cricketRuns)} runs in {15 - cricketBalls} balls
            </div>
            <div className="text-[11px] text-[#10B981] font-mono flex items-center justify-center space-x-1">
              <Activity className="w-3 h-3" />
              <span className="truncate">{recentBallEvent}</span>
            </div>
          </div>

          {/* MI */}
          <div className="flex items-center justify-end space-x-4 text-right">
            <div>
              <div className="text-lg font-black text-white">Mumbai Indians</div>
              <div className="text-2xl font-black font-mono text-gray-300">
                189/6 <span className="text-sm font-normal text-gray-400">(20.0 Ov)</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center font-black text-xl text-blue-400">
              MI
            </div>
          </div>
        </div>

        {/* Live Odds Quick Bet Buttons */}
        <div className="pt-4 border-t border-[#23334E] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() =>
                toggleSelection({
                  matchId: "live-csk-mi",
                  matchName: "Chennai Super Kings vs Mumbai Indians",
                  sport: "CRICKET",
                  tournament: "IPL 2026",
                  marketId: "live-winner",
                  marketName: "Match Winner (2-Way)",
                  outcomeId: "csk-win",
                  outcomeName: "Chennai Super Kings",
                  odds: cskOdds,
                })
              }
              className="flex-1 sm:flex-none px-6 py-3 bg-[#0B0F1A] hover:bg-[#151F32] border border-[#23334E] hover:border-[#D4AF37] rounded-xl text-left transition flex items-center justify-between space-x-4"
            >
              <span className="text-xs font-bold text-white">CSK to Win</span>
              <span className="text-sm font-mono font-black text-[#D4AF37]">@{cskOdds}</span>
            </button>

            <button
              onClick={() =>
                toggleSelection({
                  matchId: "live-csk-mi",
                  matchName: "Chennai Super Kings vs Mumbai Indians",
                  sport: "CRICKET",
                  tournament: "IPL 2026",
                  marketId: "live-winner",
                  marketName: "Match Winner (2-Way)",
                  outcomeId: "mi-win",
                  outcomeName: "Mumbai Indians",
                  odds: miOdds,
                })
              }
              className="flex-1 sm:flex-none px-6 py-3 bg-[#0B0F1A] hover:bg-[#151F32] border border-[#23334E] hover:border-blue-400 rounded-xl text-left transition flex items-center justify-between space-x-4"
            >
              <span className="text-xs font-bold text-white">MI to Win</span>
              <span className="text-sm font-mono font-black text-blue-400">@{miOdds}</span>
            </button>
          </div>

          <Link
            href="/sports"
            className="text-xs font-extrabold text-[#D4AF37] hover:text-white flex items-center space-x-1.5 transition"
          >
            <span>Explore All 48 Live In-Play Markets</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
