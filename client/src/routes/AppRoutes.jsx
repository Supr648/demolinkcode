import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';

// Customer Storefront Components & Pages (Issue #3)
import { StorefrontLayout } from '../components/layout/StorefrontLayout';
import { HomePage } from '../features/catalog/pages/HomePage';
import { ProductListPage } from '../features/catalog/pages/ProductListPage';
import { ProductDetailPage } from '../features/catalog/pages/ProductDetailPage';
import { CartPage } from '../features/cart/pages/CartPage';
import { CheckoutPage } from '../features/checkout/pages/CheckoutPage';
import { OrderConfirmationPage } from '../features/checkout/pages/OrderConfirmationPage';
import { LoginPage } from '../features/account/pages/LoginPage';
import { RegisterPage } from '../features/account/pages/RegisterPage';
import { OrdersPage } from '../features/account/pages/OrdersPage';
import { OrderDetailPage } from '../features/account/pages/OrderDetailPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer Storefront Routes (Issue #3) */}
      <Route path="/" element={<StorefrontLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-confirmation/:id" element={<OrderConfirmationPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="my-orders" element={<OrdersPage />} />
        <Route path="account/orders" element={<OrdersPage />} />
        <Route path="account/orders/:id" element={<OrderDetailPage />} />
      </Route>

      {/* Protected Admin Routes (Issue #4) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Route>

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
