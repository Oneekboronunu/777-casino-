'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Truck,
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  Phone,
  Search,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const { language, t } = useStore();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState(initialId || 'CM-882941');
  const [trackedOrder, setTrackedOrder] = useState<any>({
    orderId: initialId || 'CM-882941',
    customerName: 'Tanvir Hasan',
    phone: '01712-XXXXXX',
    destination: 'Savar, Dhaka',
    courier: 'Carnival Express Logistics',
    estimatedDelivery: isBn ? 'আগামীকাল বিকাল ৫টার মধ্যে' : 'Tomorrow by 5:00 PM',
    status: 'shipped',
    steps: [
      {
        title_en: 'Order Placed',
        title_bn: 'অর্ডার গ্রহণ করা হয়েছে',
        desc_en: 'Received by Carnival Mart automated system',
        desc_bn: 'কার্নিভাল মার্ট সিস্টেমে অর্ডার রিসিভড',
        time: 'Today, 10:30 AM',
        completed: true,
      },
      {
        title_en: 'Order Confirmed',
        title_bn: 'অর্ডার নিশ্চিত করা হয়েছে',
        desc_en: 'Verified with customer by phone',
        desc_bn: 'কাস্টমার কেয়ার কর্তৃক যাচাইকৃত',
        time: 'Today, 11:15 AM',
        completed: true,
      },
      {
        title_en: 'Packing & Quality Check',
        title_bn: 'প্যাকিং ও কোয়ালিটি চেক',
        desc_en: 'Spill-proof crate packaging completed at Savar Hub',
        desc_bn: 'সাভার হাবে লিক-প্রুফ সুরক্ষিত প্যাকিং সম্পন্ন',
        time: 'Today, 02:45 PM',
        completed: true,
      },
      {
        title_en: 'Shipped with Courier',
        title_bn: 'কুরিয়ারে হস্তান্তর',
        desc_en: 'Dispatched to delivery van / courier rider',
        desc_bn: 'ডেলিভারি ভ্যানে হস্তান্তর সম্পন্ন',
        time: 'Today, 04:30 PM',
        completed: true,
        current: true,
      },
      {
        title_en: 'Out for Delivery',
        title_bn: 'ডেলিভারির পথে',
        desc_en: 'Rider is arriving at destination area',
        desc_bn: 'রাইডার আপনার এলাকার উদ্দেশ্যে রওনা হয়েছে',
        time: 'Pending',
        completed: false,
      },
      {
        title_en: 'Delivered',
        title_bn: 'ডেলিভারি সম্পন্ন',
        desc_en: 'Handed over to customer',
        desc_bn: 'গ্রাহকের নিকট সফল হস্তান্তর',
        time: 'Pending',
        completed: false,
      },
    ],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setTrackedOrder({
      orderId: searchQuery.toUpperCase(),
      customerName: 'Valued Customer',
      phone: '01XXXXXXXXX',
      destination: 'Doorstep Delivery',
      courier: 'Carnival Express Logistics',
      estimatedDelivery: isBn ? '২৪-৪৮ ঘণ্টার মধ্যে' : 'Within 24-48 Hours',
      status: 'shipped',
      steps: trackedOrder.steps,
    });
  };

  return (
    <div className="bg-slate-50/50 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5 text-brand-600" />
            <span>{t.common.orderTracking}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.tracking.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            {t.tracking.subtitle}
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-subtle max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.tracking.inputPlaceholder}
                className="w-full pl-3.5 pr-4 py-3 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{t.tracking.trackBtn}</span>
            </button>
          </form>
        </div>

        {/* Tracking Details & Timeline Card */}
        {trackedOrder && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-8">
            {/* Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">{t.checkout.orderNumber}</span>
                <strong className="text-brand-700 font-extrabold text-sm sm:text-base">
                  {trackedOrder.orderId}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">{t.tracking.estimatedDelivery}</span>
                <strong className="text-slate-900 font-bold">
                  {trackedOrder.estimatedDelivery}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">{t.tracking.courierPartner}</span>
                <strong className="text-slate-900 font-bold">
                  {trackedOrder.courier}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">{isBn ? 'গন্তব্য এলাকা' : 'Destination'}</span>
                <strong className="text-slate-900 font-bold">
                  {trackedOrder.destination}
                </strong>
              </div>
            </div>

            {/* Visual Timeline Steps */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">
                {isBn ? 'অর্ডারের বর্তমান অগ্রগতি' : 'Live Shipment Progress'}
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {trackedOrder.steps.map((step: any, idx: number) => {
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white ${
                          step.completed
                            ? 'bg-brand-600 ring-4 ring-brand-100'
                            : 'bg-slate-300'
                        } ${step.current ? 'animate-pulse' : ''}`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>

                      {/* Step Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4
                            className={`text-xs sm:text-sm font-bold ${
                              step.completed ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {isBn ? step.title_bn : step.title_en}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {isBn ? step.desc_bn : step.desc_en}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assistance Banner */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                <span>
                  {isBn
                    ? 'অর্ডার সংক্রান্ত যেকোনো সহায়তায় কল করুন: '
                    : 'Need help with this delivery? Call: '}
                  <strong className="text-slate-900">01404005680</strong>
                </span>
              </div>
              <a
                href="https://wa.me/8801404005680"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#20bd5a] transition-colors"
              >
                WhatsApp Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
