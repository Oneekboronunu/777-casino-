"use client";

import React, { useState, useEffect } from "react";
import LiveMatchBanner from "@/components/sports/LiveMatchBanner";
import MatchCard from "@/components/sports/MatchCard";
import { Trophy, Award, Flame, Search, Filter, ShieldCheck } from "lucide-react";
import sound from "@/lib/sound";

export default function SportsbookPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMatches();
  }, [selectedSport, selectedStatus]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      let url = "/api/sports/matches?";
      if (selectedSport !== "ALL") url += `sport=${selectedSport}&`;
      if (selectedStatus !== "ALL") url += `status=${selectedStatus}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setMatches(data.matches || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.homeTeam.toLowerCase().includes(q) ||
      m.awayTeam.toLowerCase().includes(q) ||
      m.tournament.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Live Featured Match Banner */}
      <LiveMatchBanner />

      {/* Filter Navigation Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#111827] border border-[#23334E] p-3 rounded-2xl">
        {/* Sport & Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => {
              setSelectedSport("ALL");
              setSelectedStatus("ALL");
              sound.playChipClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 flex-shrink-0 ${
              selectedSport === "ALL" && selectedStatus === "ALL"
                ? "bg-[#D4AF37] text-[#0B0F1A] shadow-gold font-extrabold"
                : "bg-[#151F32] text-gray-300 hover:text-white"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>All Markets</span>
          </button>

          <button
            onClick={() => {
              setSelectedSport("ALL");
              setSelectedStatus("LIVE");
              sound.playChipClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 flex-shrink-0 ${
              selectedStatus === "LIVE"
                ? "bg-[#EF4444] text-white font-extrabold animate-pulse"
                : "bg-[#151F32] text-gray-300 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Live In-Play</span>
          </button>

          <button
            onClick={() => {
              setSelectedSport("CRICKET");
              setSelectedStatus("ALL");
              sound.playChipClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 flex-shrink-0 ${
              selectedSport === "CRICKET"
                ? "bg-[#D4AF37] text-[#0B0F1A] shadow-gold font-extrabold"
                : "bg-[#151F32] text-gray-300 hover:text-white"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Cricket (IPL & BPL)</span>
          </button>

          <button
            onClick={() => {
              setSelectedSport("FOOTBALL");
              setSelectedStatus("ALL");
              sound.playChipClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 flex-shrink-0 ${
              selectedSport === "FOOTBALL"
                ? "bg-[#D4AF37] text-[#0B0F1A] shadow-gold font-extrabold"
                : "bg-[#151F32] text-gray-300 hover:text-white"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Football (UCL & EPL)</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams or leagues..."
            className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Matches List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-gray-400">Loading sportsbook markets...</div>
      ) : filteredMatches.length === 0 ? (
        <div className="py-16 text-center text-xs text-gray-400 bg-[#111827] border border-[#23334E] rounded-2xl">
          No matches found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
