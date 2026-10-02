import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('mini_ecom_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mini_ecom_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to sync cart with localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) return { success: false, message: 'Invalid product' };

    const availableStock = Number(product.stock) || 0;
    if (availableStock <= 0) {
      addToast(`"${product.name}" is out of stock.`, 'error');
      return { success: false, message: 'Product is out of stock' };
    }

    const existingIndex = cartItems.findIndex((item) => item._id === product._id);

    if (existingIndex > -1) {
      const currentQty = cartItems[existingIndex].quantity;
      const targetQty = currentQty + quantity;

      if (targetQty > availableStock) {
        addToast(
          `Cannot add more. Maximum available stock is ${availableStock} (you already have ${currentQty} in cart).`,
          'error'
        );
        return { success: false, message: 'Exceeds available stock' };
      }

      const updated = [...cartItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: targetQty,
        stock: availableStock,
        price: product.price,
      };
      setCartItems(updated);
      addToast(`Updated "${product.name}" quantity to ${targetQty}.`, 'success');
      return { success: true };
    } else {
      if (quantity > availableStock) {
        addToast(`Only ${availableStock} item(s) available in stock.`, 'error');
        return { success: false, message: 'Exceeds available stock' };
      }

      const newItem = {
        _id: product._id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        stock: availableStock,
        category: product.category,
        quantity: Math.max(1, quantity),
      };

      setCartItems((prev) => [...prev, newItem]);
      addToast(`Added "${product.name}" to cart.`, 'success');
      return { success: true };
    }
  };

  const updateQuantity = (productId, targetQty) => {
    const qty = parseInt(targetQty, 10);
    const existing = cartItems.find((item) => item._id === productId);
    if (!existing) return;

    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (qty > existing.stock) {
      addToast(`Maximum available stock is ${existing.stock}.`, 'error');
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cartItems.find((item) => item._id === productId);
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
    if (itemToRemove) {
      addToast(`Removed "${itemToRemove.name}" from cart.`, 'info');
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('mini_ecom_cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
