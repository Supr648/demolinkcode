# Development Roadmap & Implementation Plan

This document outlines the step-by-step implementation blueprint, phased milestones, and validation procedures for building and testing the **Mini E-Commerce Demo Project (MERN)**.

---

## 📅 Phased Execution Roadmap

```
Phase 1: Setup & Initialization
   ↓
Phase 2: Database Models & Config
   ↓
Phase 3: Auth & Security Engine
   ↓
Phase 4: Categories & Products API
   ↓
Phase 5: Orders & Inventory Engine
   ↓
Phase 6: Frontend Scaffolding & Tailwind UI
   ↓
Phase 7: Storefront Features & Cart
   ↓
Phase 8: Checkout & My Orders
   ↓
Phase 9: Admin Dashboard & CRUD Operations
   ↓
Phase 10: End-to-End Verification & Polish
```

---

## Phase 1: Environment & Project Scaffolding
- [x] Initialize Git repository with proper `.gitignore` (ignoring `node_modules`, `.env`, `dist`).
- [ ] Initialize Express backend (`/server`) with `package.json`, installing `express`, `mongoose`, `dotenv`, `cors`, `jsonwebtoken`, `bcryptjs`.
- [ ] Initialize React frontend (`/client`) using Vite (`npm create vite@latest . -- --template react`).
- [ ] Configure Tailwind CSS in `/client` (`tailwind.config.js`, `postcss.config.js`, `index.css`).

---

## Phase 2: Database Connection & Models
- [ ] Establish MongoDB connection helper (`server/config/db.js`) with Mongoose error handling.
- [ ] Implement `User` model with password hashing pre-save hooks and role enum (`customer`, `admin`).
- [ ] Implement `Category` model with unique name constraint.
- [ ] Implement `Product` model with text indexing, category reference, and non-negative price/stock constraints.
- [ ] Implement `Order` model with snapshot pricing, item array, shipping address sub-schema, and order status enum.

---

## Phase 3: Authentication & Security Engine
- [ ] Create JWT generation utility (`generateToken.js`).
- [ ] Build `authController.js` with:
  - `POST /api/auth/register` (Email format check, password length >= 6, confirm password match, duplicate email check).
  - `POST /api/auth/login` (Verify credentials with bcrypt, issue token).
- [ ] Create `authMiddleware.js` (`protect`) to verify Bearer tokens and extract user payload.
- [ ] Create `adminMiddleware.js` (`adminOnly`) to restrict admin endpoints.
- [ ] Configure `errorMiddleware.js` for clean validation and error responses.

---

## Phase 4: Categories & Products API
- [ ] Implement Category Controller & Routes:
  - `GET /api/categories` (Public)
  - `POST /api/categories` (Admin only)
  - `PUT /api/categories/:id` (Admin only)
  - `DELETE /api/categories/:id` (Admin only)
- [ ] Implement Product Controller & Routes:
  - `GET /api/products` (Support `?category=...` and `?search=...`)
  - `GET /api/products/:id` (Single product details)
  - `POST /api/products` (Admin only, validate positive price and non-negative stock)
  - `PUT /api/products/:id` (Admin only)
  - `DELETE /api/products/:id` (Admin only)

---

## Phase 5: Orders & Stock Management API
- [ ] Implement Order Controller:
  - `POST /api/orders`:
    - Iterate cart items.
    - Query genuine product prices and check stock in MongoDB.
    - Calculate order total on server.
    - Atomically reduce product inventory.
    - Save Order document with `status: 'Pending'`.
  - `GET /api/orders/my-orders`: Retrieve authenticated customer's order history.
  - `GET /api/admin/orders`: Retrieve all customer orders for the admin console.
  - `PATCH /api/admin/orders/:id/status`: Update status (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).

---

## Phase 6: Frontend Foundations & Layouts
- [ ] Create Axios instance (`api/axiosClient.js`) with request interceptor for JWT authorization header.
- [ ] Build global `AuthContext` (User login, register, logout, persistence in `localStorage`).
- [ ] Build global `CartContext` (Add to cart, quantity change within stock limits, remove item, subtotal, localStorage sync).
- [ ] Create UI components:
  - `Navbar`: Responsive navigation, search link, cart badge, login/profile options.
  - `Footer`: Clean branding and footer links.
  - `Modal`: Generic accessible popup modal.
  - `ConfirmDialog`: Delete confirmation for categories and products.
  - `Toast`: Non-blocking user feedback.
  - `Loader` & `EmptyState`.
- [ ] Build `MainLayout` and `AdminLayout`.

---

## Phase 7: Storefront Views
- [ ] Build `Home.jsx` with Hero section, category quick-filter cards, and featured product grid.
- [ ] Build `Products.jsx` with category filter pills (`All | Electronics | Fashion | Shoes`), search input, and responsive grid.
- [ ] Build `ProductCard.jsx` displaying image, category, title, price, stock status, and "Add to Cart" button.
- [ ] Build `ProductDetails.jsx` with quantity selector (`[-] [qty] [+]`) capped at available stock.
- [ ] Build `Cart.jsx` with item list, quantity controls, remove buttons, total price calculation, and checkout CTA.

---

## Phase 8: Checkout & Customer Orders
- [ ] Build `Checkout.jsx`:
  - Enforce Cash on Delivery payment option.
  - Form validation for Name, Phone, Address, City, Pincode.
  - On "Place Order" click: Submit cart items and shipping details, clear cart on success, and redirect.
- [ ] Build `MyOrders.jsx`:
  - List customer orders with order ID, date, status pill, item details, and total price.

---

## Phase 9: Admin Dashboard
- [ ] Build `AdminRoute.jsx` to guard admin pages.
- [ ] Build `AdminCategories.jsx`:
  - View table of categories.
  - Add Category modal.
  - Edit Category modal.
  - Delete Category confirmation dialog.
- [ ] Build `AdminProducts.jsx`:
  - View table with product thumbnails, name, category, price, stock.
  - Add Product modal with category selector.
  - Edit Product modal.
  - Delete Product confirmation dialog.
- [ ] Build `AdminOrders.jsx`:
  - View table of all customer orders.
  - View customer name, shipping address, items purchased, total amount.
  - Change status dropdown (`Pending` → `Confirmed` → `Shipped` → `Delivered` → `Cancelled`).

---

## Phase 10: End-to-End Verification Checklist

Run through the complete demo flow to ensure 100% compliance:

1. **Admin Flow**:
   - [ ] Log in with admin credentials.
   - [ ] Add a new Category (e.g., "Smart Home").
   - [ ] Add a new Product with price, stock, image URL, category.
   - [ ] Verify product appears immediately in public storefront.

2. **Customer Flow**:
   - [ ] Register a new customer account.
   - [ ] Log in with the newly created account.
   - [ ] Browse products, filter by category pill, and search by keyword.
   - [ ] Add product to cart. Try setting quantity higher than available stock (must be prevented).
   - [ ] Navigate to checkout, fill shipping details (Cash on Delivery).
   - [ ] Place order:
     - Verify cart is cleared.
     - Verify order appears in "My Orders".
     - Verify product stock decreased in the database.

3. **Order Lifecycle Flow**:
   - [ ] Log in as Admin and view Orders in the Admin Panel.
   - [ ] Locate the placed order and verify customer address and item snapshot.
   - [ ] Update order status from `Pending` to `Confirmed`, then `Shipped`, then `Delivered`.
   - [ ] Switch back to customer view: Confirm the order status badge updates dynamically.
