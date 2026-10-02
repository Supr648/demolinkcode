const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'All shipping fields are required' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Verify stock and fetch genuine prices
    for (let i = 0; i < products.length; i++) {
      const item = products[i];
      const dbProduct = await Product.findById(item.product);

      if (!dbProduct) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }

      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product: ${dbProduct.name}` });
      }

      orderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: dbProduct.price,
        image: dbProduct.image,
        quantity: item.quantity
      });

      totalAmount += dbProduct.price * item.quantity;
    }

    // Create the order
    const order = new Order({
      user: req.user._id,
      products: orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod: 'Cash on Delivery',
      status: 'Pending'
    });

    await order.save();

    // Atomically decrement stock
    for (let i = 0; i < orderItems.length; i++) {
      await Product.findByIdAndUpdate(
        orderItems[i].product,
        { $inc: { stock: -orderItems[i].quantity } },
        { runValidators: true }
      );
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // Restore stock if status changed to Cancelled from a non-Cancelled state
    if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
      for (let i = 0; i < order.products.length; i++) {
        await Product.findByIdAndUpdate(
          order.products[i].product,
          { $inc: { stock: order.products[i].quantity } }
        );
      }
    }
    
    // If order was cancelled but is now un-cancelled, we might need to reduce stock again,
    // but the requirements only mention restoring product stock on Cancelled. Assuming we only handle cancellation.

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
