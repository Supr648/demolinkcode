export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
  category?: string;
  selectedVariants?: Record<string, string>;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  estimatedTax: number;
  total: number;
  itemCount: number;
}
