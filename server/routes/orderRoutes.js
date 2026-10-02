const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Customer routes
router.route('/')
  .post(authMiddleware, createOrder);

router.route('/my-orders')
  .get(authMiddleware, getMyOrders);

// Admin routes
router.route('/admin/orders')
  .get(authMiddleware, adminMiddleware, getAllOrders);

router.route('/admin/orders/:id/status')
  .patch(authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
