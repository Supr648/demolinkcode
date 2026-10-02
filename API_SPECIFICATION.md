# REST API Specification

This document provides complete, contract-level documentation for all backend endpoints in the **Mini E-Commerce Demo Project**.

* **Base URL**: `http://localhost:5000/api`
* **Default Data Format**: `application/json`
* **Authorization Header**: `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register Customer
* **Method**: `POST`
* **Route**: `/api/auth/register`
* **Access**: Public
* **Description**: Registers a new customer account, hashes password, and issues a JWT token.

#### Request Body
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "651d2f78e4b01a2b3c4d5e6f",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```

#### Error Responses
* `400 Bad Request`: Validation failure (missing fields, passwords do not match, password length < 6, invalid email format).
* `409 Conflict`: Email already exists.

---

### 1.2 User / Admin Login
* **Method**: `POST`
* **Route**: `/api/auth/login`
* **Access**: Public
* **Description**: Verifies credentials and returns user details with a JWT token.

#### Request Body
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "651d2f78e4b01a2b3c4d5e6f",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```

#### Error Responses
* `400 Bad Request`: Email and password are required.
* `401 Unauthorized`: Invalid email or password.

---

## 2. Category Endpoints (`/api/categories`)

### 2.1 Get All Categories
* **Method**: `GET`
* **Route**: `/api/categories`
* **Access**: Public
* **Description**: Fetches list of all product categories for storefront navigation and filter pills.

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "count": 3,
  "categories": [
    {
      "_id": "651d3a12e4b01a2b3c4d5e70",
      "name": "Electronics",
      "description": "Smartphones, laptops, and smart gadgets",
      "createdAt": "2026-10-01T10:00:00.000Z"
    },
    {
      "_id": "651d3a12e4b01a2b3c4d5e71",
      "name": "Fashion",
      "description": "Apparel, jackets, and modern styles",
      "createdAt": "2026-10-01T10:05:00.000Z"
    },
    {
      "_id": "651d3a12e4b01a2b3c4d5e72",
      "name": "Shoes",
      "description": "Athletic footwear and sneakers",
      "createdAt": "2026-10-01T10:10:00.000Z"
    }
  ]
}
```

---

### 2.2 Create Category
* **Method**: `POST`
* **Route**: `/api/categories`
* **Access**: Protected (Admin only)
* **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`

#### Request Body
```json
{
  "name": "Accessories",
  "description": "Watches, bags, and sunglasses"
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "_id": "651d3a12e4b01a2b3c4d5e73",
    "name": "Accessories",
    "description": "Watches, bags, and sunglasses",
    "createdAt": "2026-10-02T08:00:00.000Z"
  }
}
```

---

### 2.3 Update Category
* **Method**: `PUT`
* **Route**: `/api/categories/:id`
* **Access**: Protected (Admin only)

#### Request Body
```json
{
  "name": "Fashion & Apparel",
  "description": "Updated category description"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Category updated successfully",
  "category": {
    "_id": "651d3a12e4b01a2b3c4d5e71",
    "name": "Fashion & Apparel",
    "description": "Updated category description"
  }
}
```

---

### 2.4 Delete Category
* **Method**: `DELETE`
* **Route**: `/api/categories/:id`
* **Access**: Protected (Admin only)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 3. Product Endpoints (`/api/products`)

### 3.1 Get All Products (with Search & Category Filter)
* **Method**: `GET`
* **Route**: `/api/products`
* **Access**: Public
* **Query Parameters**:
  * `category` *(optional)*: Category ObjectId or slug
  * `search` *(optional)*: Text query matched against product name or description
* **Example**: `/api/products?category=651d3a12e4b01a2b3c4d5e70&search=phone`

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "count": 1,
  "products": [
    {
      "_id": "651d4b99e4b01a2b3c4d5e80",
      "name": "Wireless Noise-Cancelling Headphones",
      "description": "Premium over-ear headphones with 30-hour battery life",
      "price": 149.99,
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "category": {
        "_id": "651d3a12e4b01a2b3c4d5e70",
        "name": "Electronics"
      },
      "stock": 15,
      "createdAt": "2026-10-01T12:00:00.000Z"
    }
  ]
}
```

---

### 3.2 Get Single Product By ID
* **Method**: `GET`
* **Route**: `/api/products/:id`
* **Access**: Public

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "product": {
    "_id": "651d4b99e4b01a2b3c4d5e80",
    "name": "Wireless Noise-Cancelling Headphones",
    "description": "Premium over-ear headphones with 30-hour battery life",
    "price": 149.99,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    "category": {
      "_id": "651d3a12e4b01a2b3c4d5e70",
      "name": "Electronics"
    },
    "stock": 15
  }
}
```

---

### 3.3 Create Product
* **Method**: `POST`
* **Route**: `/api/products`
* **Access**: Protected (Admin only)
* **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`

#### Request Body
```json
{
  "name": "Mechanical Gaming Keyboard",
  "description": "RGB tactile switches with detachable USB-C cable",
  "price": 89.99,
  "image": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
  "category": "651d3a12e4b01a2b3c4d5e70",
  "stock": 25
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "651d4b99e4b01a2b3c4d5e85",
    "name": "Mechanical Gaming Keyboard",
    "price": 89.99,
    "stock": 25,
    "category": "651d3a12e4b01a2b3c4d5e70"
  }
}
```

---

### 3.4 Update Product
* **Method**: `PUT`
* **Route**: `/api/products/:id`
* **Access**: Protected (Admin only)

#### Request Body
```json
{
  "price": 79.99,
  "stock": 20
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {
    "_id": "651d4b99e4b01a2b3c4d5e85",
    "price": 79.99,
    "stock": 20
  }
}
```

---

### 3.5 Delete Product
* **Method**: `DELETE`
* **Route**: `/api/products/:id`
* **Access**: Protected (Admin only)

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 4. Order Endpoints (`/api/orders` & `/api/admin/orders`)

### 4.1 Create Order (Checkout)
* **Method**: `POST`
* **Route**: `/api/orders`
* **Access**: Protected (Customer)
* **Headers**: `Authorization: Bearer <CUSTOMER_TOKEN>`
* **Crucial Rule**: Frontend does **not** specify item prices or order total. The server calculates genuine totals directly from current MongoDB product documents and validates stock.

#### Request Body
```json
{
  "items": [
    {
      "productId": "651d4b99e4b01a2b3c4d5e80",
      "quantity": 2
    },
    {
      "productId": "651d4b99e4b01a2b3c4d5e85",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "Jane Doe",
    "phone": "+1 555-0199",
    "address": "456 Market St, Apt 2B",
    "city": "Metropolis",
    "pincode": "10001"
  }
}
```

#### Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "_id": "651d5c22e4b01a2b3c4d5e90",
    "user": "651d2f78e4b01a2b3c4d5e6f",
    "products": [
      {
        "product": "651d4b99e4b01a2b3c4d5e80",
        "name": "Wireless Noise-Cancelling Headphones",
        "price": 149.99,
        "quantity": 2
      },
      {
        "product": "651d4b99e4b01a2b3c4d5e85",
        "name": "Mechanical Gaming Keyboard",
        "price": 79.99,
        "quantity": 1
      }
    ],
    "totalAmount": 379.97,
    "shippingAddress": {
      "name": "Jane Doe",
      "phone": "+1 555-0199",
      "address": "456 Market St, Apt 2B",
      "city": "Metropolis",
      "pincode": "10001"
    },
    "status": "Pending",
    "paymentMethod": "Cash on Delivery",
    "createdAt": "2026-10-02T08:30:00.000Z"
  }
}
```

#### Error Responses
* `400 Bad Request`:
  * Insufficient stock for an item: `"Insufficient stock for Wireless Noise-Cancelling Headphones (available: 1)"`
  * Cart items empty or missing shipping address fields.
* `404 Not Found`: One or more products no longer exist in the catalog.

---

### 4.2 Get Logged-in Customer Orders
* **Method**: `GET`
* **Route**: `/api/orders/my-orders`
* **Access**: Protected (Customer)
* **Headers**: `Authorization: Bearer <CUSTOMER_TOKEN>`

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "count": 1,
  "orders": [
    {
      "_id": "651d5c22e4b01a2b3c4d5e90",
      "totalAmount": 379.97,
      "status": "Pending",
      "paymentMethod": "Cash on Delivery",
      "createdAt": "2026-10-02T08:30:00.000Z",
      "products": [
        {
          "name": "Wireless Noise-Cancelling Headphones",
          "price": 149.99,
          "quantity": 2
        }
      ]
    }
  ]
}
```

---

### 4.3 Get All Customer Orders (Admin)
* **Method**: `GET`
* **Route**: `/api/admin/orders`
* **Access**: Protected (Admin only)
* **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "count": 12,
  "orders": [
    {
      "_id": "651d5c22e4b01a2b3c4d5e90",
      "user": {
        "_id": "651d2f78e4b01a2b3c4d5e6f",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "totalAmount": 379.97,
      "status": "Pending",
      "paymentMethod": "Cash on Delivery",
      "shippingAddress": {
        "name": "Jane Doe",
        "phone": "+1 555-0199",
        "address": "456 Market St, Apt 2B",
        "city": "Metropolis",
        "pincode": "10001"
      },
      "products": [
        {
          "product": "651d4b99e4b01a2b3c4d5e80",
          "name": "Wireless Noise-Cancelling Headphones",
          "price": 149.99,
          "quantity": 2
        }
      ],
      "createdAt": "2026-10-02T08:30:00.000Z"
    }
  ]
}
```

---

### 4.4 Update Order Status (Admin)
* **Method**: `PATCH`
* **Route**: `/api/admin/orders/:id/status`
* **Access**: Protected (Admin only)
* **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`

#### Request Body
```json
{
  "status": "Confirmed"
}
```
*Valid values*: `"Pending"`, `"Confirmed"`, `"Shipped"`, `"Delivered"`, `"Cancelled"`

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Order status updated to Confirmed",
  "order": {
    "_id": "651d5c22e4b01a2b3c4d5e90",
    "status": "Confirmed",
    "updatedAt": "2026-10-02T08:45:00.000Z"
  }
}
```

#### Error Responses
* `400 Bad Request`: Invalid status string provided.
* `404 Not Found`: Order ID does not match any record.
