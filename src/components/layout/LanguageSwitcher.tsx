'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useStore();

  return (
    <div className={`inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
          language === 'bn'
            ? 'bg-white text-brand-700 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-label="Switch to Bengali"
      >
        <span>বাংলা</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
          language === 'en'
            ? 'bg-white text-brand-700 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-label="Switch to English"
      >
        <span>EN</span>
      </button>
    </div>
  );
}
