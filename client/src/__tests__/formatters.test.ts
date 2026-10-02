import { describe, it, expect } from 'vitest';
import { formatPrice, calculateDiscount } from '../lib/formatters';

describe('formatters', () => {
  it('formats INR prices accurately', () => {
    const formatted = formatPrice(14999);
    expect(formatted).toContain('14,999');
  });

  it('calculates discount percentage accurately', () => {
    const discount = calculateDiscount(1500, 2000);
    expect(discount).toBe(25);
  });

  it('returns null if compare price is lower or equal', () => {
    expect(calculateDiscount(2000, 2000)).toBeNull();
    expect(calculateDiscount(2500, 2000)).toBeNull();
  });
});
