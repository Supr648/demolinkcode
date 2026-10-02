import React from 'react';
import { Product } from '@/types/catalog';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onClearFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your filters, price range, or search keywords.',
  onClearFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl bg-surface-raised border border-edge-subtle/80 overflow-hidden shadow-card p-4 space-y-3"
          >
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-5 w-3/4" />
            <div className="pt-2 flex justify-between items-center">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-8 w-1/4 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="w-8 h-8" />}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onClearFilters ? 'Clear all filters' : undefined}
        onAction={onClearFilters}
        className="my-8"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
