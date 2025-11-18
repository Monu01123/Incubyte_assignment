import express from 'express';
import { Sweet } from '../models/Sweet.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all sweets
router.get('/', authenticate, async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ created_at: -1 });
    res.json(sweets);
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch sweets' });
  }
});

// Search sweets
router.get('/search', authenticate, async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    const sweets = await Sweet.find(query).sort({ created_at: -1 });
    res.json(sweets);
  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({ error: error.message || 'Failed to search sweets' });
  }
});

// Create sweet (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, category, price, quantity, description, image_url } = req.body;

    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'Name, category, price, and quantity are required' });
    }

    const sweet = new Sweet({
      name,
      category,
      price,
      quantity,
      description: description || '',
      image_url: image_url || '',
    });

    await sweet.save();
    res.status(201).json(sweet);
  } catch (error) {
    console.error('Create sweet error:', error);
    res.status(500).json({ error: error.message || 'Failed to create sweet' });
  }
});

// Update sweet (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const sweet = await Sweet.findByIdAndUpdate(
      id,
      { ...updates, updated_at: Date.now() },
      { new: true, runValidators: true }
    );

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json(sweet);
  } catch (error) {
    console.error('Update sweet error:', error);
    res.status(500).json({ error: error.message || 'Failed to update sweet' });
  }
});

// Delete sweet (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete sweet' });
  }
});

export default router;

