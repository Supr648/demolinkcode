import Product from '../models/Product.js';
import { memoryStore } from '../config/store.js';

// @route GET /api/products (supports ?category=...&search=...)
export const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    try {
      const filter = {};
      if (category && category !== 'all') {
        filter.category = category;
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const products = await Product.find(filter)
        .populate('category', 'name')
        .sort({ createdAt: -1 });

      if (products && products.length > 0) {
        return res.status(200).json({ success: true, count: products.length, products });
      }
    } catch {
      // Memory fallback
    }

    let prods = [...memoryStore.products];
    if (category && category !== 'all') {
      prods = prods.filter(
        (p) => (p.category?._id || p.category) === category || p.category?.name?.toLowerCase() === category.toLowerCase()
      );
    }
    if (search) {
      const q = search.toLowerCase();
      prods = prods.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({ success: true, count: prods.length, products: prods });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    try {
      const product = await Product.findById(req.params.id).populate('category', 'name');
      if (product) {
        return res.status(200).json({ success: true, product });
      }
    } catch {
      // Memory fallback
    }

    const prod = memoryStore.products.find((p) => p._id === req.params.id);
    if (prod) {
      return res.status(200).json({ success: true, product: prod });
    }
    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/products (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    }

    const numPrice = parseFloat(price);
    const numStock = parseInt(stock, 10) || 0;

    if (numPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Price must be greater than zero' });
    }
    if (numStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
    }

    try {
      const product = await Product.create({
        name: name.trim(),
        description: description?.trim() || '',
        price: numPrice,
        image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category,
        stock: numStock,
      });
      return res.status(201).json({ success: true, message: 'Product created', product });
    } catch {
      const categoryObj = memoryStore.categories.find((c) => c._id === category) || { _id: category, name: 'General' };
      const newProduct = {
        _id: 'prod_' + Date.now(),
        name: name.trim(),
        description: description?.trim() || '',
        price: numPrice,
        image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: categoryObj,
        stock: numStock,
        createdAt: new Date().toISOString(),
      };
      memoryStore.products.unshift(newProduct);
      return res.status(201).json({ success: true, message: 'Product created', product: newProduct });
    }
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/products/:id (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { name, description, price, image, category, stock },
        { new: true, runValidators: true }
      );
      if (product) {
        return res.status(200).json({ success: true, message: 'Product updated', product });
      }
    } catch {
      // Memory fallback
    }

    const index = memoryStore.products.findIndex((p) => p._id === req.params.id);
    if (index !== -1) {
      const current = memoryStore.products[index];
      const categoryObj = category
        ? memoryStore.categories.find((c) => c._id === category) || current.category
        : current.category;

      memoryStore.products[index] = {
        ...current,
        name: name ?? current.name,
        description: description ?? current.description,
        price: price !== undefined ? parseFloat(price) : current.price,
        image: image ?? current.image,
        category: categoryObj,
        stock: stock !== undefined ? parseInt(stock, 10) : current.stock,
      };

      return res.status(200).json({
        success: true,
        message: 'Product updated',
        product: memoryStore.products[index],
      });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/products/:id (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (product) {
        return res.status(200).json({ success: true, message: 'Product deleted' });
      }
    } catch {
      // Memory fallback
    }

    memoryStore.products = memoryStore.products.filter((p) => p._id !== req.params.id);
    return res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};
