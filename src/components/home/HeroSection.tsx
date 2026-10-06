'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Building2, Truck, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

interface HeroSectionProps {
  onOpenQuoteModal?: () => void;
}

export default function HeroSection({ onOpenQuoteModal }: HeroSectionProps) {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-white py-12 md:py-18 overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {t.hero.title}
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/shop"
                className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
              >
                <span>{t.hero.shopBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/offers"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-sm font-semibold rounded-xl transition-colors shadow-xs"
              >
                <span>{t.common.offers} 🔥</span>
              </Link>

              {onOpenQuoteModal && (
                <button
                  type="button"
                  onClick={onOpenQuoteModal}
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-brand-700" />
                  <span>{t.hero.corporateInquiry}</span>
                </button>
              )}
            </div>

            {/* Key Trust Stats Row */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-extrabold text-brand-700">
                  {t.hero.stat1Title}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {t.hero.stat1Desc}
                </div>
              </div>

              <div className="text-center lg:text-left border-x border-slate-200 px-3">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {t.hero.stat2Title}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {t.hero.stat2Desc}
                </div>
              </div>

              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {t.hero.stat3Title}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {t.hero.stat3Desc}
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Image & Highlight Feature */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Product Hero Showcase Card */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-elevated bg-white p-3">
                <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=1000&auto=format&fit=crop&q=80"
                    alt="Carnival Mart Cleaning Solutions"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  
                  {/* Floating Promo Tag */}
                  <div className="absolute bottom-3 left-3 right-3 text-white p-2.5 rounded-lg backdrop-blur-md bg-slate-900/40 border border-white/20 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold">
                        {isBn ? '৫ লিটার কমার্শিয়াল প্যাক' : '5L Commercial Value Packs'}
                      </div>
                      <div className="text-[10px] text-slate-200">
                        {isBn ? 'হাসপাতাল, অফিস ও গৃহস্থালীর জন্য সাশ্রয়ী' : 'Save up to 30% on bulk supplies'}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-300">
                      {isBn ? '৳৬৫০ থেকে' : 'From ৳650'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">
                    {isBn ? 'বিএসটিআই মানসম্মত' : 'Certified Standards'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isBn ? '১০০% নিরাপদ ও কার্যকর' : '100% Safe & Effective'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
