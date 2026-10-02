# Database Design & Mongoose Schemas

This document defines the schema design, field requirements, validation rules, indexing strategies, and relationships for the **MongoDB** database in the **Mini E-Commerce Demo Project**.

Only four core models are used in this architecture:
1. `User`
2. `Category`
3. `Product`
4. `Order`

---

## 1. Entity-Relationship Diagram (ERD)

```
┌──────────────────────┐
│       Category       │
├──────────────────────┤
│ _id (ObjectId)       │◀──────────────┐
│ name (String, Unique)│               │
│ description (String) │               │
│ timestamps           │               │
└──────────────────────┘               │ (category ref)
                                       │
┌──────────────────────┐       ┌───────┴──────────────┐
│         User         │       │       Product        │
├──────────────────────┤       ├──────────────────────┤
│ _id (ObjectId)       │◀──┐   │ _id (ObjectId)       │◀──────────────┐
│ name (String)        │   │   │ name (String)        │               │
│ email (String, Unique│   │   │ description (String) │               │
│ password (Hashed)    │   │   │ price (Number, >= 0) │               │
│ role (Enum)          │   │   │ image (String URL)   │               │
│ timestamps           │   │   │ category (ObjectId)  │               │
└──────────────────────┘   │   │ stock (Number, >= 0) │               │
                           │   │ timestamps           │               │
                           │   └──────────────────────┘               │
                           │                                          │
                           │   ┌──────────────────────────────────────┴──┐
                           │   │                  Order                  │
                           │   ├─────────────────────────────────────────┤
                           │   │ _id (ObjectId)                          │
                           └───│ user (ObjectId, Ref: User)              │
                               │ products: [                             │
                               │   {                                     │
                               │     product (ObjectId, Ref: Product),   │
                               │     name (String snapshot),             │
                               │     price (Number snapshot),            │
                               │     quantity (Number, >= 1)             │
                               │   }                                     │
                               │ ]                                       │
                               │ totalAmount (Number, calculated by DB)  │
                               │ shippingAddress: {                      │
                               │   name (String),                        │
                               │   phone (String),                       │
                               │   address (String),                     │
                               │   city (String),                        │
                               │   pincode (String)                      │
                               │ }                                       │
                               │ status (Enum)                           │
                               │ createdAt / updatedAt (Timestamps)      │
                               └─────────────────────────────────────────┘
```

---

## 2. Model Schemas & Specifications

### 2.1 User Model (`User.js`)

Represents both regular customers and administrative accounts.

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'admin'],
        message: '{VALUE} is not a supported role'
      },
      default: 'customer'
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook: Hash password before saving to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: Validate password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
```

#### Fields & Validations:
* `name`: String, required, trimmed, max length 50.
* `email`: String, required, unique, lowercase, regex-validated for valid format.
* `password`: String, required, min length 6, hashed with bcrypt.
* `role`: String enum (`customer` | `admin`), defaults to `customer`.
* `createdAt` & `updatedAt`: Auto-generated via `{ timestamps: true }`.

---

### 2.2 Category Model (`Category.js`)

Provides organizational categorization for products (e.g., Electronics, Fashion, Shoes).

```javascript
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [60, 'Category name cannot exceed 60 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Category', categorySchema);
```

#### Fields & Validations:
* `name`: String, required, unique, trimmed, max length 60.
* `description`: String, optional, trimmed.
* `timestamps`: Recorded on creation and modification.

---

### 2.3 Product Model (`Product.js`)

Main product catalog containing pricing, inventory, and category references.

```javascript
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0.01, 'Price must be greater than zero']
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a valid category']
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Text Index for full-text search capability
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
```

#### Fields & Validations:
* `name`: String, required, trimmed, max length 120.
* `description`: String, required, trimmed.
* `price`: Number, required, must be positive strictly $> 0$.
* `image`: String URL, required, trimmed.
* `category`: ObjectId referencing `Category`, required.
* `stock`: Number, required, non-negative ($>= 0$).
* Text Index on `{ name: 'text', description: 'text' }` for search filtering.

---

### 2.4 Order Model (`Order.js`)

Records finalized customer purchases with snapshot pricing, shipping details, and status.

```javascript
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price snapshot cannot be negative']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    }
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Postal code / Pincode is required'],
      trim: true
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: {
      type: [orderItemSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'An order must contain at least one product'
      }
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        message: '{VALUE} is not a valid order status'
      },
      default: 'Pending'
    },
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Order', orderSchema);
```

#### Fields & Validations:
* `user`: ObjectId referencing `User`, required.
* `products`: Array of item sub-documents containing:
  * `product`: ObjectId reference to `Product`.
  * `name`: Snapshot of product name at purchase time.
  * `price`: Snapshot of verified price at purchase time (retrieved server-side).
  * `quantity`: Number of units (min 1).
* `totalAmount`: Number, computed on backend by summing verified product prices $\times$ quantities.
* `shippingAddress`: Sub-document containing `name`, `phone`, `address`, `city`, `pincode`.
* `status`: Enum string (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`). Defaults to `Pending`.
* `paymentMethod`: Hardcoded to `'Cash on Delivery'`.
* `createdAt` & `updatedAt`: Automatic ISO timestamps.

---

## 3. Database Indexes

| Collection | Indexed Field(s) | Type | Purpose |
| :--- | :--- | :--- | :--- |
| `users` | `email` | Unique | Fast lookup and duplicate email prevention |
| `categories` | `name` | Unique | Ensures category distinctness |
| `products` | `name`, `description` | Text Index | Enables `$text: { $search: query }` keyword queries |
| `products` | `category` | Standard | High-performance category filtering queries |
| `orders` | `user` | Standard | Rapid retrieval of orders for "My Orders" view |
| `orders` | `createdAt` | Descending (-1) | Ordered chronological order feeds |

---

## 4. Price & Stock Integrity Strategies

1. **Snapshot Pricing**:
   Products might change price over time. Storing the `price` inside the order item subdocument guarantees that historical order totals remain accurate even if an admin modifies the product price later.
2. **Atomic Inventory Decrements**:
   Instead of read-modify-write patterns, atomic operators prevent race conditions:
   ```javascript
   await Product.updateOne(
     { _id: item.productId, stock: { $gte: item.quantity } },
     { $inc: { stock: -item.quantity } }
   );
   ```
3. **Restoring Stock on Cancellation**:
   If an admin marks an order as `Cancelled`, the deducted stock can be safely returned to the inventory catalog using `$inc: { stock: item.quantity }`.
