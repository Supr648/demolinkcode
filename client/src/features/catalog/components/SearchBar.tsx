import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '@/types/catalog';
import { formatCurrency } from '@/lib/formatters';
import { apiClient } from '@/api/client';

interface SearchBarProps {
  className?: string;
  onCloseMobile?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className = '', onCloseMobile }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search fetch
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get<{ products: Product[] }>(`/products?search=${encodeURIComponent(query.trim())}&limit=5`);
        setSuggestions(res.data.products || []);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    if (onCloseMobile) onCloseMobile();
  };

  const handleSelectProduct = (product: Product) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/products/${product.slug || product._id}`);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-ink-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder="Search audio, watches, shoes, tech..."
            className="w-full pl-10 pr-10 py-2.5 bg-surface border border-edge-subtle/80 rounded-2xl text-xs sm:text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-inner-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="absolute right-3 p-0.5 text-ink-muted hover:text-ink-primary rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Instant Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-raised border border-edge-subtle rounded-2xl shadow-dropdown z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-ink-subtle">Searching products...</div>
          ) : suggestions.length > 0 ? (
            <div className="py-2 divide-y divide-edge-subtle/50">
              <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Suggestions
              </div>
              {suggestions.map((p) => (
                <button
                  key={p._id}
                  onClick={() => handleSelectProduct(p)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-brand-50/50 transition-colors"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink-primary truncate">{p.name}</p>
                    <p className="text-[11px] text-ink-muted">{formatCurrency(p.price)}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                </button>
              ))}
              <div className="p-2 bg-canvas text-center">
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                >
                  View all results for &quot;{query}&quot;
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-xs text-ink-subtle">
              No products matching &quot;{query}&quot;
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
