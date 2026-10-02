import React from 'react';
import { Store, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      {/* Features Bar */}
      <div className="border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Free Express Shipping</h4>
                <p className="text-xs text-slate-500">On all orders with fast doorstep delivery</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Cash on Delivery</h4>
                <p className="text-xs text-slate-500">100% verified pay-at-doorstep guarantee</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Real-time Stock Engine</h4>
                <p className="text-xs text-slate-500">Atomic inventory limits & sync</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Credits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">MiniStore</span>
            <span className="text-xs text-slate-400">| MERN E-Commerce Demo</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
            <Link to="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <Link to="/products" className="hover:text-indigo-600 transition">
              Catalog
            </Link>
            <Link to="/cart" className="hover:text-indigo-600 transition">
              Cart
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} MiniStore. Built with React & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
