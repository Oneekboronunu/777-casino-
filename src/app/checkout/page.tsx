'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { formatPrice } from '@/lib/formatters';

const BANGLADESH_DISTRICTS = [
  'Dhaka (ঢাকা)',
  'Savar (সাভার)',
  'Gazipur (গাজীপুর)',
  'Narayanganj (নারায়ণগঞ্জ)',
  'Chattogram (চট্টগ্রাম)',
  'Chandpur (চাঁদপুর)',
  'Cumilla (কুমিল্লা)',
  'Sylhet (সিলেট)',
  'Rajshahi (রাজশাহী)',
  'Khulna (খুলনা)',
  'Barishal (বরিশাল)',
  'Rangpur (রংপুর)',
  'Mymensingh (ময়মনসিংহ)',
  'Bogra (বগুড়া)',
  'Cox\'s Bazar (কক্সবাজার)',
  'Tangail (টাঙ্গাইল)',
  'Feni (ফেনী)',
  'Noakhali (নোয়াখালী)',
  'Other 64 Districts (অন্যান্য জেলা)'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, getCartCount, clearCart, language, t } = useStore();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    district: 'Dhaka (ঢাকা)',
    area: '',
    orderNotes: '',
    paymentMethod: 'cod' as 'cod' | 'bkash' | 'nagad' | 'card',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<{
    orderId: string;
    total: number;
  } | null>(null);

  const isBn = language === 'bn';
  const subtotal = getCartTotal();
  const itemCount = getCartCount();

  // Delivery fee calculation: Free over ৳2,000, else ৳70 inside Dhaka/Savar, ৳120 outside
  const isDhakaOrSavar = formData.district.includes('Dhaka') || formData.district.includes('Savar');
  const deliveryFee = subtotal >= 2000 ? 0 : (isDhakaOrSavar ? 70 : 120);
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.area.trim()) {
      alert(isBn ? 'অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const orderId = `CM-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      setOrderSuccessData({
        orderId,
        total: grandTotal,
      });
      clearCart();
      setIsSubmitting(false);
    }, 800);
  };

  // Order Success Screen
  if (orderSuccessData) {
    return (
      <div className="bg-slate-50/50 py-16 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-lg w-full mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-elevated text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              {t.checkout.orderSuccess}
            </h1>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.checkout.orderNumber}:</span>
                <strong className="text-brand-700 font-bold">{orderSuccessData.orderId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.cart.total}:</span>
                <strong className="text-slate-900 font-bold">{formatPrice(orderSuccessData.total, language)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.checkout.paymentMethod}:</span>
                <span className="font-semibold text-slate-800 uppercase">{formData.paymentMethod}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t.checkout.confirmationNotice}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/track-order?id=${orderSuccessData.orderId}`}
                className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <span>{t.checkout.trackYourOrder}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/"
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors"
              >
                {t.cart.continueShopping}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{t.cart.emptyTitle}</h2>
        <p className="text-xs text-slate-500">{t.cart.emptySubtitle}</p>
        <Link
          href="/shop"
          className="inline-flex px-6 py-3 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 transition-colors"
        >
          {t.cart.startShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.checkout.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.checkout.subtitle}
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Customer & Delivery Info */}
            <div className="lg:col-span-7 space-y-6">
              {/* Shipping Form Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-subtle">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>{t.checkout.shippingInfo}</span>
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.checkout.fullName}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Tanvir Hasan"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.checkout.phoneNumber}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.checkout.email}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.checkout.district}
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none bg-white"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.checkout.area}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder={isBn ? 'যেমন: বাড়ি নম্বর ১২, রোড ৫, ব্লক ডি, মিরপুর-১০, ঢাকা' : 'e.g. House 12, Road 5, Block D, Mirpur-10, Dhaka'}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.checkout.orderNotes}
                  </label>
                  <input
                    type="text"
                    value={formData.orderNotes}
                    onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                    placeholder={isBn ? 'বিশেষ ডেলিভারি নির্দেশিকা' : 'Special delivery instructions'}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-brand-600 focus:border-brand-600 outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-subtle">
                <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  {t.checkout.paymentMethod}
                </h2>

                <label className="flex items-center justify-between p-3.5 border rounded-xl cursor-pointer hover:border-brand-500 transition-colors bg-brand-50/30 border-brand-500">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {t.checkout.cod}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isBn ? 'পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন' : 'Pay in cash upon receiving your order'}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded">
                    {isBn ? 'জনপ্রিয়' : 'Popular'}
                  </span>
                </label>

                <label className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={formData.paymentMethod === 'bkash'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'bkash' })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {t.checkout.bkash}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {isBn ? 'বিকাশ ও নগদ মার্চেন্ট পেমেন্ট' : 'Instant mobile wallet payment'}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">bKash / Nagad</span>
                </label>

                <label className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {t.checkout.card}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Visa, Mastercard, DBBL Nexus
                      </div>
                    </div>
                  </div>
                  <CreditCard className="w-4 h-4 text-slate-400" />
                </label>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-subtle">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>{t.checkout.orderSummary}</span>
                <span className="text-xs text-slate-500 font-normal">({itemCount} items)</span>
              </h2>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
                {cart.map((item, idx) => {
                  const price = item.selectedVariant
                    ? (item.selectedVariant.sale_price ?? item.selectedVariant.price)
                    : (item.product.sale_price ?? item.product.price);
                  const size = item.selectedVariant ? item.selectedVariant.size : item.product.size;

                  return (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name_en}
                          className="w-10 h-10 rounded border object-cover shrink-0"
                        />
                        <div className="truncate">
                          <div className="font-semibold text-slate-900 truncate">
                            {isBn ? item.product.name_bn : item.product.name_en}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {size} × {item.quantity}
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        {formatPrice(price * item.quantity, language)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Calculations */}
              <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(subtotal, language)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t.cart.delivery}</span>
                  <span className={deliveryFee === 0 ? 'text-brand-700 font-bold' : 'font-semibold text-slate-900'}>
                    {deliveryFee === 0 ? (isBn ? 'ফ্রি ডেলিভারি' : 'FREE') : formatPrice(deliveryFee, language)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                  <span>{t.cart.total}</span>
                  <span className="text-brand-700 font-extrabold text-base">
                    {formatPrice(grandTotal, language)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                <span>
                  {isSubmitting
                    ? (isBn ? 'অর্ডার প্রক্রিয়াধীন...' : 'Processing...')
                    : isBn
                    ? `অর্ডার নিশ্চিত করুন (${formatPrice(grandTotal, language)})`
                    : `Confirm Order (${formatPrice(grandTotal, language)})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>{isBn ? '১০০% সুরক্ষিত অর্ডার ও দ্রুত কনফার্মেশন' : '100% Safe & Secure Checkout'}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
