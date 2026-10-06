'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { language, t, getCartCount, toggleCart } = useStore();
  const cartCount = getCartCount();
  const isBn = language === 'bn';

  const navItems = [
    { href: '/', icon: Home, label: t.common.home },
    { href: '/shop', icon: Grid, label: t.common.categories },
    { href: '/track-order', icon: Truck, label: isBn ? 'ট্র্যাক' : 'Track' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-1.5 px-4 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart Toggle Button */}
        <button
          type="button"
          onClick={toggleCart}
          className="flex flex-col items-center gap-1 py-1 px-3 text-slate-500 hover:text-slate-900 relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium leading-none">{t.common.cart}</span>
        </button>
      </div>
    </div>
  );
}
