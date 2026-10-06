'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Building,
  Tag,
  ChevronDown,
  MapPin,
  FileText,
  PhoneCall
} from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import AnnouncementBar from './AnnouncementBar';
import Logo from './Logo';
import SearchBar from './SearchBar';
import LanguageSwitcher from './LanguageSwitcher';
import { CATEGORIES } from '@/data/categories';

export default function Header() {
  const pathname = usePathname();
  const { language, t, getCartCount, wishlist, toggleCart } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;
  const isBn = language === 'bn';

  const navLinks = [
    { href: '/', label: t.common.home },
    { href: '/shop?category=cleaning-supplies', label: isBn ? 'ক্লিনিং সাপ্লাইজ' : 'Cleaning Supplies' },
    { href: '/shop?category=hygiene-personal-care', label: isBn ? 'হাইজিন ও পার্সোনাল' : 'Hygiene & Care' },
    { href: '/shop?category=household-accessories', label: isBn ? 'গৃহস্থালী' : 'Household' },
    { href: '/offers', label: t.common.offers, highlight: true },
    { href: '/corporate', label: t.common.corporate },
    { href: '/locations', label: t.common.locations },
    { href: '/track-order', label: t.common.orderTracking },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-subtle border-b border-slate-100">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-slate-700 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Logo />
          </div>

          {/* Central Intelligent Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-auto">
            <SearchBar />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 text-slate-700 hover:text-brand-600 rounded-lg hover:bg-slate-50 transition-colors hidden sm:flex items-center justify-center"
              aria-label={t.common.wishlist}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={toggleCart}
              className="relative flex items-center gap-2 px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 rounded-lg border border-brand-200 transition-all font-medium text-sm"
              aria-label={t.common.cart}
            >
              <ShoppingBag className="w-4 h-4 text-brand-700" />
              <span className="hidden sm:inline-block">{t.common.cart}</span>
              <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 lg:hidden">
          <SearchBar isMobileFull />
        </div>
      </div>

      {/* Secondary Desktop Navigation Bar */}
      <nav className="hidden lg:block bg-slate-50/80 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11">
            <div className="flex items-center gap-1">
              {/* All Categories Dropdown Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-md transition-colors mr-2"
                >
                  <Menu className="w-3.5 h-3.5" />
                  <span>{t.common.categories}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </button>

                {/* Categories Dropdown Menu */}
                {isCategoryDropdownOpen && (
                  <div
                    onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                    className="absolute left-0 top-full mt-1 w-72 bg-white rounded-xl shadow-elevated border border-slate-100 py-2 z-50 animate-fade-in"
                  >
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.slug}`}
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-brand-50 text-slate-700 hover:text-brand-700 transition-colors group"
                      >
                        <span className="text-xs font-medium">
                          {isBn ? cat.name_bn : cat.name_en}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 group-hover:bg-brand-100 group-hover:text-brand-700 px-1.5 py-0.5 rounded">
                          {cat.productCount}
                        </span>
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 my-1 pt-1">
                      <Link
                        href="/shop"
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-brand-600 hover:text-brand-700 text-center"
                      >
                        {isBn ? 'সকল ক্যাটাগরি ব্রাউজ করুন →' : 'Browse All Categories →'}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                      link.highlight
                        ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                        : isActive
                        ? 'text-brand-700 bg-brand-50 font-semibold'
                        : 'text-slate-700 hover:text-brand-600 hover:bg-white'
                    }`}
                  >
                    {link.highlight && <Tag className="w-3 h-3 text-amber-600" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Corporate Quote Quick Button */}
            <Link
              href="/corporate"
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 transition-colors"
            >
              <Building className="w-3.5 h-3.5" />
              <span>{t.common.quoteRequest}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t.common.categories}
              </div>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm text-slate-700 hover:text-brand-600"
                  >
                    <span>{isBn ? cat.name_bn : cat.name_en}</span>
                    <span className="text-xs text-slate-400">({cat.productCount})</span>
                  </Link>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {isBn ? 'মেনু' : 'Menu'}
              </div>
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium text-slate-800 hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{isBn ? 'ভাষা পরিবর্তন:' : 'Language:'}</span>
                <LanguageSwitcher />
              </div>
              <a
                href="tel:01404005680"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-600 text-white rounded-lg text-xs font-semibold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t.common.callUs}: 01404005680</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
