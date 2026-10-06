import { Product } from '@/types';
import { PRODUCTS } from '@/data/products';

// Banglish & phonetic synonym mappings
const BANGLISH_SYNONYMS: Record<string, string[]> = {
  kliner: ['cleaner', 'ক্লিনার'],
  cleanar: ['cleaner', 'ক্লিনার'],
  klinar: ['cleaner', 'ক্লিনার'],
  wash: ['wash', 'ওয়াশ'],
  handwash: ['hand wash', 'হ্যান্ডওয়াশ'],
  freshnar: ['freshener', 'ফ্রেশনার'],
  freshner: ['freshener', 'ফ্রেশনার'],
  harpic: ['toilet cleaner', 'টয়লেট ক্লিনার', 'power max'],
  vim: ['dish wash', 'ডিশ ওয়াশ', 'dishwash'],
  shabon: ['soap', 'hand wash', 'হ্যান্ড ওয়াশ'],
  mop: ['spin mop', 'মপ', 'বাকেট'],
  magicmop: ['spin mop', 'মপ'],
  flur: ['floor', 'ফ্লোর'],
  floar: ['floor', 'ফ্লোর'],
  disinfect: ['disinfectant', 'জীবাণুনাশক'],
  ditergent: ['detergent', 'ডিটারজেন্ট'],
  powder: ['detergent', 'পাউডার'],
  five: ['5', '৫'],
  ek: ['1', '১'],
  pach: ['5', '৫'],
  liter: ['l', 'liter', 'লিটার'],
  litr: ['l', 'liter', 'লিটার'],
  hospital: ['hospital-grade', 'হাসপাতাল', 'bioshield'],
};

// Normalize string for fuzzy comparison
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[,\.\-\/\\_]/g, ' ')
    .replace(/\s+/g, ' ');
}

// Simple Levenshtein distance for typo tolerance
function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;
  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (b.charAt(j - 1) === a.charAt(i - 1)) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substitution
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

// Expand query tokens with synonyms
function expandQueryTokens(query: string): string[] {
  const rawTokens = normalizeText(query).split(' ').filter(Boolean);
  const expanded = new Set<string>(rawTokens);

  for (const token of rawTokens) {
    if (BANGLISH_SYNONYMS[token]) {
      BANGLISH_SYNONYMS[token].forEach((syn) => expanded.add(syn.toLowerCase()));
    }
  }

  // Handle composite patterns like '5 liter' or '5l'
  if (query.match(/5\s*(liter|litr|l|লিটার|কেয়ার)/i)) {
    expanded.add('5 l');
    expanded.add('5l');
    expanded.add('৫ লিটার');
  }

  return Array.from(expanded);
}

export interface SearchResult {
  product: Product;
  score: number;
  matchReasons: string[];
}

export function searchProducts(query: string, products: Product[] = PRODUCTS): SearchResult[] {
  if (!query || !query.trim()) {
    return products.map((p) => ({ product: p, score: 1, matchReasons: [] }));
  }

  const normalizedQuery = normalizeText(query);
  const tokens = expandQueryTokens(query);

  const results: SearchResult[] = [];

  for (const product of products) {
    let score = 0;
    const matchReasons: string[] = [];

    const nameEnNorm = normalizeText(product.name_en);
    const nameBnNorm = normalizeText(product.name_bn);
    const brandNorm = normalizeText(product.brand);
    const skuNorm = normalizeText(product.sku);
    const sizeNorm = normalizeText(product.size);
    const catEnNorm = normalizeText(product.category_en);
    const catBnNorm = normalizeText(product.category_bn);
    const descEnNorm = normalizeText(product.description_en);
    const descBnNorm = normalizeText(product.description_bn);
    const aliases = (product.search_aliases || []).map((a) => normalizeText(a));
    const keywords = [
      ...(product.keywords_en || []).map((k) => normalizeText(k)),
      ...(product.keywords_bn || []).map((k) => normalizeText(k)),
      ...(product.tags || []).map((t) => normalizeText(t)),
    ];

    // 1. Exact SKU match
    if (skuNorm.includes(normalizedQuery)) {
      score += 100;
      matchReasons.push('SKU match');
    }

    // 2. Exact Title match
    if (nameEnNorm.includes(normalizedQuery) || nameBnNorm.includes(normalizedQuery)) {
      score += 80;
      matchReasons.push('Title match');
    }

    // 3. Exact Alias match (Essential for Banglish terms like "floor kliner", "5 liter floor")
    for (const alias of aliases) {
      if (alias.includes(normalizedQuery) || normalizedQuery.includes(alias)) {
        score += 70;
        matchReasons.push(`Alias match: ${alias}`);
        break;
      }
    }

    // 4. Token based scoring
    for (const token of tokens) {
      if (nameEnNorm.includes(token) || nameBnNorm.includes(token)) {
        score += 35;
      }
      if (brandNorm.includes(token)) {
        score += 40;
        matchReasons.push('Brand match');
      }
      if (sizeNorm.includes(token) || (token === '5l' && sizeNorm.includes('5 l'))) {
        score += 30;
        matchReasons.push('Size match');
      }
      if (catEnNorm.includes(token) || catBnNorm.includes(token)) {
        score += 25;
        matchReasons.push('Category match');
      }
      if (keywords.some((kw) => kw.includes(token))) {
        score += 20;
      }
      if (descEnNorm.includes(token) || descBnNorm.includes(token)) {
        score += 10;
      }

      // 5. Fuzzy match against words in product name
      const nameWords = [...nameEnNorm.split(' '), ...nameBnNorm.split(' ')];
      for (const word of nameWords) {
        if (word.length >= 4 && token.length >= 4) {
          const dist = levenshteinDistance(word, token);
          if (dist === 1) {
            score += 20;
            matchReasons.push('Fuzzy typo match');
          } else if (dist === 2 && word.length >= 6) {
            score += 10;
          }
        }
      }
    }

    if (score > 0) {
      results.push({
        product,
        score,
        matchReasons: Array.from(new Set(matchReasons)),
      });
    }
  }

  // Sort descending by score
  return results.sort((a, b) => b.score - a.score);
}

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'brand' | 'keyword';
  slug?: string;
  category?: string;
  price?: number;
  salePrice?: number;
  image?: string;
}

export function getSearchSuggestions(query: string, language: 'bn' | 'en' = 'en'): SearchSuggestion[] {
  if (!query || query.trim().length < 1) return [];

  const searchResults = searchProducts(query);
  const suggestions: SearchSuggestion[] = [];
  const isBn = language === 'bn';

  // 1. Top matched products
  for (const res of searchResults.slice(0, 4)) {
    suggestions.push({
      text: isBn ? res.product.name_bn : res.product.name_en,
      type: 'product',
      slug: res.product.slug_en,
      category: isBn ? res.product.category_bn : res.product.category_en,
      price: res.product.price,
      salePrice: res.product.sale_price,
      image: res.product.images[0],
    });
  }

  return suggestions;
}
