"use client";

import React, { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import BetSlipDrawer from "@/components/betslip/BetSlipDrawer";
import DepositModal from "@/components/wallet/DepositModal";
import WithdrawModal from "@/components/wallet/WithdrawModal";
import AuthModal from "@/components/auth/AuthModal";
import { useUserStore } from "@/lib/store/useUserStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { fetchUser, notification, clearNotification } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#0B0F1A]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 flex items-center space-x-2.5 bg-[#151F32] border border-[#23334E] px-4 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          {notification.type === "SUCCESS" ? (
            <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
          ) : notification.type === "ERROR" ? (
            <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
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
        <main className="flex-1 min-w-0 pb-16">{children}</main>
      </div>

      {/* Global Bet Slip */}
      <BetSlipDrawer />

      {/* Modals */}
      <DepositModal />
      <WithdrawModal />
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}
