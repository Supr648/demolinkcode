import React from 'react';
import { Category } from '@/types/catalog';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { RotateCcw, Filter, Check } from 'lucide-react';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: string;
}

interface ProductFiltersProps {
  categories: Category[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  className?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  filters,
  onChange,
  onReset,
  className = '',
}) => {
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating_desc', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest Arrivals' },
  ];

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-edge-subtle">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-primary">Filters</h2>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          Sort By
        </label>
        <Select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
          options={sortOptions}
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          Categories
        </label>
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
          <button
            onClick={() => onChange({ ...filters, category: '' })}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
              filters.category === ''
                ? 'bg-brand-500 text-white font-bold shadow-sm'
                : 'text-ink-secondary hover:bg-slate-100'
            }`}
          >
            <span>All Categories</span>
            {filters.category === '' && <Check className="w-3.5 h-3.5" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onChange({ ...filters, category: cat.slug || cat._id })}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                filters.category === cat.slug || filters.category === cat._id
                  ? 'bg-brand-500 text-white font-bold shadow-sm'
                  : 'text-ink-secondary hover:bg-slate-100'
              }`}
            >
              <span>{cat.name}</span>
              {(filters.category === cat.slug || filters.category === cat._id) && (
                <Check className="w-3.5 h-3.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[11px] text-ink-muted">Min</span>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) =>
                onChange({ ...filters, minPrice: Number(e.target.value) || 0 })
              }
              placeholder="0"
              className="w-full mt-1 px-2.5 py-1.5 bg-surface border border-edge-subtle rounded-xl text-xs text-ink-primary focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <span className="text-[11px] text-ink-muted">Max</span>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                onChange({ ...filters, maxPrice: Number(e.target.value) || 0 })
              }
              placeholder="50000"
              className="w-full mt-1 px-2.5 py-1.5 bg-surface border border-edge-subtle rounded-xl text-xs text-ink-primary focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* In Stock Only */}
      <div className="pt-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded text-brand-500 border-edge-subtle focus:ring-brand-500/20"
          />
          <span className="text-xs font-semibold text-ink-primary">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
};
