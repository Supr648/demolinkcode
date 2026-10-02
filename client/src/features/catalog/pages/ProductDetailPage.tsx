import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { Product } from '@/types/catalog';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/formatters';
import { ImageGallery } from '../components/ImageGallery';
import { VariantSelector } from '../components/VariantSelector';
import { ProductGrid } from '../components/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCartStore } from '@/features/cart/stores/useCartStore';
import { useToast } from '@/components/ui/Toast';
import {
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, items, openCart } = useCartStore();
  const { success, error } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('Default');
  const [selectedSize, setSelectedSize] = useState<string>('Standard');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await apiClient.get<{ product: Product }>(`/products/${id}`);
        const p = res.data.product;
        setProduct(p);
        setQuantity(1);

        // Fetch related products from same category
        const catId = typeof p.category === 'object' ? p.category._id : p.category;
        const relRes = await apiClient.get<{ products: Product[] }>(`/products?category=${catId}&limit=4`);
        setRelatedProducts(relRes.data.products.filter((item) => item._id !== p._id));
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-6 w-1/3 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-ink-primary">Product Not Found</h2>
        <p className="text-xs text-ink-muted">The product you are looking for might have been moved or removed.</p>
        <Link to="/products">
          <Button variant="primary" size="md">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const cartItem = items.find((i) => i.productId === product._id);
  const currentInCart = cartItem ? cartItem.quantity : 0;
  const maxAvailableToAdd = Math.max(0, product.stock - currentInCart);
  const discount = calculateDiscountPercentage(product.price, product.originalPrice);

  const handleAddToCart = (andCheckout = false) => {
    if (isOutOfStock) return;

    if (quantity > maxAvailableToAdd) {
      error(`You already have ${currentInCart} in cart. Only ${maxAvailableToAdd} more can be added.`);
      return;
    }

    try {
      addItem(product, quantity, { color: selectedColor, size: selectedSize });
      success(`Added ${quantity} x "${product.name}" to bag!`);

      if (andCheckout) {
        navigate('/checkout');
      } else {
        openCart();
      }
    } catch (err: any) {
      error(err.message || 'Could not add to bag');
    }
  };

  const categoryName = typeof product.category === 'object' ? product.category.name : 'Category';

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-ink-muted">
        <Link to="/" className="hover:text-brand-600 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${typeof product.category === 'object' ? product.category.slug : product.category}`} className="hover:text-brand-600 transition">
          {categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink-primary font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-7">
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Buying Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                {categoryName}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-ink-primary bg-slate-100 px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating?.toFixed(1) || '4.8'}</span>
                <span className="text-ink-muted">({product.numReviews || 38} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-ink-primary leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-surface-raised border border-edge-subtle/70">
            <span className="text-3xl font-black text-ink-primary">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-ink-muted line-through font-semibold">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            {discount && (
              <Badge variant="sale" size="md">
                Save {discount}%
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
            {product.description}
          </p>

          {/* Stock Status Badge */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                ⚡ Only {product.stock} units left in stock!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                In Stock ({product.stock} units available)
              </span>
            )}
          </div>

          {/* Variants */}
          <VariantSelector
            colors={['Matte Black', 'Silver Grey', 'Midnight Navy']}
            sizes={['Standard', 'Pro Edition']}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onColorChange={setSelectedColor}
            onSizeChange={setSelectedSize}
          />

          {/* Quantity + Actions */}
          {!isOutOfStock && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-ink-primary">Quantity:</span>
                <div className="flex items-center border border-edge-subtle rounded-xl bg-surface">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-ink-secondary hover:text-ink-primary hover:bg-slate-100 rounded-l-xl disabled:opacity-40 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-bold text-ink-primary min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 text-ink-secondary hover:text-ink-primary hover:bg-slate-100 rounded-r-xl disabled:opacity-40 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={() => handleAddToCart(false)}
                  disabled={maxAvailableToAdd <= 0}
                  variant="secondary"
                  size="lg"
                  className="rounded-2xl flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{currentInCart > 0 ? `Add More (${currentInCart} in bag)` : 'Add to Bag'}</span>
                </Button>

                <Button
                  onClick={() => handleAddToCart(true)}
                  disabled={maxAvailableToAdd <= 0}
                  variant="primary"
                  size="lg"
                  className="rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </Button>
              </div>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-edge-subtle text-center">
            <div className="p-2.5 rounded-xl bg-surface-raised border border-edge-subtle/50">
              <Truck className="w-4 h-4 text-brand-500 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-ink-primary">Free Express</p>
              <p className="text-[9px] text-ink-muted">2-3 days delivery</p>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-raised border border-edge-subtle/50">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-ink-primary">1 Year Warranty</p>
              <p className="text-[9px] text-ink-muted">Official guarantee</p>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-raised border border-edge-subtle/50">
              <RotateCcw className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-ink-primary">7-Day Return</p>
              <p className="text-[9px] text-ink-muted">Hassle-free refunds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-edge-subtle space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-ink-primary">You Might Also Like</h2>
            <p className="text-xs sm:text-sm text-ink-muted">Customers who viewed this item also bought</p>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
};
