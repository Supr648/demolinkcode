import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Zap, Layers } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Loader';
import EmptyState from '../components/EmptyState';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          axiosClient.get('/products'),
          axiosClient.get('/categories'),
        ]);

        if (prodRes.status === 'fulfilled') {
          const prods = prodRes.value.data?.products || prodRes.value.data || [];
          setFeaturedProducts(Array.isArray(prods) ? prods.slice(0, 8) : []);
        }

        if (catRes.status === 'fulfilled') {
          const cats = catRes.value.data?.categories || catRes.value.data || [];
          setCategories(Array.isArray(cats) ? cats : []);
        }
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fallbackCategories = [
    { _id: 'electronics', name: 'Electronics', icon: '💻', count: 'Latest Gadgets' },
    { _id: 'fashion', name: 'Fashion', icon: '👕', count: 'Apparel & Trends' },
    { _id: 'shoes', name: 'Footwear', icon: '👟', count: 'Athletic & Casual' },
    { _id: 'accessories', name: 'Accessories', icon: '⌚', count: 'Smart Watches & More' },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  return (
    <div className="space-y-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Next-Gen E-Commerce Experience
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Discover Premium <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
              Products & Essentials
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Experience lightning-fast browsing with instant cart synchronization, atomic stock
            guards, and verified Cash-on-Delivery checkout.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-900/50 transition active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              Explore Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl backdrop-blur-md border border-white/10 transition"
            >
              View Special Deals
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-20 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Category Quick Browse */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Featured Categories
            </h2>
            <p className="text-sm text-slate-500">Shop curated collections by product category</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {displayCategories.map((cat, idx) => (
            <Link
              key={cat._id || idx}
              to={`/products?category=${encodeURIComponent(cat.name || cat)}`}
              className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col items-center text-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center text-2xl transition duration-300 shadow-inner">
                {cat.icon || <Layers className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition text-base">
                  {cat.name || cat}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {cat.description || cat.count || 'Explore items'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Trending Products
            </h2>
            <p className="text-sm text-slate-500">Top selling items with real-time stock status</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All ({featuredProducts.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No featured products yet"
            description="Our catalog is currently being updated. Check back soon!"
            actionText="Browse All Products"
            actionLink="/products"
          />
        )}
      </section>
    </div>
  );
};

export default Home;
