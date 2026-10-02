"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

export default function AdminPage() {
  const { user, showNotification } = useUserStore();
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
    fetchAdminData();
    fetchMatches();
  }, []);

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

      const data = await res.json();
      if (res.ok) {
        sound.playWin();
        showNotification("Match score updated & live odds synced!", "SUCCESS");
        setSelectedMatch(null);
        fetchMatches();
      } else {
        showNotification(data.error || "Update failed", "ERROR");
      }
    } catch {
      showNotification("Error updating match score", "ERROR");
    }
  };

  const handleSettleOutcome = async (matchId: string, outcomeId: string) => {
    try {
      const res = await fetch("/api/admin/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SETTLE_OUTCOME",
          matchId,
          outcomeId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        sound.playWin();
        showNotification("Winning outcome settled and all winning bets paid out!", "SUCCESS");
        fetchMatches();
        fetchAdminData();
      } else {
        showNotification(data.error || "Settlement failed", "ERROR");
      }
    } catch {
      showNotification("Error settling market", "ERROR");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Admin Title */}
      <div className="bg-[#111827] border border-[#23334E] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">GRAND ADMIN CONTROLLER</h1>
            <p className="text-xs text-gray-400">Manage User Balances, Live Match Simulations & Bet Settlement</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs font-mono font-bold text-[#10B981]">SYSTEM OPERATIONAL</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#111827] border border-[#23334E] rounded-2xl space-y-1">
          <div className="text-xs text-gray-400 font-medium">Gross Gaming Revenue (GGR)</div>
          <div className="text-2xl font-black font-mono text-[#10B981]">
            ৳{metrics?.estimatedGGR?.toLocaleString() || "482,900"}
          </div>
          <div className="text-[10px] text-gray-500">+18.4% this month</div>
        </div>

        <div className="p-5 bg-[#111827] border border-[#23334E] rounded-2xl space-y-1">
          <div className="text-xs text-gray-400 font-medium">Total Registered Players</div>
          <div className="text-2xl font-black font-mono text-white">
            {metrics?.totalUsers || 24} Users
          </div>
          <div className="text-[10px] text-[#D4AF37]">Active local VIPs</div>
        </div>

        <div className="p-5 bg-[#111827] border border-[#23334E] rounded-2xl space-y-1">
          <div className="text-xs text-gray-400 font-medium">Total Deposit Volume</div>
          <div className="text-2xl font-black font-mono text-[#D4AF37]">
            ৳{metrics?.totalDepositVolume?.toLocaleString() || "2,450,000"}
          </div>
          <div className="text-[10px] text-gray-500">bKash & Nagad verified</div>
        </div>

        <div className="p-5 bg-[#111827] border border-[#23334E] rounded-2xl space-y-1">
          <div className="text-xs text-gray-400 font-medium">Active Live Matches</div>
          <div className="text-2xl font-black font-mono text-[#EF4444]">
            {matches.filter((m) => m.status === "LIVE").length} In-Play
          </div>
          <div className="text-[10px] text-gray-500">Live score feed connected</div>
        </div>
      </div>

      {/* Sportsbook Match Controller & Settlement */}
      <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#23334E]/60 pb-3">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-sm font-bold text-white">Live Sportsbook Match Controller & Settlement Engine</h2>
          </div>
        </div>

        <div className="space-y-3">
          {matches.map((m) => (
            <div
              key={m.id}
              className="p-4 bg-[#0B0F1A] border border-[#23334E] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">
                    {m.homeTeam} ({m.homeScore}) vs {m.awayTeam} ({m.awayScore})
                  </span>
                  <span className="px-2 py-0.5 bg-[#EF4444]/20 text-[#EF4444] rounded text-[10px] font-bold">
                    {m.status} {m.liveMinute}
                  </span>
                </div>
                <div className="text-[11px] text-gray-400">{m.tournament} • {m.venue}</div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedMatch(m);
                    setHomeScoreInput(m.homeScore);
                    setAwayScoreInput(m.awayScore);
                    setLiveMinuteInput(m.liveMinute || "");
                    setLiveSummaryInput(m.liveSummary || "");
                  }}
                  className="px-3 py-1.5 bg-[#151F32] hover:bg-[#1C273D] border border-[#23334E] text-white font-bold rounded-lg transition"
                >
                  Edit Live Score
                </button>

                {/* Settle Main Outcome Buttons */}
                {m.markets[0]?.outcomes.map((out: any) => (
                  <button
                    key={out.id}
                    onClick={() => handleSettleOutcome(m.id, out.id)}
                    className={`px-2.5 py-1.5 rounded-lg font-bold border transition text-[11px] ${
                      out.isWinner
                        ? "bg-[#10B981] text-white border-[#10B981]"
                        : "bg-[#151F32] border-[#23334E] text-gray-300 hover:border-[#10B981]"
                    }`}
                  >
                    {out.isWinner ? "✓ " : "Settle: "} {out.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Management & Balance Editor */}
      <div className="bg-[#111827] border border-[#23334E] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#23334E]/60 pb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#10B981]" />
            <h2 className="text-sm font-bold text-white">Player Balances & Wallet Management</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-gray-400 uppercase bg-[#0B0F1A] border-b border-[#23334E]">
              <tr>
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Cash Balance</th>
                <th className="py-3 px-4">Bonus</th>
                <th className="py-3 px-4 text-right">Quick Balance Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23334E]/40">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-[#151F32]/50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-[10px] text-gray-400">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#10B981]">
                    ৳{u.balance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#D4AF37]">
                    ৳{u.bonusBalance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleAdjustBalance(u.id, 10000)}
                      className="px-2.5 py-1 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] font-bold rounded border border-[#10B981]/40 transition"
                    >
                      +৳10,000
                    </button>
                    <button
                      onClick={() => handleAdjustBalance(u.id, -5000)}
                      className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold rounded border border-red-500/40 transition"
                    >
                      -৳5,000
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Match Score Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-[#23334E] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              Update Live Score: {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">{selectedMatch.homeTeam} Score</label>
                <input
                  type="text"
                  value={homeScoreInput}
                  onChange={(e) => setHomeScoreInput(e.target.value)}
                  className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">{selectedMatch.awayTeam} Score</label>
                <input
                  type="text"
                  value={awayScoreInput}
                  onChange={(e) => setAwayScoreInput(e.target.value)}
                  className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="text-gray-400 block mb-1">Live Minute / Over</label>
              <input
                type="text"
                value={liveMinuteInput}
                onChange={(e) => setLiveMinuteInput(e.target.value)}
                placeholder="e.g. 74' or 18.2 Ov"
                className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="text-xs">
              <label className="text-gray-400 block mb-1">Live Summary / Commentary</label>
              <input
                type="text"
                value={liveSummaryInput}
                onChange={(e) => setLiveSummaryInput(e.target.value)}
                placeholder="e.g. Goal by Bellingham 58'"
                className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setSelectedMatch(null)}
                className="flex-1 py-2.5 bg-[#151F32] text-gray-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveScore}
                className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B0F1A] rounded-xl text-xs font-black shadow-gold"
              >
                Save & Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
