import express from 'express';
import { Bill } from '../models/Bill.js';
import { Order } from '../models/Order.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get bill by order ID
router.get('/order/:order_id', authenticate, async (req, res) => {
  try {
    const { order_id } = req.params;
    const bill = await Bill.findOne({ order_id }).populate('order_id');

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Check if user owns order or is admin
    const order = await Order.findById(order_id);
    if (order.user_id.toString() !== req.user._id.toString() && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(bill);
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch bill' });
  }
});

// Get bill by bill number
router.get('/:bill_number', authenticate, async (req, res) => {
  try {
    const { bill_number } = req.params;
    const bill = await Bill.findOne({ bill_number }).populate('order_id');

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Check if user owns bill or is admin
    if (bill.user_id.toString() !== req.user._id.toString() && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(bill);
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch bill' });
  }
});

// Get all bills (Admin/Super Admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let query = {};
    if (start_date || end_date) {
      query.generated_at = {};
      if (start_date) query.generated_at.$gte = new Date(start_date);
      if (end_date) query.generated_at.$lte = new Date(end_date);
    }

    const bills = await Bill.find(query)
      .sort({ generated_at: -1 })
      .populate('order_id');

    res.json(bills);
  } catch (error) {
    console.error('Get all bills error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch bills' });
  }
});

export default router;

