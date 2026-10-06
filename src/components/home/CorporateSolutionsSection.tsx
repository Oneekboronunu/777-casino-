'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Hospital,
  UtensilsCrossed,
  Hotel,
  School,
  Factory,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

interface CorporateSolutionsSectionProps {
  onOpenQuoteModal: () => void;
}

export default function CorporateSolutionsSection({
  onOpenQuoteModal,
}: CorporateSolutionsSectionProps) {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  const sectors = [
    {
      icon: Hospital,
      title_en: 'Hospitals & Clinics',
      title_bn: 'হাসপাতাল ও ক্লিনিক',
      desc_en: 'Clinical grade surface disinfectants & hand antiseptics.',
      desc_bn: 'মেডিকেল গ্রেড সারফেস জীবাণুনাশক ও হ্যান্ড স্যানিটাইজার।',
    },
    {
      icon: UtensilsCrossed,
      title_en: 'Restaurants & Cafes',
      title_bn: 'রেস্তোরাঁ ও কিচেন',
      desc_en: 'Heavy grease-cutting dishwash liquids & kitchen hygiene.',
      desc_bn: 'ঘন ডিশওয়াশ লিকুইড ও কিচেন সারফেস ক্লিনার।',
    },
    {
      icon: Hotel,
      title_en: 'Hotels & Resorts',
      title_bn: 'হোটেল ও রিসোর্ট',
      desc_en: 'Housekeeping floor cleaners, room fragrances & linen detergent.',
      desc_bn: 'হাউসকিপিং ক্লিনার, দীর্ঘস্থায়ী সুবাস ও লন্ড্রি ডিটারজেন্ট।',
    },
    {
      icon: Building2,
      title_en: 'Corporate Offices',
      title_bn: 'কর্পোরেট অফিস',
      desc_en: 'Restroom supplies, automatic air fresheners & touchless refills.',
      desc_bn: 'ওয়াশরুম সাপ্লাই, অটোমেটিক এয়ার ফ্রেশনার ও লিকুইড সোপ।',
    },
    {
      icon: School,
      title_en: 'Schools & Universities',
      title_bn: 'স্কুল ও বিশ্ববিদ্যালয়',
      desc_en: 'Safe, non-toxic sanitizers & classroom cleaning solutions.',
      desc_bn: 'নিরাপদ হ্যান্ডওয়াশ ও ক্যাম্পাস পরিচ্ছন্নতা সামগ্রী।',
    },
    {
      icon: Factory,
      title_en: 'Factories & Industrial',
      title_bn: 'গার্মেন্টস ও ফ্যাক্টরি',
      desc_en: 'Bulk 20L canisters, industrial degreasers & floor care.',
      desc_bn: '২০ লিটার বাল্ক জার, হেভি ডিউটি লন্ড্রি ও ক্লিনার।',
    },
  ];

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/80 border border-brand-700 text-brand-300 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-brand-400" />
              <span>{t.corporate.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t.corporate.headline}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {t.corporate.description}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t.corporate.formTitle}</span>
            </button>

            <Link
              href="/corporate"
              className="w-full py-3.5 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors text-center"
            >
              <span>{isBn ? 'কর্পোরেট পোর্টাল দেখুন' : 'View Corporate Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 6 Industry Sectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectors.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-5 transition-all flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-900/60 text-brand-400 border border-brand-700/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                    {isBn ? sec.title_bn : sec.title_en}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {isBn ? sec.desc_bn : sec.desc_en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate Benefits Strip */}
        <div className="mt-10 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
            <span>{t.corporate.benefit1}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
            <span>{t.corporate.benefit2}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
            <span>{t.corporate.benefit3}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
            <span>{t.corporate.benefit4}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
