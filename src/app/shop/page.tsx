'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ChevronDown,
  RotateCcw,
  Check,
  Search,
} from 'lucide-react';
import ProductCard from '@/components/ecommerce/ProductCard';
import { PRODUCTS } from '@/data/products';
import { CATEGORIES } from '@/data/categories';
import { useStore } from '@/lib/store/useStore';
import { searchProducts } from '@/lib/search';
import { formatPrice } from '@/lib/formatters';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const { language, t } = useStore();
  const isBn = language === 'bn';

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(3500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'popular' | 'discount'>('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available brands & sizes
  const brands = useMemo(() => Array.from(new Set(PRODUCTS.map((p) => p.brand))), []);
  const sizes = useMemo(() => Array.from(new Set(PRODUCTS.map((p) => p.size))), []);

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    // 1. Search Query parsing
    let list = initialQuery ? searchProducts(initialQuery, PRODUCTS).map((res) => res.product) : [...PRODUCTS];

    // 2. Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category_id === selectedCategory || p.subcategory_id === selectedCategory);
    }

    // 3. Brand filter
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    // 4. Size filter
    if (selectedSizes.length > 0) {
      list = list.filter((p) => selectedSizes.includes(p.size));
    }

    // 5. Price filter
    list = list.filter((p) => (p.sale_price ?? p.price) <= priceRange);

    // 6. Stock filter
    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    // 7. On Sale filter
    if (onSaleOnly) {
      list = list.filter((p) => p.offer || (p.sale_price && p.sale_price < p.price));
    }

    // 8. Sorting
    list.sort((a, b) => {
      const priceA = a.sale_price ?? a.price;
      const priceB = b.sale_price ?? b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'popular') return b.review_count - a.review_count;
      if (sortBy === 'discount') {
        const discA = a.sale_price ? a.price - a.sale_price : 0;
        const discB = b.sale_price ? b.price - b.sale_price : 0;
        return discB - discA;
      }
      return b.rating - a.rating;
    });

    return list;
  }, [initialQuery, selectedCategory, selectedBrands, selectedSizes, priceRange, inStockOnly, onSaleOnly, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setSelectedSizes([]);
    setPriceRange(3500);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy('recommended');
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedBrands.length +
    selectedSizes.length +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0);

  return (
    <div className="bg-slate-50/50 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="text-xs text-slate-400 mb-1">
            <span>{t.common.home}</span>
            <span className="mx-1.5">/</span>
            <span className="text-slate-700 font-medium">{t.common.products}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {initialQuery
                  ? isBn
                    ? `"${initialQuery}" এর অনুসন্ধান ফলাফল`
                    : `Search results for "${initialQuery}"`
                  : t.common.products}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {isBn
                  ? `মোট ${filteredProducts.length}টি পণ্য পাওয়া গেছে`
                  : `Showing ${filteredProducts.length} products`}
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs"
              >
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <span>{t.filters.title}</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-xs">
                <span className="text-xs text-slate-500 hidden sm:inline-block">
                  {t.filters.sortBy}:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="recommended">{t.filters.sortRecommended}</option>
                  <option value="price-low">{t.filters.sortPriceLow}</option>
                  <option value="price-high">{t.filters.sortPriceHigh}</option>
                  <option value="popular">{t.filters.sortPopular}</option>
                  <option value="discount">{t.filters.sortDiscount}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 mr-1">
              {isBn ? 'সক্রিয় ফিল্টার:' : 'Active Filters:'}
            </span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-200">
                <span>{CATEGORIES.find((c) => c.id === selectedCategory)?.name_en || selectedCategory}</span>
                <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedBrands.map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                <span>{b}</span>
                <button onClick={() => toggleBrand(b)}><X className="w-3 h-3" /></button>
              </span>
            ))}

            {selectedSizes.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                <span>{s}</span>
                <button onClick={() => toggleSize(s)}><X className="w-3 h-3" /></button>
              </span>
            ))}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                <span>{t.filters.inStockOnly}</span>
                <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 ml-auto flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.filters.clearAll}</span>
            </button>
          </div>
        )}

        {/* Main Grid: Sidebar Filters + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 space-y-6 shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                <span>{t.filters.title}</span>
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-brand-700 font-semibold hover:underline"
                >
                  {t.filters.clearAll}
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                {t.filters.category}
              </h4>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{t.filters.all}</span>
                  <span className="text-[10px] text-slate-400">({PRODUCTS.length})</span>
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{isBn ? cat.name_bn : cat.name_en}</span>
                    <span className="text-[10px] text-slate-400">({cat.productCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                {t.filters.brand}
              </h4>
              <div className="space-y-1.5">
                {brands.map((b) => (
                  <label
                    key={b}
                    className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-brand-600 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => toggleBrand(b)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-3.5 h-3.5"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                {t.filters.size}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => {
                  const isSelected = selectedSizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                        isSelected
                          ? 'bg-brand-600 border-brand-600 text-white font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                <span>{t.filters.price}</span>
                <span className="text-brand-700 font-bold normal-case">
                  ≤ {formatPrice(priceRange, language)}
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={3500}
                step={50}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* Quick Toggles */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-3.5 h-3.5"
                />
                <span>{t.filters.inStockOnly}</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-3.5 h-3.5"
                />
                <span>{t.filters.onSaleOnly}</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {t.emptyState.noProducts}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {t.emptyState.noProductsSub}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-700 transition-colors"
                >
                  {t.emptyState.resetFilters}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom-Sheet Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative mt-auto w-full bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  {t.filters.title}
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category List */}
              <div className="mb-4">
                <div className="text-xs font-bold text-slate-900 mb-2">{t.filters.category}</div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`text-xs px-3 py-1.5 rounded-lg border ${
                      selectedCategory === 'all'
                        ? 'bg-brand-600 text-white border-brand-600 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {t.filters.all}
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg border ${
                        selectedCategory === cat.id
                          ? 'bg-brand-600 text-white border-brand-600 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {isBn ? cat.name_bn : cat.name_en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Brands */}
              <div className="mb-4 border-t border-slate-100 pt-3">
                <div className="text-xs font-bold text-slate-900 mb-2">{t.filters.brand}</div>
                <div className="flex flex-wrap gap-1.5">
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => toggleBrand(b)}
                      className={`text-xs px-3 py-1.5 rounded-lg border ${
                        selectedBrands.includes(b)
                          ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={resetFilters}
                className="py-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              >
                {t.filters.clearAll}
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="py-2.5 bg-brand-600 text-white rounded-lg text-xs font-semibold"
              >
                {isBn ? `পণ্য দেখুন (${filteredProducts.length})` : `Show (${filteredProducts.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
