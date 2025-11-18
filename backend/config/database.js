import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    
    // Provide more helpful error messages
    if (error.message.includes('IP')) {
      console.error('\n⚠️  IP Whitelist Issue:');
      console.error('1. Go to MongoDB Atlas → Network Access');
      console.error('2. Click "Add IP Address"');
      console.error('3. Click "Allow Access from Anywhere" (0.0.0.0/0) for development');
      console.error('4. Wait 1-2 minutes for changes to propagate');
    } else if (error.message.includes('authentication')) {
      console.error('\n⚠️  Authentication Issue:');
      console.error('1. Check your MongoDB username and password in MONGODB_URI');
      console.error('2. Make sure special characters in password are URL-encoded');
      console.error('3. Verify database user has correct permissions');
    } else if (error.message.includes('timeout')) {
      console.error('\n⚠️  Connection Timeout:');
      console.error('1. Check your internet connection');
      console.error('2. Verify your IP is whitelisted in MongoDB Atlas');
      console.error('3. Check if firewall is blocking the connection');
    }
    
    process.exit(1);
  }
};

