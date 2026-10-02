import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/features/cart/stores/useCartStore';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import {
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShoppingBag,
  Truck,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDiscount,
    getShipping,
    getTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const { success, error } = useToast();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const total = getTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    const res = applyCoupon(inputCoupon.trim());
    if (res.success) {
      success(res.message);
      setInputCoupon('');
    } else {
      error(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-12 max-w-2xl mx-auto">
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10" />}
          title="Your shopping cart is empty"
          description="Looks like you haven't added any premium products to your cart yet. Explore our latest drops and deals."
          actionLabel="Explore Products"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-edge-subtle gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink-primary">Shopping Cart</h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Review your {items.length} item{items.length === 1 ? '' : 's'} before proceeding to secure checkout
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items Table/List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface-raised border border-edge-subtle rounded-2xl overflow-hidden shadow-card divide-y divide-edge-subtle">
            {items.map((item) => (
              <div key={item.productId} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Image */}
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-100 border border-edge-subtle shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-ink-primary line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-ink-muted">
                    {item.selectedOptions?.color && (
                      <span>Color: <strong>{item.selectedOptions.color}</strong></span>
                    )}
                    {item.selectedOptions?.size && (
                      <span>• Size: <strong>{item.selectedOptions.size}</strong></span>
                    )}
                  </div>
                  <p className="text-xs text-ink-subtle">
                    Unit Price: {formatCurrency(item.price)}
                  </p>
                </div>

                {/* Quantity + Subtotal */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                  <div className="flex items-center border border-edge-subtle rounded-xl bg-surface">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 text-ink-secondary hover:text-ink-primary hover:bg-slate-100 rounded-l-xl transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-ink-primary min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        if (item.quantity >= item.stock) {
                          error(`Max stock (${item.stock}) reached.`);
                          return;
                        }
                        updateQuantity(item.productId, item.quantity + 1);
                      }}
                      disabled={item.quantity >= item.stock}
                      className="p-1.5 text-ink-secondary hover:text-ink-primary hover:bg-slate-100 rounded-r-xl disabled:opacity-40 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-extrabold text-ink-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs text-ink-subtle hover:text-rose-600 transition inline-flex items-center gap-1 mt-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-surface-raised border border-edge-subtle rounded-2xl p-6 shadow-card space-y-6">
          <h2 className="text-base font-black text-ink-primary">Order Summary</h2>

          {/* Promo Code Form */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Discount Code
            </label>
            {couponCode ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-bold">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>&quot;{couponCode}&quot; applied</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  placeholder="Code (e.g. DEMO10)"
                  className="flex-1 px-3 py-2 bg-surface border border-edge-subtle rounded-xl text-xs uppercase focus:outline-none focus:border-brand-500 font-mono"
                />
                <Button type="submit" variant="secondary" size="sm">
                  Apply
                </Button>
              </form>
            )}
          </div>

          {/* Pricing Details */}
          <div className="space-y-2.5 text-xs text-ink-secondary border-y border-edge-subtle py-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-ink-primary">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-status-success font-medium">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>{shipping === 0 ? <span className="text-status-success font-bold">FREE</span> : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between text-xs text-ink-muted">
              <span>Estimated Tax (GST included)</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-edge-subtle text-base font-black text-ink-primary">
              <span>Total Amount</span>
              <span className="text-brand-600">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/checkout')}
              variant="primary"
              size="lg"
              fullWidth
              className="shadow-lg shadow-brand-500/25"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-ink-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure 256-bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
