const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const seedData = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const customerPassword = await bcrypt.hash('customer123', salt);

    const admin = await User.create({
      name: 'Store Admin',
      email: 'admin@demo.com',
      password: adminPassword,
      role: 'admin',
    });

    const customer = await User.create({
      name: 'Jane Customer',
      email: 'customer@demo.com',
      password: customerPassword,
      role: 'customer',
    });

    console.log('? Users seeded: admin@demo.com and customer@demo.com');

    // 2. Create Categories
    const electronics = await Category.create({
      name: 'Electronics',
      description: 'Smartphones, audio, laptops and smart gadgets',
    });

    const fashion = await Category.create({
      name: 'Fashion',
      description: 'Jackets, streetwear, and modern apparel',
    });

    const shoes = await Category.create({
      name: 'Shoes',
      description: 'Running sneakers and athletic footwear',
    });

    console.log('? Categories seeded: Electronics, Fashion, Shoes');

    // 3. Create Products
    await Product.create([
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium over-ear headphones with 30-hour battery life and adaptive ANC.',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        category: electronics._id,
        stock: 15,
      },
      {
        name: 'Smart Fitness Tracker Watch',
        description: 'Heart rate tracking, GPS, waterproof casing, and AMOLED touchscreen.',
        price: 99.50,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        category: electronics._id,
        stock: 8,
      },
      {
        name: 'Classic Vintage Leather Jacket',
        description: 'Genuine sheepskin leather jacket with zip pockets and quilted inner lining.',
        price: 199.00,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
        category: fashion._id,
        stock: 6,
      },
      {
        name: 'Pro Performance Running Sneakers',
        description: 'Lightweight responsive foam cushioning designed for daily marathon training.',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        category: shoes._id,
        stock: 22,
      },
      {
        name: 'Mechanical Tactile Gaming Keyboard',
        description: 'Hot-swappable RGB mechanical keyboard with custom low-latency switches.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&auto=format&fit=crop&q=80',
        category: electronics._id,
        stock: 12,
      },
    ]);

    console.log('? Products seeded successfully into MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
