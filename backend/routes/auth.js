const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Sign Up
router.post(
  '/signup',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ 
          success: false, 
          message: 'User already exists with this email' 
        });
      }

      // Create new user
      user = new User({ name, email, password });
      await user.save();

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Signup Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error during signup',
        error: error.message 
      });
    }
  }
);

// Sign In
router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Signin Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error during signin',
        error: error.message 
      });
    }
  }
);

// Get Current User
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user',
      error: error.message 
    });
  }
});

// Update Profile
router.put(
  '/profile',
  auth,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().isMobilePhone().withMessage('Valid phone is required'),
    body('address').optional().notEmpty().withMessage('Address cannot be empty'),
    body('city').optional().notEmpty().withMessage('City cannot be empty'),
    body('state').optional().notEmpty().withMessage('State cannot be empty'),
    body('zipCode').optional().notEmpty().withMessage('Zip code cannot be empty')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { name, phone, address, city, state, zipCode } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (address) updateData.address = address;
      if (city) updateData.city = city;
      if (state) updateData.state = state;
      if (zipCode) updateData.zipCode = zipCode;

      const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user
      });
    } catch (error) {
      console.error('Update Profile Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error updating profile',
        error: error.message 
      });
    }
  }
);

module.exports = router;
