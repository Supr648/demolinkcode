import Category from '../models/Category.js';
import { memoryStore } from '../config/store.js';

// @route GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      if (categories && categories.length > 0) {
        return res.status(200).json({ success: true, count: categories.length, categories });
      }
    } catch {
      // Memory fallback
    }

    return res.status(200).json({
      success: true,
      count: memoryStore.categories.length,
      categories: memoryStore.categories,
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/categories (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    try {
      const category = await Category.create({ name: name.trim(), description: description?.trim() || '' });
      return res.status(201).json({ success: true, message: 'Category created', category });
    } catch {
      const newCategory = {
        _id: 'cat_' + Date.now(),
        name: name.trim(),
        description: description?.trim() || '',
        createdAt: new Date().toISOString(),
      };
      memoryStore.categories.unshift(newCategory);
      return res.status(201).json({ success: true, message: 'Category created', category: newCategory });
    }
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/categories/:id (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description },
        { new: true, runValidators: true }
      );
      if (category) {
        return res.status(200).json({ success: true, message: 'Category updated', category });
      }
    } catch {
      // Memory fallback
    }

    const index = memoryStore.categories.findIndex((c) => c._id === req.params.id);
    if (index !== -1) {
      memoryStore.categories[index] = {
        ...memoryStore.categories[index],
        name: name || memoryStore.categories[index].name,
        description: description !== undefined ? description : memoryStore.categories[index].description,
      };
      return res.status(200).json({
        success: true,
        message: 'Category updated',
        category: memoryStore.categories[index],
      });
    }

    return res.status(404).json({ success: false, message: 'Category not found' });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/categories/:id (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (category) {
        return res.status(200).json({ success: true, message: 'Category deleted' });
      }
    } catch {
      // Memory fallback
    }

    memoryStore.categories = memoryStore.categories.filter((c) => c._id !== req.params.id);
    return res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
