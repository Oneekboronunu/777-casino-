'use client';

import React from 'react';
import { useStore } from '@/lib/store/useStore';
import { CheckCircle2 } from 'lucide-react';

export default function ToastNotification() {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in pointer-events-none">
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-elevated flex items-center gap-2.5 text-xs font-medium border border-slate-800 pointer-events-auto">
        <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
