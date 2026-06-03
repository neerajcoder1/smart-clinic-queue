const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cliniq';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected. Reconnecting...');
    isConnected = false;
  });
};

module.exports = connectDB;
