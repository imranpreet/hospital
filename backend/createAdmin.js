const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'patient' },
  contact: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@citycare.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Admin User',
        email: 'admin@citycare.com',
        password: hashedPassword,
        role: 'admin',
        contact: '+91 99999 99999'
      });
      
      await admin.save();
      console.log('✅ Default admin user created!');
      console.log('Email: admin@citycare.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    await mongoose.disconnect();
    console.log('Done!');
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
