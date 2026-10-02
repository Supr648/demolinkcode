import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartTotals } from '../../../types/cart';
import { Product } from '../../../types/catalog';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  discountCode: string | null;
  discountPercentage: number;
  lastError: string | null;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => { success: boolean; message?: string };
  updateQuantity: (productIdOrId: string, quantity: number) => { success: boolean; message?: string };
  removeItem: (productIdOrId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  removeDiscountCode: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
  getTotals: () => CartTotals;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      discountCode: null,
      discountPercentage: 0,
      lastError: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1, selectedVariants) => {
        if (!product || !product._id) {
          return { success: false, message: 'Invalid product' };
        }

        const availableStock = Number(product.stock) || 0;
        if (availableStock <= 0) {
          return { success: false, message: `"${product.name}" is currently out of stock.` };
        }

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item._id === product._id || (item as any).productId === product._id
        );

        const img = product.images?.[0] || (product as any).image || '';

        if (existingIndex > -1) {
          const currentQty = currentItems[existingIndex].quantity;
          const targetQty = currentQty + quantity;

          if (targetQty > availableStock) {
            return {
              success: false,
              message: `Cannot add more. Maximum available stock is ${availableStock} (you have ${currentQty} in cart).`,
            };
          }

          const updated = [...currentItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: targetQty,
            stock: availableStock,
            price: product.price,
            selectedVariants: selectedVariants || updated[existingIndex].selectedVariants,
            selectedOptions: selectedVariants || (updated[existingIndex] as any).selectedOptions,
          };

          set({ items: updated, isOpen: true });
          return { success: true };
        } else {
          if (quantity > availableStock) {
            return {
              success: false,
              message: `Only ${availableStock} item(s) available in stock.`,
            };
          }

          const newItem: CartItem = {
            _id: product._id,
            productId: product._id,
            name: product.name,
            price: Number(product.price),
            image: img,
            stock: availableStock,
            quantity: Math.max(1, quantity),
            category: typeof product.category === 'object' ? product.category.name : product.category,
            selectedVariants,
            selectedOptions: selectedVariants,
          } as any;

          set({ items: [...currentItems, newItem], isOpen: true });
          return { success: true };
        }
      },

      updateQuantity: (productIdOrId, quantity) => {
        const currentItems = get().items;
        const existing = currentItems.find(
          (item) => item._id === productIdOrId || (item as any).productId === productIdOrId
        );
        if (!existing) return { success: false };

        if (quantity <= 0) {
          get().removeItem(productIdOrId);
          return { success: true };
        }

        if (quantity > existing.stock) {
          return {
            success: false,
            message: `Cannot increase quantity. Maximum available stock is ${existing.stock}.`,
          };
        }

        const updated = currentItems.map((item) =>
          item._id === productIdOrId || (item as any).productId === productIdOrId
            ? { ...item, quantity }
            : item
        );
        set({ items: updated });
        return { success: true };
      },

      removeItem: (productIdOrId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item._id !== productIdOrId && (item as any).productId !== productIdOrId
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: null, discountCode: null, discountPercentage: 0 });
      },

      applyCoupon: (code) => {
        const cleaned = code.trim().toUpperCase();
        if (cleaned === 'DEMO10' || cleaned === 'SAVE10') {
          set({ couponCode: cleaned, discountCode: cleaned, discountPercentage: 10 });
          return { success: true, message: 'Coupon applied! 10% discount added.' };
        } else if (cleaned === 'SPECIAL20' || cleaned === 'MINI20') {
          set({ couponCode: cleaned, discountCode: cleaned, discountPercentage: 20 });
          return { success: true, message: 'Coupon applied! 20% discount added.' };
        }
        return { success: false, message: 'Invalid promo code. Try DEMO10 or MINI20.' };
      },

      applyDiscountCode: (code) => get().applyCoupon(code),

      removeCoupon: () => {
        set({ couponCode: null, discountCode: null, discountPercentage: 0 });
      },

      removeDiscountCode: () => get().removeCoupon(),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const discountPercentage = get().discountPercentage;
        return (subtotal * discountPercentage) / 100;
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 1000 ? 0 : 150;
      },

      getTax: () => 0, // Included in INR list price

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        const tax = get().getTax();
        return Math.max(0, subtotal - discount + shipping + tax);
      },

      getTotals: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        const estimatedTax = get().getTax();
        const total = get().getTotal();
        const itemCount = get().getItemCount();

        return {
          subtotal,
          discount,
          shipping,
          estimatedTax,
          total,
          itemCount,
        };
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'mini_ecom_cart_store',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountCode: state.discountCode,
        discountPercentage: state.discountPercentage,
      }),
    }
  )
);
