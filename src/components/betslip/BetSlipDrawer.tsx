"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
  Receipt,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useBetSlipStore } from "@/lib/store/useBetSlipStore";
import { useUserStore } from "@/lib/store/useUserStore";
import sound from "@/lib/sound";

const STAKE_PRESETS = [100, 500, 1000, 5000];

export default function BetSlipDrawer() {
  const {
    isOpen,
    setIsOpen,
    activeTab,
    setActiveTab,
    selections,
    singleStakes,
    accumulatorStake,
    removeSelection,
    clearAll,
    setSingleStake,
    setAccumulatorStake,
    getTotalAccumulatorOdds,
    getComboBoostPercent,
  } = useBetSlipStore();

  const { user, updateBalance, showNotification } = useUserStore();

  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myBets, setMyBets] = useState<any[]>([]);
  const [loadingMyBets, setLoadingMyBets] = useState(false);
  const [cashoutLoading, setCashoutLoading] = useState<string | null>(null);

  // Fetch My Bets when tab is active
  useEffect(() => {
    if (activeTab === "MY_BETS") {
      fetchMyBets();
    }
  }, [activeTab]);

  const fetchMyBets = async () => {
    setLoadingMyBets(true);
    try {
      const res = await fetch("/api/sports/user-bets");
      const data = await res.json();
      if (res.ok) {
        setMyBets(data.bets || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMyBets(false);
    }
  };

  const handleCashout = async (betId: string) => {
    setCashoutLoading(betId);
    try {
      const res = await fetch("/api/sports/cashout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ betId }),
      });

      const data = await res.json();
      if (res.ok) {
        sound.playWin();
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
        updateBalance(data.bet.returnAmount);
        showNotification(`Cashed out ৳${data.bet.returnAmount.toLocaleString()} successfully!`, "SUCCESS");
        fetchMyBets();
      } else {
        showNotification(data.error || "Cashout failed", "ERROR");
      }
    } catch {
      showNotification("Error processing cashout", "ERROR");
    } finally {
      setCashoutLoading(null);
    }
  };

  const handlePlaceBet = async () => {
    if (selections.length === 0) {
      showNotification("Please select at least one outcome to place a bet", "ERROR");
      return;
    }

    const isAccumulator = activeTab === "ACCUMULATOR" || selections.length > 1;
    let totalStake = 0;
    let totalOdds = 1.0;
    let potentialPayout = 0;

    if (isAccumulator) {
      totalStake = accumulatorStake;
      totalOdds = getTotalAccumulatorOdds();
      const boost = getComboBoostPercent();
      potentialPayout = totalStake * totalOdds * (1 + boost / 100);
    } else {
      const first = selections[0];
      totalStake = singleStakes[first.outcomeId] || 500;
      totalOdds = first.odds;
      potentialPayout = totalStake * totalOdds;
    }

    if (!user || user.balance < totalStake) {
      showNotification(`Insufficient balance (৳${user?.balance?.toLocaleString() || 0}). Please deposit.`, "ERROR");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sports/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: isAccumulator ? "ACCUMULATOR" : "SINGLE",
          selections,
          stake: totalStake,
          totalOdds,
          potentialPayout: Math.round(potentialPayout),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        sound.playBetPlaced();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
        updateBalance(-totalStake);
        showNotification(`Bet of ৳${totalStake.toLocaleString()} placed successfully! (Ticket #${data.bet.id.slice(-6)})`, "SUCCESS");
        clearAll();
        setActiveTab("MY_BETS");
      } else {
        showNotification(data.error || "Failed to place bet", "ERROR");
      }
    } catch {
      showNotification("Network error placing bet", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  const totalAccumulatorOdds = getTotalAccumulatorOdds();
  const comboBoost = getComboBoostPercent();
  const accumulatorPayout = Math.round(accumulatorStake * totalAccumulatorOdds * (1 + comboBoost / 100));

  if (!isOpen && selections.length === 0) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 w-full max-w-sm sm:max-w-[400px] bg-[#111827] border border-[#23334E] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isMinimized ? "h-14" : "max-h-[85vh] flex flex-col"
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0E1523] border-b border-[#23334E] cursor-pointer select-none">
        <div
          onClick={() => setIsMinimized(!isMinimized)}
          className="flex items-center space-x-2 flex-grow"
        >
          <Receipt className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm font-bold text-white tracking-wide">Bet Slip</span>
          {selections.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold bg-[#D4AF37] text-[#0B0F1A] rounded-full">
              {selections.length}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-400 hover:text-white rounded transition"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-400 hover:text-white rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Tabs */}
          <div className="grid grid-cols-3 p-1.5 bg-[#0B0F1A] border-b border-[#23334E] text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab("SINGLE");
                sound.playChipClick();
              }}
              className={`py-1.5 rounded-lg transition ${
                activeTab === "SINGLE"
                  ? "bg-[#151F32] text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Single ({selections.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("ACCUMULATOR");
                sound.playChipClick();
              }}
              className={`py-1.5 rounded-lg transition flex items-center justify-center space-x-1 ${
                activeTab === "ACCUMULATOR"
                  ? "bg-[#151F32] text-[#D4AF37] shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>Multi</span>
              {comboBoost > 0 && (
                <span className="text-[10px] px-1 bg-[#D4AF37] text-[#0B0F1A] rounded font-extrabold">
                  +{comboBoost}%
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("MY_BETS");
                sound.playChipClick();
              }}
              className={`py-1.5 rounded-lg transition ${
                activeTab === "MY_BETS"
                  ? "bg-[#151F32] text-[#10B981] shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              My Bets
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === "MY_BETS" ? (
              /* My Bets List */
              <div className="space-y-3">
                {loadingMyBets ? (
                  <div className="py-8 text-center text-xs text-gray-400">Loading your tickets...</div>
                ) : myBets.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-400 space-y-2">
                    <Receipt className="w-8 h-8 text-gray-600 mx-auto" />
                    <div>No active bets placed yet.</div>
                  </div>
                ) : (
                  myBets.map((bet) => (
                    <div
                      key={bet.id}
                      className="p-3 bg-[#0B0F1A] border border-[#23334E] rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-gray-400">#{bet.id.slice(-6)}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            bet.status === "WON"
                              ? "bg-[#10B981]/20 text-[#10B981]"
                              : bet.status === "CASHED_OUT"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {bet.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {bet.items.map((item: any) => (
                          <div key={item.id} className="text-xs">
                            <div className="font-bold text-white">{item.outcomeName}</div>
                            <div className="text-[11px] text-gray-400 flex justify-between">
                              <span>{item.matchName}</span>
                              <span className="text-[#D4AF37] font-mono">@{item.odds.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#23334E] flex items-center justify-between text-xs">
                        <div>
                          <div className="text-[10px] text-gray-400">Stake / Potential</div>
                          <div className="font-mono font-bold text-white">
                            ৳{bet.stake.toLocaleString()} → <span className="text-[#10B981]">৳{bet.potentialPayout.toLocaleString()}</span>
                          </div>
                        </div>

                        {bet.status === "PENDING" && (
                          <button
                            onClick={() => handleCashout(bet.id)}
                            disabled={cashoutLoading === bet.id}
                            className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B0F1A] text-xs font-bold rounded-lg transition shadow-sm disabled:opacity-50"
                          >
                            {cashoutLoading === bet.id ? (
                              "Cashing..."
                            ) : (
                              `Cash Out ৳${(bet.cashoutValue || Math.round(bet.stake * 0.9)).toLocaleString()}`
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : selections.length === 0 ? (
              /* Empty State */
              <div className="py-8 text-center text-xs text-gray-400 space-y-2">
                <Receipt className="w-8 h-8 text-gray-600 mx-auto" />
                <p>Your bet slip is empty.</p>
                <p className="text-[11px] text-gray-500">Click any odds on a cricket or football match to add a selection.</p>
              </div>
            ) : (
              /* Selections List */
              <>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pb-1">
                  <span>{selections.length} Selection(s)</span>
                  <button
                    onClick={clearAll}
                    className="flex items-center space-x-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                </div>

                {selections.map((sel) => {
                  const currentStake = singleStakes[sel.outcomeId] || 500;
                  return (
                    <div
                      key={sel.outcomeId}
                      className="p-3 bg-[#0B0F1A] border border-[#23334E] rounded-xl space-y-2 relative"
                    >
                      <button
                        onClick={() => removeSelection(sel.outcomeId)}
                        className="absolute right-2.5 top-2.5 text-gray-500 hover:text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div>
                        <div className="text-xs font-extrabold text-white pr-6">{sel.outcomeName}</div>
                        <div className="text-[11px] text-gray-400">{sel.marketName}</div>
                        <div className="text-[10px] text-gray-500">{sel.matchName}</div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-[#D4AF37] font-mono">
                          @{sel.odds.toFixed(2)}
                        </span>

                        {activeTab === "SINGLE" && (
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[11px] text-gray-400">Stake:</span>
                            <div className="relative w-24">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">৳</span>
                              <input
                                type="number"
                                min="10"
                                step="50"
                                value={currentStake}
                                onChange={(e) => setSingleStake(sel.outcomeId, Number(e.target.value))}
                                className="w-full bg-[#151F32] border border-[#23334E] rounded-lg pl-5 pr-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Accumulator / Multi-bet Settings */}
                {activeTab === "ACCUMULATOR" && (
                  <div className="p-3 bg-[#151F32] border border-[#23334E] rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">Total Combined Odds:</span>
                      <span className="text-sm font-bold text-[#D4AF37] font-mono">
                        {totalAccumulatorOdds.toFixed(2)}x
                      </span>
                    </div>

                    {comboBoost > 0 && (
                      <div className="flex items-center justify-between text-xs text-[#10B981] bg-[#10B981]/10 p-2 rounded-lg border border-[#10B981]/20">
                        <span className="flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Combo Parlay Boost</span>
                        </span>
                        <span className="font-bold">+{comboBoost}%</span>
                      </div>
                    )}

                    <div>
                      <div className="text-xs text-gray-400 mb-1">Accumulator Stake (BDT ৳)</div>
                      <div className="grid grid-cols-4 gap-1.5 mb-2">
                        {STAKE_PRESETS.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              setAccumulatorStake(p);
                              sound.playChipClick();
                            }}
                            className={`py-1 text-[11px] font-bold rounded border transition ${
                              accumulatorStake === p
                                ? "border-[#D4AF37] bg-[#D4AF37] text-[#0B0F1A]"
                                : "border-[#23334E] bg-[#0B0F1A] text-gray-300"
                            }`}
                          >
                            +{p}
                          </button>
                        ))}
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">৳</span>
                        <input
                          type="number"
                          min="10"
                          step="50"
                          value={accumulatorStake}
                          onChange={(e) => setAccumulatorStake(Number(e.target.value))}
                          className="w-full bg-[#0B0F1A] border border-[#23334E] rounded-lg pl-7 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#23334E] flex items-center justify-between">
                      <span className="text-xs text-gray-300 font-semibold">Potential Payout:</span>
                      <span className="text-base font-extrabold text-[#10B981] font-mono">
                        ৳{accumulatorPayout.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Action */}
          {activeTab !== "MY_BETS" && selections.length > 0 && (
            <div className="p-4 bg-[#0E1523] border-t border-[#23334E] space-y-2">
              <button
                onClick={handlePlaceBet}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] text-[#0B0F1A] font-extrabold text-sm rounded-xl transition shadow-gold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Placing Ticket...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-[#0B0F1A]" />
                    <span>
                      Place Bet (৳
                      {activeTab === "ACCUMULATOR"
                        ? accumulatorStake.toLocaleString()
                        : Object.values(singleStakes).reduce((a, b) => a + b, 0).toLocaleString()}
                      )
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
