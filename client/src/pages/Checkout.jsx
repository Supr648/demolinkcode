import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Banknote,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axiosClient from '../api/axiosClient';
import EmptyState from '../components/EmptyState';

export const Checkout = () => {
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your Cart is Empty"
        description="Add some products before proceeding to checkout."
        actionText="Browse Catalog"
        actionLink="/products"
      />
    );
  }

  const subtotal = getCartTotal();
  const totalItems = getCartCount();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{7,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim()) {
      errs.pincode = 'Pincode / Postal code is required';
    } else if (formData.pincode.trim().length < 3) {
      errs.pincode = 'Please enter a valid pincode';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please fill all required shipping fields correctly.', 'error');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        products: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },
        paymentMethod: 'Cash on Delivery',
      };

      const res = await axiosClient.post('/orders', orderPayload);
      clearCart();
      addToast('Order placed successfully! Cash on Delivery confirmed.', 'success');
      navigate('/my-orders');
    } catch (err) {
      console.error('Failed to place order:', err);
      addToast(err.message || 'Failed to process order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Complete your delivery details to confirm your Cash on Delivery order
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Form (Left 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Step 1: Shipping Address */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Shipping Address</h2>
                  <p className="text-xs text-slate-500">Where should we deliver your items?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 bg-slate-50 rounded-xl border text-sm focus:outline-none focus:bg-white transition ${
                      errors.name ? 'border-rose-300 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 555-019-2834"
                    className={`w-full px-4 py-3 bg-slate-50 rounded-xl border text-sm focus:outline-none focus:bg-white transition ${
                      errors.phone ? 'border-rose-300 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600'
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-rose-500">{errors.phone}</p>}
                </div>

                {/* Street Address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Street Address / House No. *
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Innovation Way, Apt 4B"
                    className={`w-full px-4 py-3 bg-slate-50 rounded-xl border text-sm focus:outline-none focus:bg-white transition resize-none ${
                      errors.address ? 'border-rose-300 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600'
                    }`}
                  />
                  {errors.address && <p className="text-xs text-rose-500">{errors.address}</p>}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="San Francisco"
                    className={`w-full px-4 py-3 bg-slate-50 rounded-xl border text-sm focus:outline-none focus:bg-white transition ${
                      errors.city ? 'border-rose-300 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600'
                    }`}
                  />
                  {errors.city && <p className="text-xs text-rose-500">{errors.city}</p>}
                </div>

                {/* Pincode */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pincode / Postal Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="94107"
                    className={`w-full px-4 py-3 bg-slate-50 rounded-xl border text-sm focus:outline-none focus:bg-white transition ${
                      errors.pincode ? 'border-rose-300 focus:ring-2 focus:ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600'
                    }`}
                  />
                  {errors.pincode && <p className="text-xs text-rose-500">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Selection */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Payment Option</h2>
                  <p className="text-xs text-slate-500">Select payment method for this order</p>
                </div>
              </div>

              {/* COD Card */}
              <div className="p-4 rounded-2xl border-2 border-indigo-600 bg-indigo-50/40 flex items-start gap-4">
                <div className="p-2 rounded-xl bg-indigo-600 text-white mt-0.5">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Cash on Delivery (COD)</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Pay securely in cash or UPI when your order is delivered to your doorstep. No
                    online card required.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition active:scale-95 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing Order...
                </>
              ) : (
                <>
                  Confirm Order &bull; ${subtotal.toFixed(2)}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Review Sidebar (Right 1 Col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs text-indigo-600 font-bold">{totalItems} item(s)</span>
            </h2>

            {/* Mini Items List */}
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="py-3 flex items-center gap-3">
                  <img
                    src={
                      item.image ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'
                    }
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Qty: {item.quantity} &times; ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Express Delivery</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline text-sm">
                <span className="font-bold text-slate-900">Total Payable</span>
                <span className="text-xl font-black text-indigo-600">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
