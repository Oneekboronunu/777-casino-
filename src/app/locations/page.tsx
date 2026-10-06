'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock, Truck, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

export default function LocationsPage() {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  const hubs = [
    {
      title_en: 'Savar Central Distribution & HQ',
      title_bn: 'সাভার কেন্দ্রীয় ডিসপ্যাচ ও প্রধান অফিস',
      address_en: '99/29-Dendabor, Savar Cantonment, Savar, Dhaka',
      address_bn: '৯৯/২৯-ডেন্ডাবর, সাভার সেনানিবাস, সাভার, ঢাকা',
      phone: '01404005680',
      email: 'mycarnivalxyz@gmail.com',
      hours_en: 'Sat - Thu: 9:00 AM - 8:00 PM',
      hours_bn: 'শনিবার - বৃহস্পতিবার: সকাল ৯টা - রাত ৮টা',
      delivery_en: 'Instant 24-Hour Dispatch for Dhaka, Savar, Gazipur & Narayanganj',
      delivery_bn: 'ঢাকা, সাভার, গাজীপুর ও নারায়ণগঞ্জে ২৪ ঘণ্টার মধ্যে হোম ডেলিভারি',
      badge: 'Main Logistics Hub',
    },
    {
      title_en: 'Chandpur Regional Branch',
      title_bn: 'চাঁদপুর আঞ্চলিক শাখা',
      address_en: '0608 - Mission Road, Chandpur',
      address_bn: '০৬০৮ - মিশন রোড, চাঁদপুর',
      phone: '01404005680',
      email: 'mycarnivalxyz@gmail.com',
      hours_en: 'Sat - Thu: 9:30 AM - 7:30 PM',
      hours_bn: 'শনিবার - বৃহস্পতিবার: সকাল ৯:৩০ - সন্ধ্যা ৭:৩০',
      delivery_en: 'Serving Chandpur, Cumilla, Noakhali & Feni districts',
      delivery_bn: 'চাঁদপুর, কুমিল্লা, নোয়াখালী ও ফেনী অঞ্চলের দ্রুত ডেলিভারি',
      badge: 'Regional Center',
    },
  ];

  return (
    <div className="bg-slate-50/50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>{t.common.locations}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            {isBn ? 'আমাদের অফিস ও ডেলিভারি হাব' : 'Our Hubs & Service Locations'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {isBn
              ? 'সাভার এবং চাঁদপুর হাব থেকে দেশের সকল ৬৪টি জেলায় সুরক্ষিত লজিস্টিকসের মাধ্যমে পণ্য সরবরাহ করা হয়।'
              : 'Serving residential and corporate clients across all 64 districts in Bangladesh.'}
          </p>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hubs.map((hub, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-subtle flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 px-2.5 py-1 rounded-md border border-brand-200">
                    {hub.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {isBn ? hub.title_bn : hub.title_en}
                </h3>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block mb-0.5">
                        {isBn ? 'ঠিকানা:' : 'Address:'}
                      </strong>
                      <span>{isBn ? hub.address_bn : hub.address_en}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block mb-0.5">
                        {isBn ? 'অফিস সময়:' : 'Office Hours:'}
                      </strong>
                      <span>{isBn ? hub.hours_bn : hub.hours_en}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Truck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 block mb-0.5">
                        {isBn ? 'ডেলিভারি কভারেজ:' : 'Delivery Coverage:'}
                      </strong>
                      <span>{isBn ? hub.delivery_bn : hub.delivery_en}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Call & Email Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <a
                  href={`tel:${hub.phone}`}
                  className="flex items-center gap-2 text-brand-700 font-bold hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  <span>{hub.phone}</span>
                </a>
                <a
                  href={`mailto:${hub.email}`}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-800"
                >
                  <Mail className="w-4 h-4" />
                  <span>{hub.email}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 64 Districts Logistics Assurance Strip */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-elevated">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold">
              {isBn ? '৬৪ জেলায় নির্ভরযোগ্য হোম ডেলিভারি' : 'Nationwide 64 Districts Courier Network'}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              {isBn
                ? 'লিক-প্রুফ সুরক্ষিত প্যাকেজিংয়ের মাধ্যমে দেশের যেকোনো প্রান্তে ২ থেকে ৪ কার্যদিবসের মধ্যে আপনার পণ্য নিরাপদে পৌঁছে দেওয়া হয়।'
                : 'Spill-proof safety crates and express dispatch ensure pristine delivery to any district.'}
            </p>
          </div>

          <a
            href="tel:01404005680"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0 shadow-sm"
          >
            {isBn ? 'সরাসরি যোগাযোগ করুন' : 'Contact Support'}
          </a>
        </div>
      </div>
    </div>
  );
}
