// Persistent in-memory data store as graceful fallback if local MongoDB is offline
export const memoryStore = {
  users: [
    {
      _id: 'admin_demo_id',
      name: 'Store Admin',
      email: 'admin@demo.com',
      role: 'admin',
    },
  ],
  categories: [
    {
      _id: 'cat_1',
      name: 'Electronics',
      description: 'Smartphones, laptops, and audio accessories',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'cat_2',
      name: 'Fashion',
      description: 'Apparel, jackets, and modern styles',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'cat_3',
      name: 'Shoes',
      description: 'Athletic footwear and sneakers',
      createdAt: new Date().toISOString(),
    },
  ],
  products: [
    {
      _id: 'prod_1',
      name: 'Wireless Noise-Cancelling Headphones',
      description: 'High-fidelity audio with 30hr battery life and adaptive ANC.',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
      category: { _id: 'cat_1', name: 'Electronics' },
      stock: 15,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'prod_2',
      name: 'Smart Fitness Tracker Watch',
      description: 'Heart rate monitor, step tracking, GPS navigation and waterproof.',
      price: 99.50,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      category: { _id: 'cat_1', name: 'Electronics' },
      stock: 6,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'prod_3',
      name: 'Classic Vintage Leather Jacket',
      description: 'Genuine sheepskin leather with quilted lining and metallic zippers.',
      price: 199.00,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60',
      category: { _id: 'cat_2', name: 'Fashion' },
      stock: 10,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'prod_4',
      name: 'Pro Performance Running Sneakers',
      description: 'Ultra-cushioned responsive foam sole designed for marathon runners.',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
      category: { _id: 'cat_3', name: 'Shoes' },
      stock: 22,
      createdAt: new Date().toISOString(),
    },
  ],
  orders: [
    {
      _id: 'ord_demo_101',
      user: { _id: 'cust_1', name: 'Jane Doe', email: 'jane@example.com' },
      products: [
        {
          product: 'prod_1',
          name: 'Wireless Noise-Cancelling Headphones',
          price: 149.99,
          quantity: 2,
        },
      ],
      totalAmount: 299.98,
      shippingAddress: {
        name: 'Jane Doe',
        phone: '+1 555-0199',
        address: '456 Market St, Apt 2B',
        city: 'Metropolis',
        pincode: '10001',
      },
      status: 'Pending',
      paymentMethod: 'Cash on Delivery',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};
