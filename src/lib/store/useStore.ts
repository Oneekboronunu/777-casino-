import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product, Language, ProductVariant } from '@/types';
import { translations } from '@/lib/i18n/translations';

interface StoreState {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;

  // Wishlist
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Search History & Analytics
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  failedSearches: { query: string; timestamp: number }[];
  logFailedSearch: (query: string) => void;

  // Toast notifications
  toastMessage: string | null;
  showToast: (message: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Language defaults to Bengali as per primary local target, switchable anytime
      language: 'bn',
      t: translations.bn,
      setLanguage: (lang: Language) => {
        set({
          language: lang,
          t: translations[lang] || translations.bn,
        });
      },

      // Cart
      cart: [],
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addToCart: (product: Product, quantity = 1, variant?: ProductVariant) => {
        const currentCart = get().cart;
        const targetVariantId = variant ? variant.id : undefined;

        const existingIndex = currentCart.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedVariant?.id === targetVariantId
        );

        let newCart: CartItem[];
        if (existingIndex > -1) {
          newCart = [...currentCart];
          newCart[existingIndex].quantity += quantity;
        } else {
          newCart = [
            ...currentCart,
            {
              product,
              selectedVariant: variant,
              quantity,
            },
          ];
        }

        const isBn = get().language === 'bn';
        const prodName = isBn ? product.name_bn : product.name_en;
        const toastText = isBn
          ? `"${prodName}" কার্টে যোগ করা হয়েছে`
          : `Added "${prodName}" to cart`;

        set({ cart: newCart, isCartOpen: true });
        get().showToast(toastText);
      },

      removeFromCart: (productId: string, variantId?: string) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(item.product.id === productId && item.selectedVariant?.id === variantId)
          ),
        }));
      },

      updateCartQuantity: (productId: string, quantity: number, variantId?: string) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, variantId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.product.id === productId && item.selectedVariant?.id === variantId) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          const price = item.selectedVariant
            ? (item.selectedVariant.sale_price ?? item.selectedVariant.price)
            : (item.product.sale_price ?? item.product.price);
          return total + price * item.quantity;
        }, 0);
      },

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId: string) => {
        const current = get().wishlist;
        const exists = current.includes(productId);
        const next = exists
          ? current.filter((id) => id !== productId)
          : [...current, productId];

        const isBn = get().language === 'bn';
        const msg = exists
          ? (isBn ? 'পছন্দের তালিকা থেকে সরানো হয়েছে' : 'Removed from wishlist')
          : (isBn ? 'পছন্দের তালিকায় যুক্ত হয়েছে' : 'Saved to wishlist');

        set({ wishlist: next });
        get().showToast(msg);
      },
      isInWishlist: (productId: string) => get().wishlist.includes(productId),

      // Quick View
      quickViewProduct: null,
      setQuickViewProduct: (product: Product | null) =>
        set({ quickViewProduct: product }),

      // Search History & Analytics
      recentSearches: ['Floor Cleaner', '5L Hand Wash', 'Power Max', 'Jasmine Freshener'],
      addRecentSearch: (query: string) => {
        if (!query.trim()) return;
        const current = get().recentSearches.filter(
          (q) => q.toLowerCase() !== query.toLowerCase()
        );
        set({ recentSearches: [query, ...current].slice(0, 8) });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),

      failedSearches: [],
      logFailedSearch: (query: string) => {
        if (!query.trim()) return;
        set((state) => ({
          failedSearches: [
            ...state.failedSearches.slice(-50),
            { query: query.trim(), timestamp: Date.now() },
          ],
        }));
      },

      // Toast
      toastMessage: null,
      showToast: (message: string) => {
        set({ toastMessage: message });
        setTimeout(() => {
          if (get().toastMessage === message) {
            set({ toastMessage: null });
          }
        }, 3000);
      },
    }),
    {
      name: 'carnival-mart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        cart: state.cart,
        wishlist: state.wishlist,
        recentSearches: state.recentSearches,
        failedSearches: state.failedSearches,
      }),
    }
  )
);
