'use client';

import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '@/components/ecommerce/CartDrawer';
import QuickViewModal from '@/components/ecommerce/QuickViewModal';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import ToastNotification from '@/components/common/ToastNotification';
import MobileBottomNav from './MobileBottomNav';
import { useStore } from '@/lib/store/useStore';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { language } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col bg-white text-slate-900 pb-16 md:pb-0 ${language === 'bn' ? 'lang-bn' : ''}`}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />

      {/* Global Client Portals / Overlays */}
      {mounted && (
        <>
          <CartDrawer />
          <QuickViewModal />
          <WhatsAppButton />
          <ToastNotification />
          <MobileBottomNav />
        </>
      )}
    </div>
  );
}
