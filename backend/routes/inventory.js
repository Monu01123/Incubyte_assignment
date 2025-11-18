import express from 'express';
import { Sweet } from '../models/Sweet.js';
import { Transaction } from '../models/Transaction.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Purchase sweet
router.post('/sweets/:id/purchase', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient quantity in stock' });
    }

    // Update quantity
    sweet.quantity -= quantity;
    sweet.updated_at = Date.now();
    await sweet.save();

    // Create transaction
    await Transaction.create({
      sweet_id: sweet._id,
      user_id: req.user._id,
      transaction_type: 'purchase',
      quantity,
    });

    res.json({
      message: 'Purchase successful',
      sweet,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: error.message || 'Purchase failed' });
  }
});

// Restock sweet (Admin only)
router.post('/sweets/:id/restock', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    // Update quantity
    sweet.quantity += quantity;
    sweet.updated_at = Date.now();
    await sweet.save();

    // Create transaction
    await Transaction.create({
      sweet_id: sweet._id,
      user_id: req.user._id,
      transaction_type: 'restock',
      quantity,
    });

    res.json({
      message: 'Restock successful',
      sweet,
    });
  } catch (error) {
    console.error('Restock error:', error);
    res.status(500).json({ error: error.message || 'Restock failed' });
  }
});

export default router;

