import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
  MapPin,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { Spinner } from '../components/Loader';
import EmptyState from '../components/EmptyState';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/orders/my-orders');
      const list = res.data?.orders || res.data || [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status = 'Pending') => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="w-3.5 h-3.5 text-blue-500" /> Confirmed
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="w-3.5 h-3.5 text-indigo-500" /> Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-500" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return <Spinner size="lg" text="Loading your order history..." />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No Orders Placed Yet"
        description="You haven't placed any orders yet. Discover our latest items and get them delivered to your doorstep."
        actionText="Browse Products"
        actionLink="/products"
      />
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track and view status for all your previous orders ({orders.length})
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-600" /> Refresh
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const formattedDate = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Recent';

          const products = order.products || [];

          return (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Order Card Header */}
              <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Order ID:
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {order._id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Placed on {formattedDate}</p>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="text-base font-black text-slate-900">
                    ${Number(order.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-5 sm:p-6 divide-y divide-slate-100">
                {products.map((item, idx) => {
                  const productData = item.product || {};
                  const itemName = item.name || productData.name || 'Product Item';
                  const itemPrice = item.price || productData.price || 0;
                  const itemImg =
                    productData.image ||
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80';

                  return (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={itemImg}
                          alt={itemName}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{itemName}</p>
                          <p className="text-xs text-slate-500">
                            Quantity: {item.quantity} &times; ${Number(itemPrice).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-bold text-slate-800">
                        ${(Number(itemPrice) * Number(item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Order Footer & Shipping info */}
              {order.shippingAddress && (
                <div className="px-5 sm:px-6 py-4 bg-slate-50/40 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-700">
                      Delivering to: {order.shippingAddress.name} ({order.shippingAddress.phone})
                    </span>
                    <span className="block text-slate-500">
                      {order.shippingAddress.address}, {order.shippingAddress.city} -{' '}
                      {order.shippingAddress.pincode} &bull; Payment:{' '}
                      <span className="font-medium text-slate-700">
                        {order.paymentMethod || 'Cash on Delivery'}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
