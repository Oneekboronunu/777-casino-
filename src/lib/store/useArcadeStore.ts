import { create } from "zustand";
import { ArcadeGame, ARCADE_GAMES } from "@/data/arcadeGames";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface ArcadeStoreState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  activeDemoGame: ArcadeGame | null;
  setActiveDemoGame: (game: ArcadeGame | null) => void;

  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  isFreePlayModalOpen: boolean;
  setIsFreePlayModalOpen: (open: boolean) => void;

  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;

  // FreePlay Points
  freePlayPoints: number;
  addFreePlayPoints: (amount: number) => void;
  deductFreePlayPoints: (amount: number) => boolean;
  resetFreePlayPoints: () => void;

  // In-app arcade notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const STORAGE_POINTS_KEY = "777_arcade_freeplay_points_v1";

const getInitialPoints = (): number => {
  if (typeof window === "undefined") return 10000;
  try {
    const saved = localStorage.getItem(STORAGE_POINTS_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  } catch (e) {
    console.warn("Could not read stored points", e);
  }
  return 10000;
};

export const useArcadeStore = create<ArcadeStoreState>((set, get) => ({
  searchQuery: "",
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  activeDemoGame: null,
  setActiveDemoGame: (game: ArcadeGame | null) => set({ activeDemoGame: game }),

  isNotificationsOpen: false,
  setIsNotificationsOpen: (open: boolean) => set({ isNotificationsOpen: open }),

  isFreePlayModalOpen: false,
  setIsFreePlayModalOpen: (open: boolean) => set({ isFreePlayModalOpen: open }),

  isHelpModalOpen: false,
  setIsHelpModalOpen: (open: boolean) => set({ isHelpModalOpen: open }),

  freePlayPoints: getInitialPoints(),

  addFreePlayPoints: (amount: number) => {
    set((state) => {
      const newPoints = state.freePlayPoints + amount;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_POINTS_KEY, newPoints.toString());
        } catch (e) {}
      }
      return { freePlayPoints: newPoints };
    });
  },

  deductFreePlayPoints: (amount: number) => {
    const current = get().freePlayPoints;
    if (current < amount) return false;
    const newPoints = current - amount;
    set({ freePlayPoints: newPoints });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_POINTS_KEY, newPoints.toString());
      } catch (e) {}
    }
    return true;
  },

  resetFreePlayPoints: () => {
    const newPoints = 10000;
    set({ freePlayPoints: newPoints });
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_POINTS_KEY, newPoints.toString());
      } catch (e) {}
    }
  },

  notifications: [
    {
      id: "notif-1",
      title: "Welcome to 777 Retro Arcade!",
      message: "Enjoy 10,000 FreePlay virtual points. No real money required, 100% free entertainment.",
      time: "Just now",
      read: false,
    },
    {
      id: "notif-2",
      title: "Daily Arcade Drop Available",
      message: "Claim +1,000 FreePlay points every 24 hours to keep spinning!",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "notif-3",
      title: "New Game: Gates of Olympus",
      message: "Zeus cascade multipliers up to 500x are now live in the arcade catalog.",
      time: "Today",
      read: true,
    },
  ],

  markNotificationAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  clearNotifications: () => set({ notifications: [] }),
}));
