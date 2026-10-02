import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/features/cart/stores/useCartStore';
import { formatCurrency } from '@/lib/formatters';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export const CartDrawer: React.FC = () => {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDiscount,
    getTax,
    getShipping,
    getTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const { success, error } = useToast();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const total = getTotal();
  const freeShippingThreshold = 1000;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;

    const res = applyCoupon(inputCoupon.trim());
    if (res.success) {
      success(res.message);
      setInputCoupon('');
    } else {
      setCouponError(res.message);
      error(res.message);
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Drawer isOpen={isOpen} onClose={closeCart} title={`Your Bag (${items.reduce((acc, i) => acc + i.quantity, 0)})`}>
      <div className="flex flex-col h-full">
        {/* Free Shipping Progress bar */}
        <div className="p-3.5 bg-brand-50/70 border-b border-brand-100">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-900 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-brand-600" />
              {amountToFreeShipping === 0
                ? '🎉 You unlocked Free Express Shipping!'
                : `Add ${formatCurrency(amountToFreeShipping)} more for Free Shipping`}
            </span>
            <span>{progressToFreeShipping}%</span>
          </div>
          <div className="w-full h-1.5 bg-brand-200/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-ink-muted mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-ink-primary mb-1">Your cart is empty</h3>
              <p className="text-xs text-ink-muted max-w-xs mb-6">
                Discover our latest premium products and build your cart.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  closeCart();
                  navigate('/products');
                }}
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-edge-subtle/60">
              {items.map((item) => (
                <div key={item.productId} className="py-3.5 first:pt-0 last:pb-0 flex gap-3.5">
                  {/* Thumbnail */}
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-100 shrink-0 border border-edge-subtle/50"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-ink-primary line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs font-extrabold text-ink-primary mt-0.5">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-ink-subtle hover:text-status-danger p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quantity Selector + Stock Warning */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-edge-subtle rounded-lg bg-surface">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 sm:p-1.5 text-ink-secondary hover:text-ink-primary hover:bg-slate-100 rounded-l-md transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-ink-primary min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (item.quantity >= item.stock) {
                              error(`Only ${item.stock} items in stock.`);
                              return;
                            }
                            updateQuantity(item.productId, item.quantity + 1);
                          }}
                          disabled={item.quantity >= item.stock}
                          className="p-1 sm:p-1.5 text-ink-secondary hover:text-ink-primary hover:bg-slate-100 rounded-r-md disabled:opacity-40 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {item.quantity >= item.stock && (
                        <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                          Max stock reached
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-surface-raised border-t border-edge-subtle space-y-3.5">
            {/* Coupon Code Input */}
            {couponCode ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Coupon &quot;{couponCode}&quot; Applied</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-semibold text-rose-600 hover:underline"
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
                  placeholder="Promo code (try DEMO10)"
                  className="flex-1 px-3 py-2 bg-surface border border-edge-subtle rounded-xl text-xs uppercase focus:outline-none focus:border-brand-500 font-mono"
                />
                <Button type="submit" variant="secondary" size="sm">
                  Apply
                </Button>
              </form>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-ink-secondary">
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
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-status-success font-semibold">FREE</span> : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-edge-subtle text-sm font-extrabold text-ink-primary">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <Button
                onClick={handleCheckout}
                variant="primary"
                size="lg"
                fullWidth
                className="shadow-lg shadow-brand-500/20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/cart');
                }}
                className="w-full text-center text-xs font-semibold text-brand-600 hover:underline py-1"
              >
                View full cart page
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
