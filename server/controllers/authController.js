import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { memoryStore } from '../config/store.js';

const generateToken = (id, role, email) => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || 'super_secret_jwt_demo_key_2026',
    { expiresIn: '7d' }
  );
};

// @route POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    // Try MongoDB first
    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: 'customer',
      });

      const token = generateToken(user._id, user.role, user.email);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch {
      // Memory fallback
      const exists = memoryStore.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return res.status(409).json({ success: false, message: 'User already exists with this email' });
      }

      const newUser = {
        _id: 'user_' + Date.now(),
        name,
        email: email.toLowerCase(),
        role: 'customer',
      };
      memoryStore.users.push(newUser);
      const token = generateToken(newUser._id, newUser.role, newUser.email);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: newUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Admin demo account shortcut
    if (email === 'admin@demo.com' && password === 'admin123') {
      const token = generateToken('admin_demo_id', 'admin', 'admin@demo.com');
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          _id: 'admin_demo_id',
          name: 'Store Admin',
          email: 'admin@demo.com',
          role: 'admin',
        },
      });
    }

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.role, user.email);
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    } catch {
      // Check memory store
    }

    const memUser = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (memUser) {
      const token = generateToken(memUser._id, memUser.role, memUser.email);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: memUser,
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    next(error);
  }
};
