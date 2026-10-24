'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled UI error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-darkbg text-slate-900 dark:text-white px-4">
      <div className="max-w-md w-full text-center p-8 bg-white dark:bg-darkbg-card rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2 className="font-headline font-bold text-xl text-slate-900 dark:text-white mb-2">
          একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          সার্ভারের সঙ্গে সংযোগে সাময়িক সমস্যা হয়েছে। পৃষ্ঠাটি পুনরায় লোড করতে নিচের বাটনে ক্লিক করুন।
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => { if (typeof window !== 'undefined') { window.location.reload(); } else { reset(); } }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-newspaper-navy text-white text-xs font-semibold hover:bg-newspaper-blue transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>আবার চেষ্টা করুন</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>প্রচ্ছদ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
