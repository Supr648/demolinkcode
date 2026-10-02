/**
 * Global Configuration for Currency & Locale
 */
export const LOCALE_CONFIG = {
  locale: 'en-IN',
  currency: 'INR',
  currencySymbol: '₹',
} as const;

const currencyFormatter = new Intl.NumberFormat(LOCALE_CONFIG.locale, {
  style: 'currency',
  currency: LOCALE_CONFIG.currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Format numerical amount into localized currency string (Default: INR en-IN)
 */
export function formatPrice(amount: number | string | undefined | null): string {
  const numericAmount = Number(amount) || 0;
  return currencyFormatter.format(numericAmount);
}

export const formatCurrency = formatPrice;

/**
 * Format Date into readable string
 */
export function formatDate(dateString: string | Date | undefined | null): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat(LOCALE_CONFIG.locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return String(dateString);
  }
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export const calculateDiscountPercentage = calculateDiscount;
