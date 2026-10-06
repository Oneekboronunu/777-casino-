'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, Flame, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { getSearchSuggestions, SearchSuggestion } from '@/lib/search';
import { POPULAR_SEARCH_TERMS } from '@/data/products';
import { formatPrice } from '@/lib/formatters';

interface SearchBarProps {
  className?: string;
  isMobileFull?: boolean;
  onSearchComplete?: () => void;
}

export default function SearchBar({
  className = '',
  isMobileFull = false,
  onSearchComplete,
}: SearchBarProps) {
  const router = useRouter();
  const { language, t, recentSearches, addRecentSearch, clearRecentSearches, logFailedSearch } = useStore();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update suggestions on input
  useEffect(() => {
    if (query.trim().length > 0) {
      const results = getSearchSuggestions(query, language);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [query, language]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    addRecentSearch(trimmed);
    setIsOpen(false);

    // If no suggestions found, log as search analytics failed search
    if (suggestions.length === 0) {
      logFailedSearch(trimmed);
    }

    if (onSearchComplete) {
      onSearchComplete();
    }

    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  const isBn = language === 'bn';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Container */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(query);
        }}
        className="relative flex items-center w-full"
      >
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4 text-slate-500" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t.common.searchPlaceholder}
          className={`w-full pl-10 pr-24 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-lg border border-slate-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none transition-all ${
            isBn ? 'font-bengali' : ''
          }`}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-20 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-md flex items-center justify-center transition-colors shadow-xs"
        >
          {t.common.search}
        </button>
      </form>

      {/* Dropdown Suggestions & History */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-elevated border border-slate-100 overflow-hidden z-50 animate-fade-in divide-y divide-slate-100">
          {/* Live Product Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                {isBn ? 'পণ্য সাজেশন' : 'Suggested Products'}
              </div>
              <div className="space-y-1">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSearchSubmit(item.text)}
                    className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.text}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {item.text}
                        </div>
                        {item.category && (
                          <div className="text-[11px] text-slate-500">
                            {item.category}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      {item.salePrice ? (
                        <div>
                          <span className="text-xs font-bold text-brand-700">
                            {formatPrice(item.salePrice, language)}
                          </span>
                          <span className="text-[11px] text-slate-400 line-through ml-1.5">
                            {formatPrice(item.price || 0, language)}
                          </span>
                        </div>
                      ) : (
                        item.price && (
                          <span className="text-xs font-bold text-slate-900">
                            {formatPrice(item.price, language)}
                          </span>
                        )
                      )}
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Search Tags */}
          <div className="p-3 bg-slate-50/50">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>{isBn ? 'জনপ্রিয় সার্চ' : 'Popular Searches'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 px-2">
              {POPULAR_SEARCH_TERMS.map((term, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setQuery(term.query);
                    handleSearchSubmit(term.query);
                  }}
                  className="text-xs px-2.5 py-1 bg-white hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-slate-200 text-slate-700 rounded-full transition-all"
                >
                  {isBn ? term.bn : term.en}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {isBn ? 'সাম্প্রতিক সার্চ' : 'Recent Searches'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearRecentSearches();
                  }}
                  className="text-slate-400 hover:text-slate-600 text-[10px] normal-case"
                >
                  {isBn ? 'ক্লিয়ার করুন' : 'Clear all'}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 px-2">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      handleSearchSubmit(term);
                    }}
                    className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
