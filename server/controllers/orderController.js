import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { memoryStore } from '../config/store.js';

// @route POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your order must contain at least one product' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'All shipping address fields (name, phone, address, city, pincode) are required',
      });
    }

    let totalAmount = 0;
    const orderProducts = [];

    // Verify stock and genuine prices directly from DB/store
    for (const item of items) {
      let productDoc = null;

      try {
        productDoc = await Product.findById(item.productId);
      } catch {
        // Fallback
      }

      if (!productDoc) {
        productDoc = memoryStore.products.find((p) => p._id === item.productId);
      }

      if (!productDoc) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} was not found in catalog`,
        });
      }

      if (productDoc.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${productDoc.name}". Available: ${productDoc.stock}, Requested: ${item.quantity}`,
        });
      }

      // Safe price snapshot sourced server-side
      const itemPrice = productDoc.price;
      totalAmount += itemPrice * item.quantity;

      orderProducts.push({
        product: productDoc._id,
        name: productDoc.name,
        price: itemPrice,
        quantity: item.quantity,
      });
    }

    // Try saving in MongoDB & reduce stock
    try {
      const order = await Order.create({
        user: req.user?._id || 'customer_demo_id',
        products: orderProducts,
        totalAmount,
        shippingAddress,
        status: 'Pending',
        paymentMethod: 'Cash on Delivery',
      });

      // Reduce product stock atomically
      for (const item of items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order,
      });
    } catch {
      // Memory fallback
      const order = {
        _id: 'ord_' + Date.now(),
        user: req.user || { _id: 'customer_demo_id', name: shippingAddress.name },
        products: orderProducts,
        totalAmount,
        shippingAddress,
        status: 'Pending',
        paymentMethod: 'Cash on Delivery',
        createdAt: new Date().toISOString(),
      };

      memoryStore.orders.unshift(order);

      // Decrement stock in memory store
      for (const item of items) {
        const prod = memoryStore.products.find((p) => p._id === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @route GET /api/orders/my-orders
export const getMyOrders = async (req, res, next) => {
  try {
    try {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      if (orders && orders.length > 0) {
        return res.status(200).json({ success: true, count: orders.length, orders });
      }
    } catch {
      // Memory fallback
    }

    const myOrders = memoryStore.orders.filter(
      (o) => (o.user?._id || o.user) === req.user?._id || !o.user || o.user?._id === 'customer_demo_id'
    );
    return res.status(200).json({ success: true, count: myOrders.length, orders: myOrders });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/admin/orders
export const getAdminOrders = async (req, res, next) => {
  try {
    try {
      const orders = await Order.find()
        .populate('user', 'name email')
        .populate('products.product', 'name price image')
        .sort({ createdAt: -1 });

      if (orders && orders.length > 0) {
        return res.status(200).json({ success: true, count: orders.length, orders });
      }
    } catch {
      // Memory fallback
    }

    return res.status(200).json({
      success: true,
      count: memoryStore.orders.length,
      orders: memoryStore.orders,
    });
  } catch (error) {
    next(error);
  }
};

// @route PATCH /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowed.join(', ')}`,
      });
    }

    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );
      if (order) {
        return res.status(200).json({
          success: true,
          message: `Order status updated to ${status}`,
          order,
        });
      }
    } catch {
      // Memory fallback
    }

    const order = memoryStore.orders.find((o) => o._id === req.params.id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      return res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        order,
      });
    }

    return res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    next(error);
  }
};
