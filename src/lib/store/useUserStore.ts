import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "USER" | "VIP" | "ADMIN";
  balance: number;
  bonusBalance: number;
  currency: string;
  referralCode?: string | null;
  couponCode?: string | null;
  // Coins & Decorations System
  coins: number;
  equippedFrame: string;
  equippedGameSkin: string;
  inventory: string[];
  lastDailyClaim?: string | null;
}

interface UserStoreState {
  user: UserProfile | null;
  isLoading: boolean;
  isDepositModalOpen: boolean;
  isWithdrawModalOpen: boolean;
  isCoinStoreOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "LOGIN" | "REGISTER";
  notification: { message: string; type: "SUCCESS" | "ERROR" | "INFO" } | null;

  // Actions
  setUser: (user: UserProfile | null) => void;
  updateBalance: (delta: number, bonusDelta?: number) => void;
  setExactBalance: (balance: number, bonusBalance?: number) => void;
  setIsDepositModalOpen: (open: boolean) => void;
  setIsWithdrawModalOpen: (open: boolean) => void;
  setIsCoinStoreOpen: (open: boolean) => void;
  openAuthModal: (mode?: "LOGIN" | "REGISTER") => void;
  closeAuthModal: () => void;
  showNotification: (message: string, type?: "SUCCESS" | "ERROR" | "INFO") => void;
  clearNotification: () => void;
  fetchUser: () => Promise<void>;

  // Currency & Decoration Actions
  addCoins: (amount: number, reason?: string) => void;
  spendCoins: (amount: number, itemId: string) => boolean;
  equipFrame: (frameId: string) => void;
  equipGameSkin: (skinId: string) => void;
  claimDailyCoins: () => { success: boolean; amount: number; message: string };
}

const STORAGE_KEY = "777_casino_active_user_v3";

const loadSavedProfileData = (): Partial<UserProfile> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load saved profile data", e);
  }
  return {};
};

const saveProfileData = (data: Partial<UserProfile>) => {
  if (typeof window === "undefined") return;
  try {
    const existing = loadSavedProfileData();
    const updated = { ...existing, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save profile data", e);
  }
};

const clearSavedProfile = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear profile", e);
  }
};

export const useUserStore = create<UserStoreState>((set, get) => ({
  user: null,
  isLoading: false,
  isDepositModalOpen: false,
  isWithdrawModalOpen: false,
  isCoinStoreOpen: false,
  isAuthModalOpen: false,
  authModalMode: "LOGIN",
  notification: null,

  setUser: (user) => {
    if (!user) {
      clearSavedProfile();
      set({ user: null });
      return;
    }
    const saved = loadSavedProfileData();
    const mergedUser: UserProfile = {
      ...user,
      id: user.id || saved.id || `usr_${Date.now()}`,
      name: user.name || saved.name || "Player",
      phone: user.phone || saved.phone || null,
      email: user.email || saved.email || "player@777casino.com",
      role: user.role || saved.role || "USER",
      balance: saved.balance !== undefined ? saved.balance : (user.balance ?? 2000),
      bonusBalance: saved.bonusBalance !== undefined ? saved.bonusBalance : (user.bonusBalance ?? 2000),
      coins: saved.coins !== undefined ? saved.coins : (user.coins ?? 1500),
      equippedFrame: saved.equippedFrame || user.equippedFrame || "frame-classic",
      equippedGameSkin: saved.equippedGameSkin || user.equippedGameSkin || "skin-felt-green",
      inventory: saved.inventory || user.inventory || ["frame-classic", "skin-felt-green"],
      lastDailyClaim: saved.lastDailyClaim !== undefined ? saved.lastDailyClaim : (user.lastDailyClaim ?? null),
    };

    saveProfileData(mergedUser);
    set({ user: mergedUser });
  },

  updateBalance: (delta, bonusDelta = 0) => {
    const { user } = get();
    if (user) {
      const nextBalance = Math.max(0, user.balance + delta);
      const nextBonus = Math.max(0, (user.bonusBalance ?? 0) + bonusDelta);
      const updated = {
        ...user,
        balance: nextBalance,
        bonusBalance: nextBonus,
      };
      set({ user: updated });
      saveProfileData({ balance: nextBalance, bonusBalance: nextBonus });
    }
  },

  setExactBalance: (balance, bonusBalance) => {
    const { user } = get();
    if (user) {
      const nextBonus = bonusBalance !== undefined ? bonusBalance : user.bonusBalance;
      const updated = {
        ...user,
        balance,
        bonusBalance: nextBonus,
      };
      set({ user: updated });
      saveProfileData({ balance, bonusBalance: nextBonus });
    }
  },

  setIsDepositModalOpen: (open) => set({ isDepositModalOpen: open }),
  setIsWithdrawModalOpen: (open) => set({ isWithdrawModalOpen: open }),
  setIsCoinStoreOpen: (open) => set({ isCoinStoreOpen: open }),

  openAuthModal: (mode = "LOGIN") => set({ isAuthModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  showNotification: (message, type = "INFO") => {
    set({ notification: { message, type } });
    setTimeout(() => {
      const current = get().notification;
      if (current?.message === message) {
        set({ notification: null });
      }
    }, 4500);
  },

  clearNotification: () => set({ notification: null }),

  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const saved = loadSavedProfileData();

      // If user is already permanently saved in browser localStorage, set immediately!
      if (saved.id && saved.name) {
        set({
          user: {
            id: saved.id,
            name: saved.name,
            phone: saved.phone || null,
            email: saved.email || "player@777casino.com",
            role: (saved.role as any) || "USER",
            balance: saved.balance ?? 2000,
            bonusBalance: saved.bonusBalance ?? 2000,
            currency: "BDT",
            coins: saved.coins ?? 1500,
            equippedFrame: saved.equippedFrame || "frame-classic",
            equippedGameSkin: saved.equippedGameSkin || "skin-felt-green",
            inventory: saved.inventory || ["frame-classic", "skin-felt-green"],
            lastDailyClaim: saved.lastDailyClaim || null,
          },
        });
      }

      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          // If server returned demo user, but localStorage has our real user, preserve real user
          const isServerDemo = data.user.id === "demo_vip_user";
          const hasLocalCustomUser = saved.id && saved.id !== "demo_vip_user";

          const baseUser = hasLocalCustomUser && isServerDemo ? saved : data.user;

          const mergedUser: UserProfile = {
            ...baseUser,
            balance: saved.balance !== undefined ? saved.balance : baseUser.balance,
            bonusBalance: saved.bonusBalance !== undefined ? saved.bonusBalance : baseUser.bonusBalance,
            coins: saved.coins !== undefined ? saved.coins : (baseUser.coins ?? 1500),
            equippedFrame: saved.equippedFrame || baseUser.equippedFrame || "frame-classic",
            equippedGameSkin: saved.equippedGameSkin || baseUser.equippedGameSkin || "skin-felt-green",
            inventory: saved.inventory || baseUser.inventory || ["frame-classic", "skin-felt-green"],
            lastDailyClaim: saved.lastDailyClaim !== undefined ? saved.lastDailyClaim : (baseUser.lastDailyClaim ?? null),
          };

          saveProfileData(mergedUser);
          set({ user: mergedUser });
        }
      }
    } catch (e) {
      console.error("Failed to fetch current user", e);
    } finally {
      set({ isLoading: false });
    }
  },

  addCoins: (amount, reason) => {
    const { user, showNotification } = get();
    if (!user) return;
    const nextCoins = Math.max(0, (user.coins || 0) + amount);
    const updated = { ...user, coins: nextCoins };
    set({ user: updated });
    saveProfileData({ coins: nextCoins });
    if (reason) {
      showNotification(`+${amount.toLocaleString()} Coins added! (${reason})`, "SUCCESS");
    }
  },

  spendCoins: (amount, itemId) => {
    const { user, showNotification } = get();
    if (!user) {
      showNotification("Please sign in to buy items", "ERROR");
      return false;
    }
    const currentCoins = user.coins || 0;
    if (currentCoins < amount) {
      showNotification(`Insufficient Coins! Need ${amount.toLocaleString()} Coins.`, "ERROR");
      return false;
    }
    const nextCoins = currentCoins - amount;
    const nextInventory = Array.from(new Set([...(user.inventory || []), itemId]));
    const updated = {
      ...user,
      coins: nextCoins,
      inventory: nextInventory,
    };
    set({ user: updated });
    saveProfileData({ coins: nextCoins, inventory: nextInventory });
    showNotification(`Unlocked item successfully!`, "SUCCESS");
    return true;
  },

  equipFrame: (frameId) => {
    const { user, showNotification } = get();
    if (!user) return;
    const updated = { ...user, equippedFrame: frameId };
    set({ user: updated });
    saveProfileData({ equippedFrame: frameId });
    showNotification("Avatar frame updated!", "SUCCESS");
  },

  equipGameSkin: (skinId) => {
    const { user, showNotification } = get();
    if (!user) return;
    const updated = { ...user, equippedGameSkin: skinId };
    set({ user: updated });
    saveProfileData({ equippedGameSkin: skinId });
    showNotification("Game table decoration updated!", "SUCCESS");
  },

  claimDailyCoins: () => {
    const { user, showNotification } = get();
    if (!user) {
      return { success: false, amount: 0, message: "Please log in to claim daily coins." };
    }
    const now = Date.now();
    const lastClaim = user.lastDailyClaim ? new Date(user.lastDailyClaim).getTime() : 0;
    const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

    if (now - lastClaim < COOLDOWN_MS) {
      const remainingHours = Math.ceil((COOLDOWN_MS - (now - lastClaim)) / (1000 * 60 * 60));
      return {
        success: false,
        amount: 0,
        message: `Already claimed today! Next claim ready in ~${remainingHours} hours.`,
      };
    }

    const rewardAmount = 350; // 350 Free Lucky Coins
    const nextCoins = (user.coins || 0) + rewardAmount;
    const nowIso = new Date().toISOString();

    const updated = {
      ...user,
      coins: nextCoins,
      lastDailyClaim: nowIso,
    };
    set({ user: updated });
    saveProfileData({ coins: nextCoins, lastDailyClaim: nowIso });
    showNotification(`Claimed +${rewardAmount} Daily Free Coins! 🎉`, "SUCCESS");

    return {
      success: true,
      amount: rewardAmount,
      message: `You received ${rewardAmount} Free Coins!`,
    };
  },
}));
