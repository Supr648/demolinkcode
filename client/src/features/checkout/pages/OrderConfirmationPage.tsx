import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, Calendar, Home, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { apiClient } from '@/api/client';
import { Order } from '@/types/order';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(
    (location.state as any)?.order || null
  );
  const [isLoading, setIsLoading] = useState(!order);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || order) return;
      try {
        setIsLoading(true);
        const res = await apiClient.get<{ order: Order }>(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, order]);

  // Calculate estimated delivery: 3 days ahead
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8">
      {/* Success Badge & Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xl animate-in zoom-in-50 duration-300">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-ink-primary">
          Order Confirmed! 🎉
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto">
          Thank you for shopping with LUMINA. We&apos;ve sent a confirmation email and will notify you when your items dispatch.
        </p>
        <div className="inline-block bg-slate-100 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-ink-primary">
          Order ID: #{id || 'ORD-982173'}
        </div>
      </div>

      {/* Delivery Status Card */}
      <div className="bg-brand-50/70 border border-brand-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">Estimated Delivery</span>
            <h3 className="text-base sm:text-lg font-black text-brand-950">
              {estimatedDelivery.toLocaleDateString('en-IN', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </h3>
          </div>
        </div>

        <Link to="/account/orders">
          <Button variant="outline" size="sm" className="bg-white border-brand-300 text-brand-700 hover:bg-brand-50">
            <Package className="w-4 h-4 mr-1.5" />
            Track Order
          </Button>
        </Link>
      </div>

      {/* Details Box */}
      {order && (
        <div className="bg-surface-raised border border-edge-subtle rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-primary pb-3 border-b border-edge-subtle">
            Order Summary
          </h2>

          {/* Items */}
          <div className="divide-y divide-edge-subtle">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-edge-subtle"
                    />
                  )}
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-ink-primary">{item.name}</p>
                    <p className="text-xs text-ink-muted">Qty: {item.qty} × {formatCurrency(item.price)}</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-ink-primary">
                  {formatCurrency(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-edge-subtle space-y-2 text-xs text-ink-secondary">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-ink-primary">{formatCurrency(order.itemsPrice || 0)}</span>
            </div>
            {(order.discountPrice || 0) > 0 && (
              <div className="flex justify-between text-status-success font-semibold">
                <span>Discount</span>
                <span>-{formatCurrency(order.discountPrice || 0)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{order.shippingPrice === 0 ? <span className="text-status-success font-bold">FREE</span> : formatCurrency(order.shippingPrice || 0)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-edge-subtle text-base font-black text-ink-primary">
              <span>Total Paid / Due</span>
              <span className="text-brand-600">{formatCurrency(order.totalPrice || 0)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link to="/products" className="w-full sm:w-auto">
          <Button variant="primary" size="lg" fullWidth className="sm:px-8">
            <Home className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};
