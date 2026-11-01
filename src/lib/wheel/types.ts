export type RewardType = "CASH" | "BONUS" | "MULTIPLIER" | "LOSE";

export interface WheelSegment {
  id: string;
  label: string;
  rewardType: RewardType;
  rewardValue: number; // Coins or payout amount
  bgColor: string;
  textColor: string;
  probabilityWeight: number; // e.g. 15 for 15%
  iconEmoji: string; // Gemstone or icon e.g. 💎, 👑, ⭐, 🔶
}

export interface SpinHistoryItem {
  id: string;
  timestamp: number;
  segmentId: string;
  segmentLabel: string;
  rewardType: RewardType;
  rewardValue: number;
  betCost: number;
  netPayout: number;
  wasOverridden: boolean;
}

export interface WheelAdminConfig {
  segments: WheelSegment[];
  nextSpinOverrideSegmentId: string | null;
  spinCost: number;
  soundEnabled: boolean;
  history: SpinHistoryItem[];
}
