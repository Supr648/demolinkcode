import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-raised border-t border-edge-subtle mt-auto">
      {/* Value Proposition Badges */}
      <div className="border-b border-edge-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-ink-primary">Free Express Delivery</h4>
                <p className="text-[11px] text-ink-muted">On all orders above ₹1,000</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-ink-primary">100% Authentic</h4>
                <p className="text-[11px] text-ink-muted">Direct from authorized brands</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-ink-primary">Easy 7-Day Returns</h4>
                <p className="text-[11px] text-ink-muted">No questions asked refund</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-ink-primary">Secure Checkout</h4>
                <p className="text-[11px] text-ink-muted">256-bit SSL encrypted & COD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-ink-primary">
                LUMINA<span className="text-brand-500">.</span>
              </span>
            </Link>
            <p className="text-xs text-ink-secondary leading-relaxed max-w-sm">
              Discover cutting-edge audio, premium wearables, footwear, and consumer electronics curated for precision, style, and everyday excellence.
            </p>
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <span>Prices in <strong>INR (₹)</strong> including all applicable taxes.</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-ink-primary mb-3">
              Categories
            </h5>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li><Link to="/products?category=audio" className="hover:text-brand-500">Audio & Sound</Link></li>
              <li><Link to="/products?category=wearables" className="hover:text-brand-500">Smart Wearables</Link></li>
              <li><Link to="/products?category=electronics" className="hover:text-brand-500">Electronics</Link></li>
              <li><Link to="/products?category=footwear" className="hover:text-brand-500">Footwear & Lifestyle</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-ink-primary mb-3">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs text-ink-secondary">
              <li><Link to="/account/orders" className="hover:text-brand-500">Track Order</Link></li>
              <li><a href="#returns" className="hover:text-brand-500">Return Policy</a></li>
              <li><a href="#shipping" className="hover:text-brand-500">Shipping & Delivery</a></li>
              <li><a href="#faq" className="hover:text-brand-500">Help & FAQs</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-ink-primary mb-3">
              Newsletter
            </h5>
            <p className="text-xs text-ink-secondary mb-3">
              Subscribe to receive private drops and seasonal vouchers.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-surface border border-edge-subtle rounded-xl text-xs focus:outline-none focus:border-brand-500"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-brand-500 text-white font-bold text-xs rounded-xl hover:bg-brand-600 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-edge-subtle flex flex-col sm:flex-row items-center justify-between text-[11px] text-ink-muted gap-4">
          <p>© {new Date().getFullYear()} LUMINA Storefront. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <a href="#security" className="hover:underline">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
