# Backend Specification & Controller Architecture

This document outlines the backend design, controller logic, middleware implementations, and business logic for the **Mini E-Commerce Demo Project (Node.js + Express.js + Mongoose)**.

---

## 1. Server Architecture & Directory Layout

The backend server is structured with a modular, controller-based pattern:

```text
server/
├── config/
│   └── db.js               # MongoDB connection logic using mongoose.connect()
├── controllers/
│   ├── authController.js   # User registration, login, profile resolution
│   ├── categoryController.js # Category CRUD operations
│   ├── productController.js  # Product catalogue, search, filters & CRUD
│   └── orderController.js    # Order placement, price validation, stock reduction
├── middleware/
│   ├── authMiddleware.js   # JWT token verification
│   ├── adminMiddleware.js  # Role checking (req.user.role === 'admin')
│   └── errorMiddleware.js  # Centralized error formatting & catch-all
├── models/
│   ├── User.js
│   ├── Category.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js       # /api/auth/*
│   ├── categoryRoutes.js   # /api/categories/*
│   ├── productRoutes.js    # /api/products/*
│   └── orderRoutes.js      # /api/orders/* & /api/admin/orders/*
├── utils/
│   └── generateToken.js    # JWT signing helper
├── server.js               # Express app configuration & server listener
└── .env.example            # Environment variables template
```

---

## 2. Environment Configuration (`.env.example`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/mini_ecommerce
JWT_SECRET=super_secret_jwt_key_replace_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

---

## 3. Middleware Specifications

### 3.1 Authentication Middleware (`authMiddleware.js`)
Validates that incoming requests provide a valid Bearer token in the `Authorization` header.

```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists'
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid or expired'
    });
  }
};
```

---

### 3.2 Admin Authorization Middleware (`adminMiddleware.js`)
Guarantees that only users with `role: 'admin'` can access administrative endpoints.

```javascript
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required'
    });
  }
};
```

---

### 3.3 Centralized Error Middleware (`errorMiddleware.js`)
Intercepts unhandled errors, formats Mongoose validation errors, and returns consistent JSON payloads.

```javascript
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose Bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found with the specified ID';
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
```

---

## 4. Key Controller Logic & Business Safeguards

### 4.1 Order Placement & Stock Validation (`orderController.js`)
This represents the most critical business workflow:
1. Customer submits `items` array with `{ productId, quantity }` and `shippingAddress`.
2. Controller iterates through all items and retrieves current product records from MongoDB.
3. Controller verifies stock sufficiency:
   ```javascript
   if (product.stock < item.quantity) {
     return res.status(400).json({
       success: false,
       message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
     });
   }
   ```
4. Controller calculates total amount using verified database prices:
   ```javascript
   const itemTotal = product.price * item.quantity;
   totalAmount += itemTotal;
   ```
5. Constructs order payload and saves to `orders` collection:
   ```javascript
   const order = await Order.create({
     user: req.user._id,
     products: orderProductsSnapshot,
     totalAmount,
     shippingAddress,
     status: 'Pending',
     paymentMethod: 'Cash on Delivery'
   });
   ```
6. Decrements stock atomically:
   ```javascript
   for (const item of items) {
     await Product.findByIdAndUpdate(item.productId, {
       $inc: { stock: -item.quantity }
     });
   }
   ```

---

### 4.2 Product Search & Filter Controller (`productController.js`)
Supports flexible queries for the storefront catalog:
```javascript
export const getProducts = async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category && category !== 'all') {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    products
  });
};
```

---

## 5. Security & Best Practices Checklist

* [x] **No Plaintext Passwords**: Automatic salting and hashing with bcrypt before persistence.
* [x] **No Client-Priced Orders**: Item prices and order totals are always sourced directly from MongoDB.
* [x] **Stock Guarding**: Immediate inventory rejection if requested quantity exceeds active stock.
* [x] **No Cross-User Access**: Customer orders endpoint filters strictly by `req.user._id`.
* [x] **Admin Route Isolation**: Chained middleware `[protect, adminOnly]` on every mutating product, category, and order route.
