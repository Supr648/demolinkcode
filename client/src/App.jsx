import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StorefrontLayout } from './components/layout/StorefrontLayout';
import { HomePage } from './features/catalog/pages/HomePage';
import { ProductListPage } from './features/catalog/pages/ProductListPage';
import { ProductDetailPage } from './features/catalog/pages/ProductDetailPage';
import { CartPage } from './features/cart/pages/CartPage';
import { CheckoutPage } from './features/checkout/pages/CheckoutPage';
import { OrderConfirmationPage } from './features/checkout/pages/OrderConfirmationPage';
import { LoginPage } from './features/account/pages/LoginPage';
import { RegisterPage } from './features/account/pages/RegisterPage';
import { OrdersPage } from './features/account/pages/OrdersPage';
import { OrderDetailPage } from './features/account/pages/OrderDetailPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StorefrontLayout />}>
          {/* Catalog Routes */}
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />

          {/* Cart & Checkout Routes */}
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation/:id" element={<OrderConfirmationPage />} />

          {/* Customer Auth & Account Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="account/orders" element={<OrdersPage />} />
          <Route path="account/orders/:id" element={<OrderDetailPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
