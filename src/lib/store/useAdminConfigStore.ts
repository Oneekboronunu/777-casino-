import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GameRigSettings {
  // Global Casino Settings
  globalHouseEdgePercent: number; // e.g. 5% to 50%
  globalWorldwideTurnoverMultiplier: number; // For Worldwide display scaling
  worldwideBaseVolumeUSD: number; // e.g. $4,250,000
  worldwideActivePlayersCount: number; // e.g. 1,420

  // Aviator Settings
  aviatorMode: "FAIR" | "HOUSE_PROFIT" | "MEGA_WIN_EVENT" | "FORCE_NEXT_CRASH";
  aviatorHouseCrashUnder120Chance: number; // e.g. 15% to 80% instant crash
  aviatorForceNextMultiplier: number; // e.g. 1.05 or 100.0
  aviatorMaxMultiplierCap: number; // e.g. 100x or 1000x

  // Carrom Board Settings
  carromWinChance: number; // 0 to 100%
  carromQueenBonusRate: number; // 10% to 100%
  carromAimAssist: boolean; // True / False

  // European Roulette Settings
  rouletteMagnetMode: boolean; // Magnet ball away from player bets
  rouletteHouseAdvantageBias: number; // Bias towards non-player bets (0 to 100%)
  rouletteZeroFrequencyBoost: number; // Chance to land on 0 Green

  // Dice Settings
  diceHouseEdgeOffset: number; // -10% to +20%
  diceMaxConsecutiveWins: number; // Force loss after N consecutive wins

  // Coin Flip Settings
  coinFlipForceOutcome: "FAIR" | "FORCE_WIN" | "FORCE_LOSS";
  coinFlipMaxStreak: number; // Force loss after N streaks
  coinFlipHouseEdge: number; // 0 to 50%

  // Player Control Overrides
  playerTargetedUserEmail: string; // Specific targeted user
  playerTargetedOutcome: "NATURAL" | "ALWAYS_WIN" | "ALWAYS_LOSE" | "HIGH_ROLLER_BOOST";
}

interface AdminConfigState {
  settings: GameRigSettings;
  updateSettings: (newSettings: Partial<GameRigSettings>) => void;
  resetToDefaults: () => void;
}

const DEFAULT_SETTINGS: GameRigSettings = {
  globalHouseEdgePercent: 8,
  globalWorldwideTurnoverMultiplier: 1.0,
  worldwideBaseVolumeUSD: 4850250,
  worldwideActivePlayersCount: 1842,

  aviatorMode: "HOUSE_PROFIT",
  aviatorHouseCrashUnder120Chance: 25,
  aviatorForceNextMultiplier: 1.15,
  aviatorMaxMultiplierCap: 250,

  carromWinChance: 65,
  carromQueenBonusRate: 40,
  carromAimAssist: true,

  rouletteMagnetMode: true,
  rouletteHouseAdvantageBias: 35,
  rouletteZeroFrequencyBoost: 10,

  diceHouseEdgeOffset: 5,
  diceMaxConsecutiveWins: 3,

  coinFlipForceOutcome: "FAIR",
  coinFlipMaxStreak: 3,
  coinFlipHouseEdge: 8,

  playerTargetedUserEmail: "player@auracasino.com",
  playerTargetedOutcome: "NATURAL",
};

export const useAdminConfigStore = create<AdminConfigState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetToDefaults: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: "aura-777-admin-game-rig-config",
    }
  )
);
