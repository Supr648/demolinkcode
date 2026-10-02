const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.warn('?? No MongoDB connection string provided in .env (MONGO_URI or MONGODB_URI).');
    return false;
  }
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`? MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`?? MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('whitelisted') || error.message.includes('cluster')) {
      console.log('?? TIP: In MongoDB Atlas -> Network Access -> Click "Add IP Address" -> Select "Allow Access from Anywhere" (0.0.0.0/0).');
    }
    return false;
  }
};

module.exports = connectDB;
