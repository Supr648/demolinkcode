const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(authMiddleware, adminMiddleware, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(authMiddleware, adminMiddleware, updateProduct)
  .delete(authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
