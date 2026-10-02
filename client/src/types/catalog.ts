export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  productCount?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'storage';
  options: string[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images?: string[];
  category: Category | string;
  stock: number;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  tags?: string[];
  variants?: ProductVariant[];
}

export interface ProductFiltersState {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'newest';
}
