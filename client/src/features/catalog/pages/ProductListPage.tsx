import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { Product, Category } from '@/types/catalog';
import { ProductGrid } from '../components/ProductGrid';
import { ProductFilters, FilterState } from '../components/ProductFilters';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { SlidersHorizontal, X } from 'lucide-react';

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read filters from URL
  const filters: FilterState = useMemo(() => ({
    category: searchParams.get('category') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 0,
    inStockOnly: searchParams.get('inStock') === 'true',
    sortBy: searchParams.get('sort') || 'featured',
  }), [searchParams]);

  const searchQuery = searchParams.get('search') || '';

  // Update URL params
  const updateFilters = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice > 0) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.inStockOnly) params.set('inStock', 'true');
    if (newFilters.sortBy && newFilters.sortBy !== 'featured') params.set('sort', newFilters.sortBy);
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params);
  };

  // Fetch products and categories
  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const queryArgs = new URLSearchParams();
        if (searchQuery) queryArgs.set('search', searchQuery);
        if (filters.category) queryArgs.set('category', filters.category);
        if (filters.minPrice > 0) queryArgs.set('minPrice', filters.minPrice.toString());
        if (filters.maxPrice > 0) queryArgs.set('maxPrice', filters.maxPrice.toString());
        if (filters.inStockOnly) queryArgs.set('inStock', 'true');
        if (filters.sortBy) queryArgs.set('sort', filters.sortBy);

        const [prodRes, catRes] = await Promise.all([
          apiClient.get<{ products: Product[] }>(`/products?${queryArgs.toString()}`),
          apiClient.get<{ categories: Category[] }>('/categories'),
        ]);

        let list = prodRes.data.products || [];

        // Client-side fallback sorting if mock fallback used
        if (filters.sortBy === 'price_asc') {
          list = [...list].sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === 'price_desc') {
          list = [...list].sort((a, b) => b.price - a.price);
        } else if (filters.sortBy === 'rating_desc') {
          list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setProducts(list);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();
  }, [searchParams, filters, searchQuery]);

  // Active filter count for badge
  const activeFilterCount = [
    Boolean(filters.category),
    filters.minPrice > 0,
    filters.maxPrice > 0,
    filters.inStockOnly,
    filters.sortBy !== 'featured',
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-edge-subtle gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink-primary">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : filters.category
              ? `Category: ${categories.find(c => c.slug === filters.category || c._id === filters.category)?.name || filters.category}`
              : 'All Products'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            {isLoading
              ? 'Loading catalog...'
              : `Showing ${products.length} product${products.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {/* Mobile filter toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({activeFilterCount})</span>
          </Button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-ink-muted">Active:</span>
          {filters.category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold border border-brand-200">
              Category: {categories.find(c => c.slug === filters.category || c._id === filters.category)?.name || filters.category}
              <button onClick={() => updateFilters({ ...filters, category: '' })}>
                <X className="w-3.5 h-3.5 hover:text-brand-900" />
              </button>
            </span>
          )}
          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
              In Stock Only
              <button onClick={() => updateFilters({ ...filters, inStockOnly: false })}>
                <X className="w-3.5 h-3.5 hover:text-emerald-900" />
              </button>
            </span>
          )}
          {(filters.minPrice > 0 || filters.maxPrice > 0) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-ink-primary rounded-full text-xs font-semibold border border-edge-subtle">
              ₹{filters.minPrice} - ₹{filters.maxPrice || '∞'}
              <button onClick={() => updateFilters({ ...filters, minPrice: 0, maxPrice: 0 })}>
                <X className="w-3.5 h-3.5 hover:text-ink-secondary" />
              </button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs text-rose-600 hover:underline font-semibold ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid Layout with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block sticky top-28 bg-surface-raised p-5 rounded-2xl border border-edge-subtle shadow-card">
          <ProductFilters
            categories={categories}
            filters={filters}
            onChange={updateFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onClearFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Products"
      >
        <div className="p-5">
          <ProductFilters
            categories={categories}
            filters={filters}
            onChange={(f) => {
              updateFilters(f);
            }}
            onReset={() => {
              handleResetFilters();
              setMobileFilterOpen(false);
            }}
          />
          <div className="pt-6">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setMobileFilterOpen(false)}
            >
              Show Results
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
