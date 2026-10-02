import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Package, ChevronRight, ShoppingBag, Clock, CheckCircle } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get<{ orders: Order[] }>('/orders/myorders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'shipped':
        return <Badge variant="accent">Shipped</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="warning">Processing</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-1/4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-edge-subtle pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-ink-primary">My Orders</h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Track shipments, view invoices, and manage past purchases
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="No orders placed yet"
          description="When you purchase items, your order history and live delivery tracker will appear here."
          actionLabel="Start Shopping"
          onAction={() => window.location.assign('/products')}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-surface-raised border border-edge-subtle rounded-2xl p-5 sm:p-6 shadow-card hover:border-brand-500/40 transition space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-edge-subtle/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-ink-primary">#{order._id}</p>
                    <p className="text-[11px] text-ink-muted">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="text-base font-extrabold text-ink-primary">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {order.orderItems.map((item, idx) => (
                    <img
                      key={idx}
                      src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      title={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-edge-subtle shrink-0"
                    />
                  ))}
                  <span className="text-xs text-ink-muted ml-2 font-medium">
                    {order.orderItems.length} item{order.orderItems.length === 1 ? '' : 's'}
                  </span>
                </div>

                <Link
                  to={`/account/orders/${order._id}`}
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  View Details
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
