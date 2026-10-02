import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useCart } from '../context/CartContext';
import { Spinner } from '../components/Loader';
import EmptyState from '../components/EmptyState';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/products/${id}`);
        const data = res.data?.product || res.data;
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <Spinner size="lg" text="Loading product details..." />;
  }

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        description="The product you are looking for may have been removed or is temporarily unavailable."
        actionText="Back to Products"
        actionLink="/products"
      />
    );
  }

  const isOutOfStock = !product.stock || product.stock <= 0;
  const inCartItem = cartItems.find((item) => item._id === product._id);
  const currentInCart = inCartItem ? inCartItem.quantity : 0;
  const maxCanAdd = Math.max(0, (product.stock || 0) - currentInCart);

  const handleIncrement = () => {
    if (quantity < maxCanAdd) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock || maxCanAdd <= 0) return;
    addToCart(product, quantity);
    setQuantity(1);
  };

  const defaultImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';

  const categoryName =
    typeof product.category === 'object' ? product.category?.name : product.category || 'General';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto">
        <Link to="/" className="hover:text-indigo-600 transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link to="/products" className="hover:text-indigo-600 transition">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link
          to={`/products?category=${encodeURIComponent(categoryName)}`}
          className="hover:text-indigo-600 transition"
        >
          {categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-800 font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main 2-Column Details Layout */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Image */}
        <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-100">
          <img
            src={product.image || defaultImage}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Only {product.stock} left in stock
            </span>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide uppercase">
              {categoryName}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-black text-indigo-600">
                ${Number(product.price).toFixed(2)}
              </span>

              {/* Stock Status Indicator */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isOutOfStock
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isOutOfStock ? (
                  <>Out of Stock</>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    In Stock ({product.stock} available)
                  </>
                )}
              </span>
            </div>

            <div className="border-t border-b border-slate-100 py-4 my-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description || 'No detailed description available for this item.'}
              </p>
            </div>
          </div>

          {/* Quantity Controls & Add to Cart */}
          <div className="space-y-4 pt-2">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quantity:
                </span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-600 disabled:text-slate-300 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= maxCanAdd}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-600 disabled:text-slate-300 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {currentInCart > 0 && (
                  <span className="text-xs text-indigo-600 font-semibold">
                    ({currentInCart} already in cart)
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || maxCanAdd <= 0}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm shadow-md transition active:scale-95 ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : maxCanAdd <= 0
                    ? 'bg-indigo-50 text-indigo-400 cursor-not-allowed border border-indigo-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {isOutOfStock
                  ? 'Out of Stock'
                  : maxCanAdd <= 0
                  ? 'Max Available Quantity in Cart'
                  : `Add to Cart - $${(Number(product.price) * quantity).toFixed(2)}`}
              </button>

              <Link
                to="/cart"
                className="inline-flex items-center justify-center py-4 px-6 rounded-2xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                View Cart
              </Link>
            </div>

            {/* Micro Benefits */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Express Doorstep Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cash on Delivery Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
