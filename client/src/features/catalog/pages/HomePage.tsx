import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { Product, Category } from '@/types/catalog';
import { ProductGrid } from '../components/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Star, TrendingUp } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          apiClient.get<{ products: Product[] }>('/products?limit=8'),
          apiClient.get<{ categories: Category[] }>('/categories'),
        ]);
        setFeaturedProducts(prodRes.data.products || []);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 text-white p-6 sm:p-12 lg:p-16 shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-brand-200">
              <Sparkles className="w-3.5 h-3.5 text-brand-300" />
              <span>New Fall 2026 Collection Dropped</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Elevate Your Everyday <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 via-white to-brand-300">
                With Precision Gear.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Explore high-fidelity acoustics, luxury smart wearables, and ergonomic footwear designed for peak performance and uncompromising aesthetics.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/products">
                <Button variant="primary" size="lg" className="shadow-lg shadow-brand-500/40">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/products?category=audio">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  Shop Audio Drops
                </Button>
              </Link>
            </div>

            {/* Micro proof points */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-md">
              <div>
                <div className="text-xl font-extrabold text-white">50k+</div>
                <div className="text-[11px] text-slate-400">Happy Shoppers</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">4.9 ★</div>
                <div className="text-[11px] text-slate-400">Verified Rating</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">2-Day</div>
                <div className="text-[11px] text-slate-400">Express Delivery</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-gradient-to-b from-white/10 to-transparent p-4 backdrop-blur-md">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Featured Headphone"
                className="w-full h-full object-cover rounded-2xl shadow-inner transform hover:scale-105 transition-transform duration-700"
              />
              {/* Floating feature chip */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-brand-300 font-bold">Spotlight</p>
                  <p className="text-sm font-bold">SonicPro Wireless X9</p>
                </div>
                <span className="text-sm font-extrabold text-brand-300">₹14,999</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills / Quick Discovery */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-ink-primary">Shop by Category</h2>
            <p className="text-xs sm:text-sm text-ink-muted">Curated departments for your lifestyle</p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat.slug || cat._id}`}
              className="group relative overflow-hidden rounded-2xl bg-surface-raised border border-edge-subtle p-5 shadow-card hover:shadow-card-hover hover:border-brand-500/50 transition-all duration-300"
            >
              <div className="flex flex-col h-full justify-between space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-primary group-hover:text-brand-500 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-ink-muted line-clamp-1">{cat.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-ink-primary">Featured Drops</h2>
            <p className="text-xs sm:text-sm text-ink-muted">Hand-picked gear with our highest customer satisfaction</p>
          </div>

          <Link to="/products">
            <Button variant="outline" size="sm">
              Browse All Products
            </Button>
          </Link>
        </div>

        <ProductGrid products={featuredProducts} isLoading={loading} />
      </section>

      {/* Promo Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-700 text-white p-8 sm:p-12 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <Badge variant="sale" size="md" className="bg-white text-brand-700 font-extrabold">
            LIMITED TIME OFFER
          </Badge>
          <h3 className="text-2xl sm:text-3xl font-black">Get 10% Extra Off Your First Order</h3>
          <p className="text-xs sm:text-sm text-brand-100 max-w-lg">
            Use voucher code <span className="font-mono font-black text-white bg-white/20 px-2 py-0.5 rounded">DEMO10</span> at checkout. Valid across all acoustics & tech.
          </p>
        </div>
        <Link to="/products">
          <Button variant="secondary" size="lg" className="bg-white text-ink-primary hover:bg-slate-100 shrink-0 font-extrabold">
            Claim Discount Now
          </Button>
        </Link>
      </section>
    </div>
  );
};
