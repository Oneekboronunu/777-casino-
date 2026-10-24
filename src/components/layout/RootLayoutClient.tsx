"use client";

import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import BetSlipDrawer from "@/components/betslip/BetSlipDrawer";
import DepositModal from "@/components/wallet/DepositModal";
import WithdrawModal from "@/components/wallet/WithdrawModal";
import CoinStoreModal from "@/components/wallet/CoinStoreModal";
import AuthModal from "@/components/auth/AuthModal";
import { useUserStore } from "@/lib/store/useUserStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const notification = useUserStore((state) => state.notification);
  const clearNotification = useUserStore((state) => state.clearNotification);

  useEffect(() => {
    setMounted(true);
    try {
      useUserStore.getState().fetchUser().catch(() => {});
    } catch (err) {
      console.warn("fetchUser mount error:", err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#120B10] text-[#F8F4EE] flex flex-col font-sans selection:bg-[#BA2649] selection:text-[#FFDE59]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 flex items-center space-x-2.5 bg-[#1C141B] border border-[#BA2649]/50 px-4 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          {notification.type === "SUCCESS" ? (
            <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
          ) : notification.type === "ERROR" ? (
            <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-[#FFDE59] flex-shrink-0" />
          )}
          <span className="text-xs font-semibold text-white pr-2">{notification.message}</span>
          <button
            onClick={clearNotification}
            className="text-gray-400 hover:text-white p-0.5 rounded transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Header */}
      <Header />

      {/* Main Body with Left Sidebar */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-20 lg:pb-16">{children}</main>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileNav />

      {/* Modals rendered safely only on client mount */}
      {mounted && (
        <>
          <BetSlipDrawer />
          <DepositModal />
          <WithdrawModal />
          <CoinStoreModal />
          <AuthModal />
        </>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
