import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mini_ecommerce', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Local MongoDB service not detected (${error.message}).`);
    console.log(`💡 Note: If you have MongoDB Atlas, provide MONGO_URI in server/.env.`);
    console.log(`🚀 Server will operate with robust in-memory mock store for demo.`);
    return false;
  }
};
