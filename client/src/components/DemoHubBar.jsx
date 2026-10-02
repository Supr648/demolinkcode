import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Layers, Package, ShoppingCart } from 'lucide-react';

export const DemoHubBar = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mode Switcher */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-white bg-indigo-600 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
            Demo Hub
          </span>
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
                !isAdminPath
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Customer Store</span>
            </Link>
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
                isAdminPath
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>

        {/* Center: Direct Test Feature Shortcuts */}
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <span className="text-[11px] text-slate-500 mr-1">Quick Test:</span>
          <Link
            to="/products"
            className="hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition"
          >
            Catalog & Filters
          </Link>
          <span className="text-slate-700">•</span>
          <Link
            to="/cart"
            className="hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1"
          >
            <ShoppingCart className="w-3 h-3 text-indigo-400" />
            <span>Cart</span>
          </Link>
          <span className="text-slate-700">•</span>
          <Link
            to="/admin/categories"
            className="hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1"
          >
            <Layers className="w-3 h-3 text-blue-400" />
            <span>Categories CRUD</span>
          </Link>
          <span className="text-slate-700">•</span>
          <Link
            to="/admin/products"
            className="hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1"
          >
            <Package className="w-3 h-3 text-emerald-400" />
            <span>Products CRUD</span>
          </Link>
          <span className="text-slate-700">•</span>
          <Link
            to="/admin/orders"
            className="hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>Orders & Status</span>
          </Link>
        </div>

        {/* Right: Test Credentials Hint */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
          <span>Login:</span>
          <code className="text-indigo-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60">
            admin@demo.com / admin123
          </code>
        </div>
      </div>
    </div>
  );
};
