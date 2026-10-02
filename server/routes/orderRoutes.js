import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAdminOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Customer order routes
router.post('/orders', protect, createOrder);
router.get('/orders/my-orders', protect, getMyOrders);

// Admin order routes
router.get('/admin/orders', protect, adminOnly, getAdminOrders);
router.patch('/admin/orders/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
