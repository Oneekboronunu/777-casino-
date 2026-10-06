'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Search } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

export default function NotFound() {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6 bg-slate-50/50">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shadow-subtle">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs uppercase font-bold tracking-widest text-brand-700">
          404 — PAGE NOT FOUND
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isBn ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি' : 'This page could not be found'}
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          {isBn
            ? 'আপনি যে পৃষ্ঠা বা পণ্যটি খুঁজছেন তা হয়তো সরানো হয়েছে বা লিংকটি সঠিক নয়।'
            : 'The page or product you are looking for might have moved or the URL is incorrect.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.home}</span>
        </Link>
        <Link
          href="/shop"
          className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Search className="w-4 h-4 text-brand-600" />
          <span>{t.common.products}</span>
        </Link>
      </div>
    </div>
  );
}
