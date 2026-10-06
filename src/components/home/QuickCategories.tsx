'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Wind, Shirt, Home, Building2, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { useStore } from '@/lib/store/useStore';

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  ShieldCheck,
  Wind,
  Shirt,
  Home,
  Building2,
};

export default function QuickCategories() {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
              {isBn ? 'ক্যাটাগরি ব্রাউজ করুন' : 'Browse Categories'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {t.sections.quickCategories}
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>{t.common.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 6 Category Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Sparkles;
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200/80 hover:border-brand-500 hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white group-hover:bg-brand-50 border border-slate-200 group-hover:border-brand-200 flex items-center justify-center text-slate-700 group-hover:text-brand-700 transition-colors mb-3">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                    {isBn ? cat.name_bn : cat.name_en}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                    {isBn ? cat.description_bn : cat.description_en}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-brand-600 font-medium">
                  <span>
                    {isBn ? `${cat.productCount}টি পণ্য` : `${cat.productCount} Products`}
                  </span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
