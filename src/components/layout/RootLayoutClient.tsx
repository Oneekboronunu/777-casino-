"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import RetroSidebar from "./RetroSidebar";
import RetroHeader from "./RetroHeader";
import RetroFooter from "./RetroFooter";
import CookieConsentModal from "@/components/arcade/CookieConsentModal";
import GameDemoModal from "@/components/arcade/GameDemoModal";
import NotificationsModal from "@/components/arcade/NotificationsModal";
import FreePlayModal from "@/components/arcade/FreePlayModal";
import HelpModal from "@/components/arcade/HelpModal";
import AuthModal from "@/components/auth/AuthModal";
import { useUserStore } from "@/lib/store/useUserStore";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const rawPathname = usePathname();
  const pathname = rawPathname || "";

  const notification = useUserStore((state) => state.notification);
  const clearNotification = useUserStore((state) => state.clearNotification);

  const { activeDemoGame, setActiveDemoGame } = useArcadeStore();

  useEffect(() => {
    setMounted(true);
    try {
      useUserStore.getState().fetchUser().catch(() => {});
    } catch (err) {
      console.warn("fetchUser mount error:", err);
    }
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#C4E4CB] text-[#40243B] flex font-sans selection:bg-[#FFE58B] selection:text-[#40243B] relative overflow-x-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 flex items-center space-x-2.5 bg-[#FFF6D4] border-2 border-[#EADBBE] px-4 py-3 rounded-2xl shadow-2xl text-[#40243B] animate-in fade-in slide-in-from-top-4 duration-200">
          {notification.type === "SUCCESS" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : notification.type === "ERROR" ? (
            <AlertCircle className="w-5 h-5 text-[#C33355] shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-amber-500 shrink-0" />
          )}
          <span className="text-xs font-bold text-[#40243B] pr-2">{notification.message}</span>
          <button
            onClick={clearNotification}
            className="text-gray-500 hover:text-[#C33355] p-0.5 rounded transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. FIXED DESKTOP LEFT SIDEBAR (178px wide, mint green #91D2BC) */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-none z-40">
        <RetroSidebar />
      </div>

      {/* 2. MOBILE DRAWER SIDEBAR */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative w-[210px] max-w-[80vw] h-full shadow-2xl z-10 overflow-y-auto">
            <RetroSidebar onCloseMobileNav={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. MAIN COLUMN (Cream Header + Soft Mint Content + Retro Footer) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Cream Header */}
        <RetroHeader onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0 bg-[#C4E4CB] pb-12">
          {children}
        </main>

        {/* Retro Pastel Footer */}
        <RetroFooter />
      </div>

      {/* Global Interactive Arcade Modals */}
      {mounted && (
        <>
          <CookieConsentModal />
          <GameDemoModal game={activeDemoGame} onClose={() => setActiveDemoGame(null)} />
          <NotificationsModal />
          <FreePlayModal />
          <HelpModal />
          <AuthModal />
        </>
      )}
    </div>
  );
}
