import { create } from "zustand";
import sound from "@/lib/sound";

export interface BetSelection {
  matchId: string;
  matchName: string;
  sport: "CRICKET" | "FOOTBALL" | string;
  tournament: string;
  marketId: string;
  marketName: string;
  outcomeId: string;
  outcomeName: string;
  odds: number;
  stake?: number;
}

interface BetSlipState {
  isOpen: boolean;
  activeTab: "SINGLE" | "ACCUMULATOR" | "MY_BETS";
  selections: BetSelection[];
  singleStakes: Record<string, number>;
  accumulatorStake: number;
  
  // Actions
  setIsOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: "SINGLE" | "ACCUMULATOR" | "MY_BETS") => void;
  toggleSelection: (selection: BetSelection) => void;
  addSelection: (selection: BetSelection) => void;
  removeSelection: (outcomeId: string) => void;
  clearAll: () => void;
  setSingleStake: (outcomeId: string, stake: number) => void;
  setAccumulatorStake: (stake: number) => void;
  
  // Computed helpers
  getTotalAccumulatorOdds: () => number;
  getComboBoostPercent: () => number;
}

export const useBetSlipStore = create<BetSlipState>((set, get) => ({
  isOpen: false,
  activeTab: "SINGLE",
  selections: [],
  singleStakes: {},
  accumulatorStake: 500,

  setIsOpen: (isOpen) => set({ isOpen }),
  
  setActiveTab: (activeTab) => set({ activeTab }),

  toggleSelection: (selection) => {
    const { selections, singleStakes } = get();
    const exists = selections.some((s) => s.outcomeId === selection.outcomeId);

    if (exists) {
      const nextSelections = selections.filter((s) => s.outcomeId !== selection.outcomeId);
      const nextStakes = { ...singleStakes };
      delete nextStakes[selection.outcomeId];
      set({ selections: nextSelections, singleStakes: nextStakes });
      sound.playChipClick();
    } else {
      // Remove any other selection from the same market if present
      const filtered = selections.filter((s) => s.marketId !== selection.marketId);
      const nextSelections = [...filtered, selection];
      const nextStakes = { ...singleStakes, [selection.outcomeId]: 500 };
      set({
        selections: nextSelections,
        singleStakes: nextStakes,
        isOpen: true,
      });
      sound.playChipClick();
    }
  },

  addSelection: (selection) => {
    const { selections, singleStakes } = get();
    const filtered = selections.filter((s) => s.outcomeId !== selection.outcomeId && s.marketId !== selection.marketId);
    set({
      selections: [...filtered, selection],
      singleStakes: { ...singleStakes, [selection.outcomeId]: 500 },
      isOpen: true,
    });
    sound.playChipClick();
  },

  removeSelection: (outcomeId) => {
    const { selections, singleStakes } = get();
    const nextSelections = selections.filter((s) => s.outcomeId !== outcomeId);
    const nextStakes = { ...singleStakes };
    delete nextStakes[outcomeId];
    set({ selections: nextSelections, singleStakes: nextStakes });
    sound.playChipClick();
  },

  clearAll: () => {
    set({ selections: [], singleStakes: {} });
    sound.playChipClick();
  },

  setSingleStake: (outcomeId, stake) => {
    const { singleStakes } = get();
    set({
      singleStakes: {
        ...singleStakes,
        [outcomeId]: Math.max(10, stake),
      },
    });
  },

  setAccumulatorStake: (stake) => {
    set({ accumulatorStake: Math.max(10, stake) });
  },

  getTotalAccumulatorOdds: () => {
    const { selections } = get();
    if (selections.length === 0) return 1.0;
    const raw = selections.reduce((acc, curr) => acc * curr.odds, 1);
    return Math.round(raw * 100) / 100;
  },

  getComboBoostPercent: () => {
    const { selections } = get();
    const count = selections.length;
    if (count < 2) return 0;
    if (count === 2) return 5;
    if (count === 3) return 10;
    if (count === 4) return 15;
    return 20; // 5+ selections = 20% combo boost
  },
}));
