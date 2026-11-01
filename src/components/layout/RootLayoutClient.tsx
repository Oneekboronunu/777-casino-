"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import DepositModal from "@/components/wallet/DepositModal";
import WithdrawModal from "@/components/wallet/WithdrawModal";
import CoinStoreModal from "@/components/wallet/CoinStoreModal";
import AuthModal from "@/components/auth/AuthModal";
import { useUserStore } from "@/lib/store/useUserStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const rawPathname = usePathname();
  const pathname = rawPathname || "";

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

  // In bet777, sports and home routes provide their own full 3-column sportsbook layout
  const is3ColumnSportsRoute = pathname === "/" || pathname.startsWith("/sports");

  return (
    <div className="min-h-screen bg-[#090D12] text-[#E2E8F0] flex flex-col font-sans selection:bg-[#95D600] selection:text-black">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 flex items-center space-x-2.5 bg-[#141C26] border border-[#95D600]/40 px-4 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          {notification.type === "SUCCESS" ? (
            <CheckCircle2 className="w-5 h-5 text-[#95D600] shrink-0" />
          ) : notification.type === "ERROR" ? (
            <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-amber-400 shrink-0" />
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

      {/* Global bet777 Header */}
      <Header />

      {/* Main Body */}
      <div className="flex-1 flex w-full">
        {!is3ColumnSportsRoute && <Sidebar />}
        <main className="flex-1 min-w-0 pb-20 lg:pb-12">{children}</main>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileNav />

      {/* Footer */}
      <Footer />

      {/* Modals rendered safely only on client mount */}
      {mounted && (
        <>
          <DepositModal />
          <WithdrawModal />
          <CoinStoreModal />
          <AuthModal />
        </>
      )}
    </div>
  );
}
