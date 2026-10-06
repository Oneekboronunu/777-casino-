'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  useEffect(() => {
    // Log client error safely
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6 bg-slate-50/50">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-subtle">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs uppercase font-bold tracking-widest text-rose-600">
          SOMETHING WENT WRONG
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isBn ? 'কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Something went wrong. Please try again.'}
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          {isBn
            ? 'সাময়িক ত্রুটির জন্য দুঃখিত। পুনরায় পেজ রিফ্রেশ করুন অথবা হোমে ফিরে যান।'
            : 'We apologize for the inconvenience. Please try reloading the page or return home.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isBn ? 'পুনরায় চেষ্টা করুন' : 'Try Again'}</span>
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4 text-brand-600" />
          <span>{t.common.home}</span>
        </Link>
      </div>
    </div>
  );
}
