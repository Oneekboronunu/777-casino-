export type Language = 'bn' | 'en';

export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  icon: string;
  image?: string;
  productCount: number;
  featured?: boolean;
  subcategories?: {
    id: string;
    slug: string;
    name_en: string;
    name_bn: string;
  }[];
}

export interface ProductVariant {
  id: string;
  size: string;
  unit: string;
  price: number;
  sale_price?: number;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  sku: string;
  name_en: string;
  name_bn: string;
  slug_en: string;
  slug_bn: string;
  brand: string;
  category_id: string;
  category_en: string;
  category_bn: string;
  subcategory_id?: string;
  subcategory_en?: string;
  subcategory_bn?: string;
  description_en: string;
  description_bn: string;
  features_en: string[];
  features_bn: string[];
  how_to_use_en?: string;
  how_to_use_bn?: string;
  specifications: { [key: string]: string };
  price: number;
  sale_price?: number;
  currency: string;
  size: string;
  unit: string;
  variants?: ProductVariant[];
  images: string[];
  stock: number;
  featured: boolean;
  popular: boolean;
  new?: boolean;
  offer?: boolean;
  offer_tag_en?: string;
  offer_tag_bn?: string;
  tags: string[];
  rating: number;
  review_count: number;
  keywords_en: string[];
  keywords_bn: string[];
  search_aliases: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  area: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  status: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  timeline: {
    status: string;
    title_en: string;
    title_bn: string;
    time: string;
    completed: boolean;
    current?: boolean;
  }[];
}

export interface FilterState {
  category: string;
  brand: string[];
  priceRange: [number, number];
  size: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  searchQuery: string;
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'newest' | 'popular' | 'discount';
}
