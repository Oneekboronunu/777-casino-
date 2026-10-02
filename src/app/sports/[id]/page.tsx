"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Trophy,
  ArrowLeft,
  Flame,
  Activity,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
} from "lucide-react";
import { useBetSlipStore } from "@/lib/store/useBetSlipStore";
import sound from "@/lib/sound";

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params?.id as string;
  const { selections, toggleSelection } = useBetSlipStore();

  const [match, setMatch] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (matchId) {
      fetchMatch();
    }
  }, [matchId]);

  const fetchMatch = async () => {
    try {
      const res = await fetch(`/api/sports/matches/${matchId}`);
      const data = await res.json();
      if (res.ok) {
        setMatch(data.match);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-gray-400">
        Loading match prediction markets...
      </div>
    );
  }

  if (!match) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="text-sm font-bold text-white">Match not found.</div>
        <Link href="/sports" className="text-xs text-[#D4AF37] hover:underline">
          Return to Sportsbook
        </Link>
      </div>
    );
  }

  const isLive = match.status === "LIVE";
  const filteredMarkets = match.markets?.filter((m: any) => {
    if (selectedCategory === "ALL") return true;
    return m.category === selectedCategory;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/sports"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Matches</span>
      </Link>

      {/* Match Header Stage */}
      <div className="bg-[#111827] border border-[#23334E] rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#23334E]/60 pb-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#D4AF37]">{match.tournament}</span>
            {isLive && (
              <span className="px-2 py-0.5 bg-[#EF4444] text-white text-[10px] font-black rounded-full animate-pulse">
                LIVE {match.liveMinute || "IN-PLAY"}
              </span>
            )}
          </div>
          <div className="text-gray-400">{match.venue}</div>
        </div>

        {/* Big Teams Clash Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left">
          {/* Home Team */}
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center font-black text-2xl text-[#D4AF37] shadow-gold">
              {match.homeTeamCode}
            </div>
            <div>
              <div className="text-xl font-black text-white">{match.homeTeam}</div>
              <div className="text-3xl font-mono font-black text-[#10B981] mt-1">
                {match.homeScore}
              </div>
            </div>
          </div>

          {/* Center VS / Status */}
          <div className="text-center py-3 px-4 bg-[#0B0F1A] border border-[#23334E] rounded-2xl space-y-1">
            <div className="text-xs uppercase font-bold text-gray-400">Match Status</div>
            <div className="text-sm font-bold text-[#D4AF37]">{match.matchTime}</div>
            {match.liveSummary && (
              <div className="text-[11px] text-[#10B981] font-mono flex items-center justify-center space-x-1">
                <Activity className="w-3.5 h-3.5" />
                <span className="truncate">{match.liveSummary}</span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-center md:justify-end space-x-4 text-center md:text-right">
            <div>
              <div className="text-xl font-black text-white">{match.awayTeam}</div>
              <div className="text-3xl font-mono font-black text-gray-200 mt-1">
                {match.awayScore}
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center font-black text-2xl text-blue-400">
              {match.awayTeamCode}
            </div>
          </div>
        </div>
      </div>

      {/* Markets Category Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 bg-[#111827] p-2 rounded-2xl border border-[#23334E]">
        {["ALL", "MAIN", "SCORES", "TOTALS", "PROPS"].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              sound.playChipClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
              selectedCategory === cat
                ? "bg-[#D4AF37] text-[#0B0F1A] shadow-gold font-extrabold"
                : "bg-[#151F32] text-gray-300 hover:text-white"
            }`}
          >
            {cat === "ALL"
              ? "All Markets"
              : cat === "MAIN"
              ? "Match Result / 1X2"
              : cat === "SCORES"
              ? "Correct Score Grid"
              : cat === "TOTALS"
              ? "Over / Under Totals"
              : "Player Props & Specials"}
          </button>
        ))}
      </div>

      {/* Prediction Markets Grid */}
      <div className="space-y-4">
        {filteredMarkets?.map((market: any) => (
          <div
            key={market.id}
            className="bg-[#111827] border border-[#23334E] rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white border-b border-[#23334E]/60 pb-2.5">
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{market.name}</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {market.outcomes.length} Selections Available
              </span>
            </div>

            {/* Outcomes Grid */}
            <div
              className={`grid ${
                market.outcomes.length > 4
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                  : market.outcomes.length === 3
                  ? "grid-cols-1 sm:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2"
              } gap-2.5`}
            >
              {market.outcomes.map((outcome: any) => {
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
                        marketId: market.id,
                        marketName: market.name,
                        outcomeId: outcome.id,
                        outcomeName: outcome.name,
                        odds: outcome.odds,
                      })
                    }
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                      isSelected
                        ? "bg-[#D4AF37] text-[#0B0F1A] border-[#D4AF37] font-black shadow-gold"
                        : "bg-[#0B0F1A] hover:bg-[#151F32] border-[#23334E] hover:border-[#D4AF37] text-gray-200"
                    }`}
                  >
                    <span className="text-xs font-bold truncate max-w-full">
                      {outcome.name}
                    </span>
                    <span
                      className={`font-mono text-sm font-extrabold ${
                        isSelected ? "text-[#0B0F1A]" : "text-[#D4AF37]"
                      }`}
                    >
                      {outcome.odds.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
