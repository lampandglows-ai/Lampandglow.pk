const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post(
  '/',
  auth,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('totalAmount').isFloat({ min: 0 }).withMessage('Valid total amount is required')
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

      const { items, shippingAddress, totalAmount, paymentMethod } = req.body;
      const user = await User.findById(req.userId);

      const order = new Order({
        user: req.userId,
        items,
        shippingAddress: {
          name: shippingAddress.name || user.name,
          email: shippingAddress.email || user.email,
          phone: shippingAddress.phone || user.phone,
          address: shippingAddress.address || user.address,
          city: shippingAddress.city || user.city,
          state: shippingAddress.state || user.state,
          zipCode: shippingAddress.zipCode || user.zipCode
        },
        totalAmount,
        paymentMethod: paymentMethod || 'credit_card'
      });

      // Update product stock
      for (let item of items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      }

      await order.save();
      await order.populate('user items.product');

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order
      });
    } catch (error) {
      console.error('Create Order Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error creating order',
        error: error.message 
      });
    }
  }
);

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching orders',
      error: error.message 
    });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user items.product');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check authorization
    if (order.user._id.toString() !== req.userId && req.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this order' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching order',
      error: error.message 
    });
  }
});

// Update order status (Admin only)
router.put(
  '/:id/status',
  auth,
  adminOnly,
  [
    body('orderStatus').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid order status')
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

      const { orderStatus, paymentStatus } = req.body;
      const updateData = { updatedAt: Date.now() };

      if (orderStatus) updateData.orderStatus = orderStatus;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate('user items.product');

      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
      }

      res.json({
        success: true,
        message: 'Order status updated successfully',
        order
      });
    } catch (error) {
      console.error('Update Order Status Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error updating order status',
        error: error.message 
      });
    }
  }
);

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check authorization
    if (order.user.toString() !== req.userId && req.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to cancel this order' 
      });
    }

    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel this order' 
      });
    }

    // Restore product stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { new: true }
      );
    }

    order.orderStatus = 'cancelled';
    order.updatedAt = Date.now();
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel Order Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error cancelling order',
      error: error.message 
    });
  }
});

module.exports = router;
