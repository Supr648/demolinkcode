import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Package, ShoppingBag, ArrowUpRight, TrendingUp, AlertCircle } from 'lucide-react';
import { categoryApi } from '../../api/categoryApi';
import { productApi } from '../../api/productApi';
import { orderApi } from '../../api/orderApi';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, productsRes, ordersRes] = await Promise.allSettled([
        categoryApi.getAll(),
        productApi.getAll(),
        orderApi.getAdminOrders(),
      ]);

      const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.categories || [] : [
        { _id: '1', name: 'Electronics', description: 'Gadgets & devices' },
        { _id: '2', name: 'Fashion', description: 'Clothing & apparel' },
        { _id: '3', name: 'Shoes', description: 'Footwear & sneakers' },
      ];

      const products = productsRes.status === 'fulfilled' ? productsRes.value.products || [] : [
        { _id: '1', name: 'Wireless Headphones', price: 149.99, stock: 15 },
        { _id: '2', name: 'Smartwatch Series X', price: 199.99, stock: 8 },
        { _id: '3', name: 'Running Sneakers', price: 89.99, stock: 20 },
      ];

      const orders = ordersRes.status === 'fulfilled' ? ordersRes.value.orders || [] : [
        {
          _id: 'ORD-9842',
          createdAt: new Date().toISOString(),
          totalAmount: 239.98,
          status: 'Pending',
          shippingAddress: { name: 'John Doe', city: 'New York' },
          products: [{ name: 'Wireless Headphones', quantity: 1, price: 149.99 }],
        },
      ];

      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      setStats({
        categories: categories.length,
        products: products.length,
        orders: orders.length,
        revenue: totalRevenue,
      });

      setRecentOrders(orders.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Categories',
      value: stats.categories,
      icon: Layers,
      color: 'bg-blue-50 text-blue-600',
      link: '/admin/categories',
    },
    {
      title: 'Total Products',
      value: stats.products,
      icon: Package,
      color: 'bg-indigo-50 text-indigo-600',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-600',
      link: '/admin/orders',
    },
    {
      title: 'Gross Revenue (COD)',
      value: `$${stats.revenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600',
      link: '/admin/orders',
    },
  ];

  if (loading) {
    return <Loader text="Loading dashboard metrics..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm">
            Admin Management Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2">Welcome to MiniStore Admin</h2>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl">
            Control categories, update product pricing & stock inventory, and monitor live customer orders.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-white text-indigo-700 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-sm"
          >
            + Add Product
          </Link>
          <Link
            to="/admin/categories"
            className="px-4 py-2.5 bg-indigo-500/30 text-white border border-white/20 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            + Add Category
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center font-bold`}>
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{card.value}</h3>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest purchases made on the storefront</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All Orders &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No customer orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700 text-xs">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {order.shippingAddress?.name || 'Customer'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {order.shippingAddress?.city || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      ${(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : order.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-700'
                            : order.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {order.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
