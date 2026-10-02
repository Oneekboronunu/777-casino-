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
}

interface UserStoreState {
  user: UserProfile | null;
  isLoading: boolean;
  isDepositModalOpen: boolean;
  isWithdrawModalOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "LOGIN" | "REGISTER";
  notification: { message: string; type: "SUCCESS" | "ERROR" | "INFO" } | null;

  // Actions
  setUser: (user: UserProfile | null) => void;
  updateBalance: (delta: number) => void;
  setExactBalance: (balance: number, bonusBalance?: number) => void;
  setIsDepositModalOpen: (open: boolean) => void;
  setIsWithdrawModalOpen: (open: boolean) => void;
  openAuthModal: (mode?: "LOGIN" | "REGISTER") => void;
  closeAuthModal: () => void;
  showNotification: (message: string, type?: "SUCCESS" | "ERROR" | "INFO") => void;
  clearNotification: () => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  user: null,
  isLoading: false,
  isDepositModalOpen: false,
  isWithdrawModalOpen: false,
  isAuthModalOpen: false,
  authModalMode: "LOGIN",
  notification: null,

  setUser: (user) => set({ user }),

  updateBalance: (delta) => {
    const { user } = get();
    if (user) {
      set({
        user: {
          ...user,
          balance: Math.max(0, user.balance + delta),
        },
      });
    }
  },

  setExactBalance: (balance, bonusBalance) => {
    const { user } = get();
    if (user) {
      set({
        user: {
          ...user,
          balance,
          bonusBalance: bonusBalance !== undefined ? bonusBalance : user.bonusBalance,
        },
      });
    }
  },

  setIsDepositModalOpen: (open) => set({ isDepositModalOpen: open }),
  setIsWithdrawModalOpen: (open) => set({ isWithdrawModalOpen: open }),

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
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          set({ user: data.user });
        }
      }
    } catch (e) {
      console.error("Failed to fetch current user", e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
