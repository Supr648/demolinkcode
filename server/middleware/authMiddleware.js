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
      message: 'Not authorized, no token provided',
    });
  }

  // Handle demo token
  if (token === 'demo_admin_jwt_token') {
    req.user = {
      _id: 'admin_demo_id',
      name: 'Store Admin',
      email: 'admin@demo.com',
      role: 'admin',
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_demo_key_2026');
    try {
      const dbUser = await User.findById(decoded.id).select('-password');
      if (dbUser) {
        req.user = dbUser;
        return next();
      }
    } catch {
      // In-memory or fallback
    }

    req.user = {
      _id: decoded.id,
      role: decoded.role || 'customer',
      email: decoded.email,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid or expired',
    });
  }
};
