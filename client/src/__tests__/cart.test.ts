import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../features/cart/stores/useCartStore';
import { Product } from '../types/catalog';

const dummyProduct: Product = {
  _id: 'prod-1',
  name: 'Acoustic Pro Headphones',
  slug: 'acoustic-pro-headphones',
  description: 'High fidelity audio',
  price: 1500,
  originalPrice: 2000,
  category: { _id: 'cat-1', name: 'Audio', slug: 'audio' },
  stock: 5,
  images: ['https://example.com/img1.jpg'],
  rating: 4.8,
  numReviews: 12,
  isFeatured: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('adds items to cart with correct quantity', () => {
    const { addItem, items, getSubtotal } = useCartStore.getState();
    addItem(dummyProduct, 2);

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(2);
    expect(state.getSubtotal()).toBe(3000);
  });

  it('respects maximum stock bounds on add', () => {
    const { addItem } = useCartStore.getState();
    const res1 = addItem(dummyProduct, 3);
    expect(res1.success).toBe(true);
    
    // Adding 3 more when stock is 5 (total 6 > 5) should be blocked
    const res2 = addItem(dummyProduct, 3);
    expect(res2.success).toBe(false);
    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(3);
  });

  it('applies DEMO10 coupon code correctly', () => {
    const { addItem, applyCoupon, getSubtotal, getDiscount, getTotal } = useCartStore.getState();
    addItem(dummyProduct, 2); // 3000

    const result = applyCoupon('DEMO10');
    expect(result.success).toBe(true);

    const state = useCartStore.getState();
    expect(state.getSubtotal()).toBe(3000);
    expect(state.getDiscount()).toBe(300); // 10% of 3000
    expect(state.getShipping()).toBe(0); // >= 1000 threshold
    expect(state.getTotal()).toBe(2700);
  });

  it('calculates shipping fee when under threshold (1000)', () => {
    const lowPriceProduct: Product = {
      ...dummyProduct,
      _id: 'prod-cheap',
      price: 450,
      stock: 10,
    };

    const { addItem, getSubtotal, getShipping, getTotal } = useCartStore.getState();
    addItem(lowPriceProduct, 1);

    const state = useCartStore.getState();
    expect(state.getSubtotal()).toBe(450);
    expect(state.getShipping()).toBe(150); // Shipping fee
    expect(state.getTotal()).toBe(600);
  });
});
