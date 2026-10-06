'use client';

import React from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { formatPrice } from '@/lib/formatters';

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    getCartCount,
    language,
    t,
  } = useStore();

  if (!isCartOpen) return null;

  const total = getCartTotal();
  const itemCount = getCartCount();
  const isBn = language === 'bn';
  const freeShippingThreshold = 2000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);
  const progressPercent = Math.min(100, Math.round((total / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">
                {t.cart.title} ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-brand-50/70 p-3.5 border-b border-brand-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-800 mb-1.5">
              <Truck className="w-4 h-4 text-brand-600" />
              {remainingForFreeShipping === 0 ? (
                <span>{t.cart.freeShippingCongrats}</span>
              ) : (
                <span>
                  {isBn
                    ? `ফ্রি ডেলিভারির জন্য আরও ${formatPrice(remainingForFreeShipping, language)} যোগ করুন`
                    : `Add ${formatPrice(remainingForFreeShipping, language)} more for FREE delivery`}
                </span>
              )}
            </div>
            <div className="w-full bg-brand-200/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    {t.cart.emptyTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    {t.cart.emptySubtitle}
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-700 transition-colors"
                >
                  {t.cart.startShopping}
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const price = item.selectedVariant
                  ? (item.selectedVariant.sale_price ?? item.selectedVariant.price)
                  : (item.product.sale_price ?? item.product.price);
                const sizeLabel = item.selectedVariant ? item.selectedVariant.size : item.product.size;

                return (
                  <div key={`${item.product.id}-${item.selectedVariant?.id || index}`} className="py-3.5 flex gap-3.5 items-start">
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={isBn ? item.product.name_bn : item.product.name_en}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.product.slug_en}`}
                          onClick={closeCart}
                          className="text-xs font-semibold text-slate-900 hover:text-brand-600 transition-colors line-clamp-2"
                        >
                          {isBn ? item.product.name_bn : item.product.name_en}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                          className="text-slate-400 hover:text-rose-500 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {sizeLabel}
                      </div>

                      {/* Quantity & Item Subtotal */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-slate-200 rounded-md">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                            className="p-1 text-slate-600 hover:bg-slate-100 rounded-l"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                            className="p-1 text-slate-600 hover:bg-slate-100 rounded-r"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-slate-900">
                          {formatPrice(price * item.quantity, language)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(total, language)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{t.cart.delivery}</span>
                  <span className="text-brand-600 font-medium">
                    {remainingForFreeShipping === 0
                      ? (isBn ? 'ফ্রি' : 'FREE')
                      : t.cart.deliveryCalculated}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                  <span>{t.cart.total}</span>
                  <span className="text-brand-700">
                    {formatPrice(total, language)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full py-2.5 border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold rounded-lg transition-colors text-center"
                >
                  {t.cart.continueShopping}
                </button>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{t.cart.checkoutBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
