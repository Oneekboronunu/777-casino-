"use client";

import React from "react";
import Link from "next/link";
import { Trophy, ChevronRight, Activity, Flame } from "lucide-react";
import { useBetSlipStore } from "@/lib/store/useBetSlipStore";
import sound from "@/lib/sound";

interface MatchCardProps {
  match: {
    id: string;
    sport: string;
    tournament: string;
    homeTeam: string;
    awayTeam: string;
    homeTeamCode: string;
    awayTeamCode: string;
    homeScore: string;
    awayScore: string;
    status: string;
    matchTime: string;
    venue: string;
    liveMinute?: string | null;
    liveSummary?: string | null;
    isHot?: boolean;
    markets: Array<{
      id: string;
      name: string;
      category: string;
      outcomes: Array<{
        id: string;
        name: string;
        odds: number;
      }>;
    }>;
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  const { selections, toggleSelection } = useBetSlipStore();

  const isLive = match.status === "LIVE";
  const mainMarket = match.markets.find((m) => m.category === "MAIN") || match.markets[0];
  const totalsMarket = match.markets.find((m) => m.category === "TOTALS");

  return (
    <div className="bg-[#111827] border border-[#23334E] hover:border-[#2E4366] rounded-2xl p-4 sm:p-5 transition space-y-4">
      {/* Tournament Bar & Status */}
      <div className="flex items-center justify-between text-xs border-b border-[#23334E]/60 pb-2.5">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-gray-300">{match.tournament}</span>
          {match.isHot && (
            <span className="flex items-center space-x-0.5 text-[10px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded">
              <Flame className="w-3 h-3" />
              <span>HOT</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isLive ? (
            <span className="flex items-center space-x-1.5 px-2 py-0.5 bg-[#EF4444]/20 text-[#EF4444] text-[10px] font-extrabold rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span>LIVE {match.liveMinute || "IN-PLAY"}</span>
            </span>
          ) : (
            <span className="text-[11px] font-medium text-gray-400">{match.matchTime}</span>
          )}
        </div>
      </div>

      {/* Teams & Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <Link href={`/sports/${match.id}`} className="space-y-2 group cursor-pointer">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-[#151F32] border border-[#23334E] flex items-center justify-center text-[10px] font-black text-[#D4AF37]">
                {match.homeTeamCode}
              </div>
              <span className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition">
                {match.homeTeam}
              </span>
            </div>
            <span className="font-mono text-sm font-extrabold text-white">
              {match.homeScore}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-[#151F32] border border-[#23334E] flex items-center justify-center text-[10px] font-black text-[#D4AF37]">
                {match.awayTeamCode}
              </div>
              <span className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition">
                {match.awayTeam}
              </span>
            </div>
            <span className="font-mono text-sm font-extrabold text-white">
              {match.awayScore}
            </span>
          </div>

          {/* Live Summary Text */}
          {match.liveSummary && (
            <div className="text-[11px] text-gray-400 flex items-center space-x-1 pt-1">
              <Activity className="w-3 h-3 text-[#10B981]" />
              <span className="truncate">{match.liveSummary}</span>
            </div>
          )}
        </Link>

        {/* Quick Main Market Odds Pill Buttons */}
        {mainMarket && (
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex justify-between">
              <span>{mainMarket.name}</span>
              <Link
                href={`/sports/${match.id}`}
                className="text-[#D4AF37] hover:underline flex items-center space-x-0.5"
              >
                <span>+{match.markets.length * 4} Markets</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className={`grid ${mainMarket.outcomes.length === 3 ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
              {mainMarket.outcomes.map((outcome) => {
                const isSelected = selections.some((s) => s.outcomeId === outcome.id);
                return (
                  <button
                    key={outcome.id}
                    onClick={() =>
                      toggleSelection({
                        matchId: match.id,
                        matchName: `${match.homeTeam} vs ${match.awayTeam}`,
                        sport: match.sport,
                        tournament: match.tournament,
                        marketId: mainMarket.id,
                        marketName: mainMarket.name,
                        outcomeId: outcome.id,
                        outcomeName: outcome.name,
                        odds: outcome.odds,
                      })
                    }
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-[#D4AF37] text-[#0B0F1A] border-[#D4AF37] font-black shadow-gold"
                        : "bg-[#0B0F1A] hover:bg-[#151F32] border-[#23334E] hover:border-[#D4AF37] text-gray-200"
                    }`}
                  >
                    <span className="text-[11px] font-semibold truncate max-w-full">
                      {outcome.name}
                    </span>
                    <span className={`font-mono text-xs font-bold ${isSelected ? "text-[#0B0F1A]" : "text-[#D4AF37]"}`}>
                      {outcome.odds.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick Totals / Over Under Market */}
      {totalsMarket && (
        <div className="pt-2 border-t border-[#23334E]/60 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">{totalsMarket.name}</span>
          <div className="flex space-x-2">
            {totalsMarket.outcomes.map((outcome) => {
              const isSelected = selections.some((s) => s.outcomeId === outcome.id);
              return (
                <button
                  key={outcome.id}
                  onClick={() =>
                    toggleSelection({
                      matchId: match.id,
                      matchName: `${match.homeTeam} vs ${match.awayTeam}`,
                      sport: match.sport,
                      tournament: match.tournament,
                      marketId: totalsMarket.id,
                      marketName: totalsMarket.name,
                      outcomeId: outcome.id,
                      outcomeName: outcome.name,
                      odds: outcome.odds,
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg border text-xs transition flex items-center space-x-1.5 ${
                    isSelected
                      ? "bg-[#D4AF37] text-[#0B0F1A] border-[#D4AF37] font-bold"
                      : "bg-[#0B0F1A] hover:bg-[#151F32] border-[#23334E] text-gray-300"
                  }`}
                >
                  <span className="text-[11px]">{outcome.name}</span>
                  <span className={`font-mono font-bold ${isSelected ? "text-[#0B0F1A]" : "text-[#D4AF37]"}`}>
                    {outcome.odds.toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
