'use client';

import React, { useState } from 'react';
import { X, Building, CheckCircle2, Send, ShieldCheck, Phone } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

interface CorporateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
}

export default function CorporateQuoteModal({
  isOpen,
  onClose,
  defaultProduct = '',
}: CorporateQuoteModalProps) {
  const { language, t } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    type: 'Office / Corporate',
    volume: defaultProduct ? `Quote for ${defaultProduct}` : '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const isBn = language === 'bn';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      // Keep state for user feedback
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 overflow-hidden animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {isBn ? 'কোটেশন রিকোয়েস্ট সফল হয়েছে!' : 'Quotation Request Received!'}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {t.corporate.successMsg}
            </p>
            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200">
              {isBn ? 'জরুরি প্রয়োজনে সরাসরি কল করুন:' : 'For urgent requests, call direct:'}{' '}
              <a href="tel:01404005680" className="font-bold text-brand-700">
                01404005680
              </a>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-700 transition-colors"
            >
              {isBn ? 'ঠিক আছে' : 'Close'}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Building className="w-4 h-4" />
              <span>{t.corporate.badge}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {t.corporate.formTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              {isBn
                ? 'আপনার প্রতিষ্ঠানের চাহিদা অনুযায়ী পাইকারি মূল্যতালিকা ও নিয়মিত সাপ্লাইয়ের কোটেশন পান।'
                : 'Get volume pricing, tailored catalog quotes, and delivery schedules for your organization.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.corporate.formName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Asif Mahmud"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.corporate.formCompany} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Apex Hospital Ltd."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.corporate.formPhone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {t.corporate.formEmail}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="procurement@company.com"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t.corporate.formType}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none bg-white text-slate-800"
                >
                  <option value="Hospital / Clinic">Hospital / Healthcare / Diagnostic Center</option>
                  <option value="Office / Corporate">Corporate Office / IT Park</option>
                  <option value="Restaurant / Hotel">Hotel / Restaurant / Cloud Kitchen</option>
                  <option value="School / University">School / University / Educational Institute</option>
                  <option value="Factory / Garment">Factory / Garments & Manufacturing</option>
                  <option value="Commercial Complex">Shopping Mall / Commercial Facility</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {t.corporate.formRequirements} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  placeholder={
                    isBn
                      ? 'যেমন: প্রতি মাসে ৫ লিটার ফ্লোর ক্লিনার ২০ ক্যান, টয়লেট ক্লিনার ১৫ ক্যান...'
                      : 'e.g., Monthly requirement: 20x 5L Floor Cleaner, 15x 5L Hand Wash...'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.corporate.submitBtn}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
