'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Building2, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

export default function AboutUsPage() {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-900/60 border border-brand-700/60 px-3 py-1 rounded-full">
            {isBn ? 'কার্নিভাল মার্ট সম্পর্কে' : 'About Carnival Mart'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {isBn ? 'পরিচ্ছন্নতা ও স্বাস্থ্য সুরক্ষায় বাংলাদেশের বিশ্বস্ত নাম' : 'Pioneering Commercial & Household Hygiene in Bangladesh'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? 'আমরা বাসা-বাড়ি, কর্পোরেট অফিস, হাসপাতাল এবং প্রাতিষ্ঠানিক ব্যবহারের জন্য মানসম্মত ক্লিনিং কেমিক্যাল ও হাইজিন পণ্য সরবরাহ করি।'
              : 'Empowering institutions, businesses, and homes across Bangladesh with high-efficacy, BSTI-compliant cleaning solutions.'}
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-16 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              {isBn ? 'আমাদের লক্ষ্য ও দর্শন' : 'Our Mission & Vision'}
            </h2>
            <p>
              {isBn
                ? 'কার্নিভাল মার্ট প্রতিষ্ঠিত হয়েছিল একটি স্পষ্ট লক্ষ্য নিয়ে—বাংলাদেশের প্রতিটি বাড়ি ও বাণিজ্যিক প্রতিষ্ঠানে আন্তর্জাতিক মানের নিরাপদ, ঘন ও কার্যকর ক্লিনিং দ্রব্যাদি সুলভ মূল্যে পৌঁছে দেওয়া। নিম্নমানের বা ঝুঁকিপূর্ণ পণ্যের বিপরীতে আমরা নিশ্চিত করি পরীক্ষিত ফর্মুলেশন ও বিএসটিআই মান।'
                : 'Carnival Mart was founded with a singular commitment: delivering dependable, hospital-grade, and cost-effective hygiene chemicals to homes, healthcare centers, and corporate facilities across Bangladesh.'}
            </p>
            <p>
              {isBn
                ? 'আমাদের প্রধান লজিস্টিকস হাব সাভার সেনানিবাসে এবং আঞ্চলিক শাখা চাঁদপুরে অবস্থিত। সেখান থেকে আধুনিক স্পিল-প্রুফ প্যাকেজিংয়ের মাধ্যমে ৬৪টি জেলায় প্রতিদিন শত শত অর্ডার নিরাপদে সরবরাহ করা হয়।'
                : 'Headquartered at our Savar Cantonment logistics center with a dedicated branch in Chandpur, our nationwide dispatch network fulfills bulk institutional contracts and individual doorstep orders daily.'}
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-brand-600 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900">{isBn ? '১০০% আসল ফর্মুলেশন' : 'Certified Quality'}</h3>
              <p className="text-xs text-slate-500">{isBn ? 'সর্বোচ্চ ৯৯.৯% জীবাণু ধ্বংসকারী উপাদান' : '99.9% germ destroy formulas'}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle text-center space-y-2">
              <Truck className="w-8 h-8 text-brand-600 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900">{isBn ? 'দেশব্যাপী নেটওয়ার্ক' : 'Nationwide Delivery'}</h3>
              <p className="text-xs text-slate-500">{isBn ? '৬৪ জেলায় দ্রুততম হোম ডেলিভারি' : 'Reliable express logistics'}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-subtle text-center space-y-2">
              <Building2 className="w-8 h-8 text-brand-600 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900">{isBn ? 'কর্পোরেট সমাধান' : 'Corporate Supply'}</h3>
              <p className="text-xs text-slate-500">{isBn ? 'হাসপাতাল ও অফিসের বিশেষ বাল্ক মূল্য' : 'Bulk rates for organizations'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
