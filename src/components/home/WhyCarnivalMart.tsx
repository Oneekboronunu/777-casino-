'use client';

import React from 'react';
import { ShieldCheck, TrendingDown, Truck, Headphones, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

export default function WhyCarnivalMart() {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  const trustPillars = [
    {
      icon: ShieldCheck,
      title: t.trust.item1Title,
      desc: t.trust.item1Desc,
    },
    {
      icon: TrendingDown,
      title: t.trust.item2Title,
      desc: t.trust.item2Desc,
    },
    {
      icon: Truck,
      title: t.trust.item3Title,
      desc: t.trust.item3Desc,
    },
    {
      icon: Headphones,
      title: t.trust.item4Title,
      desc: t.trust.item4Desc,
    },
  ];

  return (
    <section className="py-14 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
            {isBn ? 'আমাদের অঙ্গীকার' : 'Our Commitment'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t.sections.whyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            {t.sections.whySub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
