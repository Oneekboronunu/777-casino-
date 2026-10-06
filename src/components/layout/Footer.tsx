'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  Building,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useStore } from '@/lib/store/useStore';
import { CATEGORIES } from '@/data/categories';

export default function Footer() {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="bg-slate-800/80 p-2.5 rounded-xl w-fit border border-slate-700">
              <Logo variant="footer" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footer.aboutText}
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{isBn ? '১০০% আসল ফর্মুলেশন' : '100% Genuine Certified Formulation'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{isBn ? 'সারা বাংলাদেশে নির্ভরযোগ্য ডেলিভারি' : 'Nationwide Secure Logistics'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{isBn ? 'কর্পোরেট বাল্ক সাপ্লাই ও ডিসকাউন্ট' : 'Corporate Bulk Invoicing'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop & Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {isBn ? cat.name_bn : cat.name_en}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/offers" className="text-amber-400 hover:text-amber-300 font-medium">
                  {isBn ? '🔥 বিশেষ অফার ও কম্বো' : '🔥 Special Offers & Bundles'}
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="text-brand-400 hover:text-brand-300 font-medium">
                  {t.common.corporate}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.customerCare}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  {t.common.orderTracking}
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-white transition-colors">
                  {t.common.locations}
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="hover:text-white transition-colors">
                  {t.common.quoteRequest}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  {t.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-conditions" className="hover:text-white transition-colors">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  {t.footer.refundPolicy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.contactInfo}
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-slate-200 font-medium">
                    {isBn ? 'সাভার হাব (প্রধান অফিস):' : 'Savar Hub (HQ):'}
                  </div>
                  <div className="text-slate-400">{t.footer.addressSavar}</div>
                  <div className="text-slate-200 font-medium pt-1">
                    {isBn ? 'চাঁদপুর শাখা:' : 'Chandpur Branch:'}
                  </div>
                  <div className="text-slate-400">{t.footer.addressChandpur}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a
                  href={`tel:${t.footer.phone}`}
                  className="hover:text-white transition-colors font-medium text-slate-200"
                >
                  {t.footer.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a
                  href={`mailto:${t.footer.email}`}
                  className="hover:text-white transition-colors text-slate-300"
                >
                  {t.footer.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>{t.footer.copyright}</div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500">{isBn ? 'ভাষা:' : 'Language:'}</span>
            <LanguageSwitcher />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>{isBn ? 'পেমেন্ট মেথড:' : 'Payment:'}</span>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded">Cash on Delivery</span>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded">bKash</span>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded">Nagad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
