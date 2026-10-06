'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { formatPrice } from '@/lib/formatters';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    language,
    t,
  } = useStore();

  const isBn = language === 'bn';
  const total = getCartTotal();
  const itemCount = getCartCount();

  const freeShippingThreshold = 2000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);
  const progressPercent = Math.min(100, Math.round((total / freeShippingThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="bg-slate-50/50 py-20 min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4 max-w-md w-full mx-4 shadow-subtle">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">{t.cart.emptyTitle}</h1>
          <p className="text-xs text-slate-500">{t.cart.emptySubtitle}</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 transition-colors"
          >
            <span>{t.cart.startShopping}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {t.cart.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {isBn ? `মোট ${itemCount}টি আইটেম` : `${itemCount} items in cart`}
            </p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.cart.clearCart}</span>
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-brand-50 p-4 rounded-xl border border-brand-200">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-900 mb-2">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600" />
              {remainingForFreeShipping === 0
                ? t.cart.freeShippingCongrats
                : isBn
                ? `সারা দেশে ফ্রি ডেলিভারির জন্য আরও ${formatPrice(remainingForFreeShipping, language)} টাকার পণ্য যোগ করুন`
                : `Add ${formatPrice(remainingForFreeShipping, language)} more for FREE nationwide delivery`}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-brand-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Grid: Cart Table + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-subtle divide-y divide-slate-100 overflow-hidden">
            {cart.map((item, idx) => {
              const price = item.selectedVariant
                ? (item.selectedVariant.sale_price ?? item.selectedVariant.price)
                : (item.product.sale_price ?? item.product.price);
              const size = item.selectedVariant ? item.selectedVariant.size : item.product.size;

              return (
                <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name_en}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-slate-200 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/product/${item.product.slug_en}`}
                        className="text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                      >
                        {isBn ? item.product.name_bn : item.product.name_en}
                      </Link>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {isBn ? 'সাইজ:' : 'Size:'} <strong className="text-slate-700">{size}</strong>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1">
                        {formatPrice(price, language)} / unit
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity Spinner */}
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                        className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-100 rounded-l"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs sm:text-sm font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                        className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-100 rounded-r"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <span className="text-sm font-extrabold text-slate-900 w-20 text-right">
                      {formatPrice(price * item.quantity, language)}
                    </span>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-subtle">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              {t.checkout.orderSummary}
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t.cart.subtotal}</span>
                <span className="font-semibold text-slate-900">{formatPrice(total, language)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t.cart.delivery}</span>
                <span className="text-brand-700 font-medium">
                  {remainingForFreeShipping === 0
                    ? (isBn ? 'ফ্রি ডেলিভারি' : 'FREE')
                    : t.cart.deliveryCalculated}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-extrabold text-slate-900">
                <span>{t.cart.total}</span>
                <span className="text-brand-700">{formatPrice(total, language)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <span>{t.cart.checkoutBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop"
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors text-center"
            >
              {t.cart.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
