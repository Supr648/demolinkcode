import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, LogOut, Package, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/features/cart/stores/useCartStore';
import { useAuthStore } from '@/features/account/stores/useAuthStore';
import { SearchBar } from '@/features/catalog/components/SearchBar';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  const { items, openCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: 'Shop All', href: '/products' },
    { label: 'Audio', href: '/products?category=audio' },
    { label: 'Wearables', href: '/products?category=wearables' },
    { label: 'Electronics', href: '/products?category=electronics' },
    { label: 'Footwear', href: '/products?category=footwear' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-raised/90 backdrop-blur-md border-b border-edge-subtle/80 transition-all">
      {/* Top Banner */}
      <div className="bg-ink-primary text-white text-[11px] py-1.5 px-4 text-center font-medium tracking-wide">
        <span>⚡ Flash Sale: Get 10% off with coupon code <strong className="text-brand-300 font-mono">DEMO10</strong> | Free express delivery on orders over ₹1,000</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ink-primary hover:bg-slate-100 rounded-xl"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-ink-primary group-hover:text-brand-500 transition-colors">
                LUMINA<span className="text-brand-500">.</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-ink-muted -mt-1 font-bold">
                Storefront
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-semibold text-ink-secondary">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="hover:text-brand-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons (Search Mobile, User, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-ink-secondary hover:text-ink-primary hover:bg-slate-100 rounded-xl"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl border border-edge-subtle hover:bg-slate-50 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-ink-primary max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-surface-raised border border-edge-subtle rounded-2xl shadow-dropdown py-2 z-50 animate-in fade-in-0 zoom-in-95"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-edge-subtle/50">
                      <p className="text-xs font-bold text-ink-primary truncate">{user?.name}</p>
                      <p className="text-[11px] text-ink-muted truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/account/orders"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-ink-secondary hover:bg-slate-50 hover:text-brand-600 transition"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-status-danger hover:bg-rose-50 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="sm" className="text-xs">
                    Join
                  </Button>
                </Link>
              </div>
            )}

            {/* Cart Trigger Button with badge */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center p-2.5 rounded-xl bg-ink-primary text-white hover:bg-ink-secondary transition shadow-sm"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden py-3 border-t border-edge-subtle animate-in slide-in-from-top duration-200">
            <SearchBar onCloseMobile={() => setMobileSearchOpen(false)} />
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-edge-subtle space-y-2 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-ink-primary hover:bg-slate-100 transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-edge-subtle">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/register');
                    }}
                  >
                    Register
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink-primary hover:bg-slate-100 rounded-xl"
                  >
                    <Package className="w-4 h-4" />
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-status-danger hover:bg-rose-50 rounded-xl text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
