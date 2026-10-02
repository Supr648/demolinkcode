import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormData } from '../schemas/checkoutSchema';
import { useCartStore } from '@/features/cart/stores/useCartStore';
import { useAuthStore } from '@/features/account/stores/useAuthStore';
import { apiClient } from '@/api/client';
import { formatCurrency } from '@/lib/formatters';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  QrCode,
  Building2,
  Lock,
  ChevronLeft,
  ShoppingBag,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    getSubtotal,
    getDiscount,
    getShipping,
    getTotal,
    couponCode,
    clearCart,
  } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { error, success } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const total = getTotal();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      paymentMethod: 'COD',
      notes: '',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  // If cart is empty, show empty guard
  if (items.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-ink-primary">Your bag is empty</h2>
        <p className="text-xs text-ink-muted">Add items to your bag before checking out.</p>
        <Link to="/products">
          <Button variant="primary" size="md">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        orderItems: items.map((i) => ({
          product: i.productId,
          name: i.name,
          qty: i.quantity,
          image: i.image,
          price: i.price,
        })),
        shippingAddress: {
          address: data.street,
          city: data.city,
          postalCode: data.zipCode,
          country: data.country,
          phone: data.phone,
        },
        paymentMethod: data.paymentMethod,
        itemsPrice: subtotal,
        taxPrice: 0,
        shippingPrice: shipping,
        discountPrice: discount,
        totalPrice: total,
        couponCode: couponCode || undefined,
        customerName: data.name,
        customerEmail: data.email,
      };

      const res = await apiClient.post<{ order: { _id: string } }>('/orders', orderPayload);
      const createdOrder = res.data.order;

      clearCart();
      success('Order placed successfully!');
      navigate(`/order-confirmation/${createdOrder._id}`, {
        state: { order: createdOrder, formData: data, total },
      });
    } catch (err: any) {
      console.error('Order creation error:', err);
      error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-edge-subtle">
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-brand-600 mb-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Bag
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-ink-primary">Checkout</h1>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SSL Encrypted Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (Contact, Shipping, Payment) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Contact Information */}
            <div className="bg-surface-raised border border-edge-subtle rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-edge-subtle pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink-primary">
                  1. Contact Information
                </h2>
                {!isAuthenticated && (
                  <Link to="/login" className="text-xs text-brand-600 font-semibold hover:underline">
                    Already have an account? Sign In
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Rahul Sharma"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="rahul@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Phone Number (for delivery SMS updates) *"
                    placeholder="e.g. 9876543210"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-surface-raised border border-edge-subtle rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
              <div className="border-b border-edge-subtle pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink-primary">
                  2. Shipping Address
                </h2>
              </div>

              <div className="space-y-4">
                <Input
                  label="Street Address / Flat / Building *"
                  placeholder="e.g. Flat 402, Sunshine Heights, MG Road"
                  {...register('street')}
                  error={errors.street?.message}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City *"
                    placeholder="e.g. Bengaluru"
                    {...register('city')}
                    error={errors.city?.message}
                  />
                  <Input
                    label="State *"
                    placeholder="e.g. Karnataka"
                    {...register('state')}
                    error={errors.state?.message}
                  />
                  <Input
                    label="PIN / Postal Code *"
                    placeholder="e.g. 560001"
                    {...register('zipCode')}
                    error={errors.zipCode?.message}
                  />
                </div>

                <Input
                  label="Delivery Instructions (Optional)"
                  placeholder="e.g. Leave with security guard if unavailable"
                  {...register('notes')}
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-surface-raised border border-edge-subtle rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
              <div className="border-b border-edge-subtle pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink-primary">
                  3. Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setValue('paymentMethod', 'COD')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-3 transition-all ${
                    selectedPaymentMethod === 'COD'
                      ? 'border-brand-500 bg-brand-50/50 shadow-sm ring-2 ring-brand-500/20'
                      : 'border-edge-subtle hover:border-edge-strong bg-surface'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-brand-600" />
                  <div>
                    <p className="text-xs font-bold text-ink-primary">Cash on Delivery</p>
                    <p className="text-[10px] text-ink-muted">Pay in cash or UPI upon delivery</p>
                  </div>
                </button>

                {/* UPI / QR */}
                <button
                  type="button"
                  onClick={() => setValue('paymentMethod', 'UPI')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-3 transition-all ${
                    selectedPaymentMethod === 'UPI'
                      ? 'border-brand-500 bg-brand-50/50 shadow-sm ring-2 ring-brand-500/20'
                      : 'border-edge-subtle hover:border-edge-strong bg-surface'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-ink-primary">Instant UPI</p>
                    <p className="text-[10px] text-ink-muted">GPay, PhonePe, Paytm</p>
                  </div>
                </button>

                {/* Credit / Debit Card */}
                <button
                  type="button"
                  onClick={() => setValue('paymentMethod', 'Card')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-3 transition-all ${
                    selectedPaymentMethod === 'Card'
                      ? 'border-brand-500 bg-brand-50/50 shadow-sm ring-2 ring-brand-500/20'
                      : 'border-edge-subtle hover:border-edge-strong bg-surface'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs font-bold text-ink-primary">Cards & NetBanking</p>
                    <p className="text-[10px] text-ink-muted">Visa, Mastercard, RuPay</p>
                  </div>
                </button>
              </div>

              {selectedPaymentMethod === 'COD' && (
                <div className="p-3 bg-slate-50 border border-edge-subtle rounded-xl text-xs text-ink-secondary">
                  💡 <strong>Cash on Delivery selected:</strong> No advance payment required. Please keep exact change or UPI ready at the time of delivery.
                </div>
              )}
            </div>
          </div>

          {/* Right Summary Panel */}
          <div className="lg:col-span-4 bg-surface-raised border border-edge-subtle rounded-2xl p-6 shadow-card space-y-6">
            <h2 className="text-base font-black text-ink-primary">Order Review</h2>

            {/* Item Mini List */}
            <div className="divide-y divide-edge-subtle/60 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink-primary truncate">{item.name}</p>
                      <p className="text-[10px] text-ink-muted">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-ink-primary shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Totals */}
            <div className="space-y-2 text-xs text-ink-secondary border-t border-edge-subtle pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-ink-primary">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-status-success font-medium">
                  <span>Discount {couponCode ? `(${couponCode})` : ''}</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-status-success font-bold">FREE</span> : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-edge-subtle text-base font-black text-ink-primary">
                <span>Total Due</span>
                <span className="text-brand-600">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                className="shadow-xl shadow-brand-500/25"
              >
                <Lock className="w-4 h-4 mr-1.5" />
                <span>Place Order • {formatCurrency(total)}</span>
              </Button>

              <p className="text-[11px] text-center text-ink-subtle leading-tight">
                By placing your order, you agree to our Terms of Use and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
