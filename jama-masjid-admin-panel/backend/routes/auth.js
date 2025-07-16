const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;

    // Validate input
    if (!id || !password) {
      return res.status(400).json({ message: 'ID and password are required' });
    }

    // Check credentials against environment variables
    if (id !== process.env.ADMIN_ID || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: process.env.ADMIN_ID, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: process.env.ADMIN_ID,
        role: 'admin',
        name: 'Jama Masjid Admin'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token endpoint
router.get('/verify', auth, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: {
      id: req.user.id,
      role: req.user.role,
      name: 'Jama Masjid Admin'
    }
  });
});

// Logout endpoint (optional - mainly for frontend to clear token)
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;