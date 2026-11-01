import { WheelSegment } from "./types";

/**
 * 12 Default Segments matching the attached reference design:
 * Alternating luxury Royal Purple, Crimson Red, Gold, and Silver/Slate.
 */
export const DEFAULT_SEGMENTS: WheelSegment[] = [
  {
    id: "seg-jackpot",
    label: "JACKPOT",
    rewardType: "BONUS",
    rewardValue: 2000,
    bgColor: "#D97706", // Sparkling Gold
    textColor: "#FEF3C7",
    probabilityWeight: 2, // 2% chance
    iconEmoji: "👑",
  },
  {
    id: "seg-zero",
    label: "ZERO",
    rewardType: "LOSE",
    rewardValue: 0,
    bgColor: "#475569", // Silver / Slate
    textColor: "#F1F5F9",
    probabilityWeight: 25, // 25% chance
    iconEmoji: "❌",
  },
  {
    id: "seg-200-a",
    label: "200",
    rewardType: "CASH",
    rewardValue: 200,
    bgColor: "#581C87", // Royal Purple
    textColor: "#FDE047",
    probabilityWeight: 8,
    iconEmoji: "💎",
  },
  {
    id: "seg-100-a",
    label: "100",
    rewardType: "CASH",
    rewardValue: 100,
    bgColor: "#991B1B", // Crimson Red
    textColor: "#FEF08A",
    probabilityWeight: 15,
    iconEmoji: "🔶",
  },
  {
    id: "seg-50-a",
    label: "50",
    rewardType: "CASH",
    rewardValue: 50,
    bgColor: "#6B21A8", // Purple
    textColor: "#FFFFFF",
    probabilityWeight: 12,
    iconEmoji: "🔷",
  },
  {
    id: "seg-20-a",
    label: "20",
    rewardType: "CASH",
    rewardValue: 20,
    bgColor: "#991B1B", // Crimson Red
    textColor: "#FFFFFF",
    probabilityWeight: 10,
    iconEmoji: "🔮",
  },
  {
    id: "seg-100-b",
    label: "100",
    rewardType: "CASH",
    rewardValue: 100,
    bgColor: "#581C87", // Royal Purple
    textColor: "#FDE047",
    probabilityWeight: 10,
    iconEmoji: "💎",
  },
  {
    id: "seg-20-b",
    label: "20",
    rewardType: "CASH",
    rewardValue: 20,
    bgColor: "#B91C1C", // Red
    textColor: "#FFFFFF",
    probabilityWeight: 6,
    iconEmoji: "🔶",
  },
  {
    id: "seg-50-b",
    label: "50",
    rewardType: "CASH",
    rewardValue: 50,
    bgColor: "#6B21A8", // Purple
    textColor: "#FFFFFF",
    probabilityWeight: 5,
    iconEmoji: "🔷",
  },
  {
    id: "seg-100-c",
    label: "100",
    rewardType: "CASH",
    rewardValue: 100,
    bgColor: "#991B1B", // Crimson Red
    textColor: "#FEF08A",
    probabilityWeight: 4,
    iconEmoji: "💎",
  },
  {
    id: "seg-200-b",
    label: "200",
    rewardType: "CASH",
    rewardValue: 200,
    bgColor: "#581C87", // Royal Purple
    textColor: "#FDE047",
    probabilityWeight: 2,
    iconEmoji: "🔮",
  },
  {
    id: "seg-500",
    label: "500",
    rewardType: "CASH",
    rewardValue: 500,
    bgColor: "#B45309", // Warm Gold
    textColor: "#FFFBEB",
    probabilityWeight: 1,
    iconEmoji: "⭐",
  },
];

/**
 * Calculate total weight sum of all segments
 */
export function calculateTotalProbability(segments: WheelSegment[]): number {
  return segments.reduce((sum, s) => sum + (Number(s.probabilityWeight) || 0), 0);
}

/**
 * Re-normalizes weights so their sum equals exactly 100%
 */
export function normalizeProbabilities(segments: WheelSegment[]): WheelSegment[] {
  const total = calculateTotalProbability(segments);
  if (total <= 0) return segments;

  let remaining = 100;
  return segments.map((seg, idx) => {
    if (idx === segments.length - 1) {
      return { ...seg, probabilityWeight: Math.max(1, remaining) };
    }
    const scaled = Math.round(((Number(seg.probabilityWeight) || 0) / total) * 100);
    remaining -= scaled;
    return { ...seg, probabilityWeight: scaled };
  });
}

/**
 * Weighted Random Distribution Algorithm (Controller / Backend Simulator)
 *
 * Checks if a Next Spin Override is set; otherwise samples based on exact
 * probabilities configured in the probability matrix.
 */
export function selectWinningSegment(
  segments: WheelSegment[],
  overrideSegmentId?: string | null
): { segment: WheelSegment; index: number; wasOverridden: boolean } {
  if (segments.length === 0) {
    throw new Error("No segments configured for wheel");
  }

  // 1. Check for Admin Manual Override
  if (overrideSegmentId) {
    const overrideIdx = segments.findIndex((s) => s.id === overrideSegmentId);
    if (overrideIdx !== -1) {
      return {
        segment: segments[overrideIdx],
        index: overrideIdx,
        wasOverridden: true,
      };
    }
  }

  // 2. Weighted Random Selection
  const totalWeight = calculateTotalProbability(segments);
  const randomValue = Math.random() * (totalWeight > 0 ? totalWeight : 1);

  let cumulativeWeight = 0;
  for (let i = 0; i < segments.length; i++) {
    cumulativeWeight += Number(segments[i].probabilityWeight) || 0;
    if (randomValue <= cumulativeWeight) {
      return {
        segment: segments[i],
        index: i,
        wasOverridden: false,
      };
    }
  }

  // Fallback to last segment if floating point edge
  return {
    segment: segments[segments.length - 1],
    index: segments.length - 1,
    wasOverridden: false,
  };
}

/**
 * Calculates the exact target rotation angle in degrees for the wheel to land
 * precisely on targetIndex under the top-center pointer (270 degrees in canvas space).
 *
 * @param targetIndex Index of the pre-calculated winning segment
 * @param totalSegments Total number of segments on the wheel
 * @param currentAngle Current rotation degree of the wheel
 * @param minRotations Minimum full 360-degree spins for realism (default: 5)
 * @param maxRotations Maximum full 360-degree spins (default: 8)
 */
export function calculateDestinationAngle(
  targetIndex: number,
  totalSegments: number,
  currentAngle: number,
  minRotations = 5,
  maxRotations = 8
): number {
  const arcDeg = 360 / totalSegments;

  // In Canvas coordinate system:
  // 0 deg is 3 o'clock (East).
  // 90 deg is 6 o'clock (South).
  // 180 deg is 9 o'clock (West).
  // 270 deg is 12 o'clock (North / Top Center Pointer).
  const pointerAngle = 270;

  // Center angle of the target segment on an unrotated wheel
  const targetCenterAngle = (targetIndex + 0.5) * arcDeg;

  // We want: (targetCenterAngle + rotation) % 360 = pointerAngle
  // Therefore: rotation = pointerAngle - targetCenterAngle (mod 360)
  const baseDelta = (pointerAngle - targetCenterAngle + 3600) % 360;

  // Normalized current angle in [0, 360)
  const currentNormalized = ((currentAngle % 360) + 360) % 360;

  // Forward degrees from current position to land on baseDelta
  let forwardDeg = (baseDelta - currentNormalized + 360) % 360;
  if (forwardDeg < 45) {
    forwardDeg += 360; // Ensure at least a decent turn before stops
  }

  // Full spins for momentum (5 to 8 full revolutions)
  const fullSpins =
    Math.floor(minRotations + Math.random() * (maxRotations - minRotations + 1)) * 360;

  // Subtle natural jitter inside the segment (within +/- 32% of segment arc)
  // Keeps it visibly centered inside the slice while never touching separator lines
  const maxJitter = arcDeg * 0.32;
  const jitter = (Math.random() * 2 - 1) * maxJitter;

  return currentAngle + fullSpins + forwardDeg + jitter;
}

/**
 * Quintic Ease-Out curve for authentic casino deceleration
 * Rapid initial spin that gradually and satisfyingly slows down
 */
export function easeOutCasino(t: number): number {
  return 1 - Math.pow(1 - t, 4.5);
}
