const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(authMiddleware, adminMiddleware, createCategory);

router.route('/:id')
  .put(authMiddleware, adminMiddleware, updateCategory)
  .delete(authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
