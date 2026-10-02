# System Architecture & Design Blueprint

This document details the architectural principles, data flow, security model, and structural design for the **Mini E-Commerce Demo Project (MERN)**.

---

## 1. High-Level Architecture

The application adopts a decoupled client-server multi-tier architecture consisting of:
1. **Client Tier**: A Single Page Application (SPA) built with React.js, Vite, and styled with utility-first Tailwind CSS.
2. **Application Server Tier**: A stateless RESTful API server powered by Node.js and Express.js.
3. **Database Tier**: MongoDB document database managed via Mongoose ODM for strict schema validations and relationship modeling.

```
┌────────────────────────────────────────────────────────┐
│                   Client Layer (SPA)                   │
│          React + Vite + Tailwind CSS + Axios           │
│                                                        │
│   ┌─────────────────────┐    ┌─────────────────────┐   │
│   │   Customer Views    │    │     Admin Panel     │   │
│   │ (Store, Cart, Order)│    │ (CRUD Cat/Prod/Ord) │   │
│   └──────────┬──────────┘    └──────────┬──────────┘   │
└──────────────┼──────────────────────────┼──────────────┘
               │  HTTP Requests (JSON)    │
               │  Authorization: Bearer   │
               ▼                          ▼
┌────────────────────────────────────────────────────────┐
│               Application Server (Node/Express)        │
│                                                        │
│  ┌──────────────────────┐    ┌──────────────────────┐  │
│  │   Auth Middleware    │───▶│   Admin Middleware   │  │
│  │  (JWT Verification)  │    │  (Role: 'admin' chk) │  │
│  └──────────┬───────────┘    └──────────┬───────────┘  │
│             │                           │              │
│             ▼                           ▼              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Controllers (Auth, Product, Category, Order)     │  │
│  │ - Server-Side Price Lookup                       │  │
│  │ - Concurrency-safe Stock Deduction               │  │
│  │ - Status Transitions                             │  │
│  └──────────────────────────┬───────────────────────┘  │
└─────────────────────────────┼──────────────────────────┘
                              │ Mongoose ODM
                              ▼
┌────────────────────────────────────────────────────────┐
│                    Database Layer                      │
│                  MongoDB (Collections)                 │
│         [users]   [categories]   [products]   [orders] │
└────────────────────────────────────────────────────────┘
```

---

## 2. Authentication & Authorization Lifecycle

The application enforces a stateless, token-based authentication mechanism using JSON Web Tokens (JWT) and `bcryptjs`.

### Authentication Flow
1. **Registration**:
   - Customer submits `name`, `email`, `password`, `confirmPassword`.
   - Frontend validates basic criteria (non-empty, valid email, matching passwords, length >= 6).
   - Backend controller checks email uniqueness.
   - Password is salted and hashed using `bcryptjs` with salt rounds = 10 before saving.
   - User document is saved with default role `customer`.
   - Server returns JWT token and sanitized user details (`_id`, `name`, `email`, `role`).

2. **Login**:
   - User/Admin submits `email` and `password`.
   - Controller queries user by email; compares provided password with hashed password using `bcrypt.compare()`.
   - On match, signs a JWT token payload `{ id: user._id, role: user.role }` with `process.env.JWT_SECRET` and expiration (e.g., `7d`).
   - Client stores token in `localStorage` and initializes `AuthContext`.

3. **Protected Requests & Interceptors**:
   - Axios client instance automatically attaches the stored token as `Authorization: Bearer <token>` on all outgoing HTTP requests.
   - `authMiddleware` intercepts incoming requests, verifies signature, decodes payload, and attaches `req.user = await User.findById(decoded.id).select('-password')`.
   - `adminMiddleware` checks `req.user && req.user.role === 'admin'`. If false, returns `403 Forbidden`.

```
[User Login Request] ──▶ [Verify Credentials (bcrypt)] ──▶ [Sign JWT Token]
                                                                  │
                                                                  ▼
[Client: Save Token in LocalStorage] ◀──────────────── [Return Token & Profile]
         │
         ▼  (Subsequent Requests)
[Header: Authorization: Bearer <token>]
         │
         ▼
[Express Server: authMiddleware]
         ├── Token Invalid / Expired ────▶ 401 Unauthorized
         └── Token Valid ──▶ req.user = user
                                  │
                                  ▼
                        [adminMiddleware] (For Admin Routes)
                                  ├── req.user.role !== 'admin' ──▶ 403 Forbidden
                                  └── req.user.role === 'admin' ──▶ Next (Controller)
```

---

## 3. Order Processing & Tamper-Proof Security Model

One of the most critical vulnerabilities in modern e-commerce prototypes is trusting client-submitted prices or allowing race conditions in inventory deduction. This project implements strict backend safeguards:

### 1. Server-Side Price Resolution
* **The Rule**: The client **never** dictates item prices or total order amount.
* **Mechanism**:
  1. Client sends only `{ productId, quantity }` and `shippingAddress`.
  2. For each item, server queries MongoDB `Product.findById(item.productId)`.
  3. Server extracts current, active `product.price` directly from the database record.
  4. Server calculates:
     $$\text{totalAmount} = \sum (\text{product.price} \times \text{quantity})$$
  5. The order is stored with snapshot data: `product: id, name: product.name, price: product.price, quantity`.

### 2. Stock Validation & Inventory Deduction
* Before saving the order, the server checks if `product.stock >= item.quantity`.
* If any product in the cart has insufficient stock, the transaction halts immediately and returns `400 Bad Request` with an explanatory message (e.g., `"Only 2 units of 'Wireless Headphones' available"`).
* On successful validation, stock is reduced atomically:
  ```javascript
  await Product.findByIdAndUpdate(item.productId, {
    $inc: { stock: -item.quantity }
  });
  ```
* Once the order is confirmed and saved in MongoDB, the backend returns the finalized order object, and the client clears its local cart.

```
[Client submits Order]
 (items: [{ productId, quantity }], shippingAddress)
          │
          ▼
[Backend: Fetch Products from MongoDB by ID]
          │
          ├── Product Not Found? ───────▶ Return 404
          ├── item.quantity > stock? ───▶ Return 400 (Insufficient Stock)
          │
          ▼
[Calculate genuine Total Amount from DB prices]
          │
          ▼
[Create & Save Order in MongoDB]
 (status: 'Pending', paymentMethod: 'Cash on Delivery')
          │
          ▼
[Atomically Decrement Stock ($inc: -quantity)]
          │
          ▼
[Return 201 Created] ──▶ [Client clears Cart & redirects to 'My Orders']
```

---

## 4. State Management Strategy (Frontend)

To keep the application light, maintainable, and dependency-lean without Redux overhead, state is managed via **React Context API**:

### 1. `AuthContext`
* **State**:
  * `user`: `{ _id, name, email, role }` or `null`
  * `token`: Stored JWT string or `null`
  * `isLoading`: Initial token verification state
* **Methods**:
  * `login(email, password)`: Dispatches API request, saves to `localStorage`, sets state.
  * `register(formData)`: Registers, auto-authenticates, saves state.
  * `logout()`: Clears `localStorage`, resets user state to `null`, redirects to `/login`.

### 2. `CartContext`
* **State**:
  * `cartItems`: Array of `{ _id, name, price, image, stock, quantity }`
  * Persisted automatically to `localStorage` (`mini_ecom_cart`).
* **Methods**:
  * `addToCart(product, quantity)`: Appends or increases quantity with a check preventing `quantity > product.stock`.
  * `updateQuantity(productId, quantity)`: Modifies quantity within bounds `[1, product.stock]`.
  * `removeFromCart(productId)`: Removes item from cart array.
  * `clearCart()`: Empties cart upon successful checkout.
  * `getCartTotal()`: Computes subtotal `sum(price * quantity)`.
  * `getCartCount()`: Computes total number of items in cart for badge indicator.

---

## 5. Client Routing Architecture

```text
Public / Customer Routes:
/                     → Home (Featured Categories, Hero, Featured Products)
/products             → Product Catalogue (Search, Category Filter Pills, Grid)
/products/:id         → Product Details (Image, Specs, Stock Badge, Add to Cart)
/cart                 → Shopping Cart (Quantity adjustment, Subtotal, Proceed button)
/login                → Customer / Admin Login
/register             → Customer Registration

Protected Customer Routes (Require Auth):
/checkout             → Shipping Form (COD only), Order Summary, Place Order
/my-orders            → Customer Order History (Status pill, Items breakdown)

Protected Admin Routes (Require Auth + Role === 'admin'):
/admin/dashboard      → Admin Dashboard (Summary cards, quick links)
/admin/categories     → Category CRUD (Table, Add/Edit modal, Delete confirm)
/admin/products       → Product CRUD (Table, Add/Edit modal, Category dropdown, Delete confirm)
/admin/orders         → Order Management (Customer details, Status dropdown updater)
```

---

## 6. Security Principles Applied

1. **Password Hashing**: `bcryptjs` one-way hashing with salt generation prevents plain-text exposure in database leaks.
2. **Role Authorization**: Route-level checking for both customer token validity and admin privilege isolation.
3. **Database Input Sanitization**: Schema-level type casting and validation on Mongoose models protect against malformed payload injections.
4. **CORS Configuration**: Express CORS middleware configured to restrict origins to the client origin during production.
5. **No Blind Trust**: Crucial attributes such as item pricing, discounts, and inventory availability are calculated and verified exclusively on the server.
