import { DEFAULT_SEGMENTS } from "./engine";
import { SpinHistoryItem, WheelAdminConfig } from "./types";

const STORAGE_KEY = "777_CASINO_SPIN_WHEEL_CONFIG_V1";

export function getDefaultWheelConfig(): WheelAdminConfig {
  return {
    segments: DEFAULT_SEGMENTS,
    nextSpinOverrideSegmentId: null,
    spinCost: 100,
    soundEnabled: true,
    history: [],
  };
}

export function getWheelConfig(): WheelAdminConfig {
  if (typeof window === "undefined") {
    return getDefaultWheelConfig();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const def = getDefaultWheelConfig();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
      return def;
    }
    const parsed = JSON.parse(raw) as WheelAdminConfig;
    if (!parsed.segments || parsed.segments.length === 0) {
      parsed.segments = DEFAULT_SEGMENTS;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading wheel config from localStorage:", err);
    return getDefaultWheelConfig();
  }
}

export function saveWheelConfig(config: WheelAdminConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error("Error saving wheel config:", err);
  }
}

export function recordSpin(item: SpinHistoryItem): WheelAdminConfig {
  const config = getWheelConfig();
  // Keep last 100 history items
  config.history = [item, ...(config.history || [])].slice(0, 100);

  // If this spin consumed an override, reset it
  if (config.nextSpinOverrideSegmentId) {
    config.nextSpinOverrideSegmentId = null;
  }

  saveWheelConfig(config);
  return config;
}

export function setNextSpinOverride(segmentId: string | null): WheelAdminConfig {
  const config = getWheelConfig();
  config.nextSpinOverrideSegmentId = segmentId;
  saveWheelConfig(config);
  return config;
}

export function clearWheelHistory(): WheelAdminConfig {
  const config = getWheelConfig();
  config.history = [];
  saveWheelConfig(config);
  return config;
}

export function resetWheelConfigToDefaults(): WheelAdminConfig {
  const def = getDefaultWheelConfig();
  saveWheelConfig(def);
  return def;
}
