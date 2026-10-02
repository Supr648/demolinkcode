import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/catalog';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/features/cart/stores/useCartStore';
import { useToast } from '@/components/ui/Toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items } = useCartStore();
  const { success, error } = useToast();

  const isOutOfStock = product.stock <= 0;
  const cartItem = items.find((i) => i.productId === product._id);
  const currentInCart = cartItem ? cartItem.quantity : 0;
  const isMaxInCart = currentInCart >= product.stock;

  const discountPercent = calculateDiscountPercentage(product.price, product.originalPrice);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    if (isMaxInCart) {
      error(`Only ${product.stock} units available in stock.`);
      return;
    }

    try {
      addItem(product, 1);
      success(`Added "${product.name}" to cart!`);
    } catch (err: any) {
      error(err.message || 'Could not add to cart');
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-surface-raised border border-edge-subtle/80 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image Box */}
      <Link
        to={`/products/${product.slug || product._id}`}
        className="relative block aspect-square w-full overflow-hidden bg-slate-50"
      >
        <img
          src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent && discountPercent > 0 && (
            <Badge variant="sale" size="sm">
              {discountPercent}% OFF
            </Badge>
          )}
          {product.isFeatured && (
            <Badge variant="accent" size="sm">
              Featured
            </Badge>
          )}
          {isOutOfStock ? (
            <Badge variant="danger" size="sm">
              Out of Stock
            </Badge>
          ) : product.stock <= 5 ? (
            <Badge variant="warning" size="sm">
              Only {product.stock} Left
            </Badge>
          ) : null}
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            {typeof product.category === 'object' ? product.category.name : 'Store'}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium text-ink-primary">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating?.toFixed(1) || '4.8'}</span>
            <span className="text-ink-muted">({product.numReviews || 24})</span>
          </div>
        </div>

        {/* Title */}
        <Link
          to={`/products/${product.slug || product._id}`}
          className="group-hover:text-brand-500 transition-colors"
        >
          <h3 className="text-sm sm:text-base font-bold text-ink-primary line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Price & Action */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-edge-subtle/50">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-ink-primary">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-ink-muted line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-ink-subtle">Free express delivery</span>
          </div>

          <Button
            onClick={handleQuickAdd}
            disabled={isOutOfStock || isMaxInCart}
            variant={isOutOfStock ? 'secondary' : currentInCart > 0 ? 'secondary' : 'primary'}
            size="sm"
            className="!px-3 !py-2 shrink-0 rounded-xl"
            title={isOutOfStock ? 'Sold Out' : isMaxInCart ? 'Max stock in cart' : 'Add to Cart'}
          >
            {isOutOfStock ? (
              <span className="text-xs">Sold Out</span>
            ) : currentInCart > 0 ? (
              <span className="flex items-center gap-1 text-xs font-semibold">
                <Check className="w-3.5 h-3.5 text-status-success" />
                <span>{currentInCart} in cart</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
