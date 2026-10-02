import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ChevronLeft, Package, MapPin, CreditCard, Truck, CheckCircle2 } from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await apiClient.get<{ order: Order }>(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-ink-primary">Order Not Found</h2>
        <p className="text-xs text-ink-muted">We couldn&apos;t find details for order #{id}.</p>
        <Link to="/account/orders">
          <Button variant="primary" size="sm">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button + Header */}
      <div>
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-brand-600 mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-edge-subtle">
          <div>
            <h1 className="text-2xl font-black text-ink-primary">Order #{order._id}</h1>
            <p className="text-xs text-ink-muted mt-0.5">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <Badge variant={order.status === 'Delivered' ? 'success' : 'warning'} size="md">
            {order.status}
          </Badge>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-surface-raised border border-edge-subtle rounded-2xl p-6 shadow-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-4">
          Order Status Tracker
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center relative">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-ink-primary">Order Placed</p>
            <p className="text-[10px] text-ink-muted">{formatDate(order.createdAt)}</p>
          </div>

          <div className="space-y-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-sm ${
              order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-ink-muted'
            }`}>
              <Truck className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-ink-primary">Dispatched</p>
            <p className="text-[10px] text-ink-muted">{order.status === 'Shipped' ? 'In transit' : 'Pending'}</p>
          </div>

          <div className="space-y-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-sm ${
              order.status === 'Delivered' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-ink-muted'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-ink-primary">Delivered</p>
            <p className="text-[10px] text-ink-muted">{order.status === 'Delivered' ? 'Completed' : 'Estimated 3 days'}</p>
          </div>
        </div>
      </div>

      {/* Order Items & Financials */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Items */}
        <div className="md:col-span-8 bg-surface-raised border border-edge-subtle rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted pb-2 border-b border-edge-subtle">
            Items in Order ({order.orderItems?.length || 0})
          </h3>
          <div className="divide-y divide-edge-subtle">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-edge-subtle"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-ink-primary">{item.name}</h4>
                    <p className="text-xs text-ink-muted">Qty: {item.qty} × {formatCurrency(item.price)}</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-ink-primary">
                  {formatCurrency(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost summary */}
        <div className="md:col-span-4 bg-surface-raised border border-edge-subtle rounded-2xl p-6 shadow-card space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted pb-2 border-b border-edge-subtle">
            Payment & Shipping
          </h3>

          <div className="space-y-2 text-xs text-ink-secondary">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold text-ink-primary">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span>{formatCurrency(order.itemsPrice || 0)}</span>
            </div>
            {(order.discountPrice || 0) > 0 && (
              <div className="flex justify-between text-status-success">
                <span>Discount:</span>
                <span>-{formatCurrency(order.discountPrice || 0)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span>{order.shippingPrice === 0 ? 'FREE' : formatCurrency(order.shippingPrice || 0)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-edge-subtle text-sm font-black text-ink-primary">
              <span>Total Amount:</span>
              <span className="text-brand-600">{formatCurrency(order.totalPrice || 0)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-edge-subtle space-y-1 text-xs">
            <p className="font-bold text-ink-primary flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              Delivery Address:
            </p>
            <p className="text-ink-secondary text-[11px] leading-relaxed">
              {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
