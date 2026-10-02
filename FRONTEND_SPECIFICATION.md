# Frontend Specification & UI/UX Design

This document details the frontend architecture, page designs, Tailwind CSS styling tokens, component hierarchy, and client-side state handling for the **Mini E-Commerce Demo Project**.

---

## 1. UI/UX Principles & Design System

The application adheres to a clean, modern, and uncluttered e-commerce design:
* **Framework**: React.js (Vite)
* **Styling**: Tailwind CSS
* **Color Palette**:
  * Primary: Indigo / Blue accents (`indigo-600`, `indigo-700` for primary CTA buttons)
  * Neutrals: Slate / Gray shades (`slate-50`, `slate-100`, `slate-800`, `slate-900`)
  * Success: Emerald (`emerald-600`) for status badges and stock availability
  * Warning: Amber (`amber-500`) for pending statuses and low-stock alerts
  * Danger: Rose / Red (`rose-600`) for deletions and cancellation badges
* **Typography**: Clean sans-serif font stack (Inter / system-ui).
* **Feedback Systems**:
  * Floating Toast notifications for non-blocking actions (Add to Cart, Login successful, Errors).
  * Modal Confirmation dialogs for destructive actions (Delete Category, Delete Product).
  * Skeleton / Spinner loaders for asynchronous API calls.
  * Empty State placeholders with actionable buttons when collections have zero items.

---

## 2. Layouts

### 2.1 Main Storefront Layout (`MainLayout.jsx`)
Wraps all customer-facing routes:
* **Navbar**:
  * Logo & Brand Name ("MiniStore")
  * Category Quick Links & Products link
  * Cart Icon with live badge count (e.g. `3`)
  * User Menu (Profile name, "My Orders", "Logout" button, or "Login / Register" buttons if unauthenticated)
  * "Admin Portal" link if the user has `role: 'admin'`
* **Main Content Area**: Responsive container (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`).
* **Footer**: Minimalist copyright, helpful links, and technology stack credits.

### 2.2 Admin Layout (`AdminLayout.jsx`)
Wraps protected admin dashboard routes:
* **Sidebar (Desktop & Collapsible Mobile)**:
  * Brand Header ("Admin Console")
  * Navigation Links:
    * 📊 Dashboard (`/admin/dashboard`)
    * 🗂️ Categories (`/admin/categories`)
    * 📦 Products (`/admin/products`)
    * 📑 Orders (`/admin/orders`)
    * 🌐 View Public Store (`/`)
* **Header**: Shows logged-in admin name and logout action.
* **Content Area**: Clean data tables, search/filter inputs, and primary action buttons (e.g., "+ Add Product").

---

## 3. Storefront Pages & Component Breakdown

### 3.1 Home (`/`)
* **Hero Banner**: Engaging welcome title ("Discover Modern Tech & Essentials"), subtitle, and a "Shop Now" call to action button.
* **Category Showcase**: Cards displaying available categories with icons and direct click-through filters.
* **Featured / Recent Products**: Responsive grid of top 4–8 products with quick "Add to Cart" buttons.

### 3.2 Products Catalogue (`/products`)
* **Search & Filter Bar**:
  * Real-time search input with clear button.
  * Category Filter Pills: `All | Electronics | Fashion | Shoes | ...` with active highlight.
* **Responsive Product Grid**:
  * 1 column on mobile, 2 on tablet, 3–4 on desktop (`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`).
* **Product Card (`ProductCard.jsx`)**:
  * Product Image with aspect ratio preservation and hover zoom.
  * Category badge pill.
  * Product title with ellipsis for long text.
  * Price formatted cleanly (`$149.99`).
  * Stock indicator ("In Stock (15)" or "Out of Stock").
  * "Add to Cart" button (disabled if `stock === 0`).
  * Card clicks navigate to `/products/:id`.

### 3.3 Product Details (`/products/:id`)
* **Layout**: Two-column layout on desktop (Image preview left, Details right).
* **Details Content**:
  * Breadcrumb (`Home > Products > Category > Product Name`).
  * Product Title & Category pill.
  * Price with prominent typography.
  * Full description text.
  * Stock status: Green pill if $>0$, Red pill if out of stock.
  * Quantity Selector: `[-] [1] [+]` enforcing minimum 1 and maximum available stock.
  * "Add to Cart" primary CTA button.

### 3.4 Cart (`/cart`)
* **Cart Table / List**:
  * Product thumbnail, title, category, unit price.
  * Quantity increment/decrement buttons.
  * Subtotal per row (`price * quantity`).
  * Remove (Trash icon) button.
* **Order Summary Card (Right column on desktop)**:
  * Total items count.
  * Subtotal calculation.
  * Shipping (Free).
  * Estimated total.
  * "Proceed to Checkout" button.
* **Empty Cart State**: Shows empty shopping bag illustration, "Your cart is empty", and a "Continue Shopping" button.

### 3.5 Checkout (`/checkout`)
* **Access**: Authenticated users only. If unauthenticated, redirect to `/login?redirect=checkout`.
* **Shipping Address Form**:
  * Full Name (required)
  * Phone Number (required)
  * Street Address (required)
  * City (required)
  * Pincode / Postal Code (required)
* **Payment Method**:
  * Radio option pre-selected and locked to **Cash on Delivery (COD)**.
  * Clear badge: "Pay cash upon delivery at your doorstep".
* **Order Summary**:
  * Review of items and total order price.
* **Action**: "Place Order" button with loading spinner during submission.

### 3.6 Customer Orders (`/my-orders`)
* List of customer's previous orders in reverse chronological order.
* Each card includes:
  * Order ID & Date placed.
  * Status badge (`Pending` in yellow, `Confirmed` in blue, `Shipped` in purple, `Delivered` in green, `Cancelled` in red).
  * Products summary (thumbnail, name, qty $\times$ price).
  * Total order price.
  * Delivery address summary.

### 3.7 Auth Pages (`/login` & `/register`)
* Centered card design with clean form controls:
  * Email and Password fields.
  * Name and Confirm Password (on Register).
  * Inline validation messages.
  * Toggle link between Login and Register.
  * Auto-redirect to intended page on success.

---

## 4. Admin Dashboard Views

### 4.1 Admin Categories (`/admin/categories`)
* **Top Bar**: Search bar and "+ Add New Category" button.
* **Categories Table**:
  * Columns: Name, Description, Products Count (optional), Actions (Edit, Delete).
* **Add/Edit Modal**: Form with Category Name and Description inputs.
* **Delete Confirmation Modal**: "Are you sure you want to delete category '{name}'? This cannot be undone."

### 4.2 Admin Products (`/admin/products`)
* **Top Bar**: Search filter, category filter dropdown, and "+ Add New Product" button.
* **Products Table**:
  * Columns: Image thumbnail, Product Name, Category, Price, Stock count, Actions (Edit, Delete).
* **Add/Edit Modal**:
  * Name, Category dropdown (loaded dynamically from `/api/categories`), Price, Stock, Image URL, Description.
* **Delete Confirmation Dialog**: Modal with Confirm / Cancel options.

### 4.3 Admin Orders (`/admin/orders`)
* **Orders Table**:
  * Columns: Order ID, Date, Customer Name & Email, Items summary, Total Amount, Status badge, Action dropdown.
* **Status Update Action**:
  * Select dropdown with options: `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`.
  * Selecting a status immediately dispatches `PATCH /api/admin/orders/:id/status` and updates the table row with a success toast.

---

## 5. Client State Management Architecture

```text
               ┌──────────────────────────────────────┐
               │              App.jsx                 │
               └──────────────────┬───────────────────┘
                                  │
           ┌──────────────────────┴──────────────────────┐
           ▼                                             ▼
┌──────────────────────┐                     ┌──────────────────────┐
│     AuthContext      │                     │     CartContext      │
├──────────────────────┤                     ├──────────────────────┤
│ - user               │                     │ - cartItems          │
│ - token              │                     │ - addToCart()        │
│ - login()            │                     │ - updateQuantity()   │
│ - register()         │                     │ - removeFromCart()   │
│ - logout()           │                     │ - clearCart()        │
│ - isAuthenticated    │                     │ - getCartTotal()     │
│ - isAdmin            │                     │ - getCartCount()     │
└──────────────────────┘                     └──────────────────────┘
```

### LocalStorage Keys:
* `mini_ecom_token`: JWT string for authenticated sessions.
* `mini_ecom_user`: JSON object with `{ _id, name, email, role }`.
* `mini_ecom_cart`: JSON array of cart items for persistence across page refreshes.

---

## 6. Shared Components & UI Patterns

| Component | Props | Purpose |
| :--- | :--- | :--- |
| `Navbar` | `cartCount`, `user`, `onLogout` | Main navigation, responsive mobile drawer, cart badge |
| `ProductCard` | `product`, `onAddToCart` | Displays product preview, category tag, price, and CTA |
| `Modal` | `isOpen`, `title`, `onClose`, `children` | Reusable modal dialog with backdrop blur |
| `ConfirmDialog` | `isOpen`, `title`, `message`, `onConfirm`, `onCancel` | Safe confirmation for category/product deletion |
| `Toast` | `message`, `type` (`success`, `error`) | Non-blocking alert banners |
| `Loader` | `size`, `text` | Accessible spinner for network requests |
| `EmptyState` | `title`, `description`, `actionText`, `onAction` | Zero-state placeholder illustration and button |
