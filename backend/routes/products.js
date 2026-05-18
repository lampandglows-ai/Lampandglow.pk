const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching products',
      error: error.message 
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching product',
      error: error.message 
    });
  }
});

// Create product (Admin only)
router.post(
  '/',
  auth,
  adminOnly,
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('stock').isInt({ min: 0 }).withMessage('Valid stock quantity is required')
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

      const { name, description, price, category, image, images, stock } = req.body;

      const product = new Product({
        name,
        description,
        price,
        category,
        image: image || images?.[0] || '',
        images: images || [image] || [],
        stock
      });

      await product.save();

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      console.error('Create Product Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error creating product',
        error: error.message 
      });
    }
  }
);

// Update product (Admin only)
router.put(
  '/:id',
  auth,
  adminOnly,
  async (req, res) => {
    try {
      const { name, description, price, category, image, images, stock, featured } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (category) updateData.category = category;
      if (image) updateData.image = image;
      if (images) updateData.images = images;
      if (stock !== undefined) updateData.stock = stock;
      if (featured !== undefined) updateData.featured = featured;
      updateData.updatedAt = Date.now();

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found' 
        });
      }

      res.json({
        success: true,
        message: 'Product updated successfully',
        product
      });
    } catch (error) {
      console.error('Update Product Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error updating product',
        error: error.message 
      });
    }
  }
);

// Delete product (Admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting product',
      error: error.message 
    });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching featured products',
      error: error.message 
    });
  }
});

module.exports = router;
