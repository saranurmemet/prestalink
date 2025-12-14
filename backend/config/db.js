const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️  MONGO_URI is not defined in environment variables');
      console.warn('⚠️  Backend will start but database operations will fail');
      console.warn('⚠️  Set MONGO_URI in .env file for database functionality');
      return;
    }
    
    // Connect with timeout and error handling
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      connectTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.warn('⚠️  Backend will continue but database operations will fail');
    console.warn('⚠️  Please check your MongoDB connection and MONGO_URI in .env file');
    // Don't throw - allow server to start for testing
    return;
  }
};

module.exports = connectDB;

