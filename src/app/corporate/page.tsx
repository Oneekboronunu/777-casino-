'use client';

import React, { useState } from 'react';
import {
  Building2,
  Hospital,
  UtensilsCrossed,
  Hotel,
  School,
  Factory,
  CheckCircle2,
  FileSpreadsheet,
  PhoneCall,
  Mail,
  ShieldCheck,
  Truck,
  FileText
} from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

export default function CorporatePage() {
  const { language, t } = useStore();
  const isBn = language === 'bn';

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    sector: 'Hospitals & Healthcare',
    quantity: '',
    frequency: 'Monthly Contract (মাসিক চুক্তি)',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900 border border-brand-700 text-brand-300 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-brand-400" />
              <span>{t.corporate.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {t.corporate.headline}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t.corporate.description}
            </p>

            <div className="pt-3 flex flex-wrap gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                {isBn ? 'বিএসটিআই সার্টিফায়েড ফর্মুলেশন' : 'Certified BSTI Formulations'}
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-400" />
                {isBn ? 'দেশব্যাপী নির্ধারিত সিডিউলে সাপ্লাই' : 'Scheduled Doorstep Supply'}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-400" />
                {isBn ? 'ইনভয়েস ও কর্পোরেট ক্রেডিট সুবিধা' : 'Corporate Invoicing & Credit Terms'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form & Tiers Grid */}
      <section className="py-14 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Interactive Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-subtle">
              {isSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {isBn ? 'আবেদন সফলভাবে গৃহীত হয়েছে!' : 'Quotation Request Received!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    {t.corporate.successMsg}
                  </p>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 max-w-sm mx-auto">
                    {isBn ? 'কর্পোরেট হটলাইন:' : 'Corporate Helpline:'}{' '}
                    <strong className="text-brand-700 font-bold">01404005680</strong>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    {t.corporate.formTitle}
                  </h2>
                  <p className="text-xs text-slate-500 mb-6">
                    {isBn
                      ? 'আপনার প্রতিষ্ঠানের চাহিদা অনুযায়ী পাইকারি মূল্যতালিকা ও নিয়মিত সাপ্লাইয়ের কোটেশন পান।'
                      : 'Fill out this form to receive a customized price quotation and schedule for your facility.'}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.corporate.formName} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Asif Mahmud"
                          className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.corporate.formCompany} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Care Hospital Ltd."
                          className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.corporate.formPhone} *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="017XXXXXXXX"
                          className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.corporate.formEmail}
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="procurement@company.com"
                          className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.corporate.formType}
                        </label>
                        <select
                          value={formData.sector}
                          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 outline-none bg-white"
                        >
                          <option value="Hospitals & Healthcare">Hospitals / Clinics / Diagnostic</option>
                          <option value="Corporate Offices">Corporate Headquarters / Offices</option>
                          <option value="Hotels & Resorts">Hotels / Resorts / Guest Houses</option>
                          <option value="Restaurants & Cafes">Restaurants / Catering / Cloud Kitchen</option>
                          <option value="Schools & Colleges">Educational Institutions</option>
                          <option value="Garments & Factories">Factories / Garments / Warehouses</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {isBn ? 'সাপ্লাইয়ের ধরন' : 'Delivery Frequency'}
                        </label>
                        <select
                          value={formData.frequency}
                          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 outline-none bg-white"
                        >
                          <option value="Monthly Contract (মাসিক চুক্তি)">Monthly Scheduled Supply (মাসিক সাপ্লাই)</option>
                          <option value="One-time Bulk Order (এককালীন বড় অর্ডার)">One-Time Bulk Purchase (এককালীন অর্ডার)</option>
                          <option value="Weekly Replenishment (সাপ্তাহিক সাপ্লাই)">Weekly Replenishment (সাপ্তাহিক)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.corporate.formRequirements} *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder={
                          isBn
                            ? 'যেমন: ফ্লোর ক্লিনার ৫ লিটার (৫০ জার), লিকুইড হ্যান্ডওয়াশ ৫ লিটার (৩০ জার), গ্লাস ক্লিনার...'
                            : 'e.g., 5L Floor Cleaner (50 cans), 5L Hand Wash (30 cans), Hospital Disinfectant...'
                        }
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 outline-none resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>{t.corporate.submitBtn}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right: B2B Benefits & Contact */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {isBn ? 'কর্পোরেট অংশীদারিত্বের সুবিধা' : 'Corporate Supply Benefits'}
                </h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>{t.corporate.benefit1}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>{t.corporate.benefit2}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>{t.corporate.benefit3}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>{t.corporate.benefit4}</span>
                  </div>
                </div>
              </div>

              {/* Direct Support Card */}
              <div className="bg-brand-900 text-white p-6 rounded-2xl space-y-3 shadow-elevated">
                <h4 className="text-sm font-bold">
                  {isBn ? 'সরাসরি করপোরেট প্রতিনিধির সাথে কথা বলুন' : 'Talk with Corporate Account Manager'}
                </h4>
                <p className="text-xs text-brand-200">
                  {isBn
                    ? 'জরুরি বাল্ক অর্ডার বা কাস্টমাইজড কোটেশনের জন্য সরাসরি কল করুন।'
                    : 'Get fast turnaround on tenders, supply quotes, and formal invoices.'}
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href="tel:01404005680"
                    className="flex items-center gap-2 text-xs font-bold text-white bg-brand-800 hover:bg-brand-700 p-2.5 rounded-lg transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-brand-400" />
                    <span>01404005680</span>
                  </a>
                  <a
                    href="mailto:mycarnivalxyz@gmail.com"
                    className="flex items-center gap-2 text-xs text-brand-200 hover:text-white p-2.5 rounded-lg transition-colors"
                  >
                    <Mail className="w-4 h-4 text-brand-400" />
                    <span>mycarnivalxyz@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
