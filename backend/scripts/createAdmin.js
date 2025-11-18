import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const makeAdmin = async (email, isSuperAdmin = false) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    user.is_admin = true;
    if (isSuperAdmin) {
      user.is_super_admin = true;
    }
    await user.save();
    
    const role = isSuperAdmin ? 'super admin' : 'admin';
    console.log(`User ${email} is now a ${role}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
const isSuperAdmin = process.argv[3] === '--super';

if (!email) {
  console.log('Usage: node scripts/createAdmin.js <email> [--super]');
  console.log('  --super: Make user a super admin');
  process.exit(1);
}

makeAdmin(email, isSuperAdmin);

