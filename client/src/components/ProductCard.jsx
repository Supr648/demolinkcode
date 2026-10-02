import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Check, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();

  const isOutOfStock = !product.stock || product.stock <= 0;
  const inCartItem = cartItems.find((item) => item._id === product._id);
  const currentInCart = inCartItem ? inCartItem.quantity : 0;
  const reachedMaxStock = currentInCart >= (product.stock || 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || reachedMaxStock) return;
    addToCart(product, 1);
  };

  const defaultImage =
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail Container */}
      <Link
        to={`/products/${product._id}`}
        className="relative aspect-square w-full bg-slate-100 overflow-hidden block"
      >
        <img
          src={product.image || defaultImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />

        {/* Category Badge */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
            {typeof product.category === 'object' ? product.category.name : product.category}
          </span>
        )}

        {/* Stock Status Badge */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md flex items-center gap-1 ${
            isOutOfStock
              ? 'bg-rose-500/90 text-white'
              : product.stock <= 5
              ? 'bg-amber-500/90 text-white'
              : 'bg-emerald-500/90 text-white'
          }`}
        >
          {isOutOfStock ? (
            <>Out of stock</>
          ) : (
            <>
              {product.stock <= 5 ? (
                <AlertTriangle className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
              {product.stock} in stock
            </>
          )}
        </span>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/products/${product._id}`} className="block group-hover:text-indigo-600 transition">
          <h3
            className="font-semibold text-slate-800 text-base leading-snug line-clamp-1 mb-1"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {product.description || 'No description available for this product.'}
        </p>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || reachedMaxStock}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm transition active:scale-95 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : reachedMaxStock
                ? 'bg-indigo-50 text-indigo-400 cursor-not-allowed border border-indigo-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {isOutOfStock
              ? 'Unavailable'
              : reachedMaxStock
              ? 'Max in Cart'
              : currentInCart > 0
              ? `Add (${currentInCart})`
              : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
