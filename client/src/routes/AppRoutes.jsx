import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, Store } from 'lucide-react';

function SimpleStorePlaceholder() {
  const { user, isAdmin } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            M
          </div>
          <span className="font-bold text-slate-800 text-lg">MiniStore</span>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Console</span>
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-5">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Mini E-Commerce Storefront
        </h1>
        <p className="text-slate-500 mt-3 max-w-lg mx-auto text-sm sm:text-base">
          The public storefront is currently assigned to collaborator <strong>@shivamubarhande60-cell</strong> (Issue #3).
          You are logged in as <strong>{user?.name || 'Store Admin'}</strong>.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
          >
            <span>Open Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-200">
        Mini E-Commerce Demo Project &bull; MERN Stack
      </footer>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Storefront Landing Page */}
      <Route path="/" element={<SimpleStorePlaceholder />} />

      {/* Protected Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Route>

      {/* Catch-all redirect to Admin or Home */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
