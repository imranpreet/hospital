const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Admin Passkey (stored as environment variable for security)
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'HM@Admin2025$Secure';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, contact } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role, contact });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin Login with Passkey
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password, passkey } = req.body;
    
    // Validate required fields
    if (!email || !password || !passkey) {
      return res.status(400).json({ msg: 'Please provide email, password, and passkey' });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
    
    // Check if account is blocked
    if (user.isBlocked) {
      return res.status(403).json({ 
        msg: 'Your account has been blocked due to multiple failed passkey attempts. Please contact system administrator.',
        isBlocked: true,
        blockedAt: user.blockedAt
      });
    }
    
    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Verify passkey
    if (passkey !== ADMIN_PASSKEY) {
      // Increment failed attempts
      user.failedPasskeyAttempts = (user.failedPasskeyAttempts || 0) + 1;
      
      // Block account if 3 or more failed attempts
      if (user.failedPasskeyAttempts >= 3) {
        user.isBlocked = true;
        user.blockedAt = new Date();
        await user.save();
        
        return res.status(403).json({ 
          msg: 'Account blocked! You have entered incorrect passkey 3 times. Please contact system administrator.',
          isBlocked: true,
          attempts: user.failedPasskeyAttempts
        });
      }
      
      await user.save();
      
      const remainingAttempts = 3 - user.failedPasskeyAttempts;
      return res.status(400).json({ 
        msg: `Incorrect passkey. ${remainingAttempts} attempt(s) remaining before account is blocked.`,
        attempts: user.failedPasskeyAttempts,
        remainingAttempts
      });
    }
    
    // Passkey is correct - reset failed attempts and login
    user.failedPasskeyAttempts = 0;
    await user.save();
    
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      msg: 'Admin login successful'
    });
    
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Regular Login (for patients, doctors, staff)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    
    // Prevent admin login through regular login route
    if (user.role === 'admin') {
      return res.status(403).json({ msg: 'Please use admin login portal' });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Unblock admin account (only for super admin or system administrator)
router.post('/unblock-admin', async (req, res) => {
  try {
    const { email, adminPasskey } = req.body;
    
    if (!email || !adminPasskey) {
      return res.status(400).json({ msg: 'Email and admin passkey required' });
    }
    
    // Verify admin passkey
    if (adminPasskey !== ADMIN_PASSKEY) {
      return res.status(403).json({ msg: 'Invalid admin passkey' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    user.isBlocked = false;
    user.failedPasskeyAttempts = 0;
    user.blockedAt = null;
    await user.save();
    
    res.json({ msg: 'Account unblocked successfully', user: { email: user.email, name: user.name } });
    
  } catch (err) {
    console.error('Unblock error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
